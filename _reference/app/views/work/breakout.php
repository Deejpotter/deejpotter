<?php 
$fileLevel = "../";
$title = "Breakout clone | Deej Potter Designs";
include "../templates/header" 
?>

<main id="main">	

    <!-- Hero section -->
	<?php
		$bgColour = "primary";
		$bgImage = "../images/pricing-image-50-900x600.png";
		$textColour = "light";
		$sectionH1 = "Breakout clone";
		$sectionP = "I made this to practice Javascript. It's pretty rusty but it was fun to make and it might be interesting to play.";
		$otherClasses = "inset-background-cover";
		include "../templates/hero"
    ?>	

    <!-- Content section -->
    <section class="container-fluid">
        <canvas id="myCanvas" width="480" height="320"></canvas>

        <script src="/js/breakout.js"></script>
    </section>
	
</main>

<?php include "../templates/footer" ?>