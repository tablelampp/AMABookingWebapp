import mongoose, { Document, Model } from 'mongoose';

export interface IPayment extends Document {
  coachId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  date: Date;
  createdAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment; 