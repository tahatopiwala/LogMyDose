import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed substance categories
  const peptideCategory = await prisma.substanceCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'peptide',
      displayName: 'Peptides',
      description: 'Bioactive peptides for therapeutic use',
      icon: 'flask',
      sortOrder: 1,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'hormone',
      displayName: 'Hormone Therapy',
      description: 'Hormone replacement and optimization',
      icon: 'heart-pulse',
      sortOrder: 2,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'supplement',
      displayName: 'Supplements',
      description: 'Vitamins, minerals, and nutraceuticals',
      icon: 'pill',
      sortOrder: 3,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'nootropic',
      displayName: 'Nootropics',
      description: 'Cognitive enhancement compounds',
      icon: 'brain',
      sortOrder: 4,
    },
  });

  console.log('Seeded 4 categories');

  // Seed peptides - use upsert by name via findFirst + create/update pattern
  const peptides = [
    {
      name: 'BPC-157',
      aliases: ['Body Protection Compound-157', 'Pentadecapeptide BPC 157'],
      subcategory: 'healing',
      defaultDose: 250,
      doseUnit: 'mcg',
      defaultFrequency: '2x_daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 5mg vial = 250mcg per 0.1ml',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator. Protect from light.',
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: ['Active cancer', 'Pregnancy', 'Breastfeeding'],
      commonSideEffects: ['Injection site irritation', 'Nausea (rare)', 'Dizziness (rare)'],
      interactions: [],
      onsetTimeline: '2-4 weeks for noticeable effects',
      isPrescriptionRequired: false,
    },
    {
      name: 'TB-500',
      aliases: ['Thymosin Beta-4', 'TB4'],
      subcategory: 'healing',
      defaultDose: 2.5,
      doseUnit: 'mg',
      defaultFrequency: '2x_weekly',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 5mg vial',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator. Protect from light.',
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: true,
      commonCycleOnWeeks: 6,
      commonCycleOffWeeks: 4,
      contraindications: ['Active cancer', 'Pregnancy'],
      commonSideEffects: ['Injection site irritation', 'Temporary fatigue', 'Head rush'],
      interactions: [],
      onsetTimeline: '2-6 weeks for injury healing',
      isPrescriptionRequired: false,
    },
    {
      name: 'Semaglutide',
      aliases: ['Ozempic', 'Wegovy', 'Rybelsus'],
      subcategory: 'glp1',
      defaultDose: 0.25,
      doseUnit: 'mg',
      defaultFrequency: 'weekly',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Pre-filled pens typically ready to use. For compounded: reconstitute per pharmacy instructions.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Once in use, can be kept at room temperature for up to 56 days.',
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 56,
      requiresCycling: false,
      contraindications: ['Personal or family history of MTC', 'MEN 2', 'Pregnancy', 'Pancreatitis history'],
      commonSideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Decreased appetite'],
      interactions: ['Insulin', 'Sulfonylureas'],
      onsetTimeline: 'Weight loss typically begins within 4-8 weeks, full effects at 16-20 weeks',
      isPrescriptionRequired: true,
    },
    {
      name: 'Tirzepatide',
      aliases: ['Mounjaro', 'Zepbound'],
      subcategory: 'glp1_gip',
      defaultDose: 2.5,
      doseUnit: 'mg',
      defaultFrequency: 'weekly',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Pre-filled pens. For compounded: reconstitute per pharmacy instructions.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Once in use, can be kept at room temperature for up to 21 days.',
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: false,
      contraindications: ['Personal or family history of MTC', 'MEN 2', 'Pregnancy'],
      commonSideEffects: ['Nausea', 'Diarrhea', 'Decreased appetite', 'Vomiting', 'Constipation', 'Dyspepsia'],
      interactions: ['Insulin', 'Sulfonylureas'],
      onsetTimeline: 'Weight loss typically begins within 4 weeks',
      isPrescriptionRequired: true,
    },
    {
      name: 'CJC-1295',
      aliases: ['CJC-1295 DAC', 'Modified GRF 1-29'],
      subcategory: 'gh_secretagogue',
      defaultDose: 1000,
      doseUnit: 'mcg',
      defaultFrequency: '2x_weekly',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 2mg vial',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator. Sensitive to heat.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ['Active cancer', 'Diabetic retinopathy'],
      commonSideEffects: ['Water retention', 'Numbness/tingling in hands', 'Increased hunger', 'Fatigue initially'],
      interactions: [],
      onsetTimeline: '2-4 weeks for improved sleep, 8-12 weeks for body composition changes',
      isPrescriptionRequired: false,
    },
    {
      name: 'Ipamorelin',
      aliases: [],
      subcategory: 'gh_secretagogue',
      defaultDose: 200,
      doseUnit: 'mcg',
      defaultFrequency: '2x_daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Inject on empty stomach.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ['Active cancer', 'Pregnancy'],
      commonSideEffects: ['Headache', 'Flushing', 'Dizziness', 'Increased appetite'],
      interactions: [],
      onsetTimeline: '2-4 weeks for improved sleep, 8-12 weeks for full effects',
      isPrescriptionRequired: false,
    },
    {
      name: 'PT-141',
      aliases: ['Bremelanotide'],
      subcategory: 'sexual_health',
      defaultDose: 1.75,
      doseUnit: 'mg',
      defaultFrequency: 'as_needed',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Use 45-60 minutes before activity.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: ['Uncontrolled hypertension', 'Cardiovascular disease'],
      commonSideEffects: ['Nausea', 'Flushing', 'Headache', 'Temporary increase in blood pressure'],
      interactions: ['Antihypertensives'],
      onsetTimeline: '45-60 minutes before onset of effects',
      isPrescriptionRequired: true,
    },
    {
      name: 'Sermorelin',
      aliases: ['GHRH', 'GRF 1-29'],
      subcategory: 'gh_secretagogue',
      defaultDose: 200,
      doseUnit: 'mcg',
      defaultFrequency: 'daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Best injected at bedtime on empty stomach.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator. Sensitive to light and heat.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 14,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ['Active cancer', 'Pregnancy'],
      commonSideEffects: ['Injection site reactions', 'Flushing', 'Dizziness', 'Headache'],
      interactions: [],
      onsetTimeline: '2-4 weeks for improved sleep, 3-6 months for full effects',
      isPrescriptionRequired: true,
    },
    {
      name: 'Tesamorelin',
      aliases: ['Egrifta'],
      subcategory: 'gh_secretagogue',
      defaultDose: 2,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with provided diluent. Inject into abdomen.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Use immediately after reconstitution.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 1,
      requiresCycling: false,
      contraindications: ['Active cancer', 'Pregnancy', 'Hypersensitivity to mannitol'],
      commonSideEffects: ['Injection site reactions', 'Joint pain', 'Edema', 'Muscle pain'],
      interactions: [],
      onsetTimeline: '8-12 weeks for measurable reduction in visceral fat',
      isPrescriptionRequired: true,
    },
    {
      name: 'AOD-9604',
      aliases: ['Anti-Obesity Drug 9604'],
      subcategory: 'metabolic',
      defaultDose: 300,
      doseUnit: 'mcg',
      defaultFrequency: 'daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Inject on empty stomach.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Store reconstituted peptide in refrigerator.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ['Pregnancy', 'Breastfeeding'],
      commonSideEffects: ['Mild injection site reactions', 'Headache (rare)'],
      interactions: [],
      onsetTimeline: '4-8 weeks for fat metabolism effects',
      isPrescriptionRequired: false,
    },
    {
      name: 'GHK-Cu',
      aliases: ['Copper Peptide', 'GHK Copper'],
      subcategory: 'healing',
      defaultDose: 1,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Also available topically.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Protect from light. Blue-colored solution is normal.',
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: ['Copper allergy', 'Wilson disease'],
      commonSideEffects: ['Injection site irritation', 'Temporary skin discoloration'],
      interactions: [],
      onsetTimeline: '4-8 weeks for skin/healing improvements',
      isPrescriptionRequired: false,
    },
    {
      name: 'NAD+',
      aliases: ['Nicotinamide Adenine Dinucleotide'],
      subcategory: 'longevity',
      defaultDose: 100,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Typically comes pre-mixed. Can also be administered IV or orally.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Light sensitive. Store in dark container.',
      shelfLifeDays: 180,
      shelfLifeReconstitutedDays: 30,
      requiresCycling: false,
      contraindications: ['Active cancer (controversial)'],
      commonSideEffects: ['Nausea', 'Flushing', 'Headache', 'Fatigue initially'],
      interactions: [],
      onsetTimeline: '2-4 weeks for energy improvements',
      isPrescriptionRequired: false,
    },
  ];

  // Store substance IDs for templates
  const substanceIds: Record<string, string> = {};

  let substanceCount = 0;
  for (const peptide of peptides) {
    // Check if substance exists by name
    const existing = await prisma.substance.findFirst({
      where: { name: peptide.name },
    });

    let substance;
    if (existing) {
      substance = await prisma.substance.update({
        where: { id: existing.id },
        data: {
          categoryId: peptideCategory.id,
          ...peptide,
        },
      });
    } else {
      substance = await prisma.substance.create({
        data: {
          categoryId: peptideCategory.id,
          ...peptide,
        },
      });
    }
    substanceIds[peptide.name] = substance.id;
    substanceCount++;
  }

  console.log(`Seeded ${substanceCount} peptides`);

  // Seed some protocol templates
  const templates = [
    {
      name: 'BPC-157 Beginner Protocol',
      description: 'Standard healing protocol for beginners. Great for gut health and injury recovery.',
      substanceName: 'BPC-157',
      defaultDose: 250,
      doseUnit: 'mcg',
      frequency: '2x_daily',
      difficultyLevel: 'beginner',
      tags: ['healing', 'gut-health', 'injury-recovery', 'beginner'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 250, unit: 'mcg', frequency: '2x_daily' },
          { week: 2, dose: 250, unit: 'mcg', frequency: '2x_daily' },
          { week: 3, dose: 250, unit: 'mcg', frequency: '2x_daily' },
          { week: 4, dose: 250, unit: 'mcg', frequency: '2x_daily' },
        ],
      },
    },
    {
      name: 'Semaglutide Weight Loss Titration',
      description: 'Standard titration schedule for Semaglutide. Gradual dose increase to minimize side effects.',
      substanceName: 'Semaglutide',
      defaultDose: 0.25,
      doseUnit: 'mg',
      frequency: 'weekly',
      difficultyLevel: 'intermediate',
      tags: ['weight-loss', 'glp1', 'titration'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 0.25, unit: 'mg', frequency: 'weekly', notes: 'Starting dose' },
          { week: 2, dose: 0.25, unit: 'mg', frequency: 'weekly' },
          { week: 3, dose: 0.25, unit: 'mg', frequency: 'weekly' },
          { week: 4, dose: 0.25, unit: 'mg', frequency: 'weekly' },
          { week: 5, dose: 0.5, unit: 'mg', frequency: 'weekly', notes: 'First dose increase' },
          { week: 6, dose: 0.5, unit: 'mg', frequency: 'weekly' },
          { week: 7, dose: 0.5, unit: 'mg', frequency: 'weekly' },
          { week: 8, dose: 0.5, unit: 'mg', frequency: 'weekly' },
          { week: 9, dose: 1.0, unit: 'mg', frequency: 'weekly', notes: 'Second dose increase' },
          { week: 10, dose: 1.0, unit: 'mg', frequency: 'weekly' },
          { week: 11, dose: 1.0, unit: 'mg', frequency: 'weekly' },
          { week: 12, dose: 1.0, unit: 'mg', frequency: 'weekly' },
          { week: 13, dose: 1.7, unit: 'mg', frequency: 'weekly', notes: 'Third dose increase' },
          { week: 14, dose: 1.7, unit: 'mg', frequency: 'weekly' },
          { week: 15, dose: 1.7, unit: 'mg', frequency: 'weekly' },
          { week: 16, dose: 1.7, unit: 'mg', frequency: 'weekly' },
          { week: 17, dose: 2.4, unit: 'mg', frequency: 'weekly', notes: 'Maintenance dose' },
        ],
      },
    },
    {
      name: 'CJC-1295 + Ipamorelin Stack',
      description: 'Popular GH secretagogue stack for improved sleep, recovery, and body composition.',
      substanceName: 'CJC-1295',
      defaultDose: 100,
      doseUnit: 'mcg',
      frequency: 'daily',
      difficultyLevel: 'intermediate',
      tags: ['gh-secretagogue', 'sleep', 'recovery', 'stack'],
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
    },
    {
      name: 'TB-500 + BPC-157 Healing Stack',
      description: 'Synergistic healing protocol combining TB-500 and BPC-157 for accelerated recovery.',
      substanceName: 'TB-500',
      defaultDose: 2.5,
      doseUnit: 'mg',
      frequency: '2x_weekly',
      difficultyLevel: 'intermediate',
      tags: ['healing', 'injury-recovery', 'stack'],
      cycleOnWeeks: 6,
      cycleOffWeeks: 4,
    },
  ];

  let templateCount = 0;
  for (const template of templates) {
    const { substanceName, ...templateData } = template;

    // Check if template exists by name
    const existing = await prisma.protocolTemplate.findFirst({
      where: { name: template.name },
    });

    if (existing) {
      await prisma.protocolTemplate.update({
        where: { id: existing.id },
        data: {
          ...templateData,
          categoryId: peptideCategory.id,
          substanceId: substanceIds[substanceName],
        },
      });
    } else {
      await prisma.protocolTemplate.create({
        data: {
          ...templateData,
          categoryId: peptideCategory.id,
          substanceId: substanceIds[substanceName],
        },
      });
    }
    templateCount++;
  }

  console.log(`Seeded ${templateCount} protocol templates`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
