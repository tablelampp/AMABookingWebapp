import express from 'express';
import { connectDB } from '../utils/db';
import Payment from '../models/Payment';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const payments = await Payment.find().populate('coachId', 'name email');
    return res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get payments by coach
router.get('/coach/:coachId', async (req, res) => {
  try {
    await connectDB();
    const { coachId } = req.params;
    const payments = await Payment.find({ coachId }).populate('coachId', 'name email');
    return res.json(payments);
  } catch (error) {
    console.error('Error fetching coach payments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single payment
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const payment = await Payment.findById(req.params.id).populate('coachId', 'name email');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    return res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create payment
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { coachId, sessionId, amount, status, date } = req.body;

    const payment = new Payment({
      coachId,
      sessionId,
      amount,
      status: status || 'pending',
      date: date || new Date()
    });

    await payment.save();
    return res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status
router.put('/:id/status', async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();
    return res.json(payment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    await connectDB();
    const { coachId, sessionId, amount, status, date } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.coachId = coachId || payment.coachId;
    payment.sessionId = sessionId || payment.sessionId;
    payment.amount = amount || payment.amount;
    payment.status = status || payment.status;
    payment.date = date || payment.date;

    await payment.save();
    return res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    await connectDB();
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 