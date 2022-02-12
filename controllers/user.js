const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { UserSearchResult } = require('../models/UserSearchResult');

const signup = async (req, res) => {
    const { name, image, email, password, username, country, bio, level, followers, fans, videos, age, posts, coin, rCoin, gender, isVip } = req.body;

    try {
        const existingUserName = await User.findOne({ username });
        if(existingUserName) return res.status(410).json({ message: 'username already exists' });
        
        const existingEmail = await User.findOne({ email });
        if(existingEmail) return res.status(411).json({ message: 'email already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name, image, email, password: hashedPassword, username, country, bio, level, followers, fans, videos, age, posts, coin, rCoin, gender, isVip });
        
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

        res.status(200).json(existingUser);
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
        if(name){
            const searchedUser = await UserSearchResult.findOne({ myId, user: { username: name } });
            res.status(200).json(searchedUser);
        }else{
            const searchedUsers = await UserSearchResult.find({ myId });
            res.status(200).json(searchedUsers);
        }
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

    try {
        const existingUserName = await User.findOne({ username });
        if(existingUserName) return res.status(410).json({ message: 'username already exists' });

        const updatedUser = await User.findByIdAndUpdate(myId, { username, bio });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updatePicture = async (req, res) => {
    const { myId } = req.params;
    const { picture } = req.query;

    try {
        const updatedUser = await User.findByIdAndUpdate(myId, { image: picture });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { signup, login, logout, search, getByUserName, update, updatePicture };