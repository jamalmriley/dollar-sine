import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request: any) {
  const docRef = doc(db, "users", "test@test.com");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return Response.json({ data: docSnap.data() });
  } else {
    // docSnap.data() will be undefined in this case
    return Response.json({ error: "User not found" });
  }
}
