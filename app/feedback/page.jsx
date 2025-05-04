"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import React from "react";

function FeedbackForm() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions();

  console.log(questions);

  return <div>FeedbackForm</div>;
}

export default FeedbackForm;
