import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutOverviewPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            Information
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Nepal Bhumi Bank Limited is a leading land banking institution dedicated to promoting sustainable development across Nepal. 
              Our mission is to transform uneven terrains into thriving, eco-friendly communities.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We specialize in land acquisition, development, and distribution, working with government, trust (guthi), authority, 
              organizational, and private house lands for productive operations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through integrated land plans and sustainable practices, we aim to create a prosperous Nepal where land is a secure, 
              generational asset for all.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
