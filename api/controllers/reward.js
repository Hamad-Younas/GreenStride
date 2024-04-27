import Reward from "../models/reward.js";

export const getAll = async (req, res) => {
    try {
        const coupons = await Reward.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};