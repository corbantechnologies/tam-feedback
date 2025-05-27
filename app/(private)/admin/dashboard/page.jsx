"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import React from "react";

function AdminDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  console.log(account?.email);

  if (isLoadingAccount) {
    return <div>Loading...</div>;
  }

  return <div>AdminDashboard</div>;
}

export default AdminDashboard;
