const { User } = require('../models/User');
const { CoinRecord } = require('../models/CoinRecord');
const { Offer } = require('../models/Offer');

const getMyCoinRecords = async (req, res) => {
    const { myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const records = await CoinRecord.find({ userId: myId });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllOffers = async (req, res) => {

    try {
        const offers = await Offer.find();
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json(error);
    }
}

const buyCoins = async (req, res) => {
    const { myId } = req.params;
    const { coins, price, discount } = req.body;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const offer = await Offer.create({ coins, price, discount });
        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: coins, rCoin: -1*price } });

        res.status(200).json({ offer, updatedUser });
    } catch (error) {
        res.status(500).json(error);
    }
}

const watchVideo = async (req, res) => {
    const { myId } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: 10 } });
        if(!updatedUser) return res.status(404).json({ message: 'This user is not registered' });

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json(error);
    }
}

const referralSubmit = async (req, res) => {
    const { myId } = req.params;

    try {

        res.status(200).json({  });
    } catch (error) {
        res.status(500).json(error);
    }
}

const referralInfo = async (req, res) => {
    const { myId } = req.params;

    try {

        res.status(200).json({  });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getMyCoinRecords, getAllOffers, buyCoins, watchVideo, referralSubmit, referralInfo };