<!-- 
	-----EXAMPLE-----
	$bgColour = "primary";
	$bgImage = "images/laptop-60-opacity.png";
	$textColour = "dark";
	$sectionH2 = "Deej Potter Designs";
	$sectionP = "Your own personal web designer. <br>Prices start at $100. <br><strong>Contact me now!</strong>";
	$otherClasses = "";
	include "templates/basic-section"
 -->

<section class="bg-<?php echo $bgColour ?> text-<?php echo $textColour ?> py-5 <?php echo $otherClasses ?>" style='background-image:url(<?php echo $bgImage ?>);'>
	<div class="container">
		<h2><?php echo $sectionH2 ?></h2>
		<p class=""><?php echo $sectionP ?></p>
	</div>
</section>