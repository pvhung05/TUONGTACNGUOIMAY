import { SignTranslatorDemo } from "@/components/sign-translator-demo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: "70px" }}>
        <SignTranslatorDemo />
      </main>
      <Footer />
    </>
  );
}
