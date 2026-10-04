import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your English Learn Together account settings, daily practice goals, and preferences.",
  alternates: {
    canonical: "/settings",
  },
  openGraph: {
    title: "Settings | English Learn Together",
    description:
      "Manage your account settings, daily goals, and preferences.",
    url: "/settings",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
