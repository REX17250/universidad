//Obtener nombres de estudiantes aprobados
function obtainApprovals(students){
    return students.filter(student => student.grade > 60).map(approval => ({name: approval.name}))
}

const students = [
  { name: "Ana", grade: 85 },
  { name: "Luis", grade: 45 },
  { name: "Carla", grade: 70 },
  { name: "Pedro", grade: 55 }
];

console.log(obtainApprovals(students));