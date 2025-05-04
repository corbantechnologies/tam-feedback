"use client";

import FeedbackForm from "@/components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full card">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Tamarind Dhow Feedback
        </h1>
        <FeedbackForm />
      </div>
    </div>
  );
}
