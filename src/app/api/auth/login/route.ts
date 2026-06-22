import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Helper to verify passwords
function verifyPassword(password: string, salt: string, hash: string) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Read existing users
    let users = [];
    try {
      const fileData = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(fileData);
    } catch (err) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if user exists
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If user has no password (e.g. from dummy data before), reject them
    if (!user.salt || !user.hash) {
      return NextResponse.json({ error: "Invalid account configuration. Please sign up again." }, { status: 401 });
    }

    // Verify password
    const isValid = verifyPassword(password, user.salt, user.hash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Exclude sensitive data from response
    const { salt: _salt, hash: _hash, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}
