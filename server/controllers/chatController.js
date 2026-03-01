const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const otherId = req.params.id;
  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: otherId },
      { from: otherId, to: req.user._id },
    ],
  }).sort('createdAt');

  return res.json({ messages });
};

const sendMessage = async (req, res) => {
  const { to, content } = req.body;
  if (!to || !content) {
    return res.status(400).json({ message: 'Recipient and content required' });
  }
  const message = await Message.create({
    from: req.user._id,
    to,
    content,
  });
  return res.status(201).json({ message });
};

module.exports = { getMessages, sendMessage };
