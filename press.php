<?php

$press = [];

foreach($page->children("template=press-article, sort=-date") as $article){
	$press[] = array(
		'title' => $article->title,
		'url' => $article->url,
		'content' => $article->text,
		'date' => $article->date,
		'inlist' => true,
		'publisher' => $article->headline,
		'original' => $article->file ? array(
			'url' => $article->file->url
		) : false
	);
}

$templateData = array(
	'title' => $page->title,
	'press' => $press
);