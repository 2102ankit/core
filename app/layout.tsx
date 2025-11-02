import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ankit Mishra - Software Engineer",
  description:
    "Full-Stack Developer (MERN, Python, Spring Boot) with a passion for DevOps and ML. Building innovative, high-impact software from concept to delivery.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "MERN",
    "React",
    "Node.js",
    "Python",
    "Spring Boot",
  ],
  authors: [{ name: "Ankit Mishra" }],
  openGraph: {
    title: "Ankit Mishra",
    siteName: "Ankit Mishra's Personal Website",
    description:
      "Full-Stack Developer specializing in MERN, Python, and Spring Boot",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} spotlight-glow`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
