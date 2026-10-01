"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function login() {
  const router = useRouter();
  const [formdata, setFormData] = useState({ uname: "", pass: "", age: 0 });
  const [message, setMessage] = useState("");


  async function handlesubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setMessage("Invalid Username or Password");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h1>Login here</h1>
      <div className="w-100">
        <form className="flex flex-col gap-2" onSubmit={handlesubmit}>
          Username:
          <input
            type="text"
            className="bg-white p-1"
            value={formdata.uname}
            name="uname"
            onChange={(e) => {
              setFormData({ ...formdata, [e.target.name]: e.target.value });
            }}
            onFocus={() => {
              setMessage("");
            }}
          />
          Password:{" "}
          <input
            type="password"
            className="bg-white p-1"
            value={formdata.pass}
            name="pass"
            onChange={(e) => {
              setFormData({ ...formdata, [e.target.name]: e.target.value });
            }}
            onFocus={() => {
              setMessage("");
            }}
          />
          <input
            type="number"
            className="bg-white p-1"
            value={formdata.age}
            name="age"
            onChange={(e) => {
              setFormData({ ...formdata, [e.target.name]: e.target.value });
            }}
          />
          <button className="bordered px-3 py-2 bg-white text-black">
            Login
          </button>
        </form>
        <h1 className="text-xl">{message}</h1>
      </div>
    </>
  );
}
