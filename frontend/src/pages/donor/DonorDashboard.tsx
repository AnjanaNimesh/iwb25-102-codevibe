

import { HeroSlider } from "./components/HeroSlider";
import { StatsSection } from "./components/StatsSection";
import { WhyDonateSection } from "./components/WhyDonateSection";
import { GetInvolvedSection } from "./components/GetInvolvedSection";
// import { CampaignsSection } from "./components/CampaignsSection";
import { ContactSection } from "./components/ContactSection";

const DonorDashboard = () => {
  return (
    <main className="flex flex-col w-full">
      {/* Hero / Welcome Section */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* Quick stats */}
      <section className="w-full py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <StatsSection />
        </div>
      </section>

      {/* Why donate */}
      <section className="w-full py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <WhyDonateSection />
        </div>
      </section>

      {/* Ways to get involved */}
      <section className="w-full py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <GetInvolvedSection />
        </div>
      </section>

      {/* Campaigns (optional) */}
      {/* <section className="w-full py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <CampaignsSection />
        </div>
      </section> */}

      {/* Contact */}
      <section className="w-full py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <ContactSection />
        </div>
      </section>
    </main>
  );
};

export default DonorDashboard;
