import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OtherPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="wrapper py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            Other Resources
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Access additional resources including notices, publications, and other important documents.
            </p>
            <div className="mt-8 space-y-4">
              <div className="p-4 border border-primary rounded-lg">
                <h2 className="text-xl font-bold text-primary mb-2">Notices</h2>
                <p className="text-gray-700 mb-3">
                  Stay informed with our latest notices and announcements.
                </p>
                <a href="/events/notices" className="text-secondary hover:underline font-medium">
                  View Notices →
                </a>
              </div>
              <div className="p-4 border border-primary rounded-lg">
                <h2 className="text-xl font-bold text-primary mb-2">Publications</h2>
                <p className="text-gray-700 mb-3">
                  Browse our publications, reports, and documentation.
                </p>
                <a href="/events/publications" className="text-secondary hover:underline font-medium">
                  View Publications →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
