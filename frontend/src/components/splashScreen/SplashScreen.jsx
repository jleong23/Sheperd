import SplashHeader from "./SplashHeader.jsx";
import SplashHero from "./SplashHero.jsx";
import FeatureCards from "./FeatureCard.jsx";

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SplashHeader />

      <main className="mx-auto max-w-6xl px-6">
        <SplashHero />
        <FeatureCards />
      </main>
    </div>
  );
}
