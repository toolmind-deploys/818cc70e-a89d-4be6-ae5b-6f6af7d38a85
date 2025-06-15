import { firestore } from "firebase-admin";
import { initFirebaseAdminSDK } from "@/config/firebase-admin-config";
import { NextRequest, NextResponse } from "next/server";

initFirebaseAdminSDK();
const fsdb = firestore();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limitNumber = limitParam ? parseInt(limitParam, 10) : 0;

    let query = fsdb.collection("customers");
    if (limitNumber > 0) {
      query = query.limit(limitNumber);
    }

    const snapshot = await query.get();
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
    // Create a new customer document
    const newDoc = {
      ...body,
      // You can store additional data fields as needed
      createdAt: new Date()
    };
    const docRef = await fsdb.collection("customers").add(newDoc);

    return NextResponse.json({ id: docRef.id, ...newDoc });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
