<?php
// Configuración
set_time_limit(100);
ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');
$local_domain = 'sititec.local';

$fb_app_id = '269267379831311';
$fb_app_secret = 'efa1fdae65837415f5f8252ba3b7d205';

session_start();
error_reporting(E_ALL ^ E_STRICT);
//error_reporting(0);

function error($error) {
	$response = array();
	$response['success'] = '0';
	$response['error'] = $error;
	echo json_encode($response);
	die();
}

function verifica_login() {
	global $response, $success;
	
	if(isset($_SESSION['id'])) {
		return $_SESSION['id'];
	} else {
		$continuar = true;
		if(isset($_POST['token'])) {
			include 'libraries/condb.php';
			$token = $db->real_escape_string($_POST['token']);
			if($resultado = $db->query("SELECT id FROM usuarios INNER JOIN tokens ON tokens.id_usuario = usuarios.id WHERE tokens.token = '$token'")) {
				if($resultado->num_rows > 0) {
					$usuario = $resultado->fetch_assoc();
					$id_usuario = $usuario['id'];
					$_SESSION['id'] = $id_usuario;
					$db->query("UPDATE tokens SET ultimo_uso = NOW() WHERE token = '$token'");
					$db->commit();
					return $id_usuario;
				} else
					$continuar = false;
				include 'libraries/cerdb.php';
			} else
				$continuar = false;
			
		} elseif(isset($_COOKIE["token"])) {
			include 'libraries/condb.php';
			$token = $db->real_escape_string($_COOKIE["token"]);
			if($resultado = $db->query("SELECT id FROM usuarios INNER JOIN tokens ON tokens.id_usuario = usuarios.id WHERE tokens.token = '$token'")) {
				if($resultado->num_rows > 0) {
					$usuario = $resultado->fetch_assoc();
					$id_usuario = $usuario['id'];
					$_SESSION['id'] = $id_usuario;
					$db->query("UPDATE tokens SET ultimo_uso = NOW() WHERE token = '$token'");
					$db->commit();
					return $id_usuario;
				} else {
					$continuar = false;
					setcookie ("token", "", time() - 3600,"/");
				}
			} else
				$continuar = false;
			include 'libraries/cerdb.php';
		} else
			$continuar = false;
		
		if(!$continuar) {
			$success = '0';
			$response['not_authorized'] = 'Logged Out';
		}
	}
}

//funciones auxiliares
function rand_string($length) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";	
	$str = '';
	$size = strlen( $chars );
	for( $i = 0; $i < $length; $i++ ) {
		$str .= $chars[ rand( 0, $size - 1 ) ];
	}
	return $str;
}

function getPost() {
}
function getDBPost() {
}

function get_fb_user($token) {
	global $fb_app_id, $fb_app_secret, $fb_page_id;
	
	require_once('libraries/facebook/facebook.php');
	$config = array();
	$config['appId'] = $fb_app_id;
	$config['secret'] = $fb_app_secret;
	$facebook = new Facebook($config);
	
	$facebook->setAccessToken($extended_user_token);
	
	try {
		$me = $facebook->api('/me');
		if ($me)
		{
			return $facebook->getUser();
		}
		else
		{
			return '0';
		}
	} 
	catch (FacebookApiException $e) 
	{
		return '0';
	}
}


///////COSAS DE EMAIL!!!!!///////////////////////
/**
Validate an email address.
Provide email address (raw input)
Returns true if the email address has the email 
address format and the domain exists.
*/
function validEmail($email) {
   $isValid = true;
   $atIndex = strrpos($email, "@");
   if (is_bool($atIndex) && !$atIndex) {
      $isValid = false;
   } else {
      $domain = substr($email, $atIndex+1);
      $local = substr($email, 0, $atIndex);
      $localLen = strlen($local);
      $domainLen = strlen($domain);
      if ($localLen < 1 || $localLen > 64) {
         // local part length exceeded
         $isValid = false;
      } else if ($domainLen < 1 || $domainLen > 255) {
         // domain part length exceeded
         $isValid = false;
      } else if ($local[0] == '.' || $local[$localLen-1] == '.') {
         // local part starts or ends with '.'
         $isValid = false;
      } else if (preg_match('/\\.\\./', $local)) {
         // local part has two consecutive dots
         $isValid = false;
      } else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain)) {
         // character not valid in domain part
         $isValid = false;
      } else if (preg_match('/\\.\\./', $domain)) {
         // domain part has two consecutive dots
         $isValid = false;
      } else if (!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/',
                 str_replace("\\\\","",$local))) {
         // character not valid in local part unless 
         // local part is quoted
         if (!preg_match('/^"(\\\\"|[^"])+"$/', str_replace("\\\\","",$local))) {
            $isValid = false;
         }
      }
      if ($isValid && !(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A"))) {
         // domain not found in DNS
         $isValid = false;
      }
   }
   return $isValid;
}
function mandaEmailConfirmacion($destinatario, $nombre, $hash) {
	require_once 'libraries/swiftmailer/swift_required.php';
	// Create the Transport
	  $transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl')
	  ->setUsername('nelida@promocionalesapi.com')
	  ->setPassword('L1u2i3s4.')
	  ;
	
	// Create the Mailer using your created Transport
	$mailer = Swift_Mailer::newInstance($transport);
	
	// Create a message
	$message = Swift_Message::newInstance('Verificar Email')
	  ->setFrom(array('nelida@promocionalesapi.com' => 'Promocionales API'))
	  ->setTo(array($destinatario => $nombre))
	  ->setBody(		 
		'<html>' .
		' <head></head>' .
		' <body style="text-align:center;font-size:13px;font-weight:lighter;font-family:Lucida Grande;color:#666;line-height:28px;">' .
		'Hola '.$nombre.', '.
		'¡Gracias por registrarte en Promocionales API!<br/> 
		Por favor ingresa al siguiente link para confirmar tu cuenta:'.				  
		'<br/><a href="http://shambhalatea.com/usuario/verificar-email/'.$hash.'">Verificar mi cuenta</a>'.						  		
		'<br/><img src="http://www.shambhalatea.com/img/logo.png" alt="Shambhala Heavenly Infusions" width="250px" /><br/>'.
		'La familia de <br/>'.
		'Shambhala Heavenly Infusions'.
		'</body>' .
		'</html>',
		  'text/html' // Mark the content-type as HTML	
	  );
	
	// Send the message
	$result = $mailer->send($message);
}
function mandaEmailReestablecerPassword($destinatario, $nombre, $hash) {
	require_once 'libraries/swiftmailer/swift_required.php';
	// Create the Transport
	/*$transport = Swift_SmtpTransport::newInstance('email-smtp.us-east-1.amazonaws.com', 25)
	  ->setUsername('AKIAIMJU3CZRJBQJFFJQ')
	  ->setPassword('AgIl/lQFXvHf+utyqtAsbt4R0EAWyizprkcWQJBzBfhA')
	  ;*/
	  $transport = Swift_SmtpTransport::newInstance('mail.shambhalatea.com', 465, 'ssl')
	  ->setUsername('contacto@shambhalatea.com')
	  ->setPassword('Tea1234.')
	  ;
	
	// Create the Mailer using your created Transport
	$mailer = Swift_Mailer::newInstance($transport);
	
	// Create a message
	$message = Swift_Message::newInstance('Reestablecer Contraseña')
	  ->setFrom(array('contacto@shambhalatea.com' => 'Shambhala Heavenly Infusions'))
	  ->setTo(array($destinatario => $nombre))
	  ->setBody(
	  '<html>' .
		' <head></head>' .
		' <body style="text-align:center;font-size:13px;font-weight:lighter;font-family:Lucida Grande;color:#666;line-height:28px;">' .
		'Hola '.$nombre.', <br/>'.
		'Olvidaste tu contraseña, así que tienes que reestablecerla haciendo click en el siguiente enlace:'.						  
		'<br/><a href="http://shambhalatea.com/usuario/reestablecer-password/'.$hash.'">Reestablecer contraseña</a>'.						  		
		'<br/><img src="http://www.shambhalatea.com/img/logo.png" alt="Shambhala Heavenly Infusions" width="250px"/><br/>'.
		'La familia de <br/>'.
		'Shambhala Heavenly Infusions'.
		'</body>' .
		'</html>',
		  'text/html' // Mark the content-type as HTML	
	  );
		
	// Send the message
	$result = $mailer->send($message);
}

//PARA GUARDAR UNA IMAGEN TEMPORAL
function guardaImagenTemp($imagen, $extension) {
	$directorio_existe=true;
	$path="";
	$nombre_imagen;
	do {
		$hash = rand_string(80);
		$path = 'temp/'.$hash.'.'.$extension;
		if(!file_exists($path)) {
			$directorio_existe = false;
			$nombre_imagen = $path;			
			$imagen->save($nombre_imagen);
		}
	} while($directorio_existe);
	return($path);
}
//Convert an object to array and vice versa
function objectToArray($d) {
	if (is_object($d)) {		
		$d = (array) $d;
	}
	// if (is_array($d)) {		
	// 	return array_map(__FUNCTION__, $d);
	// }
	// else {		
		return $d;
	// }
}

?>