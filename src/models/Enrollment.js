import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    enrollment_id: { type: String, required: true, unique: true },
    student_id: { type: String, required: true },
    student_name: { type: String, required: true },
    student_phone: { type: String, required: true },
    student_email: { type: String, required: true },
    course_id: { type: String, required: true },
    course_name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Booked", "In Progress", "Completed"],
      default: "Pending",
    },
    is_Active: { type: Boolean, default: true },
    is_Deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);