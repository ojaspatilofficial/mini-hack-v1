import { GoogleGenerativeAI } from '@google/generative-ai';
import { IProgram } from '../models/Program';

export interface ExtractedProfile {
  age: number;
  location: string;
  education: string;
  incomeLevel: string;
  incomeNumeric: number;
  goal: string;
  goalLabel: string;
  gender: string;
  confidence: number;
}

export interface EligibilityCheck {
  id: string;
  label: string;
  shortLabel: string;
  passed: boolean;
  weight: number;
}

export interface MatchResult {
  program: any;
  matchScore: number;
  allPassed: boolean;
  isRecommended: boolean;
  checks: EligibilityCheck[];
}

export class AiService {
  private geminiClient: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.geminiClient = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Extracts structured beneficiary profile from natural language description
   */
  async extractProfile(rawText: string): Promise<ExtractedProfile> {
    if (this.geminiClient && process.env.GEMINI_API_KEY) {
      try {
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are an expert NGO eligibility assistant for the "Sahayak" platform.
Extract structured beneficiary details from the following beneficiary statement:
"${rawText}"

Return JSON matching this exact structure:
{
  "age": <number, e.g. 20>,
  "location": "<city/district, e.g. Pune, Mumbai, etc.>",
  "education": "<Student | 10th Standard | 12th Standard | ITI / Vocational Diploma | Homemaker / Self-Employed | College / Undergraduate>",
  "incomeLevel": "<e.g. Low (< ₹2.5L/year) | Below Poverty Line (BPL) | Moderate>",
  "incomeNumeric": <annual family income in INR number, e.g. 200000>,
  "goal": "<job_training | scholarship | financial_aid | employment_assistance>",
  "goalLabel": "<human readable description of what they are seeking>",
  "gender": "<female | male | any>"
}
Only output the raw JSON object, without markdown quotes.
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/```json|```/g, '');
        const parsed = JSON.parse(text);
        return {
          age: parsed.age || 20,
          location: parsed.location || 'Pune',
          education: parsed.education || 'Student',
          incomeLevel: parsed.incomeLevel || 'Low (< ₹2.5L/year)',
          incomeNumeric: parsed.incomeNumeric || 200000,
          goal: parsed.goal || 'job_training',
          goalLabel: parsed.goalLabel || 'Employment-Oriented Skill Training',
          gender: parsed.gender || 'any',
          confidence: 0.98
        };
      } catch (err) {
        console.warn('Gemini extraction failed, falling back to heuristic engine:', err);
      }
    }

    // Heuristic NLP fallback
    return this.heuristicExtract(rawText);
  }

  /**
   * Rule-based heuristic extraction
   */
  private heuristicExtract(rawText: string): ExtractedProfile {
    const text = (rawText || '').toLowerCase();

    // 1. Age
    let age = 20;
    const ageMatch = text.match(/(\b\d{1,2}\b)(?:-|\s)?(?:year|yr|yrs|years)?(?:-|\s)?old|\bage\s*(?:is|of|:)?\s*(\b\d{1,2}\b)/i);
    if (ageMatch) {
      age = parseInt(ageMatch[1] || ageMatch[2], 10);
    } else {
      const standaloneNum = text.match(/\b(1[4-9]|[2-6][0-9])\b/);
      if (standaloneNum) {
        age = parseInt(standaloneNum[1], 10);
      }
    }

    // 2. Location
    const knownCities = [
      { name: "Pune", synonyms: ["pune", "poona", "pcmc", "pimpri", "chinchwad", "hadapsar", "kothrud", "hinjewadi", "wakad"] },
      { name: "Mumbai", synonyms: ["mumbai", "bombay", "thane", "navi mumbai", "andheri", "dadar", "kurla", "bandra"] },
      { name: "Nashik", synonyms: ["nashik", "nasik"] },
      { name: "Nagpur", synonyms: ["nagpur"] },
      { name: "Aurangabad", synonyms: ["aurangabad", "sambhajinagar"] },
      { name: "Kolhapur", synonyms: ["kolhapur"] },
      { name: "Solapur", synonyms: ["solapur"] },
      { name: "Satara", synonyms: ["satara"] }
    ];

    let location = "Pune";
    for (const city of knownCities) {
      if (city.synonyms.some(syn => text.includes(syn))) {
        location = city.name;
        break;
      }
    }

    // 3. Education
    let education = "Student";
    if (text.includes("iti") || text.includes("trade") || text.includes("electrician") || text.includes("fitter")) {
      education = "ITI / Vocational Diploma";
    } else if (text.includes("college") || text.includes("degree") || text.includes("b.sc") || text.includes("b.com") || text.includes("b.e") || text.includes("btech") || text.includes("undergraduate")) {
      education = "College / Undergraduate";
    } else if (text.includes("12th") || text.includes("hsc")) {
      education = "12th Standard";
    } else if (text.includes("10th") || text.includes("ssc")) {
      education = "10th Standard";
    } else if (text.includes("homemaker") || text.includes("housewife")) {
      education = "Homemaker / Self-Employed";
    }

    // 4. Income
    let incomeLevel = "Low (< ₹2.5L/year)";
    let incomeNumeric = 200000;
    if (text.includes("bpl") || text.includes("yellow ration") || text.includes("extremely poor")) {
      incomeLevel = "Below Poverty Line (BPL)";
      incomeNumeric = 100000;
    } else if (text.includes("1.8") || text.includes("1.5") || text.includes("under 2 lakh")) {
      incomeLevel = "Low (< ₹2.0L/year)";
      incomeNumeric = 180000;
    } else if (text.includes("low income") || text.includes("poor") || text.includes("struggling")) {
      incomeLevel = "Low (< ₹2.5L/year)";
      incomeNumeric = 220000;
    }

    // 5. Gender
    let gender = "any";
    if (text.includes("girl") || text.includes("woman") || text.includes("women") || text.includes("female") || text.includes("homemaker")) {
      gender = "female";
    } else if (text.includes("boy") || text.includes("male") || text.includes("son")) {
      gender = "male";
    }

    // 6. Goal
    let goal = "job_training";
    let goalLabel = "Employment-Oriented Skill Training";

    if (text.includes("scholarship") || text.includes("tuition") || text.includes("college fee") || text.includes("higher education")) {
      goal = "scholarship";
      goalLabel = "Higher Education College Scholarship";
    } else if (text.includes("sewing") || text.includes("micro enterprise") || text.includes("small business") || text.includes("seed grant") || text.includes("tailoring")) {
      goal = "financial_aid";
      goalLabel = "Micro-Enterprise & Tool Grant (Self-Employment)";
    } else if (text.includes("iti") || text.includes("tool kit") || text.includes("apprenticeship")) {
      goal = "employment_assistance";
      goalLabel = "Vocational Trade Tools & Apprenticeship";
    } else if (text.includes("medical") || text.includes("hospital") || text.includes("health")) {
      goal = "financial_aid";
      goalLabel = "Emergency Healthcare / Medical Aid";
    }

    return {
      age,
      location,
      education,
      incomeLevel,
      incomeNumeric,
      goal,
      goalLabel,
      gender,
      confidence: 0.95
    };
  }

  /**
   * Transparent Rule Matching against all NGO programs
   */
  evaluateEligibility(profile: ExtractedProfile, program: any): MatchResult {
    const checks: EligibilityCheck[] = [];
    let score = 0;

    // 1. Age check
    const effectiveAge = profile.age || 20;
    const minAge = program.minAge ?? 16;
    const maxAge = program.maxAge ?? 60;
    const agePass = effectiveAge >= minAge && effectiveAge <= maxAge;

    if (agePass) {
      checks.push({
        id: "age",
        label: `Age matches the program (${effectiveAge} yrs meets ${minAge}–${maxAge} yrs range)`,
        shortLabel: "Age matches the program",
        passed: true,
        weight: 25
      });
      score += 25;
    } else {
      checks.push({
        id: "age",
        label: `Age (${effectiveAge} yrs) outside standard range of ${minAge}–${maxAge} yrs`,
        shortLabel: "Age criteria requirement",
        passed: false,
        weight: 0
      });
    }

    // 2. Goal / Intent check
    let goalPass = false;
    let goalLabelText = "Looking for employment-oriented training";

    if (program.id === "prog-skillbridge") {
      goalLabelText = "Looking for employment-oriented training";
      goalPass = profile.goal === "job_training" || profile.goal === "employment_assistance";
    } else if (program.id === "prog-pragati-kanya") {
      goalLabelText = "Seeking scholarship / higher education funding";
      goalPass = profile.goal === "scholarship";
    } else if (program.id === "prog-udyogini-grant") {
      goalLabelText = "Seeking self-employment / livelihood grant";
      goalPass = profile.goal === "financial_aid" || profile.goalLabel.toLowerCase().includes("sewing");
    } else if (program.id === "prog-yuva-swavalamban") {
      goalLabelText = "Seeking technical trade & tool sponsorship";
      goalPass = profile.goal === "employment_assistance" || profile.education.includes("ITI");
    } else {
      goalLabelText = "Seeking financial relief / support";
      goalPass = true;
    }

    if (goalPass) {
      checks.push({
        id: "goal",
        label: goalLabelText,
        shortLabel: goalLabelText,
        passed: true,
        weight: 35
      });
      score += 35;
    } else {
      checks.push({
        id: "goal",
        label: "Primary focus differs from program specialty",
        shortLabel: "Target focus alignment",
        passed: false,
        weight: 0
      });
      score += 10;
    }

    // 3. Income check
    const maxIncome = program.maxAnnualIncome ?? 300000;
    const incomePass = profile.incomeNumeric <= maxIncome;
    if (incomePass) {
      checks.push({
        id: "income",
        label: `Meets the income criteria (${profile.incomeLevel} is below ₹${(maxIncome / 100000).toFixed(1)}L ceiling)`,
        shortLabel: "Meets the income criteria",
        passed: true,
        weight: 20
      });
      score += 20;
    } else {
      checks.push({
        id: "income",
        label: `Income exceeds current scheme threshold of ₹${(maxIncome / 100000).toFixed(1)}L/yr`,
        shortLabel: "Income ceiling limit",
        passed: false,
        weight: 0
      });
    }

    // 4. Location check
    const locations: string[] = program.locations || [];
    const locPass = locations.some(loc =>
      loc.toLowerCase() === profile.location.toLowerCase() ||
      loc.toLowerCase().includes("all maharashtra") ||
      loc.toLowerCase().includes("all india")
    );

    if (locPass) {
      checks.push({
        id: "location",
        label: `Program available in your location (${profile.location})`,
        shortLabel: "Program available in your location",
        passed: true,
        weight: 20
      });
      score += 20;
    } else {
      checks.push({
        id: "location",
        label: `Program center currently not in ${profile.location}`,
        shortLabel: "Location center availability",
        passed: false,
        weight: 0
      });
      score += 5;
    }

    // Women-first bonus/check
    if (program.id === "prog-pragati-kanya" || program.id === "prog-udyogini-grant") {
      if (profile.gender === "female") {
        score = Math.min(100, score + 5);
        checks.push({
          id: "gender",
          label: "Eligible for Women-First priority quota",
          shortLabel: "Women-first priority quota",
          passed: true,
          weight: 5
        });
      }
    }

    const allPassed = checks.every(c => c.passed !== false);
    const finalScore = Math.min(100, Math.max(25, score));

    return {
      program,
      matchScore: finalScore,
      allPassed,
      isRecommended: finalScore >= 80,
      checks
    };
  }

  rankPrograms(profile: ExtractedProfile, programs: any[]): MatchResult[] {
    return programs
      .map(p => this.evaluateEligibility(profile, p))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const aiService = new AiService();
