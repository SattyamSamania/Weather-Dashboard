import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema({
    city: { type: String, unique: true },
    data: Object,
    ts: Number, // timestamp when cached
});

export default mongoose.models.WeatherCache ||
    mongoose.model("WeatherCache", WeatherSchema);
