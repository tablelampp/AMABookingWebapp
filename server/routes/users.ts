import express from 'express';
import { connectDB } from '../utils/db';
import User from '../models/User';
import { authenticateToken } from '../utils/auth';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get coaches only
router.get('/coaches', async (req, res) => {
  try {
    await connectDB();
    const coaches = await User.find({ role: 'coach' }).select('-password');
    return res.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    await connectDB();
    const { name, email, role, hourlyRate } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.hourlyRate = hourlyRate || user.hourlyRate;

    await user.save();
    const userResponse = user.toObject();
    delete (userResponse as any).password;
    return res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 