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

const convert = async (req, res) => {
    const { myId } = req.params;
    const { amount } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(amount <= 0) return res.status(410).json({ message: 'Invalid Value' });
        if(amount > user.coin) return res.status(411).json({ message: 'You do not have enough coins' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: -1*amount, rCoin: amount } }).select('-password');
        const newCoinRecord = await CoinRecord.create({ userId: myId, amount, isIncrease: false, usageType: 'RcoinConvertion' });

        res.status(200).json({ updatedUser, newCoinRecord });
    } catch (error) {
        res.status(500).json(error);
    }
}

const buyCoins = async (req, res) => {
    const { myId } = req.params;
    const { id, coins, price, discount, actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const offer = await Offer.find({ _id: id, coins, price, discount });
        if(!offer) return res.status(404).json({ message: 'This offer does not exist' });

        if(price <= 0 || price-discount <= 0) return res.status(410).json({ message: 'Invalid Value' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: coins } }).select('-password');
        const newRecord = await CoinRecord.create({ userId: myId, amount: coins, isIncrease: true, usageType: 'rechargeCoin' });
       
        res.status(200).json({ updatedUser, newRecord });
    } catch (error) {
        res.status(500).json(error);
    }
}

const watchVideo = async (req, res) => {
    const { myId } = req.params;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: 1 } }).select('-password');
        const newRecord = await CoinRecord.create({ userId: myId, amount: 1, isIncrease: true, usageType: 'watchingVideo' });
        res.status(200).json({ updatedUser, newRecord });
    } catch (error) {
        res.status(500).json(error);
    }
}

const referralSubmit = async (req, res) => {
    const { myId } = req.params;
    const { hisCode } = req.query;
    const { actualEmail } = req.body;
    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisCode);
        if(!him || !me) return res.status(404).json({ message: 'This user is not registered' });
        if(me.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const oldRecord = await ReferralRecord.findOne({ newUserId: myId, oldUserId: hisCode });
        if(oldRecord) return res.status(410).json({ message: 'You have already used this code before' });
        
        const hisInfoUpdated = await ReferralInfo.findOneAndUpdate({ myReferralCode: hisCode }, { $inc: { myReferralsCount: 1 } });
        const newRefRecord = await ReferralRecord.create({ newUserId: myId, newUserName: me.username, oldUserId: hisCode, oldUserName: him.username });

        const myNewCoinRecord = await CoinRecord.create({ userId: myId, amount: 200, isIncrease: true, by: him.username, usageType: 'referral' });
        const hisNewCoinRecord = await CoinRecord.create({ userId: hisCode, amount: 200, isIncrease: true, by: me.username, usageType: 'referral' });
        const meUpdated = await User.findByIdAndUpdate(myId, { $inc: { coin: 200 } }).select('-password');
        const himUpdated = await User.findByIdAndUpdate(hisCode, { $inc: { coin: 200 } }).select('-password');
        res.status(200).json({ hisInfoUpdated, newRefRecord, myNewCoinRecord, hisNewCoinRecord, meUpdated, himUpdated });
    } catch (error) {
        res.status(500).json(error);
    }
}

const referralInfo = async (req, res) => {
    const { myId } = req.params;
    try {
        const info = await ReferralInfo.findOne({ myReferralCode: myId });
        if(!info) return res.status(404).json({ message: 'This user is not registered' });
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getMyCoinRecords, getAllOffers, convert, buyCoins, watchVideo, referralSubmit, referralInfo };