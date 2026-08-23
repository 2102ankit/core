import { Footer } from "@/components/footer";
import { GridBackdrop } from "@/components/grid-backdrop";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      "Full-Stack Developer specializing in MERN, Python and Spring Boot",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackdrop />
          <Navigation />
          <main className="min-h-screen relative z-10">{children}</main>
          <div className="relative z-10">
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
