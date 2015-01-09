<?php 

$partner = [];
$position = array(
	__("links"), 
	__("mitte"), 
	__("rechts")
);

for($i = 0; $i < count($page->partner); $i++){
	$p = $page->partner->eq($i);
	$title = explode(", ", $p->title);
	$title[1] = explode(" ", $title[1]);
	$title[1] = array_map(function($ele){ return trim($ele); }, $title[1]);

	$title[1] = array_map(function($ele){ return substr($ele, 0, 1)."."; }, $title[1]);

	$name = implode(" ", $title[1])." ".$title[0];

	$partner[] = array(
		'title' => $name,
		'position' => $position[$i],
		'degree' => $p->degree,
		'text' => $p->text
	);
}

$templateData = array(
	'title' => $page->title,
	'intro' => $page->text,
	'image' => array(
		'url' => $page->image->url,
		'desc' => $page->image->description
	),
	'partner' => $partner
);
