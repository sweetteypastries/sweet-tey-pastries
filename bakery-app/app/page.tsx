import Header from "@/components/Header";
import Hero from "@/components/hero";
import SouthernDesserts from "@/components/SouthernDesserts";
import Cupcakes from "@/components/Cupcakes/Cupcakes";
import ChocolateCoveredStrawberries from "@/components/ChocolateCoveredStrawberries/ChocolateCoveredStrawberries";
import Cookies from "@/components/Cookies/Cookies";
import Macarons from "@/components/Macarons/Macarons";
import LoveMeTea from "@/components/LoveMeTea";
import Subscription from "@/components/subscription";
import OurStory from "@/components/OurStory";
import Reviews from "@/components/Reviews";
import Rewards from "@/components/Rewards";
import DeliveryInfo from "@/components/DeliveryInfo";
import Footer from "@/components/footer";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <main className="bg-[#fff8f8]">
      <Header />

      <section id="home" className="scroll-mt-28">
        <Hero />
      </section>

      <section id="about" className="scroll-mt-28">
        <OurStory />
      </section>

      <section id="desserts" className="scroll-mt-28">
        <SouthernDesserts />
      </section>

      <section id="cupcakes" className="scroll-mt-28">
        <Cupcakes />
      </section>

      <section id="strawberries" className="scroll-mt-28">
        <ChocolateCoveredStrawberries />
      </section>

      <section id="cookies" className="scroll-mt-28">
        <Cookies />
      </section>

      <section id="macarons" className="scroll-mt-28">
        <Macarons />
      </section>

      <section id="tea" className="scroll-mt-28">
        <LoveMeTea />
      </section>

      <section id="subscription" className="scroll-mt-28">
        <Subscription />
      </section>

      <Reviews />

      <section id="rewards" className="scroll-mt-28">
        <Rewards />
      </section>

      <Gallery />

      <section id="delivery" className="scroll-mt-28">
        <DeliveryInfo />
      </section>

      <Footer />
    </main>
  );
}