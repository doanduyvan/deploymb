<?php
namespace Controllers;

class DashboardController{
    private $classModel;
    function __construct()
    {
        $this->classModel = new \Models\DashboardModel();
    }
    function index(){
        $dashboard = new \Views\ViewLayout(); 
        $dashboard->setTitle('day la trang dashboard');
        $dashboard->setActivePage(1);
        $dashboard->addCSS('public/css/Admin/dashboardAdmin.css');
        $dashboard->addJS('public/js/Users/dashboard.js');
        $dashboard->render();
    }
    function getCountStudentStatus(){
        $count = $this->classModel->getCountStudentStatus();
        echo json_encode($count);
    }
    function getStudentClass(){
        $count = $this->classModel->getClassStudent();
        echo json_encode($count);
    }

}