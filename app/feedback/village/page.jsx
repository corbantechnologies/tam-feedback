"use client";
import { useState } from "react";
import { useFetchQuestions } from "@/hooks/questions/actions";
import { createFeedback } from "@/services/feedback";

export default function VillageFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("village");
  const [formData, setFormData] = useState({
    apartment_no: "",
    arrival_date: "",
    duration_of_stay: "",
    responses: {},
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResponseChange = (questionId, value, parentQuestionId = null) => {
    setFormData({
      ...formData,
      responses: {
        ...formData.responses,
        [questionId]: { value, parentQuestionId },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const payload = {
        form_type: "village",
        apartment_no: formData.apartment_no,
        arrival_date: formData.arrival_date,
        duration_of_stay: parseInt(formData.duration_of_stay),
        responses: Object.entries(formData.responses).map(
          ([question, { value, parentQuestionId }]) => {
            const q =
              questions.find((q) => q.identity === question) ||
              questions
                .flatMap((q) => q.sub_questions)
                .find((q) => q.identity === question);
            return {
              question,
              [q.type.toLowerCase()]: value,
              parent_submission: parentQuestionId
                ? formData.responses[parentQuestionId]?.submissionRef || null
                : null,
            };
          }
        ),
      };
      const response = await createFeedback(payload);
      const updatedResponses = { ...formData.responses };
      response.village_responses.forEach((res) => {
        updatedResponses[res.question].submissionRef = res.reference;
      });
      setFormData({ ...formData, responses: updatedResponses });
      setSubmitStatus({
        type: "success",
        message: "Feedback submitted! Reference: " + response.reference,
      });
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Failed to submit feedback." });
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
        Village Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[var(--foreground)] mb-1">
            Apartment Number
          </label>
          <input
            type="text"
            name="apartment_no"
            value={formData.apartment_no}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[var(--foreground)] mb-1">
            Arrival Date
          </label>
          <input
            type="date"
            name="arrival_date"
            value={formData.arrival_date}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[var(--foreground)] mb-1">
            Duration of Stay (days)
          </label>
          <input
            type="number"
            name="duration_of_stay"
            value={formData.duration_of_stay}
            onChange={handleInputChange}
            required
            min="1"
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
                value={formData.responses[question.identity]?.value || ""}
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
                value={formData.responses[question.identity]?.value || ""}
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
                    checked={
                      formData.responses[question.identity]?.value === true
                    }
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
                    checked={
                      formData.responses[question.identity]?.value === false
                    }
                    onChange={() =>
                      handleResponseChange(question.identity, false)
                    }
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            )}
            {question.sub_questions?.length > 0 && (
              <div className="ml-4 border-l-2 border-[var(--accent)] pl-4 space-y-2">
                {question.sub_questions.map((sub) => (
                  <div key={sub.identity}>
                    <label className="block text-[var(--foreground)]">
                      {sub.text}
                    </label>
                    <select
                      value={formData.responses[sub.identity]?.value || ""}
                      onChange={(e) =>
                        handleResponseChange(
                          sub.identity,
                          parseInt(e.target.value),
                          question.identity
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select</option>
                      {[...Array(sub.max_rating + 1).keys()]
                        .slice(1)
                        .map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {submitStatus && (
          <div
            className={`text-${
              submitStatus.type === "error"
                ? "[var(--error)]"
                : "[var(--success)]"
            } mb-4`}
          >
            {submitStatus.message}
          </div>
        )}
        <button type="submit" className="btn-primary w-full py-2">
          Submit
        </button>
      </form>
    </div>
  );
}
