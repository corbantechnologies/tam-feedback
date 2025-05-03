"use client";

import { apiActions } from "@/tools/api";

export const getQuestions = async () => {
  const response = await apiActions?.get("/api/v1/questions/");
  return response?.data?.results || [];
};

export const getQuestion = async (slug) => {
  const response = await apiActions?.get(`/api/v1/questions/${questionId}/`);
  return response?.data || {};
};

// authenticated
export const createQuestion = async (values, axios) => {
  await apiActions?.post("/api/v1/questions/", values, axios);
};

export const updateQuestion = async (slug, values, axios) => {
  await apiActions?.patch(`/api/v1/questions/${slug}/`, values, axios);
};

export const deleteQuestion = async (slug, axios) => {
  await apiActions?.delete(`/api/v1/questions/${slug}/`, axios);
};
