"use client";
import { useState } from "react";
import { useFetchQuestions } from "@/hooks/questions/actions";
import { createFeedback } from "@/services/feedback";
import { toast } from "react-hot-toast";

export default function DhowFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("dhow");
  const [formData, setFormData] = useState({
    ride_type: "",
    guest_name: "",
    guest_email: "",
    phone: "",
    responses: {},
  });

  const initialFormData = {
    ride_type: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        form_type: "dhow",
        ride_type: formData.ride_type,
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
      const response = await createFeedback(payload);
      setFormData(initialFormData);
      toast.success(`Feedback submitted!🚀`, {
        style: { color: "var(--success)" },
      });
    } catch (error) {
      toast.error("Failed to submit feedback.", {
        style: { color: "var(--error)" },
      });
    }
  };

  if (isLoadingQuestions)
    return (
      <div className="text-center text-[var(--foreground)]">
        Loading questions...
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
    <div className="max-w-lg mx-auto p-6 bg-[var(--background)]">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
        Dhow Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[var(--foreground)] mb-1">
            Ride Type
          </label>
          <select
            name="ride_type"
            value={formData.ride_type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
        <div>
          <label className="block text-[var(--foreground)] mb-1">Name</label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[var(--foreground)] mb-1">Email</label>
          <input
            type="email"
            name="guest_email"
            value={formData.guest_email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[var(--foreground)] mb-1">Phone</label>
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
            <label className="block text-[var(--foreground)]">
              {question.text}
            </label>
            {question.type === "RATING" && (
              <select
                value={formData.responses[question.identity] || ""}
                onChange={(e) =>
                  handleResponseChange(
                    question.identity,
                    parseInt(e.target.value)
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                {[...Array(question.max_rating + 1).keys()]
                  .slice(1)
                  .map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
              </select>
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
        <button type="submit" className="btn-primary w-full py-2">
          Submit
        </button>
      </form>
    </div>
  );
}
