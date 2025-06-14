import { firestore } from "firebase-admin";
import { initFirebaseAdminSDK } from "@/config/firebase-admin-config";
import { NextRequest, NextResponse } from "next/server";

initFirebaseAdminSDK();
const fsdb = firestore();

export async function GET(request: NextRequest) {
  try {
    // Get all documents from the 'feeds' collection
    const snapshot = await fsdb.collection("feeds").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(data);
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

    // Construct a new feed object. We rely on the body fields to match our "feeds" schema.
    // Use existing id if provided, else auto-generate a new doc ID.
    const newFeedId = body.id || undefined;
    const timestamp = Date.now();

    const newFeed = {
      // Required fields from the feed schema. Adjust as needed.
      uid: body.uid || "",
      title: body.title || "",
      views: body.views || [],
      pinned: body.pinned || false,
      status: body.status || "PUBLISHED",
      company: body.company || "",
      jobType: body.jobType || "",
      feedType: body.feedType || "",
      community: body.community || "",
      createdAt: body.createdAt || timestamp,
      reactions: body.reactions || {},
      updatedAt: body.updatedAt || timestamp,
      employType: body.employType || "",
      description: body.description || "",
      inappropriate: body.inappropriate || false,
      problemToImages: body.problemToImages || {},
      // If you have extra fields, spread them
      ...body
    };

    if (newFeedId) {
      // Set doc using a provided ID
      await fsdb.collection("feeds").doc(newFeedId).set(newFeed);
      return NextResponse.json({ id: newFeedId, ...newFeed });
    } else {
      // Otherwise let Firestore auto-generate the doc ID
      const docRef = await fsdb.collection("feeds").add(newFeed);
      return NextResponse.json({ id: docRef.id, ...newFeed });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
