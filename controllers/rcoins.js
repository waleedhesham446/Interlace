const { User } = require('../models/User');
const { RCoinRecord } = require('../models/RCoinRecord');
const { CoinRecord } = require('../models/CoinRecord');
const { Cashout } = require('../models/Cashout');

const getMyRCoinRecords = async (req, res) => {
    const { myId } = req.params;
    try {
        const records = await RCoinRecord.find({ userId: myId });
        res.status(200).json(records);
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
        if(amount > user.rCoin) return res.status(411).json({ message: 'You do not have enough rcoins' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { coin: amount, rCoin: -1*amount } });
        const newRecord = await RCoinRecord.create({ userId: myId, amount, isIncrease: false, usageType: 'convertToCoin' });
        delete updatedUser.password;

        res.status(200).json({ updatedUser, newRecord });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getCashoutHistory = async (req, res) => {
    const { myId } = req.params;
    try {
        const cashouts = await Cashout.find({ userId: myId });
        res.status(200).json(cashouts);
    } catch (error) {
        res.status(500).json(error);
    }
}

const makeCashout = async (req, res) => {
    const { myId } = req.params;
    const { amount } = req.query;
    const { method, actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(amount <= 0) return res.status(410).json({ message: 'Invalid Value' });
        if(amount > user.rCoin) return res.status(411).json({ message: 'You do not have enough rcoins' });

        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { rCoin: -1*amount } });
        const newRecord = await RCoinRecord.create({ userId: myId, amount, isIncrease: false, usageType: 'cashout' });
        delete updatedUser.password;
        const newCashout = await Cashout.create({ userId: myId, amount, method });

        res.status(200).json({ updatedUser, newRecord, newCashout });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getMyRCoinRecords, convert, getCashoutHistory, makeCashout };