<?php 

$templateData = array(
		'title' => $page->title,
		'url' => $page->url,
		'content' => $page->text,
		'date' => $page->date,
		'notoggle' => true,
		'publisher' => $page->headline,
		'original' => $page->file ? array(
			'url' => $page->file->url
		) : false
	);
