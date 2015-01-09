<?php
require 'vendor/autoload.php';

$homepage = $pages->get("/");
$settings = $pages->get(1020);

$template = $page->template->name;
$templateData = "";

//breadcrumb

$breadcrumb = [];

foreach($page->parents->append($page) as $item){
	$breadcrumb[] = array(
		'title' => $item->title,
		'url' => $item->url
	);
}