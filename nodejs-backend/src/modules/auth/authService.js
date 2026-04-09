const User = require('../auth/User');
const { generateToken } = require('../../utils/jwt');
const logger = require('../../logger');

class AuthService {
  async register(username, email, password, role = 'user') {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        role: role === 'admin' ? 'admin' : 'user',
      });

      await user.save();

      const token = generateToken(user._id, user.role);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      logger.error('Register error:', error.message);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user._id, user.role);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          score: user.score,
          streak: user.streak,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error.message);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Get user error:', error.message);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await User.find({}).select('-password').sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Get all users error:', error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();
