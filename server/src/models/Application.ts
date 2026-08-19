import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  id: string;
  beneficiaryName: string;
  phone: string;
  email?: string;
  originalPrompt: string;
  programId: string;
  programName: string;
  ngoName: string;
  extractedProfile: {
    age: number;
    location: string;
    education: string;
    incomeLevel: string;
    goal: string;
  };
  matchScore: number;
  verificationMatrix: {
    ageMatch: boolean;
    locationMatch: boolean;
    incomeMatch: boolean;
    goalMatch: boolean;
  };
  status: 'Pending Review' | 'In Review' | 'Approved' | 'Disbursed' | 'Ineligible';
  submittedAt: string;
  documentsUploaded: string[];
  staffNotes: string;
}

const ApplicationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  beneficiaryName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  originalPrompt: { type: String, required: true },
  programId: { type: String, required: true },
  programName: { type: String, required: true },
  ngoName: { type: String, required: true },
  extractedProfile: {
    age: { type: Number, required: true },
    location: { type: String, required: true },
    education: { type: String, required: true },
    incomeLevel: { type: String, required: true },
    goal: { type: String, required: true }
  },
  matchScore: { type: Number, default: 95 },
  verificationMatrix: {
    ageMatch: { type: Boolean, default: true },
    locationMatch: { type: Boolean, default: true },
    incomeMatch: { type: Boolean, default: true },
    goalMatch: { type: Boolean, default: true }
  },
  status: { 
    type: String, 
    enum: ['Pending Review', 'In Review', 'Approved', 'Disbursed', 'Ineligible'],
    default: 'Pending Review' 
  },
  submittedAt: { type: String, required: true },
  documentsUploaded: { type: [String], default: [] },
  staffNotes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
