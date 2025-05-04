"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import { createFeedback } from "@/services/feedback";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";

export default function FeedbackForm() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions();

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

  // Initial form values
  const initialValues = {
    ride_type: "Evening",
    guest_name: "",
    guest_email: "",
    responses: sortedQuestions.map((q) => ({
      question_reference: q.identity,
      rating: q.type === "RATING" ? null : undefined,
      text: q.type === "TEXT" ? "" : undefined,
    })),
  };

  // Validation schema
  const validationSchema = Yup.object({
    ride_type: Yup.string()
      .required("Ride type is required")
      .oneOf(["Afternoon", "Evening"]),
    guest_name: Yup.string().max(100, "Name is too long"),
    guest_email: Yup.string()
      .email("Invalid email")
      .max(100, "Email is too long"),
    responses: Yup.array().of(
      Yup.object().shape({
        question_reference: Yup.string().required(),
        rating: Yup.number()
          .nullable()
          .when("question_reference", {
            is: (ref) =>
              sortedQuestions.find((q) => q.identity === ref)?.type ===
              "RATING",
            then: (schema) =>
              sortedQuestions.find((q) => q.identity === ref)?.is_required
                ? schema.required("Rating is required").min(1).max(5)
                : schema.min(1).max(5),
          }),
        text: Yup.string().when("question_reference", {
          is: (ref) =>
            sortedQuestions.find((q) => q.identity === ref)?.type === "TEXT",
          then: (schema) =>
            sortedQuestions.find((q) => q.identity === ref)?.is_required
              ? schema.required("Comment is required")
              : schema,
        }),
      })
    ),
  });

  // Handle form submission
  const handleSubmit = async (
    values,
    { setSubmitting, setStatus, resetForm }
  ) => {
    try {
      await createFeedback(values);
      setStatus({ success: "Feedback submitted successfully!" });
      resetForm();
    } catch (error) {
      setStatus({
        error: error.response?.data?.detail || "Failed to submit feedback",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ status, isSubmitting }) => (
        <Form className="space-y-4">
          {/* Ride Type */}
          <div>
            <label htmlFor="ride_type" className="block text-sm font-medium">
              Ride Type
            </label>
            <Field
              as="select"
              name="ride_type"
              className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
            >
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </Field>
            <ErrorMessage
              name="ride_type"
              component="p"
              className="text-[var(--error)] text-sm mt-1"
            />
          </div>

          {/* Guest Name */}
          <div>
            <label htmlFor="guest_name" className="block text-sm font-medium">
              Name (Optional)
            </label>
            <Field
              type="text"
              name="guest_name"
              className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
            />
            <ErrorMessage
              name="guest_name"
              component="p"
              className="text-[var(--error)] text-sm mt-1"
            />
          </div>

          {/* Guest Email */}
          <div>
            <label htmlFor="guest_email" className="block text-sm font-medium">
              Email (Optional)
            </label>
            <Field
              type="email"
              name="guest_email"
              className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
            />
            <ErrorMessage
              name="guest_email"
              component="p"
              className="text-[var(--error)] text-sm mt-1"
            />
          </div>

          {/* Questions */}
          {sortedQuestions.map((question, index) => (
            <div key={question.identity}>
              <label className="block text-sm font-medium">
                {question.text}
              </label>
              {question.type === "RATING" ? (
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <Field
                        type="radio"
                        name={`responses[${index}].rating`}
                        value={rating.toString()}
                        className="mr-1"
                      />
                      {rating}
                    </label>
                  ))}
                </div>
              ) : (
                <Field
                  as="textarea"
                  name={`responses[${index}].text`}
                  className="mt-1 p-2 w-full border border-[var(--neutral)] rounded"
                  rows="4"
                />
              )}
              <ErrorMessage
                name={`responses[${index}].${
                  question.type === "RATING" ? "rating" : "text"
                }`}
                component="p"
                className="text-[var(--error)] text-sm mt-1"
              />
            </div>
          ))}

          {/* Status Messages */}
          {status?.success && (
            <p className="text-[var(--success)] text-center">
              {status.success}
            </p>
          )}
          {status?.error && (
            <p className="text-[var(--error)] text-center">{status.error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:bg-[color-mix(in_srgb,var(--primary),#fff_50%)]"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
