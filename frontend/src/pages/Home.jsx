import Navbar from "./Navbar"
import Hero from "./Hero"
import CodePreview from "./CodePreview"
import Stats from "./Stats"
import Features from "./Features"
import Comparison from "./Comparison";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA"
import Footer from "./Footer"
import Architecture from "./Architecture";
import FadeInSection from "../components/FadeInSection";

export default function Home() {
  return (
    <div className="App">

  {/* animated glow blobs */}
  <div className="blob blob1"></div>
  <div className="blob blob2"></div>

  <div className="glow-overlay"></div>

  {/* page content */}

  <Navbar />

  <FadeInSection>
  <Hero />
  </FadeInSection>
  <FadeInSection>
    <CodePreview />
  </FadeInSection>

  <FadeInSection>
    <Stats />
  </FadeInSection>

  <FadeInSection>
    <Features />
  </FadeInSection>

    <FadeInSection>
      <HowItWorks />
    </FadeInSection>

  <FadeInSection>
    <Comparison />
  </FadeInSection>

  <FadeInSection>
    <Architecture />
  </FadeInSection>

  <FadeInSection>
    <CTA />
  </FadeInSection>
  <Footer />

</div>
  )
}