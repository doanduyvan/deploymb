<?php
namespace AdminControllers;

class DashboardControllerAdmin{
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
        $dashboard->addJS('public/js/Admin/dashBoardAdmin.js');
        $dashboard->render();
    }

    // Dưới đây là các phương thức dành cho JSON API
    // function getcourse(){

    //     $course = [
    //         [
    //             'id' => 1,
    //             'name' => 'Lập trình PHP',
    //             'description' => 'Học lập trình PHP cơ bản',
    //             'price' => 1000000
    //         ],
    //         [
    //             'id' => 1,
    //             'name' => 'Lập trình java',
    //             'description' => 'Học lập trình PHP cơ bản',
    //             'price' => 1000000
    //         ],
    //         [
    //             'id' => 1,
    //             'name' => 'Lập trình python',
    //             'description' => 'Học lập trình PHP cơ bản',
    //             'price' => 1000000
    //         ],
    //     ];
    //     echo json_encode($course);
    // }


    function getCountClass(){
        $count = $this->classModel->getCountClass();
        echo json_encode($count);
    }
    function getCountStatus(){
        $count = $this->classModel->getCountStatus();
        echo json_encode($count);
    }
}