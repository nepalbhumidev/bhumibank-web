import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            Our Team
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Meet the dedicated professionals behind Nepal Bhumi Bank Limited who are working to transform land resources 
              across Nepal into sustainable communities.
            </p>
            <div className="mt-8">
              <p className="text-gray-600 italic">
                Team member information will be displayed here. Check back soon for updates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
