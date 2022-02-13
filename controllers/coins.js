const { User } = require('../models/User');
const { CoinRecord } = require('../models/CoinRecord');
const { Offer } = require('../models/Offer');
const { ReferralInfo } = require('../models/ReferralInfo');
const { ReferralRecord } = require('../models/ReferralRecord');

const getMyCoinRecords = async (req, res) => {
    const { myId } = req.params;
    try {
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
    const { id, coins, price, discount, by } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const offer = await Offer.find({ _id: id, coins, price, discount });
        if(!offer) return res.status(404).json({ message: 'This offer does not exist' });

        if(price <= 0 || price-discount <= 0) return res.status(410).json({ message: 'Invalid Value' });
        if(price-discount > user.rCoin) return res.status(411).json({ message: 'You do not have enough rcoins' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: coins, rCoin: -1*(price-discount) } });
        delete updatedUser.password;
        const newRecord = await CoinRecord.create({ userId: myId, amount: coins, isIncrease: true, by, usageType: 'rechargeCoin' });
       
        res.status(200).json({ updatedUser, newRecord });
    } catch (error) {
        res.status(500).json(error);
    }
}

const watchVideo = async (req, res) => {
    const { myId } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: 1 } });
        if(!updatedUser) return res.status(404).json({ message: 'This user is not registered' });
        delete updatedUser.password;
        res.status(200).json(updatedUser);
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