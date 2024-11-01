<?php
namespace AdminControllers;
class QuizzesControllerAdmin{

    private $quizView;
    private $quizModel;
    private $pathcss = 'public/css/Admin/';
    private $pathjs = 'public/js/Admin/';
    function __construct()
    {
        $this->quizView = new \Views\ViewLayout();
        $this->quizModel = new \Models\QuizzesCMSModel();
    }

    function index(){
        $this->quizView->setTitle('List Quizzes');
        $this->quizView->setActivePage(9);
        $this->quizView->addCSS( $this->pathcss . 'listquizadmin.css');
        $this->quizView->addJS( $this->pathjs . 'listquizadmin.js');
        $this->quizView->render();
    }

    function add(){
        $this->quizView->setTitle('Add Quizzes');
        $this->quizView->setActivePage(9,9.1);
        $this->quizView->addCSS( $this->pathcss . 'addquizadmin.css');
        $this->quizView->addJS( $this->pathjs . 'addquizadmin.js');
        $this->quizView->render();
    }

    function edit(){
        $this->quizView->setTitle('Update Quizzes');
        $this->quizView->setActivePage(9);
        $this->quizView->addCSS( $this->pathcss . 'editquizadmin.css');
        $this->quizView->addJS( $this->pathjs . 'editquizadmin.js');
        $this->quizView->render();
    }

    // các hàm xử lý ajax


    function getCourses(){
        $courses = new \Models\CourseModel();
        $courses = $courses->getAllCourses();
        echo json_encode($courses);
    }

    function getLessonByCourseId($idCourse){
        $lessons = new \Models\LessonModel();
        $lessons = $lessons->getLessonByCourseId($idCourse);
        echo json_encode($lessons);
    }

    function addQuiz(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataRes = $this->quizModel->addQuiz($dataReq);
            echo json_encode($dataRes);
        }
    }

    function getQuizName(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataRes = $this->quizModel->getQuizName($dataReq);
            echo json_encode($dataRes);
        }
    }

    function getQuizEdit(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataRes = $this->quizModel->getQuizEdit($dataReq);
            echo json_encode($dataRes);
        }
    }

    function updateQuiz(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataRes = $this->quizModel->updateQuiz($dataReq);
            echo json_encode($dataRes);
        }
    }

    function deleteQuiz(){
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $dataReq = json_decode(file_get_contents('php://input'), true);
            $dataRes = $this->quizModel->deleteQuiz($dataReq);
            echo json_encode($dataRes);
        }
    }
}