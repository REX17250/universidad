let nextId = 4;

export const courseList = [
    {
        id: 1,
        name: "Certificacion Backend",
        degree: "SIS",
        lecturer: "Ing. Rodolfo Catunta",
        schedule: "A+",
        credits: 6,
        active: true
    },
    {
        id: 2,
        name: "Programacion Web",
        degree: "SIS",
        lecturer: "Ing. Juan Perez",
        schedule: "B",
        credits: 4,
        active: true
    },
    {
        id: 3,
        name: "Bases de Datos",
        degree: "INF",
        lecturer: "Ing. Maria Lopez",
        schedule: "C",
        credits: 5,
        active: false
    }
];

export function getNextId() {
    return nextId++;
}
