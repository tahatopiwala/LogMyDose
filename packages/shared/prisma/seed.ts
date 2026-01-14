import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed substance categories
  const peptideCategory = await prisma.substanceCategory.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "peptide",
      displayName: "Peptides",
      description: "Bioactive peptides for therapeutic use",
      icon: "flask",
      sortOrder: 1,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "hormone",
      displayName: "Hormone Therapy",
      description: "Hormone replacement and optimization",
      icon: "heart-pulse",
      sortOrder: 2,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      name: "supplement",
      displayName: "Supplements",
      description: "Vitamins, minerals, and nutraceuticals",
      icon: "pill",
      sortOrder: 3,
    },
  });

  await prisma.substanceCategory.upsert({
    where: { id: "00000000-0000-0000-0000-000000000004" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      name: "nootropic",
      displayName: "Nootropics",
      description: "Cognitive enhancement compounds",
      icon: "brain",
      sortOrder: 4,
    },
  });

  console.log("Seeded 4 categories");

  // Seed peptides - use upsert by name via findFirst + create/update pattern
  const peptides = [
    {
      name: "BPC-157",
      aliases: ["Body Protection Compound-157", "Pentadecapeptide BPC 157"],
      subcategory: "healing",
      defaultDose: 250,
      doseUnit: "mcg",
      defaultFrequency: "2x_daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 5mg vial = 250mcg per 0.1ml",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Store reconstituted peptide in refrigerator. Protect from light.",
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: ["Active cancer", "Pregnancy", "Breastfeeding"],
      commonSideEffects: [
        "Injection site irritation",
        "Nausea (rare)",
        "Dizziness (rare)",
      ],
      interactions: [],
      onsetTimeline: "2-4 weeks for noticeable effects",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "BPC 157: A Review of its Effects on Wound Healing and Tissue Repair",
          url: "https://pubmed.ncbi.nlm.nih.gov/29898130/",
          type: "study",
        },
        {
          title: "Stable gastric pentadecapeptide BPC 157: novel therapy",
          url: "https://pubmed.ncbi.nlm.nih.gov/27142187/",
          type: "study",
        },
      ],
    },
    {
      name: "TB-500",
      aliases: ["Thymosin Beta-4", "TB4"],
      subcategory: "healing",
      defaultDose: 2.5,
      doseUnit: "mg",
      defaultFrequency: "2x_weekly",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 5mg vial",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Store reconstituted peptide in refrigerator. Protect from light.",
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: true,
      commonCycleOnWeeks: 6,
      commonCycleOffWeeks: 4,
      contraindications: ["Active cancer", "Pregnancy"],
      commonSideEffects: [
        "Injection site irritation",
        "Temporary fatigue",
        "Head rush",
      ],
      interactions: [],
      onsetTimeline: "2-6 weeks for injury healing",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "Thymosin β4: A Multi-Functional Regenerative Peptide",
          url: "https://pubmed.ncbi.nlm.nih.gov/22074427/",
          type: "study",
        },
        {
          title: "Thymosin Beta 4 in Wound Healing",
          url: "https://pubmed.ncbi.nlm.nih.gov/17185648/",
          type: "study",
        },
      ],
    },
    {
      name: "Semaglutide",
      aliases: ["Ozempic", "Wegovy", "Rybelsus"],
      subcategory: "glp1",
      defaultDose: 0.25,
      doseUnit: "mg",
      defaultFrequency: "weekly",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Pre-filled pens typically ready to use. For compounded: reconstitute per pharmacy instructions.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Once in use, can be kept at room temperature for up to 56 days.",
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 56,
      requiresCycling: false,
      contraindications: [
        "Personal or family history of MTC",
        "MEN 2",
        "Pregnancy",
        "Pancreatitis history",
      ],
      commonSideEffects: [
        "Nausea",
        "Vomiting",
        "Diarrhea",
        "Constipation",
        "Abdominal pain",
        "Decreased appetite",
      ],
      interactions: ["Insulin", "Sulfonylureas"],
      onsetTimeline:
        "Weight loss typically begins within 4-8 weeks, full effects at 16-20 weeks",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Type 2 diabetes mellitus (Ozempic)",
        "Chronic weight management (Wegovy)",
        "Cardiovascular risk reduction",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79",
      references: [
        {
          title: "FDA Approval - Ozempic (semaglutide) for Type 2 Diabetes",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/209637s012lbl.pdf",
          type: "fda_label",
        },
        {
          title: "FDA Approval - Wegovy (semaglutide) for Chronic Weight Management",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/215256s007lbl.pdf",
          type: "fda_label",
        },
        {
          title: "STEP 1 Trial: Semaglutide 2.4 mg for Weight Management",
          url: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
          type: "study",
        },
      ],
    },
    {
      name: "Tirzepatide",
      aliases: ["Mounjaro", "Zepbound"],
      subcategory: "glp1_gip",
      defaultDose: 2.5,
      doseUnit: "mg",
      defaultFrequency: "weekly",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Pre-filled pens. For compounded: reconstitute per pharmacy instructions.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Once in use, can be kept at room temperature for up to 21 days.",
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: false,
      contraindications: [
        "Personal or family history of MTC",
        "MEN 2",
        "Pregnancy",
      ],
      commonSideEffects: [
        "Nausea",
        "Diarrhea",
        "Decreased appetite",
        "Vomiting",
        "Constipation",
        "Dyspepsia",
      ],
      interactions: ["Insulin", "Sulfonylureas"],
      onsetTimeline: "Weight loss typically begins within 4 weeks",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Type 2 diabetes mellitus (Mounjaro)",
        "Chronic weight management (Zepbound)",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c1a64a6c-4e31-458c-9fe4-f9ef92bb7ddc",
      references: [
        {
          title: "FDA Approval - Mounjaro (tirzepatide) for Type 2 Diabetes",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/215866s003lbl.pdf",
          type: "fda_label",
        },
        {
          title: "FDA Approval - Zepbound (tirzepatide) for Chronic Weight Management",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/217806s000lbl.pdf",
          type: "fda_label",
        },
        {
          title: "SURMOUNT-1 Trial: Tirzepatide for Weight Management",
          url: "https://pubmed.ncbi.nlm.nih.gov/35658024/",
          type: "study",
        },
      ],
    },
    {
      name: "CJC-1295",
      aliases: ["CJC-1295 DAC", "Modified GRF 1-29"],
      subcategory: "gh_secretagogue",
      defaultDose: 1000,
      doseUnit: "mcg",
      defaultFrequency: "2x_weekly",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Typical ratio: 2ml BAC water per 2mg vial",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Store reconstituted peptide in refrigerator. Sensitive to heat.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ["Active cancer", "Diabetic retinopathy"],
      commonSideEffects: [
        "Water retention",
        "Numbness/tingling in hands",
        "Increased hunger",
        "Fatigue initially",
      ],
      interactions: [],
      onsetTimeline:
        "2-4 weeks for improved sleep, 8-12 weeks for body composition changes",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "CJC-1295: A Long-Acting GHRH Analog",
          url: "https://pubmed.ncbi.nlm.nih.gov/16352683/",
          type: "study",
        },
      ],
    },
    {
      name: "Ipamorelin",
      aliases: [],
      subcategory: "gh_secretagogue",
      defaultDose: 200,
      doseUnit: "mcg",
      defaultFrequency: "2x_daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Inject on empty stomach.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Store reconstituted peptide in refrigerator.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ["Active cancer", "Pregnancy"],
      commonSideEffects: [
        "Headache",
        "Flushing",
        "Dizziness",
        "Increased appetite",
      ],
      interactions: [],
      onsetTimeline:
        "2-4 weeks for improved sleep, 8-12 weeks for full effects",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "Ipamorelin: The First Selective Growth Hormone Secretagogue",
          url: "https://pubmed.ncbi.nlm.nih.gov/9849822/",
          type: "study",
        },
      ],
    },
    {
      name: "PT-141",
      aliases: ["Bremelanotide"],
      subcategory: "sexual_health",
      defaultDose: 1.75,
      doseUnit: "mg",
      defaultFrequency: "as_needed",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Use 45-60 minutes before activity.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Store reconstituted peptide in refrigerator.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: [
        "Uncontrolled hypertension",
        "Cardiovascular disease",
      ],
      commonSideEffects: [
        "Nausea",
        "Flushing",
        "Headache",
        "Temporary increase in blood pressure",
      ],
      interactions: ["Antihypertensives"],
      onsetTimeline: "45-60 minutes before onset of effects",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Hypoactive sexual desire disorder (HSDD) in premenopausal women",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=18b77e84-4bc0-4e40-b09c-bc76ef9bfe04",
      references: [
        {
          title: "FDA Approval - Vyleesi (bremelanotide) for HSDD",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/210557s000lbl.pdf",
          type: "fda_label",
        },
        {
          title: "Bremelanotide for Hypoactive Sexual Desire Disorder",
          url: "https://pubmed.ncbi.nlm.nih.gov/31042449/",
          type: "study",
        },
      ],
    },
    {
      name: "Sermorelin",
      aliases: ["GHRH", "GRF 1-29"],
      subcategory: "gh_secretagogue",
      defaultDose: 200,
      doseUnit: "mcg",
      defaultFrequency: "daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Best injected at bedtime on empty stomach.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Store reconstituted peptide in refrigerator. Sensitive to light and heat.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 14,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ["Active cancer", "Pregnancy"],
      commonSideEffects: [
        "Injection site reactions",
        "Flushing",
        "Dizziness",
        "Headache",
      ],
      interactions: [],
      onsetTimeline:
        "2-4 weeks for improved sleep, 3-6 months for full effects",
      isPrescriptionRequired: true,
      fdaStatus: "withdrawn",
      fdaApprovedFor: [
        "Previously approved for diagnosis of growth hormone deficiency (discontinued)",
      ],
      fdaLabelUrl: null,
      references: [
        {
          title: "Sermorelin: A Review of Its Use in the Diagnosis and Treatment of Children with Idiopathic Growth Hormone Deficiency",
          url: "https://pubmed.ncbi.nlm.nih.gov/10193873/",
          type: "study",
        },
      ],
    },
    {
      name: "Tesamorelin",
      aliases: ["Egrifta"],
      subcategory: "gh_secretagogue",
      defaultDose: 2,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with provided diluent. Inject into abdomen.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Use immediately after reconstitution.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 1,
      requiresCycling: false,
      contraindications: [
        "Active cancer",
        "Pregnancy",
        "Hypersensitivity to mannitol",
      ],
      commonSideEffects: [
        "Injection site reactions",
        "Joint pain",
        "Edema",
        "Muscle pain",
      ],
      interactions: [],
      onsetTimeline: "8-12 weeks for measurable reduction in visceral fat",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Reduction of excess abdominal fat in HIV-infected patients with lipodystrophy",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0d89e15d-cc26-4c2a-9f5f-6e1e78c91ce5",
      references: [
        {
          title: "FDA Approval - Egrifta (tesamorelin) for HIV Lipodystrophy",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/022505s011lbl.pdf",
          type: "fda_label",
        },
        {
          title: "Tesamorelin Effects on Visceral Fat and Liver Fat in HIV",
          url: "https://pubmed.ncbi.nlm.nih.gov/25006700/",
          type: "study",
        },
      ],
    },
    {
      name: "AOD-9604",
      aliases: ["Anti-Obesity Drug 9604"],
      subcategory: "metabolic",
      defaultDose: 300,
      doseUnit: "mcg",
      defaultFrequency: "daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Inject on empty stomach.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Store reconstituted peptide in refrigerator.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 21,
      requiresCycling: true,
      commonCycleOnWeeks: 12,
      commonCycleOffWeeks: 4,
      contraindications: ["Pregnancy", "Breastfeeding"],
      commonSideEffects: ["Mild injection site reactions", "Headache (rare)"],
      interactions: [],
      onsetTimeline: "4-8 weeks for fat metabolism effects",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "AOD9604: A Novel Peptide with Fat-Reducing Properties",
          url: "https://pubmed.ncbi.nlm.nih.gov/11713213/",
          type: "study",
        },
        {
          title: "FDA GRAS Notice for AOD-9604 (food use)",
          url: "https://www.fda.gov/media/110870/download",
          type: "fda_document",
        },
      ],
    },
    {
      name: "GHK-Cu",
      aliases: ["Copper Peptide", "GHK Copper"],
      subcategory: "healing",
      defaultDose: 1,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Also available topically.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Protect from light. Blue-colored solution is normal.",
      shelfLifeDays: 365,
      shelfLifeReconstitutedDays: 28,
      requiresCycling: false,
      contraindications: ["Copper allergy", "Wilson disease"],
      commonSideEffects: [
        "Injection site irritation",
        "Temporary skin discoloration",
      ],
      interactions: [],
      onsetTimeline: "4-8 weeks for skin/healing improvements",
      isPrescriptionRequired: false,
      fdaStatus: "research",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "GHK-Cu: The Human Skin Remodeling Peptide",
          url: "https://pubmed.ncbi.nlm.nih.gov/18047933/",
          type: "study",
        },
        {
          title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways",
          url: "https://pubmed.ncbi.nlm.nih.gov/25654320/",
          type: "study",
        },
      ],
    },
    {
      name: "NAD+",
      aliases: ["Nicotinamide Adenine Dinucleotide"],
      subcategory: "longevity",
      defaultDose: 100,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Typically comes pre-mixed. Can also be administered IV or orally.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Light sensitive. Store in dark container.",
      shelfLifeDays: 180,
      shelfLifeReconstitutedDays: 30,
      requiresCycling: false,
      contraindications: ["Active cancer (controversial)"],
      commonSideEffects: [
        "Nausea",
        "Flushing",
        "Headache",
        "Fatigue initially",
      ],
      interactions: [],
      onsetTimeline: "2-4 weeks for energy improvements",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NAD+ Metabolism and Its Roles in Cellular Processes",
          url: "https://pubmed.ncbi.nlm.nih.gov/26785480/",
          type: "study",
        },
        {
          title: "NAD+ in Aging: Molecular Mechanisms and Translational Implications",
          url: "https://pubmed.ncbi.nlm.nih.gov/30443585/",
          type: "study",
        },
      ],
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
    where: { id: "00000000-0000-0000-0000-000000000002" },
  });

  const hormones = [
    {
      name: "Testosterone Cypionate",
      aliases: ["Test Cyp", "Depo-Testosterone"],
      subcategory: "androgen",
      defaultDose: 100,
      doseUnit: "mg",
      defaultFrequency: "weekly",
      administrationRoute: "injection_im",
      preparationInstructions:
        "Draw with 18g needle, inject with 25g needle. Warm vial to body temperature before injection.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from light. Do not refrigerate.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Prostate cancer",
        "Breast cancer in men",
        "Pregnancy",
        "Polycythemia",
      ],
      commonSideEffects: [
        "Acne",
        "Hair loss",
        "Increased hematocrit",
        "Testicular atrophy",
        "Mood changes",
      ],
      interactions: ["Blood thinners", "Insulin", "Corticosteroids"],
      onsetTimeline:
        "2-4 weeks for initial effects, 3-6 months for full benefits",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Male hypogonadism",
        "Delayed puberty in males",
        "Metastatic breast cancer in females",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bbb4cf8f-b8c9-4f9d-8a2e-4be5d58e6d50",
      references: [
        {
          title: "FDA Label - Depo-Testosterone (testosterone cypionate)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/085635s029lbl.pdf",
          type: "fda_label",
        },
        {
          title: "Testosterone Therapy in Men with Hypogonadism: An Endocrine Society Guideline",
          url: "https://pubmed.ncbi.nlm.nih.gov/29562364/",
          type: "guideline",
        },
      ],
    },
    {
      name: "Testosterone Enanthate",
      aliases: ["Test E", "Delatestryl"],
      subcategory: "androgen",
      defaultDose: 100,
      doseUnit: "mg",
      defaultFrequency: "weekly",
      administrationRoute: "injection_im",
      preparationInstructions:
        "Draw with 18g needle, inject with 25g needle. Can be injected IM or subcutaneously.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from light. Do not refrigerate.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Prostate cancer",
        "Breast cancer in men",
        "Pregnancy",
        "Severe cardiac disease",
      ],
      commonSideEffects: [
        "Acne",
        "Hair loss",
        "Increased hematocrit",
        "Testicular atrophy",
        "Water retention",
      ],
      interactions: ["Blood thinners", "Insulin", "Corticosteroids"],
      onsetTimeline:
        "2-4 weeks for initial effects, 3-6 months for full benefits",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Male hypogonadism",
        "Delayed puberty in males",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e7e0e6be-fb2a-4c38-ad6b-c2a80a2d6b4c",
      references: [
        {
          title: "FDA Label - Delatestryl (testosterone enanthate)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/009165s033lbl.pdf",
          type: "fda_label",
        },
      ],
    },
    {
      name: "Estradiol",
      aliases: ["E2", "Estrace", "17β-estradiol"],
      subcategory: "estrogen",
      defaultDose: 1,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take orally with or without food. Also available as patch, gel, or injection.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Store in original container. Protect from moisture.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "History of blood clots",
        "Estrogen-sensitive cancers",
        "Liver disease",
        "Undiagnosed vaginal bleeding",
      ],
      commonSideEffects: [
        "Breast tenderness",
        "Headache",
        "Nausea",
        "Bloating",
        "Mood changes",
      ],
      interactions: [
        "Aromatase inhibitors",
        "Thyroid medications",
        "St. Johns Wort",
      ],
      onsetTimeline: "2-4 weeks for symptom improvement",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Moderate to severe vasomotor symptoms of menopause",
        "Vulvar and vaginal atrophy",
        "Hypoestrogenism due to hypogonadism",
        "Prevention of postmenopausal osteoporosis",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=af14d71e-e94c-48b2-8203-aae2a7c1f8b6",
      references: [
        {
          title: "FDA Label - Estrace (estradiol)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/017369s056lbl.pdf",
          type: "fda_label",
        },
        {
          title: "The 2022 Hormone Therapy Position Statement of The North American Menopause Society",
          url: "https://pubmed.ncbi.nlm.nih.gov/35797481/",
          type: "guideline",
        },
      ],
    },
    {
      name: "Progesterone",
      aliases: ["Prometrium", "Micronized Progesterone"],
      subcategory: "progestogen",
      defaultDose: 100,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take at bedtime due to sedative effects. Can also be used vaginally.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Store in original container.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Peanut allergy (for oral capsules)",
        "Breast cancer",
        "Blood clots",
        "Liver disease",
      ],
      commonSideEffects: [
        "Drowsiness",
        "Dizziness",
        "Breast tenderness",
        "Headache",
        "Mood changes",
      ],
      interactions: ["CYP3A4 inhibitors", "Barbiturates", "Rifampin"],
      onsetTimeline:
        "1-2 weeks for sleep benefits, 2-4 weeks for other effects",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Prevention of endometrial hyperplasia in postmenopausal women receiving estrogen",
        "Secondary amenorrhea",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3f6a7a1c-6dba-48ff-95ef-1b6a17dd0c0c",
      references: [
        {
          title: "FDA Label - Prometrium (progesterone)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/019781s029lbl.pdf",
          type: "fda_label",
        },
      ],
    },
    {
      name: "DHEA",
      aliases: ["Dehydroepiandrosterone", "Prasterone"],
      subcategory: "precursor",
      defaultDose: 25,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions: "Take in the morning with food.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Keep in cool, dry place.",
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: [
        "Hormone-sensitive cancers",
        "Pregnancy",
        "Breastfeeding",
        "PCOS",
      ],
      commonSideEffects: [
        "Acne",
        "Hair loss",
        "Oily skin",
        "Mood changes",
        "Irregular periods",
      ],
      interactions: [
        "Estrogen therapy",
        "Testosterone therapy",
        "Antipsychotics",
      ],
      onsetTimeline: "4-8 weeks for noticeable effects",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "DHEA in Elderly Women and DHEA or Testosterone in Elderly Men",
          url: "https://pubmed.ncbi.nlm.nih.gov/17090760/",
          type: "study",
        },
        {
          title: "NIH - DHEA Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/DHEA-HealthProfessional/",
          type: "nih_resource",
        },
      ],
    },
    {
      name: "Pregnenolone",
      aliases: ["Preg"],
      subcategory: "precursor",
      defaultDose: 50,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions: "Take in the morning with food.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Keep in cool, dry place.",
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: [
        "Hormone-sensitive cancers",
        "Pregnancy",
        "Seizure disorders",
      ],
      commonSideEffects: ["Headache", "Irritability", "Acne", "Insomnia"],
      interactions: ["Hormone therapies", "CNS depressants"],
      onsetTimeline: "2-4 weeks for cognitive effects",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "Pregnenolone and Cognitive Function",
          url: "https://pubmed.ncbi.nlm.nih.gov/21158904/",
          type: "study",
        },
      ],
    },
    {
      name: "Liothyronine",
      aliases: ["T3", "Cytomel", "Triiodothyronine"],
      subcategory: "thyroid",
      defaultDose: 5,
      doseUnit: "mcg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take on empty stomach, 30-60 minutes before breakfast. Consistent timing important.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from light and moisture.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Untreated adrenal insufficiency",
        "Thyrotoxicosis",
        "Acute MI",
      ],
      commonSideEffects: [
        "Palpitations",
        "Anxiety",
        "Weight loss",
        "Insomnia",
        "Heat intolerance",
      ],
      interactions: [
        "Blood thinners",
        "Diabetes medications",
        "Digoxin",
        "Antidepressants",
      ],
      onsetTimeline:
        "24-72 hours for initial effects, 2-4 weeks for stable levels",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Hypothyroidism",
        "Thyroid suppression therapy",
        "Myxedema coma",
        "Thyroid diagnostic testing",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=28db4b44-f71b-4c32-b37e-70c48685e7d5",
      references: [
        {
          title: "FDA Label - Cytomel (liothyronine sodium)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/010379s042lbl.pdf",
          type: "fda_label",
        },
        {
          title: "ATA Guidelines for Treatment of Hypothyroidism",
          url: "https://pubmed.ncbi.nlm.nih.gov/25266247/",
          type: "guideline",
        },
      ],
    },
    {
      name: "HCG",
      aliases: ["Human Chorionic Gonadotropin", "Pregnyl", "Novarel"],
      subcategory: "gonadotropin",
      defaultDose: 500,
      doseUnit: "iu",
      defaultFrequency: "2x_weekly",
      administrationRoute: "injection_subq",
      preparationInstructions:
        "Reconstitute with bacteriostatic water. Refrigerate after mixing.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes:
        "Must refrigerate after reconstitution. Use within 60 days.",
      shelfLifeDays: 730,
      shelfLifeReconstitutedDays: 60,
      requiresCycling: false,
      contraindications: [
        "Hormone-sensitive cancers",
        "Precocious puberty",
        "Pregnancy",
      ],
      commonSideEffects: [
        "Headache",
        "Irritability",
        "Restlessness",
        "Injection site pain",
      ],
      interactions: ["Gonadotropin-releasing hormones"],
      onsetTimeline: "1-2 weeks for testicular response",
      isPrescriptionRequired: true,
      fdaStatus: "approved",
      fdaApprovedFor: [
        "Prepubertal cryptorchidism",
        "Hypogonadotropic hypogonadism in males",
        "Induction of ovulation in anovulatory women",
      ],
      fdaLabelUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae5e7fbd-8e9e-4d03-96d9-5e5d2b9ad6c2",
      references: [
        {
          title: "FDA Label - Pregnyl (chorionic gonadotropin)",
          url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/017022s032lbl.pdf",
          type: "fda_label",
        },
        {
          title: "HCG Use in Male Hypogonadism",
          url: "https://pubmed.ncbi.nlm.nih.gov/23915510/",
          type: "study",
        },
      ],
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
    where: { id: "00000000-0000-0000-0000-000000000003" },
  });

  const supplements = [
    {
      name: "Vitamin D3",
      aliases: ["Cholecalciferol", "D3"],
      subcategory: "vitamin",
      defaultDose: 5000,
      doseUnit: "iu",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take with a meal containing fat for better absorption.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Keep in cool, dry place. Protect from light.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Hypercalcemia",
        "Hypervitaminosis D",
        "Kidney disease",
      ],
      commonSideEffects: ["Nausea (high doses)", "Constipation", "Weakness"],
      interactions: [
        "Thiazide diuretics",
        "Steroids",
        "Cholesterol medications",
      ],
      onsetTimeline:
        "4-8 weeks for blood level changes, 3+ months for full benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Vitamin D Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
          type: "nih_resource",
        },
        {
          title: "Vitamin D and Health: A Review",
          url: "https://pubmed.ncbi.nlm.nih.gov/32679784/",
          type: "study",
        },
      ],
    },
    {
      name: "Vitamin B12",
      aliases: ["Methylcobalamin", "Cobalamin", "B12"],
      subcategory: "vitamin",
      defaultDose: 1000,
      doseUnit: "mcg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Sublingual form absorbs better. Can be taken any time.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from light and moisture.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ["Cobalt allergy", "Leber's disease"],
      commonSideEffects: ["Generally well tolerated", "Mild diarrhea (rare)"],
      interactions: ["Metformin", "Proton pump inhibitors", "Colchicine"],
      onsetTimeline: "2-4 weeks for energy improvements",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Vitamin B12 Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
          type: "nih_resource",
        },
      ],
    },
    {
      name: "Magnesium Glycinate",
      aliases: ["Mag Glycinate", "Chelated Magnesium"],
      subcategory: "mineral",
      defaultDose: 400,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take in the evening for sleep benefits. Can be split into 2 doses.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Keep in cool, dry place.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: [
        "Severe kidney disease",
        "Heart block",
        "Myasthenia gravis",
      ],
      commonSideEffects: ["Loose stools", "Stomach upset", "Drowsiness"],
      interactions: [
        "Antibiotics",
        "Bisphosphonates",
        "Blood pressure medications",
      ],
      onsetTimeline: "1-2 weeks for sleep and relaxation benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Magnesium Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
          type: "nih_resource",
        },
        {
          title: "The Role of Magnesium in Sleep Health",
          url: "https://pubmed.ncbi.nlm.nih.gov/35184264/",
          type: "study",
        },
      ],
    },
    {
      name: "Zinc",
      aliases: ["Zinc Picolinate", "Zinc Gluconate"],
      subcategory: "mineral",
      defaultDose: 30,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take with food to avoid stomach upset. Do not take with copper supplements.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Keep in cool, dry place.",
      shelfLifeDays: 730,
      requiresCycling: true,
      commonCycleOnWeeks: 8,
      commonCycleOffWeeks: 4,
      contraindications: ["Copper deficiency (without copper supplementation)"],
      commonSideEffects: ["Nausea", "Metallic taste", "Stomach upset"],
      interactions: ["Antibiotics", "Penicillamine", "Thiazide diuretics"],
      onsetTimeline: "2-4 weeks for immune benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Zinc Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/",
          type: "nih_resource",
        },
      ],
    },
    {
      name: "Omega-3 Fish Oil",
      aliases: ["Fish Oil", "EPA/DHA", "Omega-3"],
      subcategory: "fatty_acid",
      defaultDose: 2000,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take with meals to reduce fishy aftertaste. Keep refrigerated after opening.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Refrigerate after opening. Discard if smells rancid.",
      shelfLifeDays: 365,
      requiresCycling: false,
      contraindications: ["Fish/shellfish allergy", "Bleeding disorders"],
      commonSideEffects: ["Fishy burps", "Loose stools", "Mild nausea"],
      interactions: ["Blood thinners", "Blood pressure medications"],
      onsetTimeline: "8-12 weeks for cardiovascular benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Omega-3 Fatty Acids Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
          type: "nih_resource",
        },
        {
          title: "Omega-3 Fatty Acids and Cardiovascular Disease",
          url: "https://pubmed.ncbi.nlm.nih.gov/33963618/",
          type: "study",
        },
      ],
    },
    {
      name: "CoQ10",
      aliases: ["Coenzyme Q10", "Ubiquinone", "Ubiquinol"],
      subcategory: "antioxidant",
      defaultDose: 100,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take with a meal containing fat. Ubiquinol form is better absorbed.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from heat and light.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ["None significant"],
      commonSideEffects: [
        "Mild GI upset",
        "Insomnia (if taken late)",
        "Headache (rare)",
      ],
      interactions: [
        "Blood thinners",
        "Blood pressure medications",
        "Chemotherapy drugs",
      ],
      onsetTimeline: "4-12 weeks for energy benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "Coenzyme Q10: Clinical Applications in Cardiovascular Diseases",
          url: "https://pubmed.ncbi.nlm.nih.gov/29543825/",
          type: "study",
        },
        {
          title: "NIH - Coenzyme Q10 Summary",
          url: "https://www.nccih.nih.gov/health/coenzyme-q10",
          type: "nih_resource",
        },
      ],
    },
    {
      name: "Glutathione",
      aliases: ["GSH", "L-Glutathione", "Reduced Glutathione"],
      subcategory: "antioxidant",
      defaultDose: 500,
      doseUnit: "mg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Liposomal form has better absorption. Take on empty stomach.",
      storageTemp: "2-8°C (refrigerated)",
      storageNotes: "Refrigerate liposomal forms. Protect from light.",
      shelfLifeDays: 365,
      requiresCycling: false,
      contraindications: ["None significant"],
      commonSideEffects: ["Generally well tolerated", "Mild GI upset (rare)"],
      interactions: ["Chemotherapy drugs", "Acetaminophen"],
      onsetTimeline: "4-8 weeks for detoxification benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "Glutathione: Overview of its Protective Roles and Therapeutic Potential",
          url: "https://pubmed.ncbi.nlm.nih.gov/25050823/",
          type: "study",
        },
      ],
    },
    {
      name: "Vitamin K2",
      aliases: ["MK-7", "Menaquinone-7", "K2"],
      subcategory: "vitamin",
      defaultDose: 100,
      doseUnit: "mcg",
      defaultFrequency: "daily",
      administrationRoute: "oral",
      preparationInstructions:
        "Take with vitamin D3 and a meal containing fat.",
      storageTemp: "Room temperature (15-30°C)",
      storageNotes: "Protect from light.",
      shelfLifeDays: 730,
      requiresCycling: false,
      contraindications: ["Warfarin use (requires monitoring)"],
      commonSideEffects: ["Generally well tolerated"],
      interactions: ["Blood thinners (especially warfarin)"],
      onsetTimeline: "8-12 weeks for bone health benefits",
      isPrescriptionRequired: false,
      fdaStatus: "supplement",
      fdaApprovedFor: [],
      fdaLabelUrl: null,
      references: [
        {
          title: "NIH Office of Dietary Supplements - Vitamin K Fact Sheet",
          url: "https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/",
          type: "nih_resource",
        },
        {
          title: "Vitamin K2 in Bone and Cardiovascular Health",
          url: "https://pubmed.ncbi.nlm.nih.gov/26770129/",
          type: "study",
        },
      ],
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
      name: "BPC-157 Beginner Protocol",
      description:
        "Standard healing protocol for beginners. Great for gut health and injury recovery.",
      substanceName: "BPC-157",
      defaultDose: 250,
      doseUnit: "mcg",
      frequency: "2x_daily",
      difficultyLevel: "beginner",
      tags: ["healing", "gut-health", "injury-recovery", "beginner"],
      titrationPlan: {
        weeks: [
          { week: 1, dose: 250, unit: "mcg", frequency: "2x_daily" },
          { week: 2, dose: 250, unit: "mcg", frequency: "2x_daily" },
          { week: 3, dose: 250, unit: "mcg", frequency: "2x_daily" },
          { week: 4, dose: 250, unit: "mcg", frequency: "2x_daily" },
        ],
      },
    },
    {
      name: "Semaglutide Weight Loss Titration",
      description:
        "Standard titration schedule for Semaglutide. Gradual dose increase to minimize side effects.",
      substanceName: "Semaglutide",
      defaultDose: 0.25,
      doseUnit: "mg",
      frequency: "weekly",
      difficultyLevel: "intermediate",
      tags: ["weight-loss", "glp1", "titration"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 0.25,
            unit: "mg",
            frequency: "weekly",
            notes: "Starting dose",
          },
          { week: 2, dose: 0.25, unit: "mg", frequency: "weekly" },
          { week: 3, dose: 0.25, unit: "mg", frequency: "weekly" },
          { week: 4, dose: 0.25, unit: "mg", frequency: "weekly" },
          {
            week: 5,
            dose: 0.5,
            unit: "mg",
            frequency: "weekly",
            notes: "First dose increase",
          },
          { week: 6, dose: 0.5, unit: "mg", frequency: "weekly" },
          { week: 7, dose: 0.5, unit: "mg", frequency: "weekly" },
          { week: 8, dose: 0.5, unit: "mg", frequency: "weekly" },
          {
            week: 9,
            dose: 1.0,
            unit: "mg",
            frequency: "weekly",
            notes: "Second dose increase",
          },
          { week: 10, dose: 1.0, unit: "mg", frequency: "weekly" },
          { week: 11, dose: 1.0, unit: "mg", frequency: "weekly" },
          { week: 12, dose: 1.0, unit: "mg", frequency: "weekly" },
          {
            week: 13,
            dose: 1.7,
            unit: "mg",
            frequency: "weekly",
            notes: "Third dose increase",
          },
          { week: 14, dose: 1.7, unit: "mg", frequency: "weekly" },
          { week: 15, dose: 1.7, unit: "mg", frequency: "weekly" },
          { week: 16, dose: 1.7, unit: "mg", frequency: "weekly" },
          {
            week: 17,
            dose: 2.4,
            unit: "mg",
            frequency: "weekly",
            notes: "Maintenance dose",
          },
        ],
      },
    },
    {
      name: "CJC-1295 + Ipamorelin Stack",
      description:
        "Popular GH secretagogue stack for improved sleep, recovery, and body composition.",
      substanceName: "CJC-1295",
      defaultDose: 100,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["gh-secretagogue", "sleep", "recovery", "stack"],
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
    },
    {
      name: "TB-500 + BPC-157 Healing Stack",
      description:
        "Synergistic healing protocol combining TB-500 and BPC-157 for accelerated recovery.",
      substanceName: "TB-500",
      defaultDose: 2.5,
      doseUnit: "mg",
      frequency: "2x_weekly",
      difficultyLevel: "intermediate",
      tags: ["healing", "injury-recovery", "stack"],
      cycleOnWeeks: 6,
      cycleOffWeeks: 4,
    },
    // Hormone Protocol Templates
    {
      name: "TRT Standard Protocol",
      description:
        "Standard testosterone replacement therapy protocol for men with low testosterone.",
      substanceName: "Testosterone Cypionate",
      categoryName: "hormone",
      defaultDose: 100,
      doseUnit: "mg",
      frequency: "weekly",
      difficultyLevel: "intermediate",
      tags: ["trt", "testosterone", "hormone-replacement", "men"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Starting dose",
          },
          { week: 2, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 3, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 4, dose: 100, unit: "mg", frequency: "weekly" },
          {
            week: 5,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Check labs",
          },
          { week: 6, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 7, dose: 100, unit: "mg", frequency: "weekly" },
          {
            week: 8,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Adjust dose based on labs",
          },
        ],
      },
    },
    {
      name: "TRT + HCG Protocol",
      description:
        "Testosterone replacement with HCG to maintain fertility and testicular function.",
      substanceName: "Testosterone Cypionate",
      categoryName: "hormone",
      defaultDose: 100,
      doseUnit: "mg",
      frequency: "weekly",
      difficultyLevel: "intermediate",
      tags: ["trt", "testosterone", "hcg", "fertility", "men"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Start with Test + HCG 500iu 2x/week",
          },
          { week: 2, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 3, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 4, dose: 100, unit: "mg", frequency: "weekly" },
          {
            week: 5,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Check labs",
          },
          { week: 6, dose: 100, unit: "mg", frequency: "weekly" },
          { week: 7, dose: 100, unit: "mg", frequency: "weekly" },
          {
            week: 8,
            dose: 100,
            unit: "mg",
            frequency: "weekly",
            notes: "Adjust dose based on labs",
          },
        ],
      },
    },
    {
      name: "Female HRT Protocol",
      description:
        "Hormone replacement protocol for perimenopausal and menopausal women.",
      substanceName: "Estradiol",
      categoryName: "hormone",
      defaultDose: 1,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["hrt", "estrogen", "progesterone", "menopause", "women"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 0.5,
            unit: "mg",
            frequency: "daily",
            notes: "Low starting dose",
          },
          { week: 2, dose: 0.5, unit: "mg", frequency: "daily" },
          {
            week: 3,
            dose: 1,
            unit: "mg",
            frequency: "daily",
            notes: "Increase to standard dose",
          },
          { week: 4, dose: 1, unit: "mg", frequency: "daily" },
          {
            week: 5,
            dose: 1,
            unit: "mg",
            frequency: "daily",
            notes: "Add progesterone if using",
          },
          { week: 6, dose: 1, unit: "mg", frequency: "daily" },
          { week: 7, dose: 1, unit: "mg", frequency: "daily" },
          {
            week: 8,
            dose: 1,
            unit: "mg",
            frequency: "daily",
            notes: "Check labs and adjust",
          },
        ],
      },
    },
    {
      name: "Thyroid Optimization Protocol",
      description:
        "Low-dose T3 protocol for thyroid optimization alongside T4 therapy.",
      substanceName: "Liothyronine",
      categoryName: "hormone",
      defaultDose: 5,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "advanced",
      tags: ["thyroid", "t3", "metabolism", "energy"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 5,
            unit: "mcg",
            frequency: "daily",
            notes: "Starting low dose",
          },
          { week: 2, dose: 5, unit: "mcg", frequency: "daily" },
          {
            week: 3,
            dose: 5,
            unit: "mcg",
            frequency: "daily",
            notes: "Check symptoms",
          },
          { week: 4, dose: 5, unit: "mcg", frequency: "daily" },
          {
            week: 5,
            dose: 10,
            unit: "mcg",
            frequency: "daily",
            notes: "Increase if tolerated",
          },
          { week: 6, dose: 10, unit: "mcg", frequency: "daily" },
          { week: 7, dose: 10, unit: "mcg", frequency: "daily" },
          {
            week: 8,
            dose: 10,
            unit: "mcg",
            frequency: "daily",
            notes: "Check labs",
          },
        ],
      },
    },
    // Supplement Protocol Templates
    {
      name: "Basic Supplement Stack",
      description:
        "Foundation supplement stack for overall health optimization.",
      substanceName: "Vitamin D3",
      categoryName: "supplement",
      defaultDose: 5000,
      doseUnit: "iu",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["vitamins", "minerals", "foundation", "health"],
    },
    {
      name: "Longevity Supplement Stack",
      description: "Advanced supplement protocol for longevity and anti-aging.",
      substanceName: "CoQ10",
      categoryName: "supplement",
      defaultDose: 200,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["longevity", "anti-aging", "antioxidants", "mitochondria"],
    },
    {
      name: "Sleep & Recovery Stack",
      description: "Supplement protocol to improve sleep quality and recovery.",
      substanceName: "Magnesium Glycinate",
      categoryName: "supplement",
      defaultDose: 400,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["sleep", "recovery", "relaxation", "stress"],
    },
    // Additional Peptide Protocol Templates
    {
      name: "Tirzepatide Weight Loss Titration",
      description:
        "Standard titration schedule for Tirzepatide (Mounjaro/Zepbound). Dual GLP-1/GIP agonist for enhanced weight loss.",
      substanceName: "Tirzepatide",
      defaultDose: 2.5,
      doseUnit: "mg",
      frequency: "weekly",
      difficultyLevel: "intermediate",
      tags: ["weight-loss", "glp1", "gip", "titration", "metabolic"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 2.5,
            unit: "mg",
            frequency: "weekly",
            notes: "Starting dose - expect appetite reduction",
          },
          { week: 2, dose: 2.5, unit: "mg", frequency: "weekly" },
          { week: 3, dose: 2.5, unit: "mg", frequency: "weekly" },
          { week: 4, dose: 2.5, unit: "mg", frequency: "weekly" },
          {
            week: 5,
            dose: 5,
            unit: "mg",
            frequency: "weekly",
            notes: "First dose increase",
          },
          { week: 6, dose: 5, unit: "mg", frequency: "weekly" },
          { week: 7, dose: 5, unit: "mg", frequency: "weekly" },
          { week: 8, dose: 5, unit: "mg", frequency: "weekly" },
          {
            week: 9,
            dose: 7.5,
            unit: "mg",
            frequency: "weekly",
            notes: "Second dose increase",
          },
          { week: 10, dose: 7.5, unit: "mg", frequency: "weekly" },
          { week: 11, dose: 7.5, unit: "mg", frequency: "weekly" },
          { week: 12, dose: 7.5, unit: "mg", frequency: "weekly" },
          {
            week: 13,
            dose: 10,
            unit: "mg",
            frequency: "weekly",
            notes: "Third dose increase",
          },
          { week: 14, dose: 10, unit: "mg", frequency: "weekly" },
          { week: 15, dose: 10, unit: "mg", frequency: "weekly" },
          { week: 16, dose: 10, unit: "mg", frequency: "weekly" },
          {
            week: 17,
            dose: 12.5,
            unit: "mg",
            frequency: "weekly",
            notes: "Fourth dose increase if needed",
          },
          { week: 18, dose: 12.5, unit: "mg", frequency: "weekly" },
          { week: 19, dose: 12.5, unit: "mg", frequency: "weekly" },
          { week: 20, dose: 12.5, unit: "mg", frequency: "weekly" },
          {
            week: 21,
            dose: 15,
            unit: "mg",
            frequency: "weekly",
            notes: "Maximum dose if needed",
          },
        ],
      },
    },
    {
      name: "PT-141 Sexual Health Protocol",
      description:
        "As-needed protocol for PT-141 (Bremelanotide) for sexual dysfunction. Use 45-60 minutes before activity.",
      substanceName: "PT-141",
      defaultDose: 1.75,
      doseUnit: "mg",
      frequency: "as_needed",
      difficultyLevel: "beginner",
      tags: ["sexual-health", "libido", "as-needed"],
    },
    {
      name: "Sermorelin Anti-Aging Protocol",
      description:
        "Daily Sermorelin protocol for anti-aging, improved sleep, and body composition. Inject at bedtime on empty stomach.",
      substanceName: "Sermorelin",
      defaultDose: 200,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["anti-aging", "sleep", "gh-secretagogue", "recovery"],
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 100,
            unit: "mcg",
            frequency: "daily",
            notes: "Start low to assess tolerance",
          },
          { week: 2, dose: 100, unit: "mcg", frequency: "daily" },
          {
            week: 3,
            dose: 200,
            unit: "mcg",
            frequency: "daily",
            notes: "Increase to standard dose",
          },
          { week: 4, dose: 200, unit: "mcg", frequency: "daily" },
          { week: 5, dose: 200, unit: "mcg", frequency: "daily" },
          { week: 6, dose: 200, unit: "mcg", frequency: "daily" },
          {
            week: 7,
            dose: 300,
            unit: "mcg",
            frequency: "daily",
            notes: "Optional increase for enhanced effects",
          },
          { week: 8, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 9, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 10, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 11, dose: 300, unit: "mcg", frequency: "daily" },
          {
            week: 12,
            dose: 300,
            unit: "mcg",
            frequency: "daily",
            notes: "End of cycle - take 4 weeks off",
          },
        ],
      },
    },
    {
      name: "NAD+ Cellular Energy Protocol",
      description:
        "NAD+ supplementation for cellular energy, longevity, and cognitive function.",
      substanceName: "NAD+",
      defaultDose: 100,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["longevity", "energy", "cognitive", "anti-aging", "mitochondria"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 50,
            unit: "mg",
            frequency: "daily",
            notes: "Start low - may cause flushing",
          },
          { week: 2, dose: 50, unit: "mg", frequency: "daily" },
          {
            week: 3,
            dose: 100,
            unit: "mg",
            frequency: "daily",
            notes: "Standard dose",
          },
          { week: 4, dose: 100, unit: "mg", frequency: "daily" },
          { week: 5, dose: 100, unit: "mg", frequency: "daily" },
          { week: 6, dose: 100, unit: "mg", frequency: "daily" },
          {
            week: 7,
            dose: 150,
            unit: "mg",
            frequency: "daily",
            notes: "Optional increase",
          },
          { week: 8, dose: 150, unit: "mg", frequency: "daily" },
        ],
      },
    },
    {
      name: "GHK-Cu Skin Rejuvenation Protocol",
      description:
        "Copper peptide protocol for skin health, wound healing, and hair growth.",
      substanceName: "GHK-Cu",
      defaultDose: 1,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["skin", "healing", "hair", "collagen", "anti-aging"],
    },
    {
      name: "AOD-9604 Fat Loss Protocol",
      description:
        "AOD-9604 protocol targeting fat metabolism without affecting blood sugar or growth.",
      substanceName: "AOD-9604",
      defaultDose: 300,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["fat-loss", "metabolic", "body-composition"],
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 250,
            unit: "mcg",
            frequency: "daily",
            notes: "Inject on empty stomach, morning preferred",
          },
          { week: 2, dose: 250, unit: "mcg", frequency: "daily" },
          {
            week: 3,
            dose: 300,
            unit: "mcg",
            frequency: "daily",
            notes: "Standard dose",
          },
          { week: 4, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 5, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 6, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 7, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 8, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 9, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 10, dose: 300, unit: "mcg", frequency: "daily" },
          { week: 11, dose: 300, unit: "mcg", frequency: "daily" },
          {
            week: 12,
            dose: 300,
            unit: "mcg",
            frequency: "daily",
            notes: "End of cycle",
          },
        ],
      },
    },
    {
      name: "Ipamorelin Sleep & Recovery Protocol",
      description:
        "Ipamorelin solo protocol for improved sleep quality, recovery, and gentle GH release.",
      substanceName: "Ipamorelin",
      defaultDose: 200,
      doseUnit: "mcg",
      frequency: "2x_daily",
      difficultyLevel: "beginner",
      tags: ["sleep", "recovery", "gh-secretagogue", "beginner-friendly"],
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
    },
    {
      name: "Tesamorelin Visceral Fat Protocol",
      description:
        "FDA-approved GHRH analog for reducing visceral adipose tissue. Inject into abdomen daily.",
      substanceName: "Tesamorelin",
      defaultDose: 2,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "advanced",
      tags: ["visceral-fat", "body-composition", "gh-secretagogue", "fda-approved"],
    },
    {
      name: "BPC-157 + TB-500 Advanced Healing Protocol",
      description:
        "High-dose healing stack for serious injuries. Combines systemic and local healing mechanisms.",
      substanceName: "BPC-157",
      defaultDose: 500,
      doseUnit: "mcg",
      frequency: "2x_daily",
      difficultyLevel: "advanced",
      tags: ["healing", "injury-recovery", "advanced", "stack"],
      cycleOnWeeks: 8,
      cycleOffWeeks: 4,
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 250,
            unit: "mcg",
            frequency: "2x_daily",
            notes: "BPC-157 + TB-500 2.5mg 2x/week",
          },
          {
            week: 2,
            dose: 500,
            unit: "mcg",
            frequency: "2x_daily",
            notes: "Increase BPC-157 dose",
          },
          { week: 3, dose: 500, unit: "mcg", frequency: "2x_daily" },
          { week: 4, dose: 500, unit: "mcg", frequency: "2x_daily" },
          { week: 5, dose: 500, unit: "mcg", frequency: "2x_daily" },
          { week: 6, dose: 500, unit: "mcg", frequency: "2x_daily" },
          {
            week: 7,
            dose: 250,
            unit: "mcg",
            frequency: "2x_daily",
            notes: "Taper down",
          },
          {
            week: 8,
            dose: 250,
            unit: "mcg",
            frequency: "2x_daily",
            notes: "End of cycle",
          },
        ],
      },
    },
    // Additional Hormone Protocol Templates
    {
      name: "DHEA Optimization Protocol",
      description:
        "DHEA supplementation for adrenal support, energy, and hormone precursor optimization.",
      substanceName: "DHEA",
      categoryName: "hormone",
      defaultDose: 25,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["adrenal", "energy", "hormone-precursor", "anti-aging"],
      cycleOnWeeks: 8,
      cycleOffWeeks: 4,
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 10,
            unit: "mg",
            frequency: "daily",
            notes: "Start low, take in morning",
          },
          { week: 2, dose: 10, unit: "mg", frequency: "daily" },
          {
            week: 3,
            dose: 25,
            unit: "mg",
            frequency: "daily",
            notes: "Standard dose",
          },
          { week: 4, dose: 25, unit: "mg", frequency: "daily" },
          { week: 5, dose: 25, unit: "mg", frequency: "daily" },
          { week: 6, dose: 25, unit: "mg", frequency: "daily" },
          { week: 7, dose: 25, unit: "mg", frequency: "daily" },
          {
            week: 8,
            dose: 25,
            unit: "mg",
            frequency: "daily",
            notes: "Check DHEA-S levels",
          },
        ],
      },
    },
    {
      name: "Pregnenolone Brain Health Protocol",
      description:
        "Pregnenolone for cognitive function, memory, and neurosteroid support.",
      substanceName: "Pregnenolone",
      categoryName: "hormone",
      defaultDose: 50,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["cognitive", "memory", "brain-health", "neurosteroid"],
      cycleOnWeeks: 8,
      cycleOffWeeks: 4,
    },
    {
      name: "Micro-dose TRT Protocol",
      description:
        "More frequent, smaller injections for stable testosterone levels and fewer side effects.",
      substanceName: "Testosterone Cypionate",
      categoryName: "hormone",
      defaultDose: 20,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "advanced",
      tags: ["trt", "testosterone", "micro-dose", "stable-levels"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 14,
            unit: "mg",
            frequency: "daily",
            notes: "Start with ~100mg/week equivalent",
          },
          { week: 2, dose: 14, unit: "mg", frequency: "daily" },
          { week: 3, dose: 14, unit: "mg", frequency: "daily" },
          { week: 4, dose: 14, unit: "mg", frequency: "daily" },
          {
            week: 5,
            dose: 14,
            unit: "mg",
            frequency: "daily",
            notes: "Check labs - trough levels",
          },
          { week: 6, dose: 14, unit: "mg", frequency: "daily" },
          {
            week: 7,
            dose: 20,
            unit: "mg",
            frequency: "daily",
            notes: "Adjust based on labs if needed",
          },
          { week: 8, dose: 20, unit: "mg", frequency: "daily" },
        ],
      },
    },
    {
      name: "HCG Monotherapy Protocol",
      description:
        "HCG-only protocol for men wanting to maintain fertility while optimizing testosterone.",
      substanceName: "HCG",
      categoryName: "hormone",
      defaultDose: 1500,
      doseUnit: "iu",
      frequency: "3x_weekly",
      difficultyLevel: "intermediate",
      tags: ["hcg", "fertility", "testosterone", "natural-production"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 1000,
            unit: "iu",
            frequency: "3x_weekly",
            notes: "Starting dose",
          },
          { week: 2, dose: 1000, unit: "iu", frequency: "3x_weekly" },
          {
            week: 3,
            dose: 1500,
            unit: "iu",
            frequency: "3x_weekly",
            notes: "Increase to standard dose",
          },
          { week: 4, dose: 1500, unit: "iu", frequency: "3x_weekly" },
          {
            week: 5,
            dose: 1500,
            unit: "iu",
            frequency: "3x_weekly",
            notes: "Check total T and estradiol",
          },
          { week: 6, dose: 1500, unit: "iu", frequency: "3x_weekly" },
          { week: 7, dose: 1500, unit: "iu", frequency: "3x_weekly" },
          {
            week: 8,
            dose: 1500,
            unit: "iu",
            frequency: "3x_weekly",
            notes: "Adjust based on response",
          },
        ],
      },
    },
    // Additional Supplement Protocol Templates
    {
      name: "Immune Support Stack",
      description:
        "Comprehensive immune support with Vitamin D3, Zinc, and Vitamin C for optimal immune function.",
      substanceName: "Vitamin D3",
      categoryName: "supplement",
      defaultDose: 5000,
      doseUnit: "iu",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["immune", "vitamins", "minerals", "health", "prevention"],
    },
    {
      name: "Cardiovascular Health Stack",
      description:
        "Heart health protocol with Omega-3s, CoQ10, and K2 for cardiovascular optimization.",
      substanceName: "Omega-3 Fish Oil",
      categoryName: "supplement",
      defaultDose: 3000,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["heart-health", "cardiovascular", "omega-3", "coq10"],
    },
    {
      name: "Detox & Antioxidant Protocol",
      description:
        "Glutathione-based protocol for detoxification and antioxidant support.",
      substanceName: "Glutathione",
      categoryName: "supplement",
      defaultDose: 500,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "intermediate",
      tags: ["detox", "antioxidant", "liver-support", "cellular-health"],
    },
    {
      name: "Bone Health Protocol",
      description:
        "Vitamin D3 + K2 combination for optimal calcium metabolism and bone density.",
      substanceName: "Vitamin K2",
      categoryName: "supplement",
      defaultDose: 200,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["bone-health", "calcium", "vitamin-d", "vitamin-k2"],
    },
    {
      name: "Energy & Methylation Support",
      description:
        "B12 and methylation support for energy production and neurological health.",
      substanceName: "Vitamin B12",
      categoryName: "supplement",
      defaultDose: 2000,
      doseUnit: "mcg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["energy", "methylation", "neurological", "b-vitamins"],
    },
    {
      name: "Stress & Adrenal Support Stack",
      description:
        "Magnesium-based protocol for stress management and adrenal health.",
      substanceName: "Magnesium Glycinate",
      categoryName: "supplement",
      defaultDose: 600,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["stress", "adrenal", "relaxation", "anxiety", "magnesium"],
      titrationPlan: {
        weeks: [
          {
            week: 1,
            dose: 200,
            unit: "mg",
            frequency: "daily",
            notes: "Start low - take in evening",
          },
          {
            week: 2,
            dose: 400,
            unit: "mg",
            frequency: "daily",
            notes: "Split AM/PM if desired",
          },
          { week: 3, dose: 400, unit: "mg", frequency: "daily" },
          {
            week: 4,
            dose: 600,
            unit: "mg",
            frequency: "daily",
            notes: "Full dose - 200mg AM, 400mg PM",
          },
        ],
      },
    },
    {
      name: "Zinc & Immune Cycling Protocol",
      description:
        "Cycled zinc supplementation to avoid copper depletion while supporting immune function.",
      substanceName: "Zinc",
      categoryName: "supplement",
      defaultDose: 30,
      doseUnit: "mg",
      frequency: "daily",
      difficultyLevel: "beginner",
      tags: ["zinc", "immune", "testosterone", "cycling"],
      cycleOnWeeks: 8,
      cycleOffWeeks: 4,
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
    const categoryId = categoryName
      ? categoryMap[categoryName]
      : peptideCategory.id;

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

  // Seed global products (branded versions of substances)
  const products = [
    // Semaglutide products (GLP-1)
    {
      substanceName: "Semaglutide",
      name: "Ozempic 0.25mg",
      defaultDose: 0.25,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Ozempic 0.5mg",
      defaultDose: 0.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Ozempic 1mg",
      defaultDose: 1,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Ozempic 2mg",
      defaultDose: 2,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Wegovy 0.25mg",
      defaultDose: 0.25,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Wegovy 0.5mg",
      defaultDose: 0.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Wegovy 1mg",
      defaultDose: 1,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Wegovy 1.7mg",
      defaultDose: 1.7,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Wegovy 2.4mg",
      defaultDose: 2.4,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Rybelsus 3mg (Oral)",
      defaultDose: 3,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Rybelsus 7mg (Oral)",
      defaultDose: 7,
      doseUnit: "mg",
    },
    {
      substanceName: "Semaglutide",
      name: "Rybelsus 14mg (Oral)",
      defaultDose: 14,
      doseUnit: "mg",
    },
    // Tirzepatide products (GLP-1/GIP)
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 2.5mg",
      defaultDose: 2.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 5mg",
      defaultDose: 5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 7.5mg",
      defaultDose: 7.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 10mg",
      defaultDose: 10,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 12.5mg",
      defaultDose: 12.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Mounjaro 15mg",
      defaultDose: 15,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 2.5mg",
      defaultDose: 2.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 5mg",
      defaultDose: 5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 7.5mg",
      defaultDose: 7.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 10mg",
      defaultDose: 10,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 12.5mg",
      defaultDose: 12.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Tirzepatide",
      name: "Zepbound 15mg",
      defaultDose: 15,
      doseUnit: "mg",
    },
    // Testosterone products
    {
      substanceName: "Testosterone Cypionate",
      name: "Depo-Testosterone 100mg/ml",
      defaultDose: 100,
      doseUnit: "mg",
    },
    {
      substanceName: "Testosterone Cypionate",
      name: "Depo-Testosterone 200mg/ml",
      defaultDose: 200,
      doseUnit: "mg",
    },
    {
      substanceName: "Testosterone Enanthate",
      name: "Delatestryl 200mg/ml",
      defaultDose: 200,
      doseUnit: "mg",
    },
    // Estradiol products
    {
      substanceName: "Estradiol",
      name: "Estrace 0.5mg",
      defaultDose: 0.5,
      doseUnit: "mg",
    },
    {
      substanceName: "Estradiol",
      name: "Estrace 1mg",
      defaultDose: 1,
      doseUnit: "mg",
    },
    {
      substanceName: "Estradiol",
      name: "Estrace 2mg",
      defaultDose: 2,
      doseUnit: "mg",
    },
    // Progesterone products
    {
      substanceName: "Progesterone",
      name: "Prometrium 100mg",
      defaultDose: 100,
      doseUnit: "mg",
    },
    {
      substanceName: "Progesterone",
      name: "Prometrium 200mg",
      defaultDose: 200,
      doseUnit: "mg",
    },
    // Thyroid products
    {
      substanceName: "Liothyronine",
      name: "Cytomel 5mcg",
      defaultDose: 5,
      doseUnit: "mcg",
    },
    {
      substanceName: "Liothyronine",
      name: "Cytomel 25mcg",
      defaultDose: 25,
      doseUnit: "mcg",
    },
    {
      substanceName: "Liothyronine",
      name: "Cytomel 50mcg",
      defaultDose: 50,
      doseUnit: "mcg",
    },
    // HCG products
    {
      substanceName: "HCG",
      name: "Pregnyl 10,000 IU",
      defaultDose: 10000,
      doseUnit: "iu",
    },
    {
      substanceName: "HCG",
      name: "Novarel 10,000 IU",
      defaultDose: 10000,
      doseUnit: "iu",
    },
    // PT-141 products
    {
      substanceName: "PT-141",
      name: "Vyleesi 1.75mg",
      defaultDose: 1.75,
      doseUnit: "mg",
    },
    // Tesamorelin products
    {
      substanceName: "Tesamorelin",
      name: "Egrifta 1mg",
      defaultDose: 1,
      doseUnit: "mg",
    },
    {
      substanceName: "Tesamorelin",
      name: "Egrifta 2mg",
      defaultDose: 2,
      doseUnit: "mg",
    },
    // BPC-157 compounded products
    {
      substanceName: "BPC-157",
      name: "BPC-157 5mg Vial",
      defaultDose: 250,
      doseUnit: "mcg",
    },
    {
      substanceName: "BPC-157",
      name: "BPC-157 10mg Vial",
      defaultDose: 250,
      doseUnit: "mcg",
    },
    // TB-500 compounded products
    {
      substanceName: "TB-500",
      name: "TB-500 5mg Vial",
      defaultDose: 2.5,
      doseUnit: "mg",
    },
    {
      substanceName: "TB-500",
      name: "TB-500 10mg Vial",
      defaultDose: 2.5,
      doseUnit: "mg",
    },
    // CJC-1295 compounded products
    {
      substanceName: "CJC-1295",
      name: "CJC-1295 with DAC 2mg Vial",
      defaultDose: 1000,
      doseUnit: "mcg",
    },
    {
      substanceName: "CJC-1295",
      name: "CJC-1295 no DAC (Mod GRF 1-29) 2mg Vial",
      defaultDose: 100,
      doseUnit: "mcg",
    },
    // Ipamorelin compounded products
    {
      substanceName: "Ipamorelin",
      name: "Ipamorelin 5mg Vial",
      defaultDose: 200,
      doseUnit: "mcg",
    },
    // Sermorelin products
    {
      substanceName: "Sermorelin",
      name: "Sermorelin 3mg Vial",
      defaultDose: 200,
      doseUnit: "mcg",
    },
    {
      substanceName: "Sermorelin",
      name: "Sermorelin 6mg Vial",
      defaultDose: 200,
      doseUnit: "mcg",
    },
    // NAD+ products
    {
      substanceName: "NAD+",
      name: "NAD+ 100mg/ml Injectable",
      defaultDose: 100,
      doseUnit: "mg",
    },
    {
      substanceName: "NAD+",
      name: "NAD+ 500mg IV Infusion",
      defaultDose: 500,
      doseUnit: "mg",
    },
    // GHK-Cu products
    {
      substanceName: "GHK-Cu",
      name: "GHK-Cu 50mg Vial",
      defaultDose: 1,
      doseUnit: "mg",
    },
    // AOD-9604 products
    {
      substanceName: "AOD-9604",
      name: "AOD-9604 5mg Vial",
      defaultDose: 300,
      doseUnit: "mcg",
    },
  ];

  let productCount = 0;
  for (const product of products) {
    const substanceId = substanceIds[product.substanceName];
    if (!substanceId) {
      console.warn(`Substance not found for product: ${product.name}`);
      continue;
    }

    // Check if product exists by name and substanceId
    const existing = await prisma.product.findFirst({
      where: {
        name: product.name,
        substanceId,
      },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          defaultDose: product.defaultDose,
          doseUnit: product.doseUnit,
          isGlobal: true,
          isActive: true,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          substanceId,
          name: product.name,
          defaultDose: product.defaultDose,
          doseUnit: product.doseUnit,
          isGlobal: true,
          isActive: true,
        },
      });
    }
    productCount++;
  }

  console.log(`Seeded ${productCount} global products`);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
