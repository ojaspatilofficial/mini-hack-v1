import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  id: string;
  name: string;
  ngoName: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  minAge: number;
  maxAge: number;
  maxAnnualIncome: number;
  locations: string[];
  allowedEducation: string[];
  targetGoals: string[];
  benefits: string[];
  documentsRequired: string[];
  duration: string;
  fundingAmount: string;
  seatsRemaining: number;
  deadline: string;
}

const ProgramSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ngoName: { type: String, required: true },
  category: { type: String, required: true },
  badge: { type: String, default: '' },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  minAge: { type: Number, default: 16 },
  maxAge: { type: Number, default: 60 },
  maxAnnualIncome: { type: Number, default: 300000 },
  locations: { type: [String], default: [] },
  allowedEducation: { type: [String], default: [] },
  targetGoals: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  documentsRequired: { type: [String], default: [] },
  duration: { type: String, default: 'Flexible' },
  fundingAmount: { type: String, default: 'Full Sponsorship' },
  seatsRemaining: { type: Number, default: 50 },
  deadline: { type: String, default: 'Open Year-Round' }
}, {
  timestamps: true
});

export const Program = mongoose.model<IProgram>('Program', ProgramSchema);
