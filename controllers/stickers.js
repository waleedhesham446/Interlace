const { User } = require('../models/User');
const { Sticker } = require('../models/Sticker');
const { LiveStream } = require('../models/LiveStream');

const getAllStickers = async (req, res) => {

    try {
        const stickers = await Sticker.find();
        res.status(200).json(stickers);
    } catch (error) {
        res.status(500).json(error);
    }
}

const sendSticker = async (req, res) => {
    const { liveId, myId } = req.params;
    const { hisId, stickerId } = req.body;

    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });
        
        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) === -1 || live.watchersIds.indexOf(hisId) === -1) return res.status(410).json({ message: 'The sender and/or the receiver are/is not in this live stream' });

        const sticker = await Sticker.findById(stickerId);
        if(!sticker) return res.status(404).json({ message: 'This sticker does not exist' });

        if(sticker.price > me.coin) return res.status(411).json({ message: 'You do not have enough coins' });

        const updatedSender = await User.findByIdAndUpdate(myId, { $inc: { coin: -1*sticker.price } }).select('-password');
        const updatedReceiver = await User.findByIdAndUpdate(hisId, { $inc: { coin: sticker.price } }).select('-password');
        
        res.status(200).json({ sticker, updatedSender, updatedReceiver });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllStickers, sendSticker };