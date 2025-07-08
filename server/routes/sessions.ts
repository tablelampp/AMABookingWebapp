import express from 'express';
import { connectDB } from '../utils/db';
import Session from '../models/Session';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

// Get all sessions
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const sessions = await Session.find().populate('coachId', 'name email');
    return res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions by coach
router.get('/coach/:coachId', async (req, res) => {
  try {
    await connectDB();
    const { coachId } = req.params;
    const sessions = await Session.find({ coachId }).populate('coachId', 'name email');
    return res.json(sessions);
  } catch (error) {
    console.error('Error fetching coach sessions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single session
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const session = await Session.findById(req.params.id).populate('coachId', 'name email');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create session
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { coachId, title, description, start, end, maxStudents, price } = req.body;

    const session = new Session({
      coachId,
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      maxStudents: maxStudents || 1,
      price: price || 0,
      students: []
    });

    await session.save();
    return res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Book session
router.post('/:id/book', async (req, res) => {
  try {
    await connectDB();
    const { studentName, studentEmail } = req.body;
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.students.length >= session.maxStudents) {
      return res.status(400).json({ message: 'Session is full' });
    }

    // Check if student is already booked
    const existingBooking = session.students.find(
      student => student.email === studentEmail
    );
    if (existingBooking) {
      return res.status(400).json({ message: 'Student already booked for this session' });
    }

    session.students.push({
      name: studentName,
      email: studentEmail,
      bookedAt: new Date()
    });

    await session.save();
    return res.json(session);
  } catch (error) {
    console.error('Error booking session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/:id/cancel', async (req, res) => {
  try {
    await connectDB();
    const { studentEmail } = req.body;
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const studentIndex = session.students.findIndex(
      student => student.email === studentEmail
    );
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    session.students.splice(studentIndex, 1);
    await session.save();
    return res.json(session);
  } catch (error) {
    console.error('Error canceling booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    await connectDB();
    const { coachId, title, description, start, end, maxStudents, price } = req.body;
    
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.coachId = coachId || session.coachId;
    session.title = title || session.title;
    session.description = description || session.description;
    session.start = start ? new Date(start) : session.start;
    session.end = end ? new Date(end) : session.end;
    session.maxStudents = maxStudents || session.maxStudents;
    session.price = price || session.price;

    await session.save();
    return res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    await connectDB();
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Session.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 