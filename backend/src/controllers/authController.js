const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? "Username" : "Email";
      return res.status(400).json({ error: `${field} already exists` });
    }

    const user = new User({ name, username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user: { id: user._id, name, username, email }, token });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Registration failed due to a server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identity, password } = req.body; // identity can be username or email
    const user = await User.findOne({ $or: [{ username: identity }, { email: identity }] });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user._id, name: user.name, username: user.username, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (user) {
      // Suggestion logic
      const suggestions = [
        `${username}${Math.floor(Math.random() * 100)}`,
        `${username}_${Math.floor(Math.random() * 999)}`,
        `the_${username}`,
      ];
      return res.json({ available: false, suggestions });
    }
    
    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ error: "Check failed" });
  }
};
