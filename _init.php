<?php
require 'vendor/autoload.php';

$homepage = $pages->get("/");
$settings = $pages->get(1020);

$template = $page->template->name;
$templateData = "";