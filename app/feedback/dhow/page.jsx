"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import React from "react";

export default function DhowFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("dhow");

  console.table(questions);

  return <div>DhowFeedback</div>;
}
