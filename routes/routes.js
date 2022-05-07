const studentContoller = require("../controllers/student");

const routes = {
    "student/list" : studentContoller.getAllStudentList,
    "student/delete": studentContoller.deleteStudent,
    "student/create": studentContoller.createStudent,
    "student/edit": studentContoller.editStudent,
    "student/file/upload": studentContoller.uploadFile
}
module.exports = routes;
