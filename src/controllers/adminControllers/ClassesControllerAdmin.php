<?php

namespace AdminControllers;

use Views\ViewLayout;

class ClassesControllerAdmin
{
    private $classModel;

    function __construct()
    {
        $this->classModel = new \Models\ClassModel();
    }

    function index()
    {
        $class = new ViewLayout();
        $class->setTitle('Danh sách khóa học');
        $class->setActivePage(2);
        $class->addCSS('public/css/Admin/classAdmin.css');
        $class->addJS('public/js/Admin/listClassAdmin.js');
        $class->render();
    }

    function addClassAdmin()
    {
        $class = new ViewLayout();
        $class->setTitle('Add class');
        $class->setActivePage(2);
        $class->addCSS('public/css/Admin/classAdmin.css');
        $class->addJS('public/js/Admin/addClassAdmin.js');
        $class->render();
    }


    // function listClassAdmin()
    // {
    //     $class = new ViewLayout();
    //     $class->setTitle('list classes');
    //     $class->setActivePage(2);
    //     $class->addCSS('public/css/Admin/classAdmin.css');
    //     $class->addJS('public/js/Admin/listClassAdmin.js');
    //     $class->render();
    // }
    public function getclasses()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->getClasses($datareq);
            echo json_encode($class);
        }
    }
    public function addClass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->addClass($datareq);
            echo json_encode($class);
        }
    }
    public function editCLass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->editCLass($datareq);
            echo json_encode($class);
        }
    }

    public function deleteClass()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->deleteClass($datareq);
            echo json_encode($class);
        }
    }
    public function updateStatus()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classModel->updateStatus($datareq);
            echo json_encode($class);
        }
    }
}
