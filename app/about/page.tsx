import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            About Us
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Nepal Bhumi Bank Limited. We are committed to transforming land resources across Nepal into thriving, sustainable communities.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Learn more about our company, our mission, and what we do by exploring the sections below.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
