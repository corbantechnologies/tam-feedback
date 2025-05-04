"use client";
import { getQuestions } from "@/services/questions";
import { useQuery } from "@tanstack/react-query";

export function useFetchQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  });
}
