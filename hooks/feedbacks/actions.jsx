"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";
import {
  getFeedbackByDate,
  getFeedbackByDateRange,
  getFeedbackByFormType,
  getFeedbackBySpecificFormType,
  getFeedbacks,
  getFeedbacksBySpecificRide,
} from "@/services/feedback";

export function useFetchFeedbacksByFormType() {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: () => getFeedbackByFormType(axios),
    enabled: !!axios,
  });
}

export function useFetchFeedbacksBySpecificFormType(formType) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks", formType],
    queryFn: () => getFeedbackBySpecificFormType(axios, formType),
    enabled: !!axios && !!formType,
  });
}

export function useFetchfeedbacksBySpecificRide(ride) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks", ride],
    queryFn: () => getFeedbacksBySpecificRide(axios, ride),
    enabled: !!axios && !!ride,
  });
}

export function useFetchFeedbackBySpecificDate(date) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks", date],
    queryFn: () => getFeedbackByDate(axios, date),
    enabled: !!axios && !!date,
  });
}

export function useFetchFeedbackByDateRange(startDate, endDate) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks", startDate, endDate],
    queryFn: () => getFeedbackByDateRange(axios, startDate, endDate),
    enabled: !!axios && !!startDate && !!endDate,
  });
}

export function useFetchFeedbacks(params = {}) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["feedbacks", params],
    queryFn: () => getFeedbacks(axios, params),
    enabled: !!axios,
  });
}
