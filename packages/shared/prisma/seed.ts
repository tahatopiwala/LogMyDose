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

  // Seed hormones
  const hormoneCategory = await prisma.substanceCategory.findUnique({
    where: { id: '00000000-0000-0000-0000-000000000002' },
  });

  const hormones = [
    {
      name: 'Testosterone Cypionate',
      aliases: ['Test Cyp', 'Depo-Testosterone'],
      subcategory: 'androgen',
      defaultDose: 100,
      doseUnit: 'mg',
      defaultFrequency: 'weekly',
      administrationRoute: 'injection_im',
      preparationInstructions: 'Draw with 18g needle, inject with 25g needle. Warm vial to body temperature before injection.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from light. Do not refrigerate.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Prostate cancer', 'Breast cancer in men', 'Pregnancy', 'Polycythemia'],
      commonSideEffects: ['Acne', 'Hair loss', 'Increased hematocrit', 'Testicular atrophy', 'Mood changes'],
      interactions: ['Blood thinners', 'Insulin', 'Corticosteroids'],
      onsetTimeline: '2-4 weeks for initial effects, 3-6 months for full benefits',
      isPrescriptionRequired: true,
    },
    {
      name: 'Testosterone Enanthate',
      aliases: ['Test E', 'Delatestryl'],
      subcategory: 'androgen',
      defaultDose: 100,
      doseUnit: 'mg',
      defaultFrequency: 'weekly',
      administrationRoute: 'injection_im',
      preparationInstructions: 'Draw with 18g needle, inject with 25g needle. Can be injected IM or subcutaneously.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from light. Do not refrigerate.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Prostate cancer', 'Breast cancer in men', 'Pregnancy', 'Severe cardiac disease'],
      commonSideEffects: ['Acne', 'Hair loss', 'Increased hematocrit', 'Testicular atrophy', 'Water retention'],
      interactions: ['Blood thinners', 'Insulin', 'Corticosteroids'],
      onsetTimeline: '2-4 weeks for initial effects, 3-6 months for full benefits',
      isPrescriptionRequired: true,
    },
    {
      name: 'Estradiol',
      aliases: ['E2', 'Estrace', '17β-estradiol'],
      subcategory: 'estrogen',
      defaultDose: 1,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take orally with or without food. Also available as patch, gel, or injection.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Store in original container. Protect from moisture.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['History of blood clots', 'Estrogen-sensitive cancers', 'Liver disease', 'Undiagnosed vaginal bleeding'],
      commonSideEffects: ['Breast tenderness', 'Headache', 'Nausea', 'Bloating', 'Mood changes'],
      interactions: ['Aromatase inhibitors', 'Thyroid medications', 'St. Johns Wort'],
      onsetTimeline: '2-4 weeks for symptom improvement',
      isPrescriptionRequired: true,
    },
    {
      name: 'Progesterone',
      aliases: ['Prometrium', 'Micronized Progesterone'],
      subcategory: 'progestogen',
      defaultDose: 100,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take at bedtime due to sedative effects. Can also be used vaginally.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Store in original container.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Peanut allergy (for oral capsules)', 'Breast cancer', 'Blood clots', 'Liver disease'],
      commonSideEffects: ['Drowsiness', 'Dizziness', 'Breast tenderness', 'Headache', 'Mood changes'],
      interactions: ['CYP3A4 inhibitors', 'Barbiturates', 'Rifampin'],
      onsetTimeline: '1-2 weeks for sleep benefits, 2-4 weeks for other effects',
      isPrescriptionRequired: true,
    },
    {
      name: 'DHEA',
      aliases: ['Dehydroepiandrosterone', 'Prasterone'],
      subcategory: 'precursor',
      defaultDose: 25,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take in the morning with food.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Keep in cool, dry place.',
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: ['Hormone-sensitive cancers', 'Pregnancy', 'Breastfeeding', 'PCOS'],
      commonSideEffects: ['Acne', 'Hair loss', 'Oily skin', 'Mood changes', 'Irregular periods'],
      interactions: ['Estrogen therapy', 'Testosterone therapy', 'Antipsychotics'],
      onsetTimeline: '4-8 weeks for noticeable effects',
      isPrescriptionRequired: false,
    },
    {
      name: 'Pregnenolone',
      aliases: ['Preg'],
      subcategory: 'precursor',
      defaultDose: 50,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take in the morning with food.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Keep in cool, dry place.',
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: ['Hormone-sensitive cancers', 'Pregnancy', 'Seizure disorders'],
      commonSideEffects: ['Headache', 'Irritability', 'Acne', 'Insomnia'],
      interactions: ['Hormone therapies', 'CNS depressants'],
      onsetTimeline: '2-4 weeks for cognitive effects',
      isPrescriptionRequired: false,
    },
    {
      name: 'Liothyronine',
      aliases: ['T3', 'Cytomel', 'Triiodothyronine'],
      subcategory: 'thyroid',
      defaultDose: 5,
      doseUnit: 'mcg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take on empty stomach, 30-60 minutes before breakfast. Consistent timing important.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from light and moisture.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Untreated adrenal insufficiency', 'Thyrotoxicosis', 'Acute MI'],
      commonSideEffects: ['Palpitations', 'Anxiety', 'Weight loss', 'Insomnia', 'Heat intolerance'],
      interactions: ['Blood thinners', 'Diabetes medications', 'Digoxin', 'Antidepressants'],
      onsetTimeline: '24-72 hours for initial effects, 2-4 weeks for stable levels',
      isPrescriptionRequired: true,
    },
    {
      name: 'HCG',
      aliases: ['Human Chorionic Gonadotropin', 'Pregnyl', 'Novarel'],
      subcategory: 'gonadotropin',
      defaultDose: 500,
      doseUnit: 'iu',
      defaultFrequency: '2x_weekly',
      administrationRoute: 'injection_subq',
      preparationInstructions: 'Reconstitute with bacteriostatic water. Refrigerate after mixing.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Must refrigerate after reconstitution. Use within 60 days.',
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 60,
      requiresCycling: false,
      contraindications: ['Hormone-sensitive cancers', 'Precocious puberty', 'Pregnancy'],
      commonSideEffects: ['Headache', 'Irritability', 'Restlessness', 'Injection site pain'],
      interactions: ['Gonadotropin-releasing hormones'],
      onsetTimeline: '1-2 weeks for testicular response',
      isPrescriptionRequired: true,
    },
  ];

  let hormoneCount = 0;
  for (const hormone of hormones) {
    const existing = await prisma.substance.findFirst({
      where: { name: hormone.name },
    });

    let substance;
    if (existing) {
      substance = await prisma.substance.update({
        where: { id: existing.id },
        data: {
          categoryId: hormoneCategory!.id,
          ...hormone,
        },
      });
    } else {
      substance = await prisma.substance.create({
        data: {
          categoryId: hormoneCategory!.id,
          ...hormone,
        },
      });
    }
    substanceIds[hormone.name] = substance.id;
    hormoneCount++;
  }

  console.log(`Seeded ${hormoneCount} hormones`);

  // Seed supplements
  const supplementCategory = await prisma.substanceCategory.findUnique({
    where: { id: '00000000-0000-0000-0000-000000000003' },
  });

  const supplements = [
    {
      name: 'Vitamin D3',
      aliases: ['Cholecalciferol', 'D3'],
      subcategory: 'vitamin',
      defaultDose: 5000,
      doseUnit: 'iu',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take with a meal containing fat for better absorption.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Keep in cool, dry place. Protect from light.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Hypercalcemia', 'Hypervitaminosis D', 'Kidney disease'],
      commonSideEffects: ['Nausea (high doses)', 'Constipation', 'Weakness'],
      interactions: ['Thiazide diuretics', 'Steroids', 'Cholesterol medications'],
      onsetTimeline: '4-8 weeks for blood level changes, 3+ months for full benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'Vitamin B12',
      aliases: ['Methylcobalamin', 'Cobalamin', 'B12'],
      subcategory: 'vitamin',
      defaultDose: 1000,
      doseUnit: 'mcg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Sublingual form absorbs better. Can be taken any time.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from light and moisture.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Cobalt allergy', "Leber's disease"],
      commonSideEffects: ['Generally well tolerated', 'Mild diarrhea (rare)'],
      interactions: ['Metformin', 'Proton pump inhibitors', 'Colchicine'],
      onsetTimeline: '2-4 weeks for energy improvements',
      isPrescriptionRequired: false,
    },
    {
      name: 'Magnesium Glycinate',
      aliases: ['Mag Glycinate', 'Chelated Magnesium'],
      subcategory: 'mineral',
      defaultDose: 400,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take in the evening for sleep benefits. Can be split into 2 doses.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Keep in cool, dry place.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Severe kidney disease', 'Heart block', 'Myasthenia gravis'],
      commonSideEffects: ['Loose stools', 'Stomach upset', 'Drowsiness'],
      interactions: ['Antibiotics', 'Bisphosphonates', 'Blood pressure medications'],
      onsetTimeline: '1-2 weeks for sleep and relaxation benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'Zinc',
      aliases: ['Zinc Picolinate', 'Zinc Gluconate'],
      subcategory: 'mineral',
      defaultDose: 30,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take with food to avoid stomach upset. Do not take with copper supplements.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Keep in cool, dry place.',
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: ['Copper deficiency (without copper supplementation)'],
      commonSideEffects: ['Nausea', 'Metallic taste', 'Stomach upset'],
      interactions: ['Antibiotics', 'Penicillamine', 'Thiazide diuretics'],
      onsetTimeline: '2-4 weeks for immune benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'Omega-3 Fish Oil',
      aliases: ['Fish Oil', 'EPA/DHA', 'Omega-3'],
      subcategory: 'fatty_acid',
      defaultDose: 2000,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take with meals to reduce fishy aftertaste. Keep refrigerated after opening.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Refrigerate after opening. Discard if smells rancid.',
      shelfLifeDays: 365,
      requiresCycling: false,
      contraindications: ['Fish/shellfish allergy', 'Bleeding disorders'],
      commonSideEffects: ['Fishy burps', 'Loose stools', 'Mild nausea'],
      interactions: ['Blood thinners', 'Blood pressure medications'],
      onsetTimeline: '8-12 weeks for cardiovascular benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'CoQ10',
      aliases: ['Coenzyme Q10', 'Ubiquinone', 'Ubiquinol'],
      subcategory: 'antioxidant',
      defaultDose: 100,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take with a meal containing fat. Ubiquinol form is better absorbed.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from heat and light.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['None significant'],
      commonSideEffects: ['Mild GI upset', 'Insomnia (if taken late)', 'Headache (rare)'],
      interactions: ['Blood thinners', 'Blood pressure medications', 'Chemotherapy drugs'],
      onsetTimeline: '4-12 weeks for energy benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'Glutathione',
      aliases: ['GSH', 'L-Glutathione', 'Reduced Glutathione'],
      subcategory: 'antioxidant',
      defaultDose: 500,
      doseUnit: 'mg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Liposomal form has better absorption. Take on empty stomach.',
      storageTemp: '2-8°C (refrigerated)',
      storageNotes: 'Refrigerate liposomal forms. Protect from light.',
      shelfLifeDays: 365,
      requiresCycling: false,
      contraindications: ['None significant'],
      commonSideEffects: ['Generally well tolerated', 'Mild GI upset (rare)'],
      interactions: ['Chemotherapy drugs', 'Acetaminophen'],
      onsetTimeline: '4-8 weeks for detoxification benefits',
      isPrescriptionRequired: false,
    },
    {
      name: 'Vitamin K2',
      aliases: ['MK-7', 'Menaquinone-7', 'K2'],
      subcategory: 'vitamin',
      defaultDose: 100,
      doseUnit: 'mcg',
      defaultFrequency: 'daily',
      administrationRoute: 'oral',
      preparationInstructions: 'Take with vitamin D3 and a meal containing fat.',
      storageTemp: 'Room temperature (15-30°C)',
      storageNotes: 'Protect from light.',
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ['Warfarin use (requires monitoring)'],
      commonSideEffects: ['Generally well tolerated'],
      interactions: ['Blood thinners (especially warfarin)'],
      onsetTimeline: '8-12 weeks for bone health benefits',
      isPrescriptionRequired: false,
    },
  ];

  let supplementCount = 0;
  for (const supplement of supplements) {
    const existing = await prisma.substance.findFirst({
      where: { name: supplement.name },
    });

    let substance;
    if (existing) {
      substance = await prisma.substance.update({
        where: { id: existing.id },
        data: {
          categoryId: supplementCategory!.id,
          ...supplement,
        },
      });
    } else {
      substance = await prisma.substance.create({
        data: {
          categoryId: supplementCategory!.id,
          ...supplement,
        },
      });
    }
    substanceIds[supplement.name] = substance.id;
    supplementCount++;
  }

  console.log(`Seeded ${supplementCount} supplements`);

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
    // Hormone Protocol Templates
    {
      name: 'TRT Standard Protocol',
      description: 'Standard testosterone replacement therapy protocol for men with low testosterone.',
      substanceName: 'Testosterone Cypionate',
      categoryName: 'hormone',
      defaultDose: 100,
      doseUnit: 'mg',
      frequency: 'weekly',
      difficultyLevel: 'intermediate',
      tags: ['trt', 'testosterone', 'hormone-replacement', 'men'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Starting dose' },
          { week: 2, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 3, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 4, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 5, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Check labs' },
          { week: 6, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 7, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 8, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Adjust dose based on labs' },
        ],
      },
    },
    {
      name: 'TRT + HCG Protocol',
      description: 'Testosterone replacement with HCG to maintain fertility and testicular function.',
      substanceName: 'Testosterone Cypionate',
      categoryName: 'hormone',
      defaultDose: 100,
      doseUnit: 'mg',
      frequency: 'weekly',
      difficultyLevel: 'intermediate',
      tags: ['trt', 'testosterone', 'hcg', 'fertility', 'men'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Start with Test + HCG 500iu 2x/week' },
          { week: 2, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 3, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 4, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 5, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Check labs' },
          { week: 6, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 7, dose: 100, unit: 'mg', frequency: 'weekly' },
          { week: 8, dose: 100, unit: 'mg', frequency: 'weekly', notes: 'Adjust dose based on labs' },
        ],
      },
    },
    {
      name: 'Female HRT Protocol',
      description: 'Hormone replacement protocol for perimenopausal and menopausal women.',
      substanceName: 'Estradiol',
      categoryName: 'hormone',
      defaultDose: 1,
      doseUnit: 'mg',
      frequency: 'daily',
      difficultyLevel: 'intermediate',
      tags: ['hrt', 'estrogen', 'progesterone', 'menopause', 'women'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 0.5, unit: 'mg', frequency: 'daily', notes: 'Low starting dose' },
          { week: 2, dose: 0.5, unit: 'mg', frequency: 'daily' },
          { week: 3, dose: 1, unit: 'mg', frequency: 'daily', notes: 'Increase to standard dose' },
          { week: 4, dose: 1, unit: 'mg', frequency: 'daily' },
          { week: 5, dose: 1, unit: 'mg', frequency: 'daily', notes: 'Add progesterone if using' },
          { week: 6, dose: 1, unit: 'mg', frequency: 'daily' },
          { week: 7, dose: 1, unit: 'mg', frequency: 'daily' },
          { week: 8, dose: 1, unit: 'mg', frequency: 'daily', notes: 'Check labs and adjust' },
        ],
      },
    },
    {
      name: 'Thyroid Optimization Protocol',
      description: 'Low-dose T3 protocol for thyroid optimization alongside T4 therapy.',
      substanceName: 'Liothyronine',
      categoryName: 'hormone',
      defaultDose: 5,
      doseUnit: 'mcg',
      frequency: 'daily',
      difficultyLevel: 'advanced',
      tags: ['thyroid', 't3', 'metabolism', 'energy'],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 5, unit: 'mcg', frequency: 'daily', notes: 'Starting low dose' },
          { week: 2, dose: 5, unit: 'mcg', frequency: 'daily' },
          { week: 3, dose: 5, unit: 'mcg', frequency: 'daily', notes: 'Check symptoms' },
          { week: 4, dose: 5, unit: 'mcg', frequency: 'daily' },
          { week: 5, dose: 10, unit: 'mcg', frequency: 'daily', notes: 'Increase if tolerated' },
          { week: 6, dose: 10, unit: 'mcg', frequency: 'daily' },
          { week: 7, dose: 10, unit: 'mcg', frequency: 'daily' },
          { week: 8, dose: 10, unit: 'mcg', frequency: 'daily', notes: 'Check labs' },
        ],
      },
    },
    // Supplement Protocol Templates
    {
      name: 'Basic Supplement Stack',
      description: 'Foundation supplement stack for overall health optimization.',
      substanceName: 'Vitamin D3',
      categoryName: 'supplement',
      defaultDose: 5000,
      doseUnit: 'iu',
      frequency: 'daily',
      difficultyLevel: 'beginner',
      tags: ['vitamins', 'minerals', 'foundation', 'health'],
    },
    {
      name: 'Longevity Supplement Stack',
      description: 'Advanced supplement protocol for longevity and anti-aging.',
      substanceName: 'CoQ10',
      categoryName: 'supplement',
      defaultDose: 200,
      doseUnit: 'mg',
      frequency: 'daily',
      difficultyLevel: 'intermediate',
      tags: ['longevity', 'anti-aging', 'antioxidants', 'mitochondria'],
    },
    {
      name: 'Sleep & Recovery Stack',
      description: 'Supplement protocol to improve sleep quality and recovery.',
      substanceName: 'Magnesium Glycinate',
      categoryName: 'supplement',
      defaultDose: 400,
      doseUnit: 'mg',
      frequency: 'daily',
      difficultyLevel: 'beginner',
      tags: ['sleep', 'recovery', 'relaxation', 'stress'],
    },
  ];

  // Map category names to IDs
  const categoryMap: Record<string, string> = {
    peptide: peptideCategory.id,
    hormone: hormoneCategory!.id,
    supplement: supplementCategory!.id,
  };

  let templateCount = 0;
  for (const template of templates) {
    const { substanceName, categoryName, ...templateData } = template as {
      substanceName: string;
      categoryName?: string;
      [key: string]: unknown;
    };

    // Determine the category ID - use categoryName if provided, otherwise default to peptide
    const categoryId = categoryName ? categoryMap[categoryName] : peptideCategory.id;

    // Check if template exists by name
    const existing = await prisma.protocolTemplate.findFirst({
      where: { name: template.name },
    });

    if (existing) {
      await prisma.protocolTemplate.update({
        where: { id: existing.id },
        data: {
          ...templateData,
          categoryId,
          substanceId: substanceIds[substanceName],
        },
      });
    } else {
      await prisma.protocolTemplate.create({
        data: {
          ...templateData,
          categoryId,
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
