import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function ExternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
