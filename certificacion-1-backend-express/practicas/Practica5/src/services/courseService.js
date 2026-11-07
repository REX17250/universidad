import Course from "../models/Course.js";

export async function getAllCourses() {
    return await Course.find();
}

export async function getFilteredCourses(schedule, credits, active) {
    const filter = {};
    if (schedule !== undefined) filter.schedule = schedule;
    if (credits !== undefined) filter.credits = Number(credits);
    if (active !== undefined) filter.active = active === "true";
    return await Course.find(filter);
}

export async function createCourse(courseData) {
    const course = new Course(courseData);
    return await course.save();
}

export async function getCourseById(id) {
    return await Course.findById(id);
}

export async function updateCourseById(id, body) {
    const curso = await Course.findByIdAndUpdate(id, body, { new: true });
    if (!curso) return { success: false, message: `No se encontró un curso con id ${id}` };
    return { success: true, data: curso };
}

export async function deleteCourseById(id) {
    const curso = await Course.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!curso) return { success: false, message: `No se encontró un curso con id ${id}` };
    return { success: true, data: curso };
}

export async function getCoursesByIds(ids) {
    return await Promise.all(ids.map(id => Course.findById(id).then(c => c || null)));
}
