const User = require('../models/User');

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

const explore = async (req, res) => {
  const { gender, minAge, maxAge, search } = req.query;
  const filter = { _id: { $ne: req.user._id } };
  if (gender) filter.gender = gender;
  if (minAge || maxAge) {
    filter.age = {};
    if (minAge) filter.age.$gte = Number(minAge);
    if (maxAge) filter.age.$lte = Number(maxAge);
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const users = await User.find(filter).limit(30);
  return res.json({ users: users.map(formatUser) });
};

const likeUser = async (req, res) => {
  const targetId = req.params.id;
  if (String(targetId) === String(req.user._id)) {
    return res.status(400).json({ message: 'Cannot like yourself' });
  }

  const target = await User.findById(targetId);
  if (!target) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = await User.findById(req.user._id);

  const alreadyLiked = user.likes.some((id) => String(id) === String(targetId));
  if (!alreadyLiked) {
    user.likes.push(targetId);
  }

  let matched = false;
  const targetLikedBack = target.likes.some((id) => String(id) === String(user._id));
  if (targetLikedBack) {
    matched = true;
    if (!user.matches.some((id) => String(id) === String(targetId))) {
      user.matches.push(targetId);
    }
    if (!target.matches.some((id) => String(id) === String(user._id))) {
      target.matches.push(user._id);
    }
  }

  await user.save();
  if (matched) {
    await target.save();
  }

  return res.json({
    matched,
    likes: user.likes,
    matches: user.matches,
  });
};

const dislikeUser = async (req, res) => {
  const targetId = req.params.id;
  const user = await User.findById(req.user._id);
  user.likes = user.likes.filter((id) => String(id) !== String(targetId));
  user.matches = user.matches.filter((id) => String(id) !== String(targetId));
  await user.save();
  return res.json({ likes: user.likes, matches: user.matches });
};

const getMatches = async (req, res) => {
  const matchedUsers = await User.find({ _id: { $in: req.user.matches } });
  return res.json({ matches: matchedUsers.map(formatUser) });
};

module.exports = { explore, likeUser, dislikeUser, getMatches };
