import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// 🔧 Example: Local upload (for testing)
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Save locally (for dev)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(process.cwd(), "public", file.name);
  await writeFile(filePath, buffer);

  const url = `/` + file.name; // publicly accessible from /public
  return NextResponse.json({ url });
}
