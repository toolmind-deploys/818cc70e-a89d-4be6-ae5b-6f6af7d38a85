import { firestore } from "firebase-admin";
import { initFirebaseAdminSDK } from "@/config/firebase-admin-config";
import { NextRequest, NextResponse } from "next/server";

initFirebaseAdminSDK();
const fsdb = firestore();

export async function GET(request: NextRequest) {
  try {
    // Fetch all feeds from Firestore
    const snapshot = await fsdb.collection("feeds").get();
    const feeds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(feeds);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Create a new feed document in Firestore
    const newFeed = {
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await fsdb.collection("feeds").doc(newFeed.id).set(newFeed);

    return NextResponse.json({ id: newFeed.id, ...newFeed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
