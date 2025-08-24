import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    cities: [String], // array of saved city names
});

export default mongoose.models.Preferences || mongoose.model("Preferences", PreferencesSchema);
