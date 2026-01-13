import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WhatWeDoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            What We Do
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Nepal Bhumi Bank Limited extensively links fallow lands across Nepal to productive uses. We lease and utilize various 
              types of lands for operations including government, trust (guthi), authority, organizational, and private house lands.
            </p>
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">Sustainable Land Development</h2>
                <p className="text-gray-700 leading-relaxed">
                  We develop modern, amenity-rich settlements across Nepal while conserving the environment and natural resources, 
                  selling or renting them for public benefit.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">Property Acquisition and Enhancement</h2>
                <p className="text-gray-700 leading-relaxed">
                  Through integrated land plans, we handle purchase/sale of properties, housing, apartments, homes, malls, and towers 
                  with construction services.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">Investment Partnerships</h2>
                <p className="text-gray-700 leading-relaxed">
                  We offer flexible investments and transparent deals tailored to our clients, supporting sustainable development 
                  through private sector involvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
