import mongoose, { Document, Model } from 'mongoose';

export interface ISession extends Document {
  coachId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  maxStudents: number;
  price: number;
  students: Array<{
    name: string;
    email: string;
    bookedAt: Date;
  }>;
  createdAt: Date;
}

const SessionSchema = new mongoose.Schema<ISession>({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  maxStudents: {
    type: Number,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  students: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      bookedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
export default Session; 