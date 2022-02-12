const { Banner } = require('../models/Banner');

const getAllBanners = async (req, res) => {

    try {
        const allBanners = await Banner.find();
        res.status(200).json(allBanners);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllBanners };