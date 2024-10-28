<?php
namespace Controllers;
class ClassesController
{
    private $layout = null;
    private $courseModel = null;
    private $classModel = null;
    private $classDetailModel = null;
    public function __construct()
    {
        $this->layout = new \Views\ViewLayout();
        $this->courseModel = new \Models\CourseModel();
        $this->classModel = new \Models\ClassModel();
        $this->classDetailModel = new \Models\ClassDetailModel();
    }

    public function index()
    {
        $this->layout->setTitle('Classes - AnhNguMB');
        $this->layout->setActivePage(2);
        $this->layout->templatehtml = file_get_contents('public/temphtml/tempuser/joinclass.html');
        $this->layout->render();
    }

    public function myclass(){
        $this->layout->setTitle('My Classes - AnhNguMB');
        $this->layout->setActivePage(2,2.1);
        $this->layout->templatehtml = file_get_contents('public/temphtml/tempuser/myclass.html');
        $this->layout->render();
    }

    // phuong thuc danh cho ajax


    function getallcourse(){
        $courses = $this->courseModel->getAllCourses();
        echo json_encode($courses);
    }

    // function getclassbycourse($idCouse){
    //     $classes = $this->classModel->getClassByCourse($idCouse);
    //     echo json_encode($classes);
    // }

    function getClassDetailByCourseClass($idCourse = null){
        $idUser = \Cores\Authentication::getId();
        $class = $this->classDetailModel->getClassByCourseAndClass($idUser,$idCourse);
        echo json_encode($class);
    }

    function joinclass(){

        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataRequest = json_decode(file_get_contents('php://input'), true);
            $idUser = \Cores\Authentication::getId();
            $result = $this->classDetailModel->joinClass($idUser, $dataRequest);
            echo json_encode($result);
        }

    }

    function canceljoinclass(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataRequest = json_decode(file_get_contents('php://input'), true);
            $idUser = \Cores\Authentication::getId();
            $result = $this->classDetailModel->cancelJoinClass($idUser, $dataRequest);
            echo json_encode($result);
        }
    }

    function getclassjoined(){
        $idUser = \Cores\Authentication::getId();
        $classes = $this->classModel->getClassJoinedAndPending($idUser,1);
        echo json_encode($classes);
    }

    function getclasspending(){
        $idUser = \Cores\Authentication::getId();
        $classes = $this->classModel->getClassJoinedAndPending($idUser,0);
        echo json_encode($classes);
    }
}