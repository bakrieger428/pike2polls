import { HeroSection, StatisticsSection, TimelineSection, CasesSection, FindingsSection } from '@/components/rides-to-polls';
import { MapSection } from '@/components/rides-to-polls/sections/MapSection';
import { SimulatorSection } from '@/components/rides-to-polls/sections/SimulatorSection';

export default function RidesToThePollsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <section id="statistics" className="scroll-mt-20">
        <StatisticsSection />
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="scroll-mt-20">
        <TimelineSection />
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="scroll-mt-20">
        <MapSection />
      </section>

      {/* Election Simulator Section */}
      <section id="simulator" className="scroll-mt-20">
        <SimulatorSection />
      </section>

      {/* Case Studies Section */}
      <section id="cases" className="scroll-mt-20">
        <CasesSection />
      </section>

      {/* Key Findings Section */}
      <section id="findings" className="scroll-mt-20">
        <FindingsSection />
      </section>
    </main>
  );
}
