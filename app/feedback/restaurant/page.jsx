"use client";
import { useState } from "react";
import { useFetchQuestions } from "@/hooks/questions/actions";
import { createFeedback } from "@/services/feedback";
import { toast } from "react-hot-toast";

export default function RestaurantFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("restaurant");
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    phone: "",
    responses: {},
  });
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
    guest_name: "",
    guest_email: "",
    phone: "",
    responses: {},
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResponseChange = (questionId, value) => {
    setFormData({
      ...formData,
      responses: { ...formData.responses, [questionId]: value },
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        form_type: "restaurant",
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        phone: formData.phone,
        responses: Object.entries(formData.responses).map(
          ([question, value]) => ({
            question,
            [questions.find((q) => q.identity === question).type.toLowerCase()]:
              value,
          })
        ),
      };
      await createFeedback(payload);
      setFormData(initialFormData);
      toast.success(`Feedback submitted!🚀`, {
        style: { color: "var(--success)" },
      });
      setSubmitting(false);
    } catch (error) {
      toast.error("Failed to submit feedback.", {
        style: { color: "var(--error)" },
      });
    }
  };

  if (isLoadingQuestions)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  if (questionsError)
    return (
      <div className="text-center text-[var(--foreground)]">
        Error: {questionsError.message}{" "}
        <button className="btn-secondary mt-2" onClick={refetchQuestions}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center p-6">
      <div className="max-w-2xl w-full p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          Restaurant Feedback
        </h2>
        <div className="space-y-4">
          <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Name
              </label>
              <input
                type="text"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-[var(--foreground)] mb-1">
                Email
              </label>
              <input
                type="email"
                name="guest_email"
                value={formData.guest_email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[var(--foreground)] mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {questions.map((question) => (
            <div key={question.identity} className="space-y-2">
              <label className="block font-semibold text-[var(--foreground)]">
                {question.text}
              </label>
              {question.type === "RATING" && (
                <div className="flex space-x-2">
                  {[...Array(question.max_rating + 1).keys()]
                    .slice(1)
                    .map((val) => (
                      <button
                        key={val}
                        onClick={() =>
                          handleResponseChange(question.identity, val)
                        }
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                          formData.responses[question.identity] === val
                            ? "bg-purple-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                </div>
              )}
              {question.type === "TEXT" && (
                <textarea
                  value={formData.responses[question.identity] || ""}
                  onChange={(e) =>
                    handleResponseChange(question.identity, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}
              {question.type === "YES_NO" && (
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={question.identity}
                      value="true"
                      checked={formData.responses[question.identity] === true}
                      onChange={() =>
                        handleResponseChange(question.identity, true)
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={question.identity}
                      value="false"
                      checked={formData.responses[question.identity] === false}
                      onChange={() =>
                        handleResponseChange(question.identity, false)
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary w-full py-2 rounded-lg text-white font-semibold hover:bg-purple-600 transition-colors"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
