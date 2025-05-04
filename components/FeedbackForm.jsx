"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import { createFeedback } from "@/services/feedback";
import React, { useState } from "react";

export default function FeedbackForm() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions();

  // Form state
  const [formData, setFormData] = useState({
    ride_type: "Evening",
    guest_name: "",
    guest_email: "",
    responses: [],
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoadingQuestions)
    return <p className="text-center">Loading questions...</p>;
  if (questionsError)
    return (
      <p className="text-[var(--error)] text-center">
        Error: {questionsError.message}
      </p>
    );

  // Sort questions: RATING first, then TEXT
  const sortedQuestions = questions
    ? [...questions].sort((a, b) => {
        if (a.type === "RATING" && b.type === "TEXT") return -1;
        if (a.type === "TEXT" && b.type === "RATING") return 1;
        return 0;
      })
    : [];

  // Initialize responses if not set
  if (formData.responses.length !== sortedQuestions.length) {
    setFormData({
      ...formData,
      responses: sortedQuestions.map((q) => ({
        question_reference: q.identity,
        rating: q.type === "RATING" ? null : undefined,
        text: q.type === "TEXT" ? "" : undefined,
      })),
    });
  }

  // Handle input changes
  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      // Update response array
      const updatedResponses = [...formData.responses];
      updatedResponses[index] = {
        ...updatedResponses[index],
        [field]: field === "rating" ? parseInt(value) : value,
      };
      setFormData({ ...formData, responses: updatedResponses });
    } else {
      // Update top-level fields
      setFormData({ ...formData, [name]: value });
    }
    // Clear errors for changed field
    setErrors({ ...errors, [name || `responses[${index}].${field}`]: "" });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.ride_type) newErrors.ride_type = "Ride type is required";
    else if (!["Afternoon", "Evening"].includes(formData.ride_type))
      newErrors.ride_type = "Invalid ride type";

    if (formData.guest_name && formData.guest_name.length > 100)
      newErrors.guest_name = "Name is too long";

    if (formData.guest_email) {
      if (formData.guest_email.length > 100)
        newErrors.guest_email = "Email is too long";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guest_email))
        newErrors.guest_email = "Invalid email";
    }

    formData.responses.forEach((response, index) => {
      const question = sortedQuestions.find(
        (q) => q.identity === response.question_reference
      );
      if (
        question.type === "RATING" &&
        question.is_required &&
        !response.rating
      )
        newErrors[`responses[${index}].rating`] = "Rating is required";
      else if (response.rating && (response.rating < 1 || response.rating > 5))
        newErrors[`responses[${index}].rating`] =
          "Rating must be between 1 and 5";

      if (question.type === "TEXT" && question.is_required && !response.text)
        newErrors[`responses[${index}].text`] = "Comment is required";
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createFeedback(formData);
      setStatus({ success: "Feedback submitted successfully!" });
      setFormData({
        ride_type: "Evening",
        guest_name: "",
        guest_email: "",
        responses: sortedQuestions.map((q) => ({
          question_reference: q.identity,
          rating: q.type === "RATING" ? null : undefined,
          text: q.type === "TEXT" ? "" : undefined,
        })),
      });
      setErrors({});
    } catch (error) {
      setStatus({
        error: error.response?.data?.detail || "Failed to submit feedback",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ride Type */}
      <div>
        <label htmlFor="ride_type" className="block text-sm font-medium">
          Ride Type
        </label>
        <select
          name="ride_type"
          value={formData.ride_type}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
        >
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        {errors.ride_type && (
          <p className="text-[var(--error)] text-sm mt-1">{errors.ride_type}</p>
        )}
      </div>

      {/* Guest Name */}
      <div>
        <label htmlFor="guest_name" className="block text-sm font-medium">
          Name (Optional)
        </label>
        <input
          type="text"
          name="guest_name"
          value={formData.guest_name}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
        />
        {errors.guest_name && (
          <p className="text-[var(--error)] text-sm mt-1">
            {errors.guest_name}
          </p>
        )}
      </div>

      {/* Guest Email */}
      <div>
        <label htmlFor="guest_email" className="block text-sm font-medium">
          Email (Optional)
        </label>
        <input
          type="email"
          name="guest_email"
          value={formData.guest_email}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
        />
        {errors.guest_email && (
          <p className="text-[var(--error)] text-sm mt-1">
            {errors.guest_email}
          </p>
        )}
      </div>

      {/* Questions */}
      {sortedQuestions.map((question, index) => (
        <div key={question.identity}>
          <label className="block text-sm font-medium">{question.text}</label>
          {question.type === "RATING" ? (
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex items-center">
                  <input
                    type="radio"
                    name={`responses[${index}].rating`}
                    value={rating}
                    checked={formData.responses[index]?.rating === rating}
                    onChange={(e) => handleChange(e, index, "rating")}
                    className="mr-1"
                  />
                  {rating}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              name={`responses[${index}].text`}
              value={formData.responses[index]?.text || ""}
              onChange={(e) => handleChange(e, index, "text")}
              className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
              rows="4"
            />
          )}
          {errors[
            `responses[${index}].${
              question.type === "RATING" ? "rating" : "text"
            }`
          ] && (
            <p className="text-[var(--error)] text-sm mt-1">
              {
                errors[
                  `responses[${index}].${
                    question.type === "RATING" ? "rating" : "text"
                  }`
                ]
              }
            </p>
          )}
        </div>
      ))}

      {/* Status Messages */}
      {status?.success && (
        <p className="text-[var(--success)] text-center">{status.success}</p>
      )}
      {status?.error && (
        <p className="text-[var(--error)] text-center">{status.error}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary text-lg px-6 py-3 w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
