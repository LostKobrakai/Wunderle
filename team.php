<?
$fields = array("management", "office", "architects", "constructionists", "interns");

$templateData = array(
	'title' => $page->title,
	'intro' => $page->text,
	'teams' => array(
		array(
			'title' => $page->fields->get("management")->label,
			'name' => 'management',
			'items' => $page->management->getArray()
		),
		array(
			'title' => $page->fields->get("office")->label,
			'name' => 'office',
			'items' => $page->office->getArray()
		),
		array(
			'title' => $page->fields->get("architects")->label,
			'name' => 'architects',
			'items' => $page->architects->getArray()
		),
		array(
			'title' => $page->fields->get("constructionists")->label,
			'name' => 'constructionists',
			'items' => $page->constructionists->getArray()
		),
		array(
			'title' => $page->fields->get("interns")->label,
			'name' => 'interns',
			'items' => $page->interns->getArray()
		)
	)
);