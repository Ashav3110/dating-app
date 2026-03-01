const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  gender: user.gender,
  age: user.age,
  bio: user.bio,
  avatar: user.avatar,
  interests: user.interests,
  likes: user.likes,
  matches: user.matches,
});

const register = async (req, res) => {
  const { name, email, password, gender, age, bio, interests } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    gender,
    age,
    bio,
    avatar: req.file ? `/uploads/${req.file.filename}` : undefined,
    interests: interests ? interests.split(',').map((i) => i.trim()).filter(Boolean) : [],
  });

  const token = generateToken(user._id);
  return res.status(201).json({ token, user: formatUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  const safeUser = await User.findById(user._id);
  return res.json({ token, user: formatUser(safeUser) });
};

const me = async (req, res) => {
  return res.json({ user: formatUser(req.user) });
};

const updateProfile = async (req, res) => {
  const updates = ['name', 'gender', 'age', 'bio'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  if (req.body.interests !== undefined) {
    req.user.interests = Array.isArray(req.body.interests)
      ? req.body.interests
      : req.body.interests.split(',').map((i) => i.trim()).filter(Boolean);
  }

  if (req.file) {
    req.user.avatar = `/uploads/${req.file.filename}`;
  }

  const saved = await req.user.save();
  return res.json({ user: formatUser(saved) });
};

module.exports = { register, login, me, updateProfile };
