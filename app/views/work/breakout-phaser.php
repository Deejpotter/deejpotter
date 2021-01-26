<?php 
$fileLevel = "../";
$title = "Phaser breakout clone | Deej Potter Designs";
include "../templates/header" 
?>

<main id="main">	

    <!-- Hero section -->
	<?php
		$bgColour = "primary";
		$bgImage = "../images/pricing-image-50-900x600.png";
		$textColour = "light";
		$sectionH1 = "Breakout clone";
		$sectionP = "I made this to practice Phaser. It's pretty rusty but it was fun to make and it might be interesting to play.";
		$otherClasses = "inset-background-cover";
		include "../templates/hero"
    ?>	

    <!-- Content section -->
    <section class="container">
        <div id="game-area" class=""></div>

        <script src="/js/phaser.js"></script>
        <script src="/js/breakout-phaser.js"></script>
    </section>
	
</main>

<?php include "../templates/footer" ?>