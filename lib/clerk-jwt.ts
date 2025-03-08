import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs";

// Erstellt einen JWT für Supabase
export async function createSupabaseJWT() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return null;
    }
    
    // Erstelle einen Clerk-Client
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    // Erstelle einen JWT für Supabase
    const token = await clerk.users.createJWT({
      userId,
      template: "supabase",
    });
    
    return token;
  } catch (error) {
    console.error("Fehler beim Erstellen des Supabase JWT:", error);
    return null;
  }
}
