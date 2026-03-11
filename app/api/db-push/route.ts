import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync("npx prisma db push", { env: process.env }).toString();
    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stdout: error.stdout?.toString(), stderr: error.stderr?.toString() }, { status: 500 });
  }
}
