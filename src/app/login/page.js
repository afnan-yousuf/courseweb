"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      router.push("/students");
      router.refresh();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
      }}
    >
      <h1>Login</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Email</label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Password</label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}