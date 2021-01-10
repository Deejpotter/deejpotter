function toggleMenu() {
  var x = document.getElementsByClassName("main-nav")[0];
  if (x.style.display === "flex") {
    x.style.display = "none";
  } else {
    x.style.display = "flex";
  }
}