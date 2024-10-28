<?php

namespace Controllers;

use Views\ViewLayout;

class QuizzesController
{
    private $classModel = null;
    private $lessonModel = null;
    private $quizModel = null;
    function __construct()
    {
        $this->classModel = new \Models\ClassModel();
        $this->lessonModel = new \Models\LessonModel();
        $this->quizModel = new \Models\QuizzesCMSModel();
    }

    function index()
    {
        $quiz = new ViewLayout();
        $quiz->setTitle('Quizzes - Anh Ngữ MB');
        $quiz->setActivePage(5);
        $quiz->templatehtml = file_get_contents('public/temphtml/tempuser/filterquiz.html');

        // $quiz->templatehtml = file_get_contents('public/temphtml/tempUser/quiz.html');
        // $quiz->addCSS('public/css/Users/Quiz.css');
        // $quiz->addJS('public/js/Users/Quiz.js');
        $quiz->render();
    }

    function startquiz(){
        $quiz = new ViewLayout();
        $quiz->setTitle('Quizzes - Anh Ngữ MB');
        $quiz->setActivePage(5);
        $quiz->templatehtml = file_get_contents('public/temphtml/tempuser/quiz.html');
        $quiz->render();
    }

    // Các phương thức dành cho ajax

    function getClassByUser(){
        $idUser = \Cores\Authentication::getId();
        $classes = $this->classModel->getClassesByUser($idUser);
        echo json_encode($classes);
    }

    function getUnitByClass($idClass){
        if ($idClass === '' || !is_numeric($idClass)) {
            echo json_encode([]);
            return;
        }

        $idUser = \Cores\Authentication::getId();
        $units = $this->lessonModel->getLessonByIdCourse( $idUser ,$idClass);
        echo json_encode($units);
    }

    function getQuizByIdLesson($idClass,$idLesson){
        if ($idClass === '' || !is_numeric($idClass)) {
            echo json_encode([]);
            return;
        }
        if ($idLesson === '' || !is_numeric($idLesson)) {
            echo json_encode([]);
            return;
        }

        $idUser = \Cores\Authentication::getId();
        $quizzes = $this->quizModel->getQuizByIdLesson($idUser,$idClass,$idLesson);
        echo json_encode($quizzes);
    }

    function getQuestionByIdQuiz($idClass, $idLesson, $idQuiz){
        $idUser = \Cores\Authentication::getId();
        $quiz = $this->quizModel->getQuestionByIdQuiz($idUser,$idClass, $idLesson, $idQuiz);
        echo json_encode($quiz);
    }

}
