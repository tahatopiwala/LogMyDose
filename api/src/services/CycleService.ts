import { Cycle } from "@biostak/shared/prisma";
import {
  ICycleService,
  StartCycleInput,
  UpdateCycleInput,
  CyclePhaseInfo,
  CycleSummary,
} from "../interfaces/services/ICycleService.js";
import {
  ICycleRepository,
  CycleWithSubstance,
} from "../interfaces/repositories/ICycleRepository.js";
import { IProtocolRepository } from "../interfaces/repositories/IProtocolRepository.js";
import { AppError } from "../middleware/errorHandler.js";

export class CycleService implements ICycleService {
  constructor(
    private readonly cycleRepository: ICycleRepository,
    private readonly protocolRepository?: IProtocolRepository,
  ) {}

  async startCycle(patientId: string, input: StartCycleInput): Promise<Cycle> {
    // Verify protocol substance exists and belongs to patient
    if (this.protocolRepository) {
      const protocolSubstance = await this.protocolRepository.findProtocolSubstanceById(
        input.protocolSubstanceId,
      );

      if (!protocolSubstance) {
        throw new AppError(404, "Protocol substance not found", "NOT_FOUND");
      }

      // Verify the protocol belongs to this patient
      const protocol = await this.protocolRepository.findById(protocolSubstance.protocolId);
      if (!protocol || protocol.patientId !== patientId) {
        throw new AppError(403, "Access denied", "FORBIDDEN");
      }
    }

    // Check for existing active cycle
    const activeCycle = await this.cycleRepository.findActiveCycle(input.protocolSubstanceId);
    if (activeCycle) {
      throw new AppError(
        400,
        "An active cycle already exists for this substance",
        "CYCLE_EXISTS",
      );
    }

    // Get the next cycle number
    const cycleCount = await this.cycleRepository.countByProtocolSubstance(
      input.protocolSubstanceId,
    );
    const cycleNumber = cycleCount + 1;

    // Create the cycle
    const startDate = input.startDate ? new Date(input.startDate) : new Date();

    return this.cycleRepository.create({
      patientId,
      protocolSubstanceId: input.protocolSubstanceId,
      cycleNumber,
      startDate,
      onWeeks: input.onWeeks,
      offWeeks: input.offWeeks,
      notes: input.notes,
    });
  }

  async getCycles(
    patientId: string,
    protocolSubstanceId?: string,
  ): Promise<CycleWithSubstance[]> {
    const cycles = await this.cycleRepository.findByPatient({
      patientId,
      protocolSubstanceId,
    });

    // Refresh status for active cycles
    const refreshedCycles = await Promise.all(
      cycles.map(async (cycle) => {
        if (cycle.status !== "completed") {
          const updated = await this.refreshCycleStatus(cycle.id);
          return { ...cycle, ...updated };
        }
        return cycle;
      }),
    );

    return refreshedCycles;
  }

  async getCycleById(id: string, patientId: string): Promise<CycleWithSubstance | null> {
    const cycle = await this.cycleRepository.findById(id);

    if (!cycle) {
      throw new AppError(404, "Cycle not found", "NOT_FOUND");
    }

    if (cycle.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Refresh status if active
    if (cycle.status !== "completed") {
      await this.refreshCycleStatus(id);
    }

    // Fetch with full details
    const cycles = await this.cycleRepository.findByPatient({
      patientId,
      protocolSubstanceId: cycle.protocolSubstanceId,
    });

    return cycles.find((c) => c.id === id) || null;
  }

  async getActiveCycle(
    protocolSubstanceId: string,
    patientId: string,
  ): Promise<CycleWithSubstance | null> {
    const cycle = await this.cycleRepository.findActiveCycle(protocolSubstanceId);

    if (!cycle) return null;

    if (cycle.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Refresh status
    const updated = await this.refreshCycleStatus(cycle.id);

    return { ...cycle, ...updated };
  }

  async updateCycle(
    id: string,
    patientId: string,
    input: UpdateCycleInput,
  ): Promise<Cycle> {
    const cycle = await this.cycleRepository.findById(id);

    if (!cycle) {
      throw new AppError(404, "Cycle not found", "NOT_FOUND");
    }

    if (cycle.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (cycle.status === "completed") {
      throw new AppError(400, "Cannot update a completed cycle", "CYCLE_COMPLETED");
    }

    return this.cycleRepository.update(id, {
      onWeeks: input.onWeeks,
      offWeeks: input.offWeeks,
      notes: input.notes,
    });
  }

  async completeCycle(id: string, patientId: string): Promise<Cycle> {
    const cycle = await this.cycleRepository.findById(id);

    if (!cycle) {
      throw new AppError(404, "Cycle not found", "NOT_FOUND");
    }

    if (cycle.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (cycle.status === "completed") {
      throw new AppError(400, "Cycle is already completed", "ALREADY_COMPLETED");
    }

    return this.cycleRepository.update(id, {
      status: "completed",
      endDate: new Date(),
    });
  }

  calculatePhaseInfo(cycle: Cycle): CyclePhaseInfo {
    const now = new Date();
    const startDate = new Date(cycle.startDate);

    // Calculate days since start
    const daysSinceStart = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate total cycle length in days
    const onDays = cycle.onWeeks * 7;
    const offDays = cycle.offWeeks * 7;
    const totalCycleDays = onDays + offDays;

    // Position within the current cycle iteration
    const positionInCycle = daysSinceStart % totalCycleDays;

    // Determine if in on or off phase
    const isOnPhase = positionInCycle < onDays;
    const status = isOnPhase ? "on" : "off";

    // Calculate current week (1-indexed)
    const currentWeekInPhase = isOnPhase
      ? Math.floor(positionInCycle / 7) + 1
      : Math.floor((positionInCycle - onDays) / 7) + 1;

    // Total weeks in current phase
    const totalWeeksInPhase = isOnPhase ? cycle.onWeeks : cycle.offWeeks;

    // Days remaining in current phase
    const daysRemainingInPhase = isOnPhase
      ? onDays - positionInCycle
      : totalCycleDays - positionInCycle;

    // Calculate phase end date
    const phaseEndDate = new Date(now);
    phaseEndDate.setDate(phaseEndDate.getDate() + daysRemainingInPhase);

    // Calculate next phase date (same as phase end for active cycles)
    const nextPhaseDate = new Date(phaseEndDate);

    // Overall current week from cycle start
    const currentWeek = Math.floor(daysSinceStart / 7) + 1;
    const totalWeeks = cycle.onWeeks + cycle.offWeeks;

    // Weeks remaining in current phase
    const weeksRemaining = totalWeeksInPhase - currentWeekInPhase + 1;

    // Is this the last week of the current phase?
    const isLastWeekOfPhase = currentWeekInPhase === totalWeeksInPhase;

    return {
      cycleId: cycle.id,
      status: cycle.status === "completed" ? "completed" : status,
      currentWeek,
      totalWeeks,
      weeksRemaining,
      phaseEndDate,
      nextPhaseDate: cycle.status === "completed" ? null : nextPhaseDate,
      isLastWeekOfPhase,
    };
  }

  async refreshCycleStatus(id: string): Promise<Cycle> {
    const cycle = await this.cycleRepository.findById(id);

    if (!cycle) {
      throw new AppError(404, "Cycle not found", "NOT_FOUND");
    }

    if (cycle.status === "completed") {
      return cycle;
    }

    const phaseInfo = this.calculatePhaseInfo(cycle);

    // Update if status changed
    if (phaseInfo.status !== cycle.status || phaseInfo.currentWeek !== cycle.currentWeek) {
      return this.cycleRepository.update(id, {
        status: phaseInfo.status as "on" | "off",
        currentWeek: phaseInfo.currentWeek,
      });
    }

    return cycle;
  }

  async getCycleSummary(patientId: string): Promise<CycleSummary> {
    const cycles = await this.cycleRepository.findByPatient({ patientId });

    // Refresh all active cycles
    for (const cycle of cycles) {
      if (cycle.status !== "completed") {
        await this.refreshCycleStatus(cycle.id);
      }
    }

    // Refetch after refresh
    const updatedCycles = await this.cycleRepository.findByPatient({ patientId });

    const activeCycles = updatedCycles.filter((c) => c.status !== "completed").length;
    const onPhase = updatedCycles.filter((c) => c.status === "on").length;
    const offPhase = updatedCycles.filter((c) => c.status === "off").length;
    const completedCycles = updatedCycles.filter((c) => c.status === "completed").length;

    return {
      activeCycles,
      onPhase,
      offPhase,
      completedCycles,
    };
  }
}
