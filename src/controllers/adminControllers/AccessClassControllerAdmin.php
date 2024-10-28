<?php

namespace AdminControllers;

use Views\ViewLayout;

class AccessclassControllerAdmin
{
    private $classAccModel;

    function __construct()
    {
        $this->classAccModel = new \Models\AccessclassModel();
    }

    function index()
    {
        $class = new ViewLayout();
        $class->setTitle('Lớp truy cập');
        $class->setActivePage(2.3);
        $class->addCSS('public/css/Admin/classAdmin.css');
        $class->addJS('public/js/Admin/accessClassAdmin.js');
        $class->render();
    }
    public function getAccessStatuss() 
    {
        $datareq = json_decode(file_get_contents('php://input'), true);
        $dataResponse = $this->classAccModel->getAccessStatuss($datareq);
        echo json_encode($dataResponse);
    }
    public function deleteAccessStatus()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classAccModel->deleteAccessStatus($datareq);
            echo json_encode($class);
        }
    }
    public function subaccessStatus(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $datareq = json_decode(file_get_contents('php://input'), true);
            $class = $this->classAccModel->subaccessStatus($datareq);
            echo json_encode($class);
        }
    }
}
