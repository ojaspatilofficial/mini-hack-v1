export const DEFAULT_PROGRAMS = [
  {
    id: "prog-skillbridge",
    name: "SkillBridge: IT & Technical Vocations",
    ngoName: "Yuva Vikas Foundation",
    category: "job_training",
    badge: "Most Popular for Youth",
    tagline: "Free 4-month industry-certified bootcamp with guaranteed placement drives",
    description: "SkillBridge provides intensive training in digital skills, web development, hardware support, and soft skills tailored for underprivileged youth entering the job market.",
    minAge: 18,
    maxAge: 28,
    maxAnnualIncome: 300000,
    locations: ["Pune", "Mumbai", "Nashik", "Nagpur", "Pimpri-Chinchwad", "All Maharashtra"],
    allowedEducation: ["10th pass", "12th pass", "student", "undergraduate", "graduate", "diploma", "dropout"],
    targetGoals: ["job-oriented training", "employment assistance", "digital skills", "vocational training", "placement"],
    benefits: [
      "100% tuition-free training + course materials",
      "₹2,500/month travel & sustenance stipend",
      "Guaranteed interviews with 40+ hiring corporate partners",
      "Laptop/Computer lab access with dedicated mentorship"
    ],
    documentsRequired: ["Aadhaar Card", "Income Certificate / Ration Card", "Latest Marksheet", "Bank Passbook"],
    duration: "4 Months (Full-Time / Hybrid)",
    fundingAmount: "₹35,000 / beneficiary (Full Sponsorship)",
    seatsRemaining: 48,
    deadline: "2026-09-15"
  },
  {
    id: "prog-pragati-kanya",
    name: "Pragati Kanya Higher Education Scholarship",
    ngoName: "Savitribai Social Trust",
    category: "scholarship",
    badge: "Women in STEM & Higher Ed",
    tagline: "Merit-cum-means financial aid for female students pursuing college degrees",
    description: "Supports girl students from low-income families to continue undergraduate degrees in Engineering, Science, Arts, and Commerce without financial stress.",
    minAge: 16,
    maxAge: 25,
    maxAnnualIncome: 250000,
    locations: ["Pune", "Mumbai", "Kolhapur", "Aurangabad", "Solapur", "All Maharashtra", "All India"],
    allowedEducation: ["12th pass", "student", "undergraduate", "college"],
    targetGoals: ["scholarship", "higher education", "college fees", "tuition support", "girls education"],
    benefits: [
      "₹40,000 per academic year direct fee transfer",
      "One-on-one mentorship by corporate women leaders",
      "Free access to online learning libraries and Coursera licenses"
    ],
    documentsRequired: ["Aadhaar Card", "College Admission Proof", "Income Certificate (<2.5L)", "Class 12 Marksheet"],
    duration: "Annual (Renewable up to 3 years)",
    fundingAmount: "₹40,000 / year",
    seatsRemaining: 110,
    deadline: "2026-09-30"
  },
  {
    id: "prog-udyogini-grant",
    name: "Udyogini Micro-Enterprise Seed Grant",
    ngoName: "Stree Shakti Mahila Manch",
    category: "financial_aid",
    badge: "Livelihood & Self-Employment",
    tagline: "Seed capital and equipment sponsorship for women-led home micro-businesses",
    description: "Empowers aspiring female entrepreneurs, homemakers, and self-help group members with machinery (e.g. industrial sewing machines, food processing kits) and ₹20,000 seed working capital.",
    minAge: 20,
    maxAge: 55,
    maxAnnualIncome: 200000,
    locations: ["Pune", "Mumbai", "Thane", "Nashik", "Satara", "All Maharashtra"],
    allowedEducation: ["any", "illiterate", "10th pass", "12th pass", "dropout", "homemaker"],
    targetGoals: ["self employment", "sewing machine grant", "small business", "micro enterprise", "livelihood support", "financial aid"],
    benefits: [
      "Free commercial sewing / tailoring equipment kit or food kiosk kit",
      "₹20,000 non-repayable seed working capital grant",
      "Market linkage with local exhibitions and e-commerce platforms",
      "Financial literacy and bookkeeping workshops"
    ],
    documentsRequired: ["Aadhaar Card", "BPL Ration Card / Income Proof", "Bank Account Details", "Business Idea Brief"],
    duration: "6 Months incubation",
    fundingAmount: "₹45,000 (Kit + Cash Grant)",
    seatsRemaining: 25,
    deadline: "2026-10-10"
  },
  {
    id: "prog-yuva-swavalamban",
    name: "Yuva Swavalamban ITI & Diploma Tool Grant",
    ngoName: "Jan Kalyan Seva Trust",
    category: "employment_assistance",
    badge: "Trades & Technical Skills",
    tagline: "Toolkit sponsorship & apprenticeship linkage for electrician, fitter, and CNC trades",
    description: "Equips vocational ITI students and trade apprentices with professional-grade starter toolkits and direct apprenticeship matching in manufacturing industrial hubs.",
    minAge: 17,
    maxAge: 30,
    maxAnnualIncome: 350000,
    locations: ["Pune", "Pimpri-Chinchwad", "Chakan", "Talegaon", "Aurangabad", "All Maharashtra"],
    allowedEducation: ["10th pass", "iti", "diploma", "apprentice", "student"],
    targetGoals: ["job-oriented training", "employment assistance", "tool grant", "iti", "technical job", "apprenticeship"],
    benefits: [
      "Brand-new professional toolkit (Electrical / Mechanical / Welder)",
      "Apprenticeship placement assistance in MIDC industrial clusters",
      "Safety certification and soft skills booster modules"
    ],
    documentsRequired: ["Aadhaar Card", "ITI Enrolment / Passing Certificate", "Income Self-Declaration"],
    duration: "2 Months fast-track",
    fundingAmount: "₹18,000 in tools & training",
    seatsRemaining: 65,
    deadline: "2026-09-20"
  },
  {
    id: "prog-aarogya-suraksha",
    name: "Aarogya Suraksha Medical Relief Fund",
    ngoName: "Care India Health Mission",
    category: "financial_aid",
    badge: "Emergency Healthcare Aid",
    tagline: "Direct financial assistance for critical illness and assistive devices",
    description: "Provides one-time emergency financial aid, prosthetic support, hearing aids, and diagnostic sponsorship for economically vulnerable families.",
    minAge: 1,
    maxAge: 80,
    maxAnnualIncome: 180000,
    locations: ["All Maharashtra", "Pune", "Mumbai", "Nagpur", "All India"],
    allowedEducation: ["any"],
    targetGoals: ["medical aid", "health emergency", "financial aid", "assistive device", "hospital support"],
    benefits: [
      "Up to ₹50,000 direct hospital billing settlement",
      "Free assistive aids (wheelchairs, hearing aids, crutches)",
      "Free medicine dispatch for chronic conditions (up to 6 months)"
    ],
    documentsRequired: ["Hospital Estimate / Treatment Record", "Aadhaar Card", "BPL / Ration Card", "Doctor Recommendation"],
    duration: "Immediate / 48-hour approval",
    fundingAmount: "Up to ₹50,000",
    seatsRemaining: 40,
    deadline: "Open Year-Round"
  }
];

export const DEFAULT_APPLICATIONS = [
  {
    id: "SHK-2026-8941",
    beneficiaryName: "Rohan Gaikwad",
    phone: "+91 98231 44520",
    email: "rohan.gaikwad@example.com",
    originalPrompt: "I'm a 20-year-old student from Pune. My family income is low and I want job-oriented training.",
    programId: "prog-skillbridge",
    programName: "SkillBridge: IT & Technical Vocations",
    ngoName: "Yuva Vikas Foundation",
    extractedProfile: {
      age: 20,
      location: "Pune",
      education: "Student (Undergraduate)",
      incomeLevel: "Low (< ₹2.5L/year)",
      goal: "Job-Oriented Skill Training & Placement"
    },
    matchScore: 98,
    verificationMatrix: {
      ageMatch: true,
      locationMatch: true,
      incomeMatch: true,
      goalMatch: true
    },
    status: "Pending Review",
    submittedAt: "2026-08-19 14:22",
    documentsUploaded: ["Aadhaar Card (Verified)", "Income Certificate.pdf", "HSC Marksheet.pdf"],
    staffNotes: "Auto-verified 4/4 criteria. Recommended for next batch starting Sept 1st."
  },
  {
    id: "SHK-2026-8812",
    beneficiaryName: "Sunita Kamble",
    phone: "+91 97652 11093",
    email: "sunita.kamble@example.com",
    originalPrompt: "I am 34 years old homemaker from Pune looking for sewing machine financial grant to start home tailoring business.",
    programId: "prog-udyogini-grant",
    programName: "Udyogini Micro-Enterprise Seed Grant",
    ngoName: "Stree Shakti Mahila Manch",
    extractedProfile: {
      age: 34,
      location: "Pune",
      education: "Homemaker (10th pass)",
      incomeLevel: "Very Low (< ₹1.5L/year)",
      goal: "Sewing Machine & Small Business Seed Grant"
    },
    matchScore: 96,
    verificationMatrix: {
      ageMatch: true,
      locationMatch: true,
      incomeMatch: true,
      goalMatch: true
    },
    status: "In Review",
    submittedAt: "2026-08-18 11:05",
    documentsUploaded: ["Aadhaar Card.pdf", "Ration Card (Yellow).pdf"],
    staffNotes: "Scheduled field visit for machine delivery validation."
  },
  {
    id: "SHK-2026-8790",
    beneficiaryName: "Pooja Shinde",
    phone: "+91 94220 89112",
    email: "pooja.shinde@example.com",
    originalPrompt: "19-year old female studying 2nd year B.Sc in Mumbai. Single parent family income 1.8 lakh, seeking college scholarship.",
    programId: "prog-pragati-kanya",
    programName: "Pragati Kanya Higher Education Scholarship",
    ngoName: "Savitribai Social Trust",
    extractedProfile: {
      age: 19,
      location: "Mumbai",
      education: "College Student (2nd Yr B.Sc)",
      incomeLevel: "Low (₹1.8L/year)",
      goal: "Higher Education College Scholarship"
    },
    matchScore: 99,
    verificationMatrix: {
      ageMatch: true,
      locationMatch: true,
      incomeMatch: true,
      goalMatch: true
    },
    status: "Approved",
    submittedAt: "2026-08-17 16:40",
    documentsUploaded: ["Aadhaar Card", "College ID & Fee Receipt", "Income Certificate"],
    staffNotes: "Approved ₹40,000 annual scholarship tranche 1."
  }
];
