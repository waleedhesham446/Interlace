const { User } = require('../models/User');
const { VipPlan } = require('../models/VipPlan');

const getAllVipPlans = async (req, res) => {
    try {
        const vipPlans = await VipPlan.find();
        res.status(200).json(vipPlans);
    } catch (error) {
        res.status(500).json(error);
    }
}

const buyVipPlan = async (req, res) => {
    const { offerId } = req.params;
    const { myId, actualEmail } = req.body;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const vipPlan = await VipPlan.findById(offerId);
        if(!vipPlan) return res.status(404).json({ message: 'This vip plan dose not exist' });

        if(vipPlan.price > user.coin) return res.status(410).json({ message: 'You do not have enough coins' });
        
        const updatedUser = await User.findByIdAndUpdate(myId, { isVip: true, $inc: { coin: -1*vipPlan.price } });
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllVipPlans, buyVipPlan };