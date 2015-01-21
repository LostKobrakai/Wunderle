<?php

$meta = array('status', 'client', 'type', 'time', 'size', 'place');

$meta = array_map(function($ele){
	if($ele === "type"){
		return array('name' => wire("fields")->get("meta_$ele")->label, 'value' => "Wettbewerb");
	}
	$field = wire("page")->get("meta_$ele");
	if($field instanceof Page){
		$value = $field->title;
	}else{
		$value = $field !== false ? $field : "";
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
			'desc' => $img->description,
			'first' => $img === wire("page")->project_images->first(),
			'second' => $img === wire("page")->project_images->eq(1),
			'gallery' => $img !== wire("page")->project_images->eq(1) && $img !== wire("page")->project_images->eq(0)
		);
	})),
	'meta' => $meta
);
