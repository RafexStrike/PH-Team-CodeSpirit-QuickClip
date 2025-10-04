import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const client = await clientPromise;
  const database = client.db("Notes");
  const notesCollection = database.collection("savedNotesCollection")
  const notes = database.collection("savedNotes")
  const body = await request.json();

  const collectionID = body.id;
}
