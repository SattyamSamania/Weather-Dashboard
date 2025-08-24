import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserPreferences from "@/lib/models/Preferences";

const USER_ID = "guest";

export async function GET() {
    await connectDB();
    let prefs = await UserPreferences.findOne({ userId: USER_ID });

    if (!prefs) {
        prefs = await UserPreferences.create({ userId: USER_ID, favorites: [] });
    }

    return NextResponse.json(prefs);
}

export async function POST(req) {
    await connectDB();
    const { city } = await req.json();

    if (!city) {
        return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    const prefs = await UserPreferences.findOneAndUpdate(
        { userId: USER_ID },
        { $addToSet: { favorites: city.toLowerCase() } }, // prevents duplicates
        { upsert: true, new: true }
    );

    return NextResponse.json(prefs);
}

export async function DELETE(req) {
    await connectDB();
    const { city } = await req.json();

    if (!city) {
        return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    const prefs = await UserPreferences.findOneAndUpdate(
        { userId: USER_ID },
        { $pull: { favorites: city.toLowerCase() } },
        { new: true }
    );

    return NextResponse.json(prefs);
}
