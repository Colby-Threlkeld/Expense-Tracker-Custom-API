const User = require('../models/User');

// Get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password'); //Excludes password
        res.json(users);
    } catch(error) {
        res.status(500).json({ error: "Users not found"});
    }
};

// Get user by ID
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error retreiving user" });
    }
};

// update user by ID
exports.updateUserById = async(req, res) => {
    try {
        // only allows authurized user to update their own info
        if (req.userId !== req.params.id) {
            return res.status(403).json({ error: "Unauthorized user" });
        }

        const { name, email, password } = req.body; // pulls values from req body

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (password !== undefined) user.password = password;

        await user.save(); // saves updated user to db

        const safe = user.toObject(); /// mongoose doc -> plain js object
        delete safe.password; // removes password field to prevent sending it to client
        res.json(safe); // sends safe version in response
    }
    catch (error) {
        res.status(500).json({ error: "Error when updating user information" });
    }
};


// delete user by ID
exports.deleteUserById = async(req, res) => {
    try {
        if (req.userId !== req.params.id) {
            return res.status(403).json({ error: "unauthorized user" });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error while deleting user" });
    }
};