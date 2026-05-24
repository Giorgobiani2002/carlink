import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Carlink Auto Import | ავტომობილების იმპორტი",
  description:
    "ავტომობილების იმპორტი ამერიკიდან, კანადიდან და ჩინეთიდან. Copart, IAAI, ლოგისტიკა, კალკულატორი და სრული მხარდაჭერა.",
  keywords: [
    "ავტომობილების იმპორტი",
    "მანქანის ჩამოყვანა",
    "Copart Georgia",
    "IAAI Georgia",
    "USA auto import",
    "Carlink",
  ],
  icons: {
    icon: [{ url: "/logocarlink.webp", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
