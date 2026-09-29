"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EnrollmentFormContent() {
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get("course") || "";

  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(preselectedCourse);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.data.filter((c) => c.is_Active && !c.is_Deleted));
        }
      });
  }, []);

  useEffect(() => {
    if (preselectedCourse) {
      setSelectedCourseId(preselectedCourse);
    }
  }, [preselectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !studentEmail || !selectedCourseId) {
      alert("Please fill in all required fields.");
      return;
    }

    const courseObj = courses.find((c) => c.course_id === selectedCourseId);

    const payload = {
      student_name: studentName,
      student_phone: studentPhone,
      student_email: studentEmail,
      course_id: selectedCourseId,
      course_name: courseObj ? courseObj.course_name : "Unknown Course",
    };

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Error submitting enrollment: " + data.error);
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-sm text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your enrollment has been successfully registered with status <strong>Pending</strong>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setStudentName("");
            setStudentPhone("");
            setStudentEmail("");
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Submit Another Enrollment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Enrollment Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a Course --</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              required
              placeholder="+1 (555) 000-0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-2"
          >
            Complete Enrollment
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <EnrollmentFormContent />
    </Suspense>
  );
}