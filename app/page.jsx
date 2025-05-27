import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1  flex items-center justify-center py-16 px-4">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Tamarind Feedback
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Thank you for choosing Tamarind. Your feedback is invaluable to us.
            We strive to provide the best experience, and your insights help us
            to improve. Share your unforgettable dhow experience or explore
            insights to enhance our service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback/dhow">
              <button className="btn-primary text-lg px-6 py-3">
                Dhow Feedback
              </button>
            </Link>
            <Link href="/feedback/restaurant">
              <button className="btn-primary text-lg px-6 py-3">
                Restaurant Feedback
              </button>
            </Link>
            <Link href="/feedback/village">
              <button className="btn-primary text-lg px-6 py-3">
                Village Feedback
              </button>
            </Link>
            {/* <Link href="/">
              <button className="btn-secondary text-lg px-6 py-3">
                Staff Dashboard
              </button>
            </Link> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inherit text-gray-600 py-4 text-center">
        <p>Tamarind Dhow Feedback System | Built by Dalienst</p>
      </footer>
    </div>
  );
}
