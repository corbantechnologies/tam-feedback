"use client";
import { getQuestions } from "@/services/questions";
import { useQuery } from "@tanstack/react-query";

export function useFetchQuestions(formtype) {
  return useQuery({
    queryKey: ["questions", formtype],
    queryFn: () => getQuestions(formtype),
    enabled: !!formtype,
    retry: 1,
  });
}
