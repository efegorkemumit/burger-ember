import { Scene } from "@/components/scene/Scene";
import { ScrollController } from "@/components/scene/ScrollController";
import { QualityTypographyOverlay } from "@/components/scene/QualityTypographyOverlay";
import { Hero } from "@/components/sections/Hero";
import { Ingredients } from "@/components/sections/Ingredients";
import { FirePatty } from "@/components/sections/FirePatty";
import { Build } from "@/components/sections/Build";
import { QualityNumbers } from "@/components/sections/QualityNumbers";
import { FinalAssembly } from "@/components/sections/FinalAssembly";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <ScrollController />
      <Scene />
      <QualityTypographyOverlay />

      <main className="relative">
        <Hero />
        <Ingredients />
        <FirePatty />
        <Build />
        <QualityNumbers />
        <FinalAssembly />
        <Footer />
      </main>
    </>
  );
}
