"use client";
import { useFetchQuestions } from "@/hooks/questions/actions";
import React from "react";

export default function RestaurantFeedback() {
  const {
    isLoading: isLoadingQuestions,
    data: questions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useFetchQuestions("restaurant");

  console.table(questions);

  return <div>RestaurantFeedback</div>;
}
