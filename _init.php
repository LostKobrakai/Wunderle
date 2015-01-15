<?php
require 'vendor/autoload.php';
require '_classes.php';

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

if($config->ajax && $input->get->breadcrumbOnly == 1){
	$data = array(
		'id' => $page->id,
		'template' => $template, 
		'breadcrumb' => array('breadcrumb' => $breadcrumb
	));
	echo json_encode($data);
	die();
}