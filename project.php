<?php

$meta = array('status', 'client', 'type', 'time', 'size', 'place');

$meta = array_map(function($ele){
	$field = wire("page")->get("meta_$ele");
	if($field instanceof Page){
		$value = $field->title;
	}else{
		$value = $field === false ? $field : "";
	}
	return array(
		'name' => wire("fields")->get("meta_$ele")->label,
		'value' => $value
	);
}, $meta);

$templateData = array(
	'title' => $page->get("headline|title"),
	'subhead' => $page->subheadline,
	'text' => $page->text,
	'images' => array_values($page->project_images->explode(function($img){
		return array(
			'url' => $img->url,
			'desc' => $img->description
		);
	})),
	'meta' => $meta
);
