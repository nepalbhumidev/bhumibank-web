import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NoticesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            Notices
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Stay updated with our latest notices and important announcements from Nepal Bhumi Bank Limited.
            </p>
            <div className="mt-8">
              <p className="text-gray-600 italic">
                Notices will be displayed here. Check back soon for updates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
