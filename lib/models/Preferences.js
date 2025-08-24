import mongoose from "mongoose";

const UserPreferencesSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // can be user email, auth id, or just "guest"
    favorites: { type: [String], default: [] },
});

export default mongoose.models.UserPreferences ||
    mongoose.model("UserPreferences", UserPreferencesSchema);
