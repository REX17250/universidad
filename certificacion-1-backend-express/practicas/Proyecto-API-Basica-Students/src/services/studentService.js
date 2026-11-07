import { studentList } from "../data/students.js";

const activeStudents = () => studentList.filter((student) => student.active === 1);

export function getAllStudents(){
    return activeStudents();
}

export function getStudentsByPassStatus(pass){
    return activeStudents().filter((student) => {
        const hasPassed = student.grade >= 60;
        return hasPassed === pass;
    });
}

export function getStudentsBySite(site){
    return activeStudents().filter((student) => student.site === site);
}

export function createStudent(student){
    studentList.push(student);
    return student;
}

export function getStudentById(id){
    return studentList.find((student) => student.id === id) ?? null;
}