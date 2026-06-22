import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Helper to hash passwords
function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, avatar } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Ensure data directory exists (ignore read-only errors on Vercel)
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {}

    // Read existing users or create empty list
    let users = [];
    try {
      const fileData = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(fileData);
    } catch (err) {
      // File doesn't exist, start with empty list
    }

    // Check if user already exists
    let user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const { salt, hash } = hashPassword(password);

    user = {
      email,
      name: name || email.split("@")[0],
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
      salt,
      hash
    };
    
    users.push(user);
    
    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (e) {}

    // Exclude sensitive data from response
    const { salt: _salt, hash: _hash, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Failed to sign up" }, { status: 500 });
  }
}
