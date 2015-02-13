<!DOCTYPE html>
<!--[if lt IE 7]><html class="ie ie6" lang="de"> <![endif]-->
<!--[if IE 7]><html class="ie ie7" lang="de"> <![endif]-->
<!--[if IE 8]><html class="ie ie8" lang="de"> <![endif]-->
<!--[if IE]><html class="ie" lang="de"> <![endif]-->
<html lang="de">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1">
		<?php echo $page->seo->render; ?>
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>style.css" /><script src="<?php echo $config->urls->templates?>js/modernizr.js" type="text/javascript"></script>
		<script src="<?php echo $config->urls->templates?>js/libs/picturefill.min.js" type="text/javascript"></script>
	</head>
	<body>
		<header class="siteHeader">
			<a href="<?php echo $homepage->url; ?>" data-template="<?php echo $homepage->template->name; ?>" class="logo">
				<span class="logo--bold">
					Wunderle + Partner
				</span>
				<span class="logo--light">
					Architekten
				</span>
			</a>
			<nav class="mainnav">
				<h1 class="is-vishidden">Mainnavigation</h1>
				<a href="#footernav" class="js-toggleMobileNav mobileToggle">Menü</a>
				<ul class="mainnav__firstlevel">
					<?php foreach($homepage->children as $first) : 
						$altHref = $first->template->name === "agency" ? "data-href='{$first->child->url}' " : "";
					?>
					<li<?php if($first->id === $page->id || in_array($first->id, $page->parents->explode("id"))) echo " class='active'"; ?>>
						<a href="<?php echo $first->url; ?>" <?php echo $altHref; ?>data-template="<?php echo $first->template->name; ?>"><?php echo $first->title; ?></a>
						<?php if($first->numChildren && $first->template->name !== "contests") : ?>
						<div class="nav-aside">
							<ul class="mainnav__secondlevel">
							<?php foreach($first->children as $second) : ?>
								<li<?php if($second->id === $page->id || in_array($second->id, $page->parents->explode("id"))) echo " class='active'"; ?>>
									<a href="<?php echo $second->url; ?>" data-template="<?php echo $second->template->name; ?>" data-title="<?php echo $second->title; ?>"><?php echo $second->title; ?></a>
							<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; endforeach; ?>
				</ul>
			</nav>