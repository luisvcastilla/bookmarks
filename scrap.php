<?php
header('Content-Type: text/html; charset=utf-8');

function getMetaData($url){
	// get meta tags
	$meta=get_meta_tags($url);
	// store page
	$page=file_get_contents($url);
	// find where the title CONTENT begins
	$titleStart=strpos($page,'<title>')+7;
	// find how long the title is
	$titleLength=strpos($page,'</title>')-$titleStart;
	// extract title from $page
	$meta['title']=substr($page,$titleStart,$titleLength);
	// return array of data
	return $meta;
}

$tags=getMetaData('http://sititec.com/');
var_dump($tags);
echo 'Title: '.$tags['title'];
echo '<br />';
echo 'Description: '.$tags['description'];
// echo 'Keywords: '.$tags['keywords'];

$page = file_get_contents('http://sititec.com/');
$doc = new DOMDocument(); 
libxml_use_internal_errors(true);
$doc->loadHTML($page);
libxml_clear_errors();
$images = $doc->getElementsByTagName('img'); 
foreach($images as $image) {
    echo $image->getAttribute('src') . '<br />';
}

?>