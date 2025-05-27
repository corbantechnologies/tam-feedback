"use client";

import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    const session = await getSession();

    setLoading(false);
    if (response?.error) {
      setLoading(false);
      toast?.error("Invalid email or password");
    } else {
      toast?.success("Login successful! Redirecting...");
      if (session?.user?.is_admin === true) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return <div>Login</div>;
}

export default Login;
