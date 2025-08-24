import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "../../../models/User";

const MONGO_URI = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
    mongoose.connect(MONGO_URI);
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    return NextResponse.json(user?.preferences || []);
}

export async function POST(req) {
    const body = await req.json();
    const { email, city } = body;
    if (!email || !city) return NextResponse.json({ error: "Email and city required" }, { status: 400 });

    let user = await User.findOne({ email });
    if (!user) user = new User({ email, preferences: [city] });
    else if (!user.preferences.includes(city)) user.preferences.push(city);

    await user.save();
    return NextResponse.json(user.preferences);
}
