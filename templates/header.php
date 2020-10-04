<!doctype html>
<html lang="en">

<head>

	<!-- Meta data -->
	<title><?php echo $title ?></title>
	<meta name="description" content="<?php echo $description ?>">
	<link rel="canonical" href="<?php echo $link ?>">
	<meta name="robots" content="index, follow">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- OG -->
	<meta property="og:title" content="<?php echo $title ?>">
	<meta property="og:description" content="<?php echo $description ?>">
	<meta property="og:url" content="<?php echo $link ?>">
	<meta property="og:type" content="website">
	<meta property="og:image" content="<?php echo $image ?>">

	<!-- Google fonts -->
	<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="<?php echo $fileLevel ?>css/bootstrap.css">

	<!-- MAIN CSS -->
	<link rel="stylesheet" href="<?php echo $fileLevel ?>css/style.css">

</head>


<body>

	<!-- Main header for every page -->
	<nav class="navbar navbar-expand-md">
		<div class="container">
			<!-- Brand -->
			<a class="navbar-brand" href="/">
				<img src="<?php echo $fileLevel ?>images/DeejPotterLogo.png">
			</a>

			<!-- Toggler/collapsibe Button -->
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
				<i class="fas fa-bars"></i>
			</button>

			<!-- Navbar links -->
			<div class="collapse navbar-collapse" id="collapsibleNavbar">
				<ul class="navbar-nav nav-fill ml-auto">
					<li class="nav-item">
						<a class="nav-link" href="<?php echo $fileLevel ?>websites">Websites</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo $fileLevel ?>games">Games</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo $fileLevel ?>about">About me</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="<?php echo $fileLevel ?>contact">Contact me</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>