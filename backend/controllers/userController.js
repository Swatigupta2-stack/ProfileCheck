import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import CoverLetter from '../models/CoverLetter.js';

/**
 * Generate JWT token
 * @param {string} id - User ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Register a new user
 */
export async function register(req, res) {
  try {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { userId }] });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({
      userId,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          userId: user.userId,
          email: user.email,
          token: generateToken(user.userId),
        },
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Helper to check and update subscription status based on expiry date
 */
export async function checkAndUpdateSubscription(user) {
  if (!user) return null;
  if (
    user.subscriptionTier === 'pro' &&
    user.subscriptionExpiryDate &&
    new Date(user.subscriptionExpiryDate) < new Date()
  ) {
    user.subscriptionTier = 'free';
    await user.save();
  }
  return user;
}

/**
 * Login user
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      user = await checkAndUpdateSubscription(user);
      res.json({
        success: true,
        data: {
          userId: user.userId,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
          token: generateToken(user.userId),
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get user profile
 */
export async function getProfile(req, res) {
  try {
    let user = await User.findOne({ userId: req.user.userId }).select('-password');
    user = await checkAndUpdateSubscription(user);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req, res) {
  try {
    const user = await User.findOne({ userId: req.user.userId });

    if (user) {
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          userId: updatedUser.userId,
          email: updatedUser.email,
          token: generateToken(updatedUser.userId),
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get all resumes for user
 */
export async function getUserResumes(req, res) {
  try {
    const userId = req.params.userId || req.user.userId;
    
    // Security check: only allow users to access their own data
    if (userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get all cover letters for user
 */
export async function getUserCoverLetters(req, res) {
  try {
    const userId = req.params.userId || req.user.userId;

    // Security check: only allow users to access their own data
    if (userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const coverLetters = await CoverLetter.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, data: coverLetters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Delete account
 */
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.userId;

    // Delete user data
    await Resume.deleteMany({ userId });
    await CoverLetter.deleteMany({ userId });
    await User.findOneAndDelete({ userId });

    res.json({ success: true, message: 'Account and all data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get subscription tier and expiry status by userId
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const { userId } = req.params;
    let user = await User.findOne({ userId });
    if (!user) {
      return res.json({ success: true, subscriptionTier: 'free' });
    }
    user = await checkAndUpdateSubscription(user);
    res.json({
      success: true,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export default {
  register,
  login,
  getProfile,
  updateProfile,
  getUserResumes,
  getUserCoverLetters,
  deleteAccount,
  getSubscriptionStatus,
};
