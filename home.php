<?php 

$news = [];
$slides = [];

foreach($page->slider as $n){
	$slideshow_sizes = array(
		"100vw"
	);
	$slideshow_srcset = array(
		'medium' => $n->project_images->eq(0)->size(600, 400, array(
					'quality' => 90,
					'upscaling' => false, 
					'cropping' => 'center' 
				))->url." 600w",
		'large' => $n->project_images->eq(0)->size(850, 567, array(
					'quality' => 90,
					'upscaling' => false, 
					'cropping' => 'center' 
				))->url." 850w",
		'hdpi' => $n->project_images->eq(0)->size(850 * 2, 567 * 2, array(
					'quality' => 70,
					'upscaling' => false, 
					'cropping' => 'center' 
				))->url." 850w"
	);

	$slides[] = array(
		'title' => $n->title,
		'url' => $n->url,
		'image' => array(
			'url' => $n->project_images->eq(0)->size(420, 280, array(
				'quality' => 90,
				'upscaling' => false, 
				'cropping' => 'center' 
			))->url,
			'sizes' => implode(", ", $slideshow_sizes),
			'srcset' => implode(", ", $slideshow_srcset),
			'desc' => $n->project_images->eq(0)->description
		)
	);
}

foreach($pages->find("template=news, sort=-date") as $n){
	$news[] = array(
		'title' => $n->title,
		'url' => $n->url,
		'content' => $n->text,
		'date' => $n->date
	);
}

$templateData = array(
	'title' => $page->title,
	'news' => $news,
	'slides' => $slides
);