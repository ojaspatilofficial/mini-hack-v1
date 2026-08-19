import { Router, Request, Response } from 'express';
import { Program } from '../models/Program';
import { Application } from '../models/Application';
import { aiService } from '../services/aiService';
import { DEFAULT_PROGRAMS, DEFAULT_APPLICATIONS } from '../data/seedData';

const router = Router();

// In-Memory Fallback store in case MongoDB is disconnected
let memPrograms = [...DEFAULT_PROGRAMS];
let memApplications = [...DEFAULT_APPLICATIONS];

// Helper to determine if MongoDB is active
const isMongoConnected = () => {
  return Program.db.readyState === 1;
};

/**
 * Seed initial data if MongoDB collections are empty
 */
export async function seedInitialData() {
  if (!isMongoConnected()) return;
  try {
    const progCount = await Program.countDocuments();
    if (progCount === 0) {
      await Program.insertMany(DEFAULT_PROGRAMS);
      console.log('🌱 Seeded default NGO programs into MongoDB');
    }

    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      await Application.insertMany(DEFAULT_APPLICATIONS);
      console.log('🌱 Seeded default beneficiary applications into MongoDB');
    }
  } catch (err) {
    console.error('Error checking/seeding database:', err);
  }
}

/**
 * POST /api/extract-and-match
 * Extract demographic entities and match against programs
 */
router.post('/extract-and-match', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // 1. Extract profile
    const profile = await aiService.extractProfile(prompt);

    // 2. Fetch programs
    let programs: any[] = [];
    if (isMongoConnected()) {
      programs = await Program.find().lean();
    }
    if (!programs.length) {
      programs = memPrograms;
    }

    // 3. Rank & Match
    const rankedResults = aiService.rankPrograms(profile, programs);

    res.json({
      extractedProfile: profile,
      rankedResults,
      topRecommendation: rankedResults[0] || null
    });
  } catch (error) {
    console.error('Error in /api/extract-and-match:', error);
    res.status(500).json({ error: 'Failed to process AI matching' });
  }
});

/**
 * GET /api/programs
 * List all NGO programs
 */
router.get('/programs', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoConnected()) {
      const programs = await Program.find().lean();
      if (programs.length > 0) {
        res.json(programs);
        return;
      }
    }
    res.json(memPrograms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

/**
 * POST /api/programs
 * Add a new NGO program
 */
router.post('/programs', async (req: Request, res: Response): Promise<void> => {
  try {
    const newProgData = {
      ...req.body,
      id: req.body.id || `prog-${Date.now()}`
    };

    if (isMongoConnected()) {
      const created = await Program.create(newProgData);
      res.status(201).json(created);
      return;
    }

    memPrograms.push(newProgData);
    res.status(201).json(newProgData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create program' });
  }
});

/**
 * GET /api/applications
 * List submitted applications with optional filters
 */
router.get('/applications', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, programId, search } = req.query;

    let apps: any[] = [];
    if (isMongoConnected()) {
      const query: any = {};
      if (status && status !== 'All') query.status = status;
      if (programId && programId !== 'All') query.programId = programId;
      if (search) {
        query.$or = [
          { beneficiaryName: { $regex: search, $options: 'i' } },
          { id: { $regex: search, $options: 'i' } },
          { 'extractedProfile.location': { $regex: search, $options: 'i' } }
        ];
      }
      apps = await Application.find(query).sort({ createdAt: -1 }).lean();
    } else {
      apps = memApplications.filter(app => {
        const matchesStatus = !status || status === 'All' || app.status === status;
        const matchesProgram = !programId || programId === 'All' || app.programId === programId;
        const matchesSearch = !search || 
          app.beneficiaryName.toLowerCase().includes(String(search).toLowerCase()) ||
          app.id.toLowerCase().includes(String(search).toLowerCase()) ||
          app.extractedProfile.location.toLowerCase().includes(String(search).toLowerCase());
        return matchesStatus && matchesProgram && matchesSearch;
      });
    }

    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

/**
 * POST /api/applications
 * Submit new application from beneficiary portal
 */
router.post('/applications', async (req: Request, res: Response): Promise<void> => {
  try {
    const appData = {
      ...req.body,
      id: req.body.id || `SHK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: req.body.submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: req.body.status || 'Pending Review'
    };

    if (isMongoConnected()) {
      const created = await Application.create(appData);
      res.status(201).json(created);
      return;
    }

    memApplications.unshift(appData);
    res.status(201).json(appData);
  } catch (error) {
    console.error('Failed to create application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

/**
 * GET /api/applications/:id
 */
router.get('/applications/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const app = await Application.findOne({ id }).lean();
      if (app) {
        res.json(app);
        return;
      }
    }
    const memApp = memApplications.find(a => a.id === id);
    if (memApp) {
      res.json(memApp);
      return;
    }
    res.status(404).json({ error: 'Application not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get application' });
  }
});

/**
 * PATCH /api/applications/:id/status
 * Update status and notes for an application
 */
router.patch('/applications/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, staffNotes } = req.body;

    if (isMongoConnected()) {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (staffNotes !== undefined) updateData.staffNotes = staffNotes;

      const updated = await Application.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
      if (updated) {
        res.json(updated);
        return;
      }
    }

    const appIndex = memApplications.findIndex(a => a.id === id);
    if (appIndex !== -1) {
      if (status) memApplications[appIndex].status = status;
      if (staffNotes !== undefined) memApplications[appIndex].staffNotes = staffNotes;
      res.json(memApplications[appIndex]);
      return;
    }

    res.status(404).json({ error: 'Application not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

/**
 * GET /api/metrics
 * Summary KPI numbers
 */
router.get('/metrics', async (_req: Request, res: Response): Promise<void> => {
  try {
    let apps: any[] = [];
    if (isMongoConnected()) {
      apps = await Application.find().lean();
    } else {
      apps = memApplications;
    }

    const total = apps.length;
    const pending = apps.filter(a => a.status === 'Pending Review').length;
    const inReview = apps.filter(a => a.status === 'In Review').length;
    const approved = apps.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length;
    const highMatch = apps.filter(a => a.matchScore >= 95).length;

    res.json({ total, pending, inReview, approved, highMatch });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
