"use client"

import { Button } from "@/components/ui/button"

export default function Header() {
    return (
        <header className="w-full border-b bg-background/70 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold tracking-wide">
                    🌦 Weather Dashboard
                </h1>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost">Home</Button>
                    <Button variant="ghost">About</Button>
                    <Button variant="ghost">Settings</Button>
                </nav>
            </div>
        </header>
    )
}
