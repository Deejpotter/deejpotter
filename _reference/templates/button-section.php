<!-- 
	-----EXAMPLE-----
	$bgColour = "primary";
		$textColour = "light";
		$bgImage = "images/contact-image-50-800x600.png";
		$sectionH2 = "Ready to get started?";
		$sectionP = "Maybe you just have some questions. <br>Either way, contact me and let me know. I’d love to hear from you.";
		$buttonColour = "secondary";
		$sectionButtonLink = "contact";
		$sectionButtonText = "Contact me now";
		$otherClasses = "inset-background-right";
		include "templates/button-section"
 -->

<section class="bg-<?php echo $bgColour ?> text-<?php echo $textColour ?> py-5 <?php echo $otherClasses ?>" style='background-image:url(<?php echo $bgImage ?>);'>
	<div class="container">
		<h2><?php echo $sectionH2; ?></h2>
        <p class=""><?php echo $sectionP; ?></p>
        <a class="shadow btn btn-<?php echo $buttonColour ?>" href= "<?php echo $fileLevel; echo $sectionButtonLink; ?>"><?php echo $sectionButtonText; ?></a>	
	</div>
</section>