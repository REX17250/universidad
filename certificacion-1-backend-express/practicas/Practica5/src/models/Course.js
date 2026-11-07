import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    lecturer: { type: String, required: true, trim: true },
    schedule: { type: String, required: true, enum: ["A+", "B+", "A", "B", "C", "D", "E", "Z"] },
    credits: { type: Number, required: true, min: 1, max: 10 },
    active: { type: Boolean, required: true, default: true }
});

export default mongoose.model("Course", courseSchema);
