import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden | NextLevelTraders",
  description: "Melden Sie sich bei NextLevelTraders an",
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Anmelden</h1>
          <p className="mt-2 text-muted-foreground">
            Willkommen zurück bei NextLevelTraders
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "bg-card shadow-md",
              headerTitle: "text-2xl font-semibold",
              headerSubtitle: "text-muted-foreground",
            },
          }}
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}