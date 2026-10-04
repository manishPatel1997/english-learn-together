import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "System administration panel for English Learn Together.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
