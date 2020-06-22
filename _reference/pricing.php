<?php 
$fileLevel = "";
$title = "Pricing | Deej Potter Designs";

include "./templates/header" 
?>


<main id="main">

	<!-- Hero section -->
	<?php
		$bgColour = "primary";
		$bgImage = "images/pricing-image-50-900x600.png";
		$textColour = "light";
		$sectionH1 = "Prices";
		$sectionP = "On this page you can find information about my prices as well as a form to get a quick quote.";
		$otherClasses = "inset-background-cover";
		include "templates/hero"
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

	<!-- Content section -->
	<section class="container pb-5">
		<div class="row">
			<div class="col-md">
				<h2>Get an instant quote</h2>
				<p>Choose the number of pages you need (just take a guess if you aren't sure, 
				you may need more or less than you think). Next choose a level of hosting for after your 
				website is done. Finally, choose any addons you want and if you need copywriting for your web pages. 
				You will then see an estimated price below the form.</p>
				<p>Remember that this is just an estimate, to get a 
				proper quote you'll need to contact me and have a full asessment done.</p>
			</div>

			<div class="col-md">
				<form id="pricing-form" name="pricing-form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
					<div class="form-group">
						<label for='pages'>How many pages do you think you will need:</label>
						<input class="form-control shadow" type="number" name="pages" id = "pages" oninput="getTotal()">
					</div>
					<div class="form-group">
						<label for='hosting'>What kind of hosting would you like:</label>
						<select class="form-control shadow" name="hosting" id="hosting" onchange="getHostingTotal()">
							<option value="none">None</option>
							<option value="basic">Just hosting - $10 per month</option>
							<option value="analytics">Hosting and analytics - $30 per month</option>
							<option value="marketing">Digital marketing package - $100 per month</option>
						</select>
					</div>
					<div class="form-group">
						<div class="form-group">
							<label for='database'>Database integration (allow people to sign up for an account on your website) - $200</label>
							<input type="checkbox" name="database" id="database" value="200" onchange="getTotal()"/>
						</div>

						<div class="form-group">
							<label for='spreadsheet'>Spreadsheet content editing (edit your content through Google Sheets) - $200</label>
							<input type="checkbox" name="spreadsheet" id="spreadsheet" value="200" onchange="getTotal()"/>
						</div>

						<div class="form-group">
							<label for='copywriting'>Copywriting (I'll write content for your website) - $50 per page</label>
							<input type="checkbox" name="copywriting" id="copywriting" value="50" onchange="getTotal()"/>
						</div>
					</div>
					<div id="cost-section">
						<p id="total-cost" class="font-weight-bold">Total cost = $0</p>
						<p id="monthly-cost" class="font-weight-bold">Monthly cost = $0</p>
					</div>
					<div>
						<p>If this sounds good or you want a more accurate quote click the button below to get started.</p>
						<a href="contact" class="btn btn-primary shadow">Get a quote</a>
					</div>	
				</form>
			</div>
		</div>
	</section>

</main>

<script language="JavaScript" src="js/pricing.js" type="text/javascript"></script>
<script language="JavaScript" src="js/gen_validatorv31.js" type="text/javascript"></script>				
<script language="JavaScript">
	// Code for validating the form
	// Visit http://www.javascript-coder.com/html-form/javascript-form-validation.phtml
	// for details
	var frmvalidator  = new Validator("pricing-form");
	frmvalidator.addValidation("pages","req"); 
	frmvalidator.addValidation("hosting","req"); ; 
</script>	

<?php include "./templates/footer" ?>