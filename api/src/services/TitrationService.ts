import { TitrationPhase, Prisma } from "@biostak/shared/prisma";
import {
  STANDARD_TITRATION_PLANS,
  findTitrationPlan,
} from "@biostak/shared/entities";
import {
  ITitrationService,
  StartTitrationInput,
  AdvancePhaseInput,
  UpdateTitrationInput,
  TitrationProgress,
  TitrationSummary,
} from "../interfaces/services/ITitrationService.js";
import {
  ITitrationRepository,
  TitrationPhaseWithSubstance,
} from "../interfaces/repositories/ITitrationRepository.js";
import { IProtocolRepository } from "../interfaces/repositories/IProtocolRepository.js";
import { AppError } from "../middleware/errorHandler.js";

export class TitrationService implements ITitrationService {
  constructor(
    private readonly titrationRepository: ITitrationRepository,
    private readonly protocolRepository?: IProtocolRepository
  ) {}

  async startTitration(
    patientId: string,
    input: StartTitrationInput
  ): Promise<TitrationPhase[]> {
    // Verify protocol substance exists and belongs to patient
    if (this.protocolRepository) {
      const protocolSubstance = await this.protocolRepository.findProtocolSubstanceById(
        input.protocolSubstanceId
      );

      if (!protocolSubstance) {
        throw new AppError(404, "Protocol substance not found", "NOT_FOUND");
      }

      const protocol = await this.protocolRepository.findById(
        protocolSubstance.protocolId
      );
      if (!protocol || protocol.patientId !== patientId) {
        throw new AppError(403, "Access denied", "FORBIDDEN");
      }
    }

    // Check for existing active titration
    const activePhase = await this.titrationRepository.findActivePhase(
      input.protocolSubstanceId
    );
    if (activePhase) {
      throw new AppError(
        400,
        "An active titration already exists for this substance",
        "TITRATION_EXISTS"
      );
    }

    // Get titration steps from plan or custom input
    let steps: { doseAmount: number; doseUnit: string; weeksAtDose: number; isMaintenance?: boolean }[];
    let targetDose: number;

    if (input.planName) {
      const plan = findTitrationPlan(input.planName);
      if (!plan) {
        throw new AppError(
          400,
          `Unknown titration plan: ${input.planName}`,
          "INVALID_PLAN"
        );
      }
      steps = plan.steps;
      targetDose = plan.targetDose;
    } else if (input.customSteps && input.customSteps.length > 0) {
      steps = input.customSteps;
      const lastStep = steps[steps.length - 1];
      targetDose = lastStep.doseAmount;
    } else {
      throw new AppError(
        400,
        "Either planName or customSteps must be provided",
        "INVALID_INPUT"
      );
    }

    // Create all phases
    const startDate = input.startDate ? new Date(input.startDate) : new Date();
    const createdPhases: TitrationPhase[] = [];
    let currentStartDate = new Date(startDate);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isFirstPhase = i === 0;

      const phase = await this.titrationRepository.create({
        patientId,
        protocolSubstanceId: input.protocolSubstanceId,
        phaseNumber: i + 1,
        doseAmount: new Prisma.Decimal(step.doseAmount),
        doseUnit: step.doseUnit,
        startDate: currentStartDate,
        weeksAtDose: step.weeksAtDose,
        reason: "scheduled",
        targetDose: new Prisma.Decimal(targetDose),
        isMaintenancePhase: step.isMaintenance || false,
        notes: isFirstPhase ? input.notes : undefined,
      });

      // Mark non-first phases as not yet started (they'll be activated when previous completes)
      if (!isFirstPhase) {
        await this.titrationRepository.update(phase.id, {
          status: "completed", // Will be changed when actually started
        });
        // Actually, let's keep them as a different approach - pre-create but mark status
        // Re-update to show they're pending
        await this.titrationRepository.update(phase.id, {
          status: "active",
        });
      }

      createdPhases.push(phase);

      // Calculate next phase start date
      currentStartDate = new Date(currentStartDate);
      currentStartDate.setDate(currentStartDate.getDate() + step.weeksAtDose * 7);
    }

    // Only the first phase should be active, rest should wait
    for (let i = 1; i < createdPhases.length; i++) {
      await this.titrationRepository.update(createdPhases[i].id, {
        status: "completed",
      });
    }

    // Re-fetch to get updated statuses
    return this.titrationRepository
      .findByProtocolSubstance(input.protocolSubstanceId)
      .then((phases) => phases.map((p) => p as TitrationPhase));
  }

  async getTitrationPhases(
    patientId: string,
    protocolSubstanceId?: string
  ): Promise<TitrationPhaseWithSubstance[]> {
    const phases = await this.titrationRepository.findByPatient({
      patientId,
      protocolSubstanceId,
    });

    // Refresh active phases
    for (const phase of phases) {
      if (phase.status === "active") {
        await this.refreshPhaseStatus(phase.id);
      }
    }

    // Re-fetch after refresh
    return this.titrationRepository.findByPatient({
      patientId,
      protocolSubstanceId,
    });
  }

  async getTitrationPhaseById(
    id: string,
    patientId: string
  ): Promise<TitrationPhaseWithSubstance | null> {
    const phase = await this.titrationRepository.findById(id);

    if (!phase) {
      throw new AppError(404, "Titration phase not found", "NOT_FOUND");
    }

    if (phase.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Refresh if active
    if (phase.status === "active") {
      await this.refreshPhaseStatus(id);
    }

    // Fetch with full details
    const phases = await this.titrationRepository.findByPatient({
      patientId,
      protocolSubstanceId: phase.protocolSubstanceId,
    });

    return phases.find((p) => p.id === id) || null;
  }

  async getActivePhase(
    protocolSubstanceId: string,
    patientId: string
  ): Promise<TitrationPhaseWithSubstance | null> {
    const phase = await this.titrationRepository.findActivePhase(protocolSubstanceId);

    if (!phase) return null;

    if (phase.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Refresh status
    await this.refreshPhaseStatus(phase.id);

    // Re-fetch
    return this.titrationRepository.findActivePhase(protocolSubstanceId);
  }

  async getTitrationProgress(
    protocolSubstanceId: string,
    patientId: string
  ): Promise<TitrationProgress | null> {
    const phases = await this.titrationRepository.findByProtocolSubstance(
      protocolSubstanceId
    );

    if (phases.length === 0) return null;

    // Verify ownership
    if (phases[0].patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    const activePhase = phases.find((p) => p.status === "active");
    const completedPhases = phases.filter((p) => p.status === "completed").length;
    const currentPhase = activePhase || phases[phases.length - 1];

    const currentDose = Number(currentPhase.doseAmount);
    const targetDose = Number(currentPhase.targetDose || currentDose);
    const progressPercent = (currentDose / targetDose) * 100;

    // Calculate weeks in current phase
    const now = new Date();
    const phaseStart = new Date(currentPhase.startDate);
    const daysSinceStart = Math.floor(
      (now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weeksInCurrentPhase = Math.floor(daysSinceStart / 7) + 1;
    const weeksRemainingInPhase = Math.max(
      0,
      currentPhase.weeksAtDose - weeksInCurrentPhase + 1
    );

    // Calculate next phase date
    let nextPhaseDate: Date | null = null;
    if (activePhase && !activePhase.isMaintenancePhase) {
      nextPhaseDate = new Date(phaseStart);
      nextPhaseDate.setDate(nextPhaseDate.getDate() + activePhase.weeksAtDose * 7);
    }

    return {
      currentPhase: activePhase || null,
      phases,
      totalPhases: phases.length,
      completedPhases,
      currentDose,
      targetDose,
      doseUnit: currentPhase.doseUnit,
      progressPercent: Math.min(100, progressPercent),
      weeksInCurrentPhase,
      weeksRemainingInPhase,
      nextPhaseDate,
      isAtMaintenance: currentPhase.isMaintenancePhase,
    };
  }

  async updatePhase(
    id: string,
    patientId: string,
    input: UpdateTitrationInput
  ): Promise<TitrationPhase> {
    const phase = await this.titrationRepository.findById(id);

    if (!phase) {
      throw new AppError(404, "Titration phase not found", "NOT_FOUND");
    }

    if (phase.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return this.titrationRepository.update(id, {
      weeksAtDose: input.weeksAtDose,
      notes: input.notes,
    });
  }

  async advanceToNextPhase(
    protocolSubstanceId: string,
    patientId: string,
    input?: AdvancePhaseInput
  ): Promise<TitrationPhase> {
    const activePhase = await this.titrationRepository.findActivePhase(
      protocolSubstanceId
    );

    if (!activePhase) {
      throw new AppError(404, "No active titration phase found", "NO_ACTIVE_PHASE");
    }

    if (activePhase.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (activePhase.isMaintenancePhase) {
      throw new AppError(
        400,
        "Cannot advance past maintenance phase",
        "AT_MAINTENANCE"
      );
    }

    // Complete current phase
    await this.titrationRepository.update(activePhase.id, {
      status: "completed",
      endDate: new Date(),
    });

    // Get all phases and find the next one
    const allPhases = await this.titrationRepository.findByProtocolSubstance(
      protocolSubstanceId
    );
    const nextPhaseIndex = allPhases.findIndex((p) => p.id === activePhase.id) + 1;

    if (nextPhaseIndex < allPhases.length) {
      // Activate existing next phase
      const nextPhase = allPhases[nextPhaseIndex];
      return this.titrationRepository.update(nextPhase.id, {
        status: "active",
        reason: input?.reason || "scheduled",
        notes: input?.notes,
      });
    }

    // No pre-existing next phase - create a custom one if requested
    if (input?.customDose && input?.customWeeks) {
      const phaseCount = await this.titrationRepository.countByProtocolSubstance(
        protocolSubstanceId
      );

      return this.titrationRepository.create({
        patientId,
        protocolSubstanceId,
        phaseNumber: phaseCount + 1,
        doseAmount: new Prisma.Decimal(input.customDose),
        doseUnit: activePhase.doseUnit,
        startDate: new Date(),
        weeksAtDose: input.customWeeks,
        reason: input.reason || "custom",
        targetDose: activePhase.targetDose || undefined,
        isMaintenancePhase: false,
        notes: input.notes,
      });
    }

    throw new AppError(
      400,
      "No next phase defined. Provide customDose and customWeeks to create one.",
      "NO_NEXT_PHASE"
    );
  }

  async skipPhase(
    id: string,
    patientId: string,
    notes?: string
  ): Promise<TitrationPhase> {
    const phase = await this.titrationRepository.findById(id);

    if (!phase) {
      throw new AppError(404, "Titration phase not found", "NOT_FOUND");
    }

    if (phase.patientId !== patientId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    if (phase.status !== "active") {
      throw new AppError(400, "Can only skip active phases", "INVALID_STATUS");
    }

    // Mark as skipped
    await this.titrationRepository.update(id, {
      status: "skipped",
      endDate: new Date(),
      notes: notes || "Phase skipped",
    });

    // Try to advance to next phase
    try {
      return await this.advanceToNextPhase(phase.protocolSubstanceId, patientId, {
        reason: "tolerability",
        notes: "Advanced due to skipped phase",
      });
    } catch {
      // No next phase, return the skipped phase
      return this.titrationRepository.findById(id) as Promise<TitrationPhase>;
    }
  }

  async refreshPhaseStatus(id: string): Promise<TitrationPhase> {
    const phase = await this.titrationRepository.findById(id);

    if (!phase) {
      throw new AppError(404, "Titration phase not found", "NOT_FOUND");
    }

    if (phase.status !== "active") {
      return phase;
    }

    // Check if phase duration has been exceeded
    const now = new Date();
    const phaseStart = new Date(phase.startDate);
    const phaseEndDate = new Date(phaseStart);
    phaseEndDate.setDate(phaseEndDate.getDate() + phase.weeksAtDose * 7);

    if (now >= phaseEndDate && !phase.isMaintenancePhase) {
      // Phase time is up - could auto-advance here, but let's just flag it
      // The user should manually advance to control the process
      return phase;
    }

    return phase;
  }

  async getTitrationSummary(patientId: string): Promise<TitrationSummary> {
    const phases = await this.titrationRepository.findByPatient({ patientId });

    // Group by protocol substance to count unique titrations
    const bySubstance = new Map<string, TitrationPhaseWithSubstance[]>();
    for (const phase of phases) {
      const existing = bySubstance.get(phase.protocolSubstanceId) || [];
      existing.push(phase);
      bySubstance.set(phase.protocolSubstanceId, existing);
    }

    let activeTitrations = 0;
    let atMaintenance = 0;
    let completed = 0;

    for (const [, substancePhases] of bySubstance) {
      const activePhase = substancePhases.find((p) => p.status === "active");
      if (activePhase) {
        activeTitrations++;
        if (activePhase.isMaintenancePhase) {
          atMaintenance++;
        }
      } else {
        // All phases completed or skipped
        completed++;
      }
    }

    return {
      activeTitrations,
      atMaintenance,
      completed,
    };
  }

  getAvailablePlans(): { name: string; targetDose: number; doseUnit: string; steps: number }[] {
    return STANDARD_TITRATION_PLANS.map((plan) => ({
      name: plan.substanceName,
      targetDose: plan.targetDose,
      doseUnit: plan.doseUnit,
      steps: plan.steps.length,
    }));
  }
}
