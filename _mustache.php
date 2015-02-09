<?php
	$times["Computing"] = Debug::timer($templateTimings);

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
		<script src="<?php echo $config->urls->templates?>js/libs/script.js" type="text/javascript" async></script>
		<script src="<?php echo $config->urls->templates?>js/main.js" type="text/javascript" async></script>
		<script type="text/javascript">
			//if (!!!theme) theme = {};
			<?php //echo "theme.initTemplate = \"".$page->template->name."\";"; ?>
			<?php if(in_array($template, array("projects", "project-category"))) //echo "theme.initData = ".json_encode(new FrontendPage($page, $templateData, $template)).";"; ?>
			<?php 
				//echo "theme.projectimages=[";
				foreach($pages->find("template=project") as $project) {
					//echo "{'title': '".$project->title."', 'img': '".$project->project_images->first()->url."'}, ";
				}
				//echo "];";
			?>
		</script>
		<!-- <script src="<?php echo $config->urls->templates?>js/canvas.min.js" type="text/javascript"></script> -->
	</body>
</html>
<?php
	flush();
	ob_flush();

	$times["Rendering"] = Debug::timer($templateTimings);
	$strings = array_map(function ($v, $k) { 
		return $k . ': done by ' . $v . 'ms'; 
	}, $times, array_keys($times));
	$log->save("template-timings", implode(' | ', $strings));

	$log->prune("template-timings", 30);