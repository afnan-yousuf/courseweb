import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, unique: true },
    course_name: { type: String, required: true },
    course_duration: { type: String, required: true },
    course_fee: { type: Number, required: true },
    is_Active: { type: Boolean, default: true },
    is_Deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);