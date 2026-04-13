import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Instituto Mundo de Dentro | Neuropsicologia e Psicologia Infantil em Teresina",
  description:
    "Instituto Mundo de Dentro: Avaliação neuropsicológica, neurofeedback, psicologia infantil e orientação parental em Teresina, Piauí. Cuidando do mundo interno de cada pessoa com ciência e acolhimento.",
  keywords:
    "neuropsicologia, psicologia infantil, neurofeedback, avaliação neuropsicológica, TDAH, dislexia, Teresina, Piauí",
  icons: {
    icon: "/assets/logo_mundo_de_dentro.svg",
  },
  openGraph: {
    title:
      "Instituto Mundo de Dentro | Neuropsicologia e Psicologia Infantil em Teresina",
    type: "website",
    description:
      "Instituto Mundo de Dentro: Avaliação neuropsicológica, neurofeedback, psicologia infantil e orientação parental em Teresina, Piauí. Cuidando do mundo interno de cada pessoa com ciência e acolhimento.",
    images: [
      {
        url: "/assets/logo_mundo_de_dentro.svg",
        width: 1200,
        height: 630,
        alt: "Instituto Mundo de Dentro",
      },
    ],
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
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
