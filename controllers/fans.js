const { User } = require('../models/User');

const getAllFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const followersIds = user.followersIds;
        const followers = followersIds.map(async(followerId) => {
            let follower = await User.findById(followerId);
            delete follower.password;
            return follower;
        });
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json(error);
    }
}

const follow = async (req, res) => {
    const { myId } = req.params;
    const { hisId } = req.query;

    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });

        if(him.followersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'You already follows this person' });

        const updatedUser = await User.findByIdAndUpdate(hisId, { $push: { followersIds: myId  }, $inc: { followers: 1 } });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unfollow = async (req, res) => {
    const { myId } = req.params;
    const { hisId } = req.query;

    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });

        if(him.followersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'You does not follow this person' });

        const updatedUser = await User.findByIdAndUpdate(hisId, { $pull: { followersIds: myId  }, $inc: { followers: -1 } });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllFollowers, follow, unfollow };