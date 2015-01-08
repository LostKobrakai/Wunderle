<?php 

$projects = [];

foreach($page->find("template=contest, sort=sort") as $p){
	$projects[] = array(
		'title' => $p->title,
		'url' => $p->url,
		'image' => array(
			'url' => $p->project_images->first()->size(375, 250)->url,
			'desc' => $p->project_images->description
		),
		'meta_type' => array(
			'title' => "Wettbewerb"
		),
		'meta_status' => $p->meta_status->title
	);
}

$templateData = array(
	'title' => $page->title,
	'status' => $pages->find("parent_id=1027")->explode("title"),
	'projects' => $projects
);
