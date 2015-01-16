<?php
$parts = array("profile", "philosophy", "quality", "services");

$templateData = array(
	'title' => $page->title,
	'intro' => $page->text,
	'image' => array(
		'url' => $page->image->url,
		'desc' => $page->image->description
	),
);

foreach($parts as $part){
	$templateData[$part] = array(
		'title' => $page->get($part."_headline"),
		'text' => $page->get($part."_text")
	);
}