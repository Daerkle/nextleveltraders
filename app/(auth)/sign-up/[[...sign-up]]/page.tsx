import { SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren | NextLevelTraders",
  description: "Erstellen Sie Ihren NextLevelTraders Account",
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Registrieren</h1>
          <p className="mt-2 text-muted-foreground">
            Erstellen Sie Ihren NextLevelTraders Account
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "bg-card shadow-md",
              headerTitle: "text-2xl font-semibold",
              headerSubtitle: "text-muted-foreground",
            },
          }}
          afterSignUpUrl="/dashboard"
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}