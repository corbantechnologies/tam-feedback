"use client";

import { useFetchAllFeedbacks } from "@/hooks/feedbacks/actions";
import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const {
    isLoading: isLoadingFeedbacks,
    data: allFeedbacks = [],
    refetch: refetchFeedbacks,
  } = useFetchAllFeedbacks();

  const [formType, setFormType] = useState("");
  const [rideType, setRideType] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupByFormType, setGroupByFormType] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Filter feedbacks based on user input
  const filteredFeedbacks = allFeedbacks.filter((feedback) => {
    const createdAt = new Date(feedback.created_at);
    const matchesFormType = formType ? feedback.form_type === formType : true;
    const matchesRideType = rideType ? feedback.ride_type === rideType : true;
    const matchesDate = date
      ? createdAt.toISOString().split("T")[0] === date
      : true;
    const matchesDateRange =
      startDate && endDate
        ? createdAt >= new Date(startDate) && createdAt <= new Date(endDate)
        : true;
    return (
      matchesFormType && matchesRideType && matchesDate && matchesDateRange
    );
  });

  // Group feedbacks if group_by_form_type is true
  const groupedFeedbacks = groupByFormType
    ? filteredFeedbacks.reduce((acc, feedback) => {
        acc[feedback.form_type] = acc[feedback.form_type] || [];
        acc[feedback.form_type].push(feedback);
        return acc;
      }, {})
    : { all: filteredFeedbacks };

  // Flatten grouped feedbacks for display
  const feedbacksToDisplay = groupByFormType
    ? Object.values(groupedFeedbacks).flat()
    : groupedFeedbacks.all;

  const totalPages = Math.ceil(feedbacksToDisplay.length / 10);
  const paginatedFeedbacks = feedbacksToDisplay.slice(
    (page - 1) * 10,
    page * 10
  );

  const handleFilterChange = (setter) => (e) => setter(e.target.value);
  const toggleGroupBy = () => setGroupByFormType(!groupByFormType);
  const openModal = (feedback) => setSelectedFeedback(feedback);
  const closeModal = () => setSelectedFeedback(null);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          Admin Dashboard
        </h1>
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Form Type
              </label>
              <select
                value={formType}
                onChange={handleFilterChange(setFormType)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Form Types</option>
                <option value="dhow">Dhow</option>
                <option value="village">Village</option>
                <option value="restaurant">Restaurant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ride Type
              </label>
              <select
                value={rideType}
                onChange={handleFilterChange(setRideType)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ride Types</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Single Date
              </label>
              <input
                type="date"
                value={date}
                onChange={handleFilterChange(setDate)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleFilterChange(setStartDate)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleFilterChange(setEndDate)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={groupByFormType}
                  onChange={toggleGroupBy}
                  className="mr-2 h-5 w-5 text-blue-500"
                />
                Group by Form Type
              </label>
            </div>
          </div>
        </div>
        {isLoadingFeedbacks ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : feedbacksToDisplay.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No feedback available.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-left text-gray-700">
                    <th className="p-3 font-semibold">Form Type</th>
                    <th className="p-3 font-semibold">Guest Name</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Reference</th>
                    <th className="p-3 font-semibold">Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback, index) => (
                    <tr
                      key={feedback.reference}
                      className={`border-t hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-3">{feedback.form_type}</td>
                      <td className="p-3">{feedback.guest_name}</td>
                      <td className="p-3">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">{feedback.reference}</td>
                      <td className="p-3">
                        <button
                          onClick={() => openModal(feedback)}
                          className="text-blue-600 hover:underline"
                        >
                          View Responses
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Responses</h2>
            <div className="mt-2 p-3 bg-gray-100 rounded-lg">
              {[
                ...(selectedFeedback.village_responses || []),
                ...(selectedFeedback.dhow_responses || []),
                ...(selectedFeedback.restaurant_responses || []),
              ].length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {[
                    ...(selectedFeedback.village_responses || []),
                    ...(selectedFeedback.dhow_responses || []),
                    ...(selectedFeedback.restaurant_responses || []),
                  ].map((response, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-medium">
                        {response.question
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        :
                      </span>{" "}
                      {response.text
                        ? response.text
                        : response.rating !== null
                        ? `Rating: ${response.rating}`
                        : response.yes_no !== null
                        ? response.yes_no
                          ? "Yes"
                          : "No"
                        : "N/A"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No responses available.</p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
