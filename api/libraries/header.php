<?php
include 'libraries/boilerplate.php';
header('Content-Type: text/html; charset=utf-8');
$request_body = file_get_contents('php://input');
$data = count($_POST) >= 1 ? $_POST : objectToArray(json_decode($request_body));
$params = $data;
$accion = $data['accion'];
var_dump($_POST);
$response = array();
$success = '1';
include 'libraries/condb.php';
?>