import { firestore } from "firebase-admin";
import { initFirebaseAdminSDK } from "@/config/firebase-admin-config";
import { NextRequest, NextResponse } from "next/server";

initFirebaseAdminSDK();
const fsdb = firestore();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const createdToday = searchParams.get("createdToday");

    let snapshot;

    if (createdToday === "true") {
      // Query customers whose createdAt is within today's date range
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      snapshot = await fsdb
        .collection("customers")
        .where("createdAt", ">=", start)
        .where("createdAt", "<=", end)
        .get();
    } else {
      // Otherwise get all customers
      snapshot = await fsdb.collection("customers").get();
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Create a new customer document, including a createdAt field
    const newDoc = {
      ...body,
      createdAt: new Date()
    };
    const docRef = await fsdb.collection("customers").add(newDoc);

    return NextResponse.json({ id: docRef.id, ...newDoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
