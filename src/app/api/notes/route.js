// src/app/api/notes/route.js
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "notes.json");

function readData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

// GET -> list all notes
export async function GET() {
  try {
    const notes = readData();
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to read notes" }), { status: 500 });
  }
}

// POST -> create a new note
export async function POST(req) {
  try {
    const body = await req.json();
    const notes = readData();
    notes.unshift(body); // add to front
    writeData(notes);
    return new Response(JSON.stringify(body), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create note" }), { status: 500 });
  }
}

// PUT -> update note (expects body with id)
export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    }
    const notes = readData();
    const idx = notes.findIndex((n) => n.id === body.id);
    if (idx === -1) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    notes[idx] = { ...notes[idx], ...body, dateUpdated: new Date().toISOString() };
    writeData(notes);
    return new Response(JSON.stringify(notes[idx]), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update note" }), { status: 500 });
  }
}

// DELETE -> delete note (expects JSON { id })
export async function DELETE(req) {
  try {
    const body = await req.json();
    if (!body?.id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    const notes = readData();
    const filtered = notes.filter((n) => n.id !== body.id);
    writeData(filtered);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete note" }), { status: 500 });
  }
}
