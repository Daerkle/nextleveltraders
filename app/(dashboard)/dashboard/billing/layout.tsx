import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnement & Rechnung - NextLevelTraders",
  description: "Verwalten Sie Ihr NextLevelTraders Abonnement und sehen Sie Ihre Rechnungen ein.",
};

interface BillingLayoutProps {
  children: React.ReactNode;
}

export default function BillingLayout({ children }: BillingLayoutProps) {
  return (
    <div className="container my-10">
      {children}
    </div>
  );
}