<?php 

$news = [];
$slides = [];

if($input->pageNum <= 1){

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
					))->url." ".(850 * 2)."w"
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

	foreach($pages->find("template=news, sort=-date, limit=5") as $n){
		$news[] = array(
			'title' => $n->title,
			'url' => $n->url,
			'content' => $n->text,
			'date' => $n->date
		);
	}

	$newsCount = $pages->count("template=news, sort=-date");

	$templateData = array(
		'title' => $page->title,
		'newslist' => array(
			'title' => "Aktuelles"
		),
		'news' => $news,
		'newsCount' => $newsCount,
		'slides' => $slides,
		'newsfolder' => array(
			'url' => $pages->get("template=news-folder")->url
		),
		'pageNum' => $input->pageNum,
		'lastPage' => ceil($newsCount / 5)
	);

}else{
	foreach($pages->find("template=news, sort=-date, limit=5") as $n){
		$news[] = array(
			'title' => $n->title,
			'url' => $n->url,
			'content' => $n->text,
			'date' => $n->date
		);
	}

		$templateData = array(
		'news' => $news,
		'pageNum' => $input->pageNum
	);
}