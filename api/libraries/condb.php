<?php
$db = new mysqli("localhost", "root", "", "cion");
//$db = new mysqli("lpsql01.lunariffic.com", "grupo71_root", "fantasy1", "grupo71_castilla");
$db->set_charset("utf8mb4");
$db->query('SET character_set_results = "utf8", character_set_client = "utf8", character_set_connection = "utf8", character_set_database = "utf8", character_set_server = "utf8", collation_connection = "utf8_unicode_ci", time_zone = "America/Monterrey";');
$db->autocommit(FALSE);

?>
