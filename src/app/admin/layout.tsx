import type { Metadata } from "next";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";

export const metadata: Metadata = {
  title: "Admin — Instituto Mundo de Dentro",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      {children}
      <Toaster richColors position="top-right" />
    </TRPCReactProvider>
  );
}
