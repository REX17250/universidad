let studentList = [
    {
        "name": "Matias Meneses",
        "grade": 78
    },
    {
        "name": "Wendy Caceres",
        "grade": 83
    },
    {
        "name": "Daner Tonconi",
        "grade": 49
    }
];

export const getStudents = (req, res) => {
    if(req.query.pass){
        const pass = req.query.pass == 'true' ? true : false;
        const filteredStudentList = studentList.filter(student => (student.grade >= 60) == pass);
        res.status(200).json(filteredStudentList);
    }
    else{
        res.status(200).json(studentList);
    }
};

export const createStudent = (req, res) => {
    const body = req.body;
    if(body.hasOwnProperty("name") && body.hasOwnProperty("grade")){
        studentList.push(body);
        res.status(201).json({student: body});
    }
    else{
        res.status(400).json({error: "Body not supported"});
    }
};

export const getStudentByPos = (req, res) => {
    const pos = req.params.pos;
    console.log(`Retrieving information for student in ${pos}.`);
    if(pos >= 0 && pos < studentList.length){
        res.status(200).json({student: studentList[pos]});
    }
    else{
        res.status(404).json({error: "Student not found"});
    }
};