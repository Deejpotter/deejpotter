<!-- 
	-----EXAMPLE-----
	$bgColour = "light";
	$textColour = "dark";
	$bgImage = "";
	$sectionH2 = "Ready to get started?";
	$sectionP = "Maybe you just have some questions. <br>Either way, contact me and let me know. I’d love to hear from you.";
	$sectionButtonLink = "contact";
	$otherClasses = "";
	include "templates/index-section"
 -->

 <section class="index-section bg-<?php echo $bgColour ?> text-<?php echo $textColour ?> py-4 <?php echo $otherClasses ?>" style='background-image:url(<?php echo $bgImage ?>);'>
	<div class="container">
		<div class="row">
			<div class="col-10">
				<h2><?php echo $sectionH2; ?></h2>
				<p class=""><?php echo $sectionP; ?></p>
			</div>
			<div class="col-md-2">
				<a href= "<?php echo $fileLevel; echo $sectionButtonLink; ?>">
					<i class="fa fa-chevron-right text-<?php echo $textColour ?>"></i>
				</a>
			</div>
		</div>
	</div>
</section>