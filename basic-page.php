<?php

$templateData = array(
	'title' => $page->title,
	'editLink' => $page->editable() ? "<a href='$page->editURL'>Edit</a>" : "Nooot!",
	'news' => $news
);
