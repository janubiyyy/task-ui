import ToasterProvider from "@/components/ToasterProvider";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Task Manager",
  description: "Frontend assessment for COREnglish",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <ToasterProvider />
        <Providers>
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
