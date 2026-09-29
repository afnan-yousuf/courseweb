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
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Advance Your Career with Expert-Led Courses
        </h1>
        <p className="mt-4 text-lg text-white/90">
          Explore our available courses below and enroll to get started on your learning journey today.
        </p>
        <div className="mt-8">
          <Link
            href="/enroll"
            className="inline-block bg-white/90 backdrop-blur-md text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-white transition border border-white/50"
          >
            Enroll in a Course
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">Available Courses</h2>
      {loading ? (
        <p className="text-center text-white py-12">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="backdrop-blur-md bg-white/60 border border-white/40 p-8 rounded-2xl shadow-xl text-center text-gray-700">
          No active courses found in database. Visit the admin panel to add courses.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:bg-white/80 transition transform hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.course_name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-6">
                  <p>⏱️ Duration: <span className="font-medium text-gray-900">{course.course_duration}</span></p>
                  <p>💰 Fee: <span className="font-medium text-gray-900">${course.course_fee}</span></p>
                </div>
              </div>
              <Link
                href={`/enroll?course=${encodeURIComponent(course.course_id)}`}
                className="w-full text-center bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium py-2.5 rounded-xl transition shadow-md"
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