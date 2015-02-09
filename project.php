<?php

$meta = array('status', 'client', 'type', 'time', 'size', 'place');

$meta = array_map(function($ele){
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
		$sizes = array(
			"100vw"
		);
		$srcset = array(
			'medium' => $img->size(600, 400, array(
						'quality' => 90,
						'upscaling' => false, 
						'cropping' => 'center' 
					))->url." 600w",
			'large' => $img->size(850, 567, array(
						'quality' => 90,
						'upscaling' => false, 
						'cropping' => 'center' 
					))->url." 850w",
			'xlarge' => $img->size(1200, 800, array(
						'quality' => 90,
						'upscaling' => false, 
						'cropping' => 'center' 
					))->url." 1200w",
			'hdpi' => $img->size(850 * 2, 567 * 2, array(
						'quality' => 70,
						'upscaling' => false, 
						'cropping' => 'center' 
					))->url." ".(850 * 2)."w"
		);

		if($img === wire("page")->project_images->first()){
			array_push($sizes, "(min-width: 850px) 50vw");
		}

		return array(
			'url' => $img->size(420, 280, array(
					'quality' => 90,
					'upscaling' => false, 
					'cropping' => 'center' 
				))->url,
			'desc' => $img->description,
			'sizes' => implode(", ", $sizes),
			'srcset' => implode(", ", $srcset),
			'first' => $img === wire("page")->project_images->first()
		);
	})),
	'meta' => $meta
);
