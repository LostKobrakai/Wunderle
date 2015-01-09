<?php

	//Is ajax call?
	if($config->ajax) :
		$data = array('template' => $template, 'data' => $templateData);
		echo json_encode($data);
	else :

	//Actually Render Stuff
	$m = new Mustache_Engine(array(
		'cache' => dirname(__FILE__).'/../assets/cache/mustache',
		'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/views'),
		'partials_loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/views/partials')
	));

	$tpl = $m->loadTemplate($template);
	$content = $tpl->render($templateData);
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title><?php echo $page->title; ?></title>
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>style.css" />
	</head>
	<body>
		<header class="siteHeader">
			<a href="<?php echo $homepage->url; ?>" data-template="<?php echo $homepage->template->name; ?>" class="logo logo--bigmargin">
				<span class="logo--bold">
					Wunderle + Partner
				</span>
				<span class="logo--light">
					Architekten
				</span>
			</a>
			<nav class="mainnav">
				<h1 class="is-vishidden">Mainnavigation</h1>
				<ul class="mainnav__firstlevel">
					<?php foreach($homepage->children as $first) : ?>
					<li<?php if($first->id === $page->id || in_array($first->id, $page->parents->explode("id"))) echo " class='active'"; ?>>
						<a href="<?php echo $first->url; ?>" data-template="<?php echo $first->template->name; ?>"><?php echo $first->title; ?></a>
						<?php if($first->numChildren && $first->template->name !== "contests") : ?>
						<ul class="mainnav__secondlevel">
						<?php foreach($first->children as $second) : ?>
							<li<?php if($second->id === $page->id || in_array($second->id, $page->parents->explode("id"))) echo " class='active'"; ?>>
								<a href="<?php echo $second->url; ?>" data-template="<?php echo $second->template->name; ?>"><?php echo $second->title; ?></a>
						<?php endforeach; ?>
						</ul>
					<?php endif; endforeach; ?>
				</ul>
			</nav>
			<nav class="breadcrumb">
				<h1 class="is-vishidden">Breadcrump</h1>
				<ul>
				<?php 
					echo $page->parents->append($page)->implode(function($item){
						return "<li><a href='$item->url' title='$item->title'>$item->title</a>";
					});
				?>
				</ul>
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
		<script src="<?php echo $config->urls->templates?>js/canvas.min.js" type="text/javascript"></script>
	</body>
</html>
<?php 
	endif; 
?>