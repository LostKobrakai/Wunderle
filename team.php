<?php
$fields = array("management", "office", "architects", "constructionists", "interns");

function changeAtSign(Array $a){
	for ($i=0; $i < count($a); $i++) { 
		$a[$i]["email"] = str_replace("@", "[at]", $a[$i]["email"]);
	}
	return $a;
}

$templateData = array(
	'title' => $page->title,
	'intro' => $page->text,
	'teams' => array(
		array(
			'title' => $page->fields->get("management")->label,
			'name' => 'management',
			'items' => changeAtSign($page->management->getArray())
		),
		array(
			'title' => $page->fields->get("office")->label,
			'name' => 'office',
			'items' => changeAtSign($page->office->getArray())
		),
		array(
			'title' => $page->fields->get("architects")->label,
			'name' => 'architects',
			'items' => changeAtSign($page->architects->getArray())
		),
		array(
			'title' => $page->fields->get("constructionists")->label,
			'name' => 'constructionists',
			'items' => changeAtSign($page->constructionists->getArray())
		),
		array(
			'title' => $page->fields->get("interns")->label,
			'name' => 'interns',
			'items' => changeAtSign($page->interns->getArray())
		)
	)
);