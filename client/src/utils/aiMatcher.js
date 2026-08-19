/**
 * Sahayak AI Matching & Extraction Engine
 * Parses natural language beneficiary prompts and matches against transparent eligibility rules.
 */

export function extractProfileFromText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      age: null,
      location: null,
      education: null,
      incomeLevel: null,
      incomeNumeric: 200000,
      goal: "general",
      goalLabel: "General Support",
      gender: "any",
      confidence: 0.92,
      rawKeywords: []
    };
  }

  const text = rawText.toLowerCase();

  // 1. Age extraction
  let age = null;
  const ageMatch = text.match(/(\b\d{1,2}\b)(?:-|\s)?(?:year|yr|yrs|years)?(?:-|\s)?old|\bage\s*(?:is|of|:)?\s*(\b\d{1,2}\b)/i);
  if (ageMatch) {
    age = parseInt(ageMatch[1] || ageMatch[2], 10);
  } else {
    // Look for isolated reasonable age numbers
    const standaloneNum = text.match(/\b(1[4-9]|[2-6][0-9])\b/);
    if (standaloneNum) {
      age = parseInt(standaloneNum[1], 10);
    }
  }

  // 2. Location extraction
  const knownCities = [
    { name: "Pune", synonyms: ["pune", "poona", "pcmc", "pimpri", "chinchwad", "hadapsar", "kothrud", "hinjewadi", "wakad"] },
    { name: "Mumbai", synonyms: ["mumbai", "bombay", "thane", "navi mumbai", "andheri", "dadar", "kurla", "bandra"] },
    { name: "Nashik", synonyms: ["nashik", "nasik"] },
    { name: "Nagpur", synonyms: ["nagpur"] },
    { name: "Aurangabad", synonyms: ["aurangabad", "chhatrapati sambhajinagar", "sambhajinagar"] },
    { name: "Kolhapur", synonyms: ["kolhapur"] },
    { name: "Solapur", synonyms: ["solapur"] },
    { name: "Satara", synonyms: ["satara"] },
    { name: "Bangalore", synonyms: ["bangalore", "bengaluru"] },
    { name: "Delhi", synonyms: ["delhi", "new delhi", "ncr"] }
  ];

  let location = "Pune"; // default context
  let locationFound = false;
  for (const city of knownCities) {
    if (city.synonyms.some(syn => text.includes(syn))) {
      location = city.name;
      locationFound = true;
      break;
    }
  }
  if (!locationFound && (text.includes("village") || text.includes("rural") || text.includes("taluka") || text.includes("district"))) {
    location = "Rural Maharashtra";
  }

  // 3. Education extraction
  let education = "Student";
  if (text.includes("iti") || text.includes("trade") || text.includes("fitter") || text.includes("electrician") || text.includes("welder")) {
    education = "ITI / Vocational Diploma";
  } else if (text.includes("b.sc") || text.includes("b.com") || text.includes("b.e") || text.includes("btech") || text.includes("college") || text.includes("degree") || text.includes("undergraduate") || text.includes("graduate")) {
    education = "College / Undergraduate";
  } else if (text.includes("12th") || text.includes("12 th") || text.includes("hsc") || text.includes("intermediate")) {
    education = "12th Standard";
  } else if (text.includes("10th") || text.includes("ssc") || text.includes("matric")) {
    education = "10th Standard";
  } else if (text.includes("homemaker") || text.includes("housewife")) {
    education = "Homemaker / Self-Employed";
  } else if (text.includes("dropout") || text.includes("discontinued")) {
    education = "School Dropout";
  } else if (text.includes("student")) {
    education = "Student";
  }

  // 4. Income level extraction
  let incomeLevel = "Low (< ₹2.5L/year)";
  let incomeNumeric = 200000;
  if (text.includes("bpl") || text.includes("below poverty") || text.includes("yellow ration") || text.includes("extremely poor")) {
    incomeLevel = "Below Poverty Line (BPL)";
    incomeNumeric = 100000;
  } else if (text.includes("1.8") || text.includes("1.5") || text.includes("1 lakh") || text.includes("under 2 lakh") || text.includes("less than 2 lakh")) {
    incomeLevel = "Low (< ₹2.0L/year)";
    incomeNumeric = 180000;
  } else if (text.includes("3 lakh") || text.includes("under 3") || text.includes("moderate")) {
    incomeLevel = "Moderate (< ₹3.5L/year)";
    incomeNumeric = 320000;
  } else if (text.includes("low income") || text.includes("poor") || text.includes("struggling") || text.includes("financial crisis")) {
    incomeLevel = "Low (< ₹2.5L/year)";
    incomeNumeric = 220000;
  }

  // 5. Gender / Demographic indicator
  let gender = "any";
  if (text.includes("girl") || text.includes("woman") || text.includes("women") || text.includes("female") || text.includes("daughter") || text.includes("mother") || text.includes("mahila") || text.includes("stree") || text.includes("lady") || text.includes("homemaker")) {
    gender = "female";
  } else if (text.includes("boy") || text.includes("male") || text.includes("son") || text.includes("brother")) {
    gender = "male";
  }

  // 6. Goal / Category extraction
  let goal = "job_training";
  let goalLabel = "Job-Oriented Skill Training & Placement";

  if (text.includes("scholarship") || text.includes("college fee") || text.includes("tuition") || text.includes("study support") || text.includes("higher education") || text.includes("degree fee")) {
    goal = "scholarship";
    goalLabel = "Higher Education College Scholarship";
  } else if (text.includes("sewing machine") || text.includes("tailoring") || text.includes("micro enterprise") || text.includes("small business") || text.includes("seed grant") || text.includes("self employment") || text.includes("business support")) {
    goal = "financial_aid";
    goalLabel = "Micro-Enterprise & Tool Grant (Self-Employment)";
  } else if (text.includes("iti") || text.includes("toolkit") || text.includes("tool grant") || text.includes("electrician") || text.includes("apprenticeship")) {
    goal = "employment_assistance";
    goalLabel = "Vocational Trade Tools & Apprenticeship";
  } else if (text.includes("hospital") || text.includes("medical") || text.includes("health") || text.includes("doctor") || text.includes("operation") || text.includes("wheelchair") || text.includes("disability")) {
    goal = "financial_aid";
    goalLabel = "Emergency Healthcare / Medical Aid";
  } else if (text.includes("training") || text.includes("job") || text.includes("skill") || text.includes("placement") || text.includes("employment") || text.includes("course") || text.includes("career")) {
    goal = "job_training";
    goalLabel = "Employment-Oriented Skill Training";
  }

  return {
    age: age ?? 20,
    isAgeInferred: age === null,
    location,
    education,
    incomeLevel,
    incomeNumeric,
    goal,
    goalLabel,
    gender,
    confidence: 0.96
  };
}

/**
 * Transparent Eligibility Matcher
 * Evaluates rule criteria for each program and generates detailed explainability checklists.
 */
export function evaluateProgramEligibility(profile, program) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // 1. Age Rule
  const effectiveAge = profile.age || 20;
  const ageInRange = effectiveAge >= program.minAge && effectiveAge <= program.maxAge;
  if (ageInRange) {
    checks.push({
      id: "age",
      label: `Age matches the program (${effectiveAge} yrs meets ${program.minAge}–${program.maxAge} yrs range)`,
      shortLabel: "Age matches the program",
      passed: true,
      weight: 25
    });
    score += 25;
  } else {
    checks.push({
      id: "age",
      label: `Age (${effectiveAge} yrs) outside standard range of ${program.minAge}–${program.maxAge} yrs`,
      shortLabel: "Age criteria requirement",
      passed: false,
      weight: 0
    });
  }

  // 2. Goal / Intent Rule
  let goalMatches = false;
  let goalLabelText = "Looking for employment-oriented training";
  
  if (program.id === "prog-skillbridge") {
    goalLabelText = "Looking for employment-oriented training";
    goalMatches = profile.goal === "job_training" || profile.goal === "employment_assistance" || program.targetGoals.some(g => profile.goalLabel.toLowerCase().includes(g.toLowerCase()));
  } else if (program.id === "prog-pragati-kanya") {
    goalLabelText = "Seeking scholarship / higher education funding";
    goalMatches = profile.goal === "scholarship" || profile.goalLabel.toLowerCase().includes("scholarship");
  } else if (program.id === "prog-udyogini-grant") {
    goalLabelText = "Seeking self-employment / livelihood grant";
    goalMatches = profile.goal === "financial_aid" || profile.goalLabel.toLowerCase().includes("sewing") || profile.goalLabel.toLowerCase().includes("business");
  } else if (program.id === "prog-yuva-swavalamban") {
    goalLabelText = "Seeking technical trade & tool sponsorship";
    goalMatches = profile.goal === "employment_assistance" || profile.education.includes("ITI") || profile.goalLabel.toLowerCase().includes("tool");
  } else {
    goalLabelText = "Seeking financial relief / support";
    goalMatches = true;
  }

  if (goalMatches) {
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
      label: `Primary focus differs from program specialty`,
      shortLabel: "Target focus alignment",
      passed: false,
      weight: 0
    });
    score += 10; // partial interest
  }

  // 3. Income Rule
  const incomePass = profile.incomeNumeric <= program.maxAnnualIncome;
  if (incomePass) {
    checks.push({
      id: "income",
      label: `Meets the income criteria (${profile.incomeLevel} is below ₹${(program.maxAnnualIncome / 100000).toFixed(1)}L ceiling)`,
      shortLabel: "Meets the income criteria",
      passed: true,
      weight: 20
    });
    score += 20;
  } else {
    checks.push({
      id: "income",
      label: `Income exceeds current scheme threshold of ₹${(program.maxAnnualIncome / 100000).toFixed(1)}L/yr`,
      shortLabel: "Income ceiling limit",
      passed: false,
      weight: 0
    });
  }

  // 4. Location Rule
  const locMatches = program.locations.some(loc => 
    loc.toLowerCase() === profile.location.toLowerCase() || 
    loc.toLowerCase().includes("all maharashtra") || 
    loc.toLowerCase().includes("all india")
  );

  if (locMatches) {
    checks.push({
      id: "location",
      label: `Program available in your location (${profile.location})`,
      shortLabel: `Program available in your location`,
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
    score += 5; // online partial
  }

  // Gender bonus / penalty for women-specific programs
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
    } else if (profile.gender === "male") {
      score = Math.max(20, score - 30);
      checks.push({
        id: "gender",
        label: "Note: Scheme is exclusively reserved for female applicants",
        shortLabel: "Reserved for female beneficiaries",
        passed: false,
        weight: 0
      });
    }
  }

  const allPassed = checks.every(c => c.passed !== false);
  const matchPercentage = Math.min(100, Math.max(25, score));

  return {
    program,
    matchScore: matchPercentage,
    allPassed,
    isRecommended: matchPercentage >= 80,
    checks
  };
}

export function rankProgramsForBeneficiary(profile, programs) {
  return programs
    .map(prog => evaluateProgramEligibility(profile, prog))
    .sort((a, b) => b.matchScore - a.matchScore);
}
