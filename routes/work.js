var express = require('express');
var router = express.Router();

/* GET work page. */
router.get('/', function(req, res, next) {
  res.render('work', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/pricing-image-50-900x600.png",
      sectionH1: "My work",
      sectionP: "On this page is a list of projects I have made including a description of what I did during the project and my reasons for the decisions I made where it's applicable. As always, if you have any questions about the things in here feel free to contact me.",
      otherClasses: "inset-background-cover"
    },
    sections: [
      {
        bgColour: "light",
        textColour: "dark",
        bgImage: "",
        sectionH2: "Online calculator",
        sectionP: "This is something I made for a bit of practice. It's an online calculator. It's pretty self-explanitory, it can do basic math problems.",
        sectionButtonLink: "/work/calculator",
        otherClasses: ""
      },
      {
        bgColour: "light",
        textColour: "dark",
        bgImage: "",
        sectionH2: "Breakout clone",
        sectionP: "I made this small game to practice Javascript. It's pretty rusty but it was fun to make and it might be interesting to play.",
        sectionButtonLink: "/work/breakout",
        otherClasses: ""
      },
    ]
  });
});

/* GET calculator page. */
router.get('/calculator', function(req, res, next) {
  res.render('work/calculator', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "../images/pricing-image-50-900x600.png",
      sectionH1: "My calculator",
      sectionP: "You can calculate numbers below.",
      otherClasses: "inset-background-cover"
    }
  });
});

/* GET breakout page. */
router.get('/breakout', function(req, res, next) {
  res.render('work/breakout', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "../images/pricing-image-50-900x600.png",
      sectionH1: "Breakout clone",
      sectionP: "I made this to practice Javascript. It's pretty rusty but it was fun to make and it might be interesting to play.",
      otherClasses: "inset-background-cover"
    }
  });
});


module.exports = router;
