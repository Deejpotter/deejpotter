<?php 
$fileLevel = "";
$title = "Your personal web designer | Deej Potter Designs";
include "templates/header" 
?>

<main id="main">
	
	<!-- Hero section -->
	<?php
		$bgColour = "primary";
		$bgImage = "images/laptop-60-opacity.png";
		$textColour = "light";
		$sectionH1 = "Deej Potter Designs";
		$sectionP = "Your own personal web designer. <br>Prices start at $100. <br><strong>Contact me now!</strong>";
		$otherClasses = "inset-background-cover";
		include "templates/home-hero"
	?>

	<!-- Basic section -->
	<?php
		$bgColour = "light";
		$textColour = "dark";
		$bgImage = "";
		$sectionH2 = "I’m here to help you";
		$sectionP = "I know there is a lot to learn when it comes to the internet so I’m here to guide you through the whole journey. 
		You’ll have personal contact with me the whole time and I will be happy to answer any questions you have. 
		I also have varying levels of service after your website is finished so you can be sure you will never be left 
		not knowing what to do next.";
		$otherClasses = "";
		include "templates/basic-section"
	?>

	<!-- Basic section -->
	<?php
		$bgColour = "secondary";
		$textColour = "light";
		$bgImage = "images/pencils-60-opacity.png";
		$sectionH2 = "An affordable marketing option";
		$sectionP = "Every business needs a website. When people are looking for something these days the first place 
				they look is online. So what do people see when they search for you? This is where I come in. I can 
				build you a high quality, responsive website for as little as $100. You can then take your website 
				and you’re free to do whatever you want with it but if you need help with that I offer a few levels 
				of service from as little as $10 per month. You can read more about my prices on my pricing page.";
		$otherClasses = "inset-background-left";
		include "templates/basic-section"
	?>

	<!-- Basic section -->
	<?php
		$bgColour = "light";
		$textColour = "dark";
		$bgImage = "";
		$sectionH2 = "Helpful and technological";
		$sectionP = "I love working with technology and I love helping people. With web design, 
				I get to do both of those things. I have a wife and 3 kids and they are the main reason 
				I wanted to start my own business, to spend more time with them. If you’d like to know more 
				check out my personal page.";
		$otherClasses = "";
		include "templates/basic-section"
	?>

	<!-- Button section -->
	<?php
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
	?>
		
</main>

<?php include "templates/footer" ?>