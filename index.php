<?php
session_start();
define('DIR_ROOT', __DIR__);
date_default_timezone_set('Asia/Ho_Chi_Minh');
$currentDateTime = date('H:i:s d-m-Y');
define("NOW", $currentDateTime);

// dành cho localhost
// $web_root = "";
// $arrPath = explode('\\', DIR_ROOT);
// $indexPath = array_search("htdocs",$arrPath);
// $arrPath = array_slice($arrPath,$indexPath+1);
// if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
//     $web_root = 'https://' . $_SERVER['HTTP_HOST'];
// } else {
//     $web_root = 'http://' . $_SERVER['HTTP_HOST'];
// }
// $stringPath = count($arrPath) > 0 ? implode("/",$arrPath) . "/" : "";
// $web_root .= '/' . $stringPath;
// define("WEB_ROOT", $web_root);


include_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// dành cho server
define("WEB_ROOT", $_ENV['HTTP_ROOT']);

new Cores\Router();

// $test = new \Models\ClassDetailModel();

// $data = $test->getClassDetails(1);

// echo "<pre>";
// print_r($data);
// echo "</pre>";






