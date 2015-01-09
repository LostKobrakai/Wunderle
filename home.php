<?php 

$news = [];

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
	'editLink' => $page->editable() ? "<a href='$page->editURL'>Edit</a>" : "Nooot!",
	'news' => $news
);
