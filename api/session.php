<?php
include "libraries/header.php";
require_once 'libraries/swiftmailer/swift_required.php';
$transport = Swift_SmtpTransport::newInstance('smtp.yandex.com', 465, 'ssl')
	->setUsername('saltillo@mapatour.com.mx')
	->setPassword('L1u2i3s4.')
	->setAuthMode('PLAIN');
$mailer = Swift_Mailer::newInstance($transport);
switch($accion) {	
	case('nueva-sesion'):		
		$session_token = $db->real_escape_string($params['session_token']);	
		if(!$resultado = $db->query("INSERT INTO sessions (session) VALUES ($session_token)")){
			error('No se guardo la sesión');
		}
		$id = $db->insert_id;	
		$response['id_session'] = $id;
		$response['session_token'] = $session_token;		
	break;
	case('listar'):
		if(!$resultado = $db->query("SELECT * FROM urls INNER JOIN sessions ON
			sessions.id = urls.session_id WHERE sessions.session = '$session_key'")){
				error('No se guardo la sesión');
		}
		while($row = $resultado->fetch_assoc()) {
			$response['urls'] = $row;
		}				
	break;

	default:
		error('Parámetro no encontrado');
	break;
}

include "libraries/footer.php";


?>