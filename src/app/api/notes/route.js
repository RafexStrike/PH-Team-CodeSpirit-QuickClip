// src/app/api/notes/route.js

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const database = client.db("Notes");
  const savedNotes = await database
    .collection("savedNotesCollection")
    .find({})
    .toArray();

  return NextResponse.json(savedNotes);
}

export async function POST(request) {
  const client = await clientPromise;
  const database = client.db("Notes");
  const body = await request.json();

  await database.collection("savedNotesCollection").insertOne(body);

  return NextResponse.json(
    { message: "Note added to mongodb successfully." },
    { status: 201 }
  );
}
