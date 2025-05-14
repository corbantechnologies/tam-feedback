"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import React from "react";

export default function VillageFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("village");

  console.log(questions);

  return <div>VillageFeedback</div>;
}
