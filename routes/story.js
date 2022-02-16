const express = require('express');
const multer = require("multer");
const {
    getStoryById,
    getStoriesOfUser,
    getStoriesOfFollowings,
    getStoriesOfFollowers,
    getAllStories,
    createStory,
    removeStory
} = require('../controllers/story');
const auth = require('../middlewares/auth');
const { makeid } = require('../utilities');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const DIR = `uploads/stories/${req.body.type}s`;
        console.log(DIR);
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        const uniqueName = `${makeid(16)}_${filename}`;
        req.body.fileUrl = `/${req.body.type}s_story/${uniqueName}`;
        cb(null, uniqueName);
    },
});

const router = express.Router();

router.get('/:storyId', getStoryById);
router.get('/user/:userId', getStoriesOfUser);
router.get('/following/:userId', getStoriesOfFollowings);
router.get('/follower/:userId', getStoriesOfFollowers);
router.get('/all', getAllStories);
router.post('/create/:userId', multer({ storage: storage }).single("file"), auth, createStory);
router.delete('/remove/:storyId', auth, removeStory);

module.exports = router;