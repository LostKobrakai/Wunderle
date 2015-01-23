<?php 

$news = [];
$slides = [];

foreach($page->slider as $n){
	$slides[] = array(
		'title' => $n->title,
		'url' => $n->url,
		'image' => array(
			'url' => $n->project_images->eq(0)->size(850, 567, array(
				'quality' => 90,
				'upscaling' => false, 
				'cropping' => 'center' 
			))->url,
			'desc' => $n->project_images->eq(0)->description
		)
	);
}

foreach($pages->find("template=news, sort=-date") as $n){
	$news[] = array(
		'title' => $n->title,
		'url' => $n->url,
		'content' => $n->text,
		'date' => $n->date
	);
}

$templateData = array(
	'title' => $page->title,
	'news' => $news,
	'slides' => $slides
);