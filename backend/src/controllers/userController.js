const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (password) user.password = password; // The pre-save hook will hash this

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
