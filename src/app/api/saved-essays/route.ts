import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SavedEssay } from "@/types/ielts";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "saved_essays.json");

async function ensureDataFile(): Promise<SavedEssay[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
      return [];
    }
    console.error("Error reading saved_essays.json:", err);
    return [];
  }
}

async function writeDataFile(essays: SavedEssay[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(essays, null, 2), "utf-8");
}

export async function GET() {
  try {
    const essays = await ensureDataFile();
    // Return newest first
    essays.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ essays });
  } catch (err: any) {
    console.error("GET /api/saved-essays error:", err);
    return NextResponse.json({ error: "Failed to load saved essays", essays: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      taskType,
      prompt,
      essayText,
      wordCount,
      overallBand,
      criteriaScores,
      examinerSummary,
    } = body;

    if (!essayText || !prompt) {
      return NextResponse.json(
        { error: "Essay text and prompt are required" },
        { status: 400 }
      );
    }

    const essays = await ensureDataFile();
    const existingIndex = id ? essays.findIndex((e) => e.id === id) : -1;

    const essayId = id || `essay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const savedRecord: SavedEssay = {
      id: essayId,
      title: title || (taskType === "task2" ? "Task 2 Essay" : "Task 1 Report"),
      taskType: taskType || "task2",
      prompt,
      essayText,
      wordCount: typeof wordCount === "number" ? wordCount : essayText.trim().split(/\s+/).filter(Boolean).length,
      overallBand: typeof overallBand === "number" ? overallBand : null,
      criteriaScores: criteriaScores || undefined,
      examinerSummary: examinerSummary || undefined,
      createdAt: existingIndex >= 0 ? essays[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      essays[existingIndex] = savedRecord;
    } else {
      essays.unshift(savedRecord);
    }

    await writeDataFile(essays);

    essays.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ success: true, essay: savedRecord, essays });
  } catch (err: any) {
    console.error("POST /api/saved-essays error:", err);
    return NextResponse.json({ error: "Failed to save essay" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // No body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Essay ID required" }, { status: 400 });
    }

    const essays = await ensureDataFile();
    const filtered = essays.filter((e) => e.id !== id);

    await writeDataFile(filtered);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ success: true, essays: filtered });
  } catch (err: any) {
    console.error("DELETE /api/saved-essays error:", err);
    return NextResponse.json({ error: "Failed to delete essay" }, { status: 500 });
  }
}
