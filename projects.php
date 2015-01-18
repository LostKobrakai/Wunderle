<?php 

$projects = [];

foreach($page->find("template=project, sort=sort") as $p){
	$projects[] = array(
		'id' => $p->id,
		'title' => $p->title,
		'url' => $p->url,
		'image' => array(
			'url' => $p->project_images->first()->size(375, 250)->url,
			'desc' => $p->project_images->first()->description
		),
		'meta_type' => array(
			'title' => $p->meta_type ? $p->meta_type->title : "",
			'url' => $p->meta_type ? $p->meta_type->url : ""
		),
		'meta_status' => $p->meta_status ? $p->meta_status->title : ""
	);
}

$templateData = array(
	'title' => $page->title,
	'types' => $page->children->explode(function($item){
		return array(
			'title' => $item->title,
			'url' => $item->url,
			'id' => $item->id
		);
	}),
	'status' => $pages->find("parent_id=1027")->explode("title"),
	'projects' => $projects
);
