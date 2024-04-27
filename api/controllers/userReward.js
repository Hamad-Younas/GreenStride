import UserReward from "../models/userReward.js";

export const Add = async (req, res) => {
    try {
        const { user, rewards } = req.body;

        // Find the UserReward document for the given user ID
        let userReward = await UserReward.findOne({ user });

        // If no UserReward document exists, create a new one
        if (!userReward) {
            userReward = new UserReward({
                user,
                rewards: []
            });
        }

        // Add each reward object to the rewards array
        userReward.rewards.push(rewards);

        // Save the updated UserReward document
        await userReward.save();

        res.status(201).json({ message: "User rewards added successfully" });
    } catch (error) {
        console.error("Error adding user rewards:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserRewards = async (req, res) => {
    try {
        const userId  = req.params.ID;

        console.log(userId)
        // Find UserReward document for the given user ID
        const userRewards = await UserReward.findOne({ user: userId })

        if (!userRewards) {
            return res.status(201).json({ userRewards:null });
        }

        res.status(200).json({ userRewards:userRewards });
    } catch (error) {
        console.error("Error fetching user rewards:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};