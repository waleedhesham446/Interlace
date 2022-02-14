const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { User } = require('../models/User');
const { ReferralInfo } = require('../models/ReferralInfo');
dotenv.config();

const signup = async (req, res) => {
    const { name, image, email, password, username, country, bio, age, gender, isVip } = req.body;
    try {
        const existingUserName = await User.findOne({ username });
        if(existingUserName) return res.status(410).json({ message: 'username already exists' });
        
        const existingEmail = await User.findOne({ email });
        if(existingEmail) return res.status(411).json({ message: 'email already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ name, image, email, password: hashedPassword, username, country, bio, age, gender, isVip });
        const newReferralInfo = await ReferralInfo.create({ myReferralCode: newUser._id });
        res.status(200);
    } catch (error) {
        res.status(500).json(error);
    }
}

const login = async (req, res) => {
    const { username, password } = req.query;
    try {
        const existingUser = await User.findOne({ username });
        if(!existingUser) return res.status(400).json({ message: 'Invalid username or password' });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({ message: 'Invalid username or password' });
        delete existingUser.password;
        const token = jwt.sign({ email: existingUser.email}, process.env.SECRET, { expiresIn: "365d" });
        res.status(200).json({ existingUser, token });
    } catch (error) {
        res.status(500).json(error);
    }
}

const logout = async (req, res) => {
    try {
        res.status(200);
    } catch (error) {
        res.status(500).json(error);
    }
}

const search = async (req, res) => {
    const { myId } = req.params;
    const { name } = req.query;
    try {
        const searchedUsers = await User.find({ $or:[ 
            { username: { $regex: name, $options: "i" } },
            { name: { $regex: name, $options: "i" } },
            { email: { $regex: name, $options: "i" } },
        ] });
        const searchedUsersWithFollowFlag = searchedUsers.map((searchedUser) => {
            delete searchedUser.password;
            let iamFollowing = false;
            if(searchedUser.followersIds.indexOf(myId) !== -1) iamFollowing = true;
            return { iamFollowing, user: searchedUser };
        });
        res.status(200).json(searchedUsersWithFollowFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getByUserName = async (req, res) => {
    const { username } = req.params;
    try {
        const searchedUser = await User.findOne({ username });
        delete searchedUser.password;
        res.status(200).json(searchedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

const update = async (req, res) => {
    const { myId } = req.params;
    const { username, bio } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const existingUserName = await User.findOne({ username });
        if(existingUserName) return res.status(410).json({ message: 'username already exists' });

        const updatedUser = await User.findByIdAndUpdate(myId, { username, bio });
        if(!updatedUser) return res.status(404).json({ message: 'This user is not registered' });
        delete updatedUser.password;
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updatePicture = async (req, res) => {
    const { myId } = req.params;
    const { picture } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const updatedUser = await User.findByIdAndUpdate(myId, { image: picture });
        delete updatedUser.password;
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { signup, login, logout, search, getByUserName, update, updatePicture };