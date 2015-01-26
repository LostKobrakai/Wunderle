<?php

	//Is ajax call?
	if($config->ajax){
		header('Content-type: application/json');
		echo json_encode(new FrontendPage($page, $templateData, $template));
		die();
	}

	//Actually Render Stuff
	$m = new Mustache_Engine(array(
		'cache' => dirname(__FILE__).'/../assets/cache/mustache',
		'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/views'),
		'partials_loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/views/partials')
	));

	$tpl = $m->loadTemplate($template);
	$content = $tpl->render($templateData);

	$tpl = $m->loadTemplate("breadcrumb");
	$current = array_pop($breadcrumb);
	$breadcrumb_markup = $tpl->render(array('parents' => $breadcrumb, 'current' => array($current)));
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<meta charset="UTF-8">
		<title><?php echo $page->title; ?></title>
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1">
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>style.css" />
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
			<nav class="breadcrumb">
				<?php echo $breadcrumb_markup; ?>
			</nav>
		</header>
		<main id="content" class="maxWidth">
			<?php echo $content; ?>
		</main>
		<footer class="siteFooter">
			<div class="container">
				<nav class="footernav">
					<h1 class="is-vishidden">Footernavigation</h1>
					<ul>
						<?php 
							foreach($settings->footer as $item) :
								if($item->switch) :
						?>
						<li>
							<a href="<?php echo $item->website; ?>">
								<?php echo $item->title; ?>
							</a>
						<?php else : ?>
						<li>
							<a href="<?php echo $item->page->url; ?>">
								<?php echo $item->page->title; ?>
							</a>
						<?php endif; endforeach; ?>
					</ul>
				</nav>
				<span class="copy">&copy; <?php echo date("Y"); ?> Wunderle + Partner Architekten</span>
			</div>
		</footer>
		<script src="<?php echo $config->urls->templates?>js/master.min.js" type="text/javascript"></script>
		<script type="text/javascript">
			<?php echo "theme.initTemplate = \"".$page->template->name."\";"; ?>
			<?php if(in_array($template, array("projects", "project-category"))) echo "theme.initData = ".json_encode(new FrontendPage($page, $templateData, $template)).";"; ?>
			<?php 
				echo "theme.projectimages=[";
				foreach($pages->find("template=project") as $project) {
					echo "{'title': '".$project->title."', 'img': '".$project->project_images->first()->url."'}, ";
				}
				echo "];";
			?>
		</script>
		<!-- <script src="<?php echo $config->urls->templates?>js/canvas.min.js" type="text/javascript"></script> -->
		<script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js" type="text/javascript"></script>
	</body>
</html>