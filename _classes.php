<?php
class FrontendPage {
	public $id;
	public $url;
	public $parents;
	public $template;
	public $title;
	public $data;
	public $cache;

	function __construct(Page $page, $data, $template = null){
		$this->id = $page->id;
		$this->url = $page->url;
		$this->title = $page->title;
		$this->template = $template ? $template : $page->template->name;
		$this->data = $data;
		$this->cache = time();
		
		$this->parents = $page->parents->explode(function($item, $key){
			return array(
					'id' => $item->id,
					'title' => $item->title,
					'url' => $item->url
				);
		});
	}	
}