<?php

if($config->ajax){
	$session->redirect($page->parent->url);
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
	'noAjax' => true
);