"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courses");

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseFee, setCourseFee] = useState("");

  const [enrollments, setEnrollments] = useState([]);

  const loadData = async () => {
    try {
      const courseRes = await fetch("/api/courses");
      const courseData = await courseRes.json();
      if (courseData.success) setCourses(courseData.data);

      const enrollRes = await fetch("/api/enrollments");
      const enrollData = await enrollRes.json();
      if (enrollData.success) setEnrollments(enrollData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName || !courseDuration || !courseFee) return;

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: courseName,
          course_duration: courseDuration,
          course_fee: parseFloat(courseFee),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCourseName("");
        setCourseDuration("");
        setCourseFee("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCourseStatus = async (course_id, currentStatus) => {
    try {
      await fetch(`/api/courses/${course_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_Active: !currentStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (course_id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`/api/courses/${course_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_Deleted: true }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (enrollment_id, newStatus) => {
    try {
      await fetch(`/api/enrollments/${enrollment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">Admin Dashboard</h1>
        <div className="flex space-x-2 backdrop-blur-md bg-white/40 border border-white/40 p-1 rounded-xl shadow-md">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "courses" ? "bg-white text-indigo-600 shadow-md" : "text-gray-700 hover:text-white"
            }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "enrollments" ? "bg-white text-indigo-600 shadow-md" : "text-gray-700 hover:text-white"
            }`}
          >
            Student Enrollments
          </button>
        </div>
      </div>

      {activeTab === "courses" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="backdrop-blur-md bg-white/70 border border-white/40 p-6 rounded-2xl shadow-xl h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                  placeholder="e.g. Python for Beginners"
                  className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  required
                  placeholder="e.g. 4 Weeks"
                  className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee ($)</label>
                <input
                  type="number"
                  value={courseFee}
                  onChange={(e) => setCourseFee(e.target.value)}
                  required
                  placeholder="199"
                  className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition shadow-md"
              >
                Add Course
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/30">
              <h2 className="text-lg font-bold text-gray-900">Course Catalog</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white/40 text-gray-700 border-b border-white/30">
                    <th className="p-4">Name</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {courses.filter((c) => !c.is_Deleted).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-600">
                        No courses added yet.
                      </td>
                    </tr>
                  ) : (
                    courses
                      .filter((c) => !c.is_Deleted)
                      .map((course) => (
                        <tr key={course.course_id} className="hover:bg-white/40 transition">
                          <td className="p-4 font-medium text-gray-900">{course.course_name}</td>
                          <td className="p-4 text-gray-700">{course.course_duration}</td>
                          <td className="p-4 text-gray-700">${course.course_fee}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                course.is_Active
                                  ? "bg-green-100/80 text-green-800"
                                  : "bg-yellow-100/80 text-yellow-800"
                              }`}
                            >
                              {course.is_Active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => toggleCourseStatus(course.course_id, course.is_Active)}
                              className="text-indigo-700 hover:underline font-medium"
                            >
                              {course.is_Active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => deleteCourse(course.course_id)}
                              className="text-red-600 hover:underline font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/30">
            <h2 className="text-lg font-bold text-gray-900">Enrolled Students</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white/40 text-gray-700 border-b border-white/30">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-600">
                      No student enrollments recorded yet.
                    </td>
                  </tr>
                ) : (
                  enrollments.map((en) => (
                    <tr key={en.enrollment_id} className="hover:bg-white/40 transition">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{en.student_name}</div>
                        <div className="text-xs text-gray-500">ID: {en.student_id}</div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div>{en.student_email}</div>
                        <div className="text-xs text-gray-500">{en.student_phone}</div>
                      </td>
                      <td className="p-4 font-medium text-indigo-700">{en.course_name}</td>
                      <td className="p-4">
                        <select
                          value={en.status}
                          onChange={(e) => handleStatusChange(en.enrollment_id, e.target.value)}
                          className={`border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none backdrop-blur-md ${
                            en.status === "Pending"
                              ? "bg-yellow-100/70 text-yellow-800 border-yellow-300"
                              : en.status === "Booked"
                              ? "bg-blue-100/70 text-blue-800 border-blue-300"
                              : en.status === "In Progress"
                              ? "bg-purple-100/70 text-purple-800 border-purple-300"
                              : "bg-green-100/70 text-green-800 border-green-300"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Booked">Booked</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}