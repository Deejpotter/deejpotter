var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/laptop-60-opacity.png",
      sectionH1: "Deej Potter",
      sectionP: "My personal website",
      otherClasses: "inset-background-cover"
    },
    firstSection: {
      bgColour: "light",
      textColour: "dark",
      bgImage: "",
      sectionH2: "I’m here to help you",
      sectionP: "I know there is a lot to learn when it comes to the internet so I’m here to guide you through the whole journey. You’ll have personal contact with me the whole time and I will be happy to answer any questions you have. I also have varying levels of service after your website is finished so you can be sure you will never be left not knowing what to do next.",
      otherClasses: ""
    },
    secondSection: {
      bgColour: "secondary",
      textColour: "light",
      bgImage: "images/pencils-60-opacity.png",
      sectionH2: "An affordable marketing option",
      sectionP: "Every business needs a website. When people are looking for something these days the first place they look is online. So what do people see when they search for you? This is where I come in. I can build you a high quality, responsive website for as little as $100. You can then take your website and you’re free to do whatever you want with it but if you need help with that I offer a few levels of service from as little as $10 per month. You can read more about my prices on my pricing page.",
      otherClasses: "inset-background-right"
    },
    aboutSection: {
      bgColour: "light",
      textColour: "dark",
      bgImage: "",
      sectionH2: "Helpful and technological",
      sectionP: "I love working with technology and I love helping people. With web design, I get to do both of those things. I have a wife and 3 kids and they are the main reason I wanted to start my own business, to spend more time with them. If you’d like to know more check out my personal page.",
      otherClasses: ""
    },
    contactSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/contact-image-50-800x600.png",
      sectionH2: "Ready to get started?",
      sectionP: "Maybe you just have some questions. Either way, contact me and let me know. I’d love to hear from you.",
      buttonColour: "secondary",
      sectionButtonLink: "/contact",
      sectionButtonText: "Contact me now",
      otherClasses: "inset-background-right"
    }
  });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/contact-image-50-800x600.png",
      sectionH1: "Ready to talk about your project?",
      sectionP: "Please fill out the form below and I'll get back to you as soon as I can. I can't wait to hear from you.",
      otherClasses: "inset-background-cover"
    }
  });
});
/* POST contact page. */
router.post('/contact', function(req, res, next) {
  var name = JSON.stringify(req.body.name)
  var email = JSON.stringify(req.body.email)
  var message = JSON.stringify(req.body.message)
var transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    user: 'deejpotterdesigns@hotmail.com',
    pass: 'Daniel1990'
  }
});
var mailOptions = {
  from: 'deejpotterdesigns@hotmail.com',
  to: 'deejpotter@gmail.com',
  subject: 'Sending Email using Node.js',
  text: ''
};
console.log(mailOptions)
mailOptions.text = name + " " + email + " " + message;
console.log(mailOptions)
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
 res.redirect('/thankYou')
});

/* GET thank you page. */
router.get('/thankYou', function(req, res, next) {
  res.render('thankYou', {

  });
});

/* GET pricing page. */
router.get('/pricing', function(req, res, next) {
  res.render('pricing', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/pricing-image-50-900x600.png",
      sectionH1: "All about me",
      sectionP: "If you want to know more about my life you've come to the right place.",
      otherClasses: "inset-background-cover"
    }
  });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/pricing-image-50-900x600.png",
      sectionH1: "All about me",
      sectionP: "If you want to know more about my life you've come to the right place.",
      otherClasses: "inset-background-cover"
    }
  });
});

/* GET about page. */
router.get('/privacyPolicy', function(req, res, next) {
  res.render('privacyPolicy', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/pricing-image-50-900x600.png",
      sectionH1: "All about me",
      sectionP: "If you want to know more about my life you've come to the right place.",
      otherClasses: "inset-background-cover"
    }
  });
});

/* GET about page. */
router.get('/terms', function(req, res, next) {
  res.render('terms', { 
    heroSection: {
      bgColour: "primary",
      textColour: "light",
      bgImage: "images/pricing-image-50-900x600.png",
      sectionH1: "All about me",
      sectionP: "If you want to know more about my life you've come to the right place.",
      otherClasses: "inset-background-cover"
    }
  });
});

module.exports = router;
