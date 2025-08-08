import type { Metadata } from "next";
import { Container } from "@mui/material";
import { ToastWrapper } from "@/lib/toastify";
import QueryProvider from "@/lib/tanstack-query";
import { MUIProvider } from "@/lib/mui";

export const metadata: Metadata = {
  title: "Gansik",
  description: "Gansik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <MUIProvider>
            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                pt: 8,
              }}
            >
              {children}
            </Container>
            <ToastWrapper />
          </MUIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
