import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            Gallery
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Explore our photo gallery showcasing our projects, developments, and company activities.
            </p>
            <div className="mt-8">
              <p className="text-gray-600 italic">
                Gallery images will be displayed here. Check back soon for updates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
