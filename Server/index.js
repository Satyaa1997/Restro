const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urbanspoon';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const InquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String,
  guests: Number,
});
const Inquiry = mongoose.model('Inquiry', InquirySchema);

const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  email: String,
  dob: String,
  loginId: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loginId: String,
  items: [{
    name: String,
    price: String,
    qty: Number,
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', OrderSchema);

const generatePassword = () => Math.random().toString(36).slice(-8);

app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, email, dob } = req.body;
    if (!name || !phone || !email || !dob) {
      return res.status(400).json({ error: 'Please fill in all registration fields.' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered. Please log in.' });
    }

    const loginId = phone;
    const password = generatePassword();
    const newUser = new User({ name, phone, email, dob, loginId, password });
    await newUser.save();

    res.status(201).json({
      message: 'Registration successful. Use your login credentials to sign in.',
      loginId,
      password,
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      return res.status(400).json({ error: 'Login ID and password are required.' });
    }

    const user = await User.findOne({ loginId, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login ID or password.' });
    }

    const orders = await Order.find({ user: user._id });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        dob: user.dob,
        loginId: user.loginId,
      },
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/order', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'Order must include a valid user and items.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const newOrder = new Order({ user: user._id, loginId: user.loginId, items, total });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to place order.' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch orders.' });
  }
});

app.post('/api/inquiry', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry Saved Successfully!', details: newInquiry });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Admin Route to get all inquiries
app.get('/api/admin/inquiries', async (req, res) => {
  const data = await Inquiry.find();
  res.json(data);
});

app.get('/api/admin/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.get('/api/admin/orders', async (req, res) => {
  const orders = await Order.find().populate('user', 'name phone email');
  res.json(orders);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));