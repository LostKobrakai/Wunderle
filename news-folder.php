<?php

if($config->ajax){
	$session->redirect($page->parent->url);
}

foreach($pages->find("template=news, sort=-date") as $n){
	$news[] = array(
		'title' => $n->title,
		'url' => $n->url,
		'content' => $n->text,
		'date' => $n->date,
		'inlist' => true
	);
}

$templateData = array(
	'title' => $page->title,
	'newslist' => array(
		'title' => "Aktuelles"
	),
	'news' => $news,
	'noAjax' => true
);