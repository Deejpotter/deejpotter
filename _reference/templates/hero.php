<!-- 
	-----EXAMPLE-----
	$bgColour = "primary";
	$bgImage = "images/laptop-60-opacity.png";
	$textColour = "dark";
	$sectionH1 = "Deej Potter Designs";
	$sectionP = "Your own personal web designer. <br>Prices start at $100. <br><strong>Contact me now!</strong>";
	$otherClasses = "";
	include "templates/hero"
 -->

<section class="jumbotron jumbotron-fluid bg-<?php echo $bgColour ?> text-<?php echo $textColour ?> my-0 <?php echo $otherClasses ?>" style='background-image:url(<?php echo $bgImage ?>);'>
	<div class="container text-center">
		<h1 class="display-1"><?php echo $sectionH1 ?></h1>
		<p class="lead"><?php echo $sectionP ?></p>
	</div>
</section>