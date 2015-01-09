<?php 

$projects = [];

foreach($page->find("template=project, sort=sort") as $p){
	$projects[] = array(
		'title' => $p->title,
		'url' => $p->url,
		'image' => array(
			'url' => $p->project_images->first()->size(375, 250)->url,
			'desc' => $p->project_images->description
		),
		'meta_type' => array(
			'title' => $p->meta_type->title,
			'url' => $p->meta_type->url
		),
		'meta_status' => $p->meta_status ? $p->meta_status->title : ""
	);
}

$inactive = [];

foreach($page->parent->find("parent_id!=$page->id, template=project") as $p){
	$inactive[] = array(
		'title' => $p->title,
		'url' => $p->url,
		'image' => array(
			'url' => $p->project_images->first()->size(375, 250)->url,
			'desc' => $p->project_images->description
		),
		'meta_type' => array(
			'title' => $p->meta_type->title,
			'url' => $p->meta_type->url
		),
		'meta_status' => $p->meta_status ? $p->meta_status->title : ""
	);
}

$templateData = array(
	'title' => $page->title,
	'types' => $page->parent->children->explode("title"),
	'status' => $pages->find("parent_id=1027")->explode("title"),
	'projects' => $projects,
	'inactive' => $inactive
);
