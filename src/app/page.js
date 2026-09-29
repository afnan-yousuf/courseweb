"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.data.filter((c) => c.is_Active && !c.is_Deleted));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Advance Your Career with Expert-Led Courses
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore our available courses below and enroll to get started on your learning journey today.
        </p>
        <div className="mt-8">
          <Link
            href="/enroll"
            className="inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Enroll in a Course
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm text-center">
          No active courses found in database. Visit the admin panel to add courses.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.course_name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-6">
                  <p>⏱️ Duration: <span className="font-medium text-gray-800">{course.course_duration}</span></p>
                  <p>💰 Fee: <span className="font-medium text-gray-800">${course.course_fee}</span></p>
                </div>
              </div>
              <Link
                href={`/enroll?course=${encodeURIComponent(course.course_id)}`}
                className="w-full text-center bg-indigo-50 text-indigo-600 font-medium py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition"
              >
                Enroll Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}