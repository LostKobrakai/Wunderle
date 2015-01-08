<?php 

$projects = [];

foreach($page->find("template=project")->sort("sort") as $p){
	$projects[] = array(
		'title' => $p->title,
		'image' => array(
			'url' => $p->project_images->first()->size(375, 250)->url,
			'desc' => $p->project_images->description
		),
		'meta_type' => $p->meta_type->title,
		'meta_status' => $p->meta_status->title
	);
}

$templateData = array(
	'title' => $page->title,
	'types' => $page->children->explode("title"),
	'status' => $pages->find("parent_id=1027")->explode("title"),
	'projects' => $projects
);
