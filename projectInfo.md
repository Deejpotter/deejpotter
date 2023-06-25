# Project Info

This document provides a detailed overview of the planning and technical aspects of my portfolio website.

## Overview

This portfolio website is a personal project that showcases my journey as a full-stack developer. It includes sections about me, a contact form, showcases of my website projects, games, and technical apps, as well as some blog posts about stuff I know about. The website has evolved over time, starting with PHP, then migrating to Angular, and now built with Next.js for the speed and SEO benefits of static site generation while still keeping a good amount of dynamic functionality. The content is managed using Netlify CMS, and user authentication is handled by Netlify Identity. The dynamic functionality is handled by Netlify Functions.

## Planning

The website is divided into six main sections:

1. **About**: This section provides a brief introduction about me and my journey into the tech world.
1. **Contact**: This section includes a contact form built with Netlify Forms.
1. **Website Projects**: This section is for the websites I've built, with pages generated dynamically using Netlify CMS.
1. **Games**: This section is for the WebGL games I've developed. The games are hosted both on the website itself and on third-party sites. The pages are generated dynamically using Netlify CMS but some of the files are pulled in dynamically.
1. **Technical Apps**: This section is for technical apps with dynamic functionality that I've built. Again, the pages are generated dynamically using Netlify CMS but the functionality of these apps is handled by Netlify Functions.
1. **Blog**: Here I'll have blog posts about all the great things I know about.

The portfolio has seen several iterations, starting with PHP, then migrating to Angular when I was working with Angular at One Alpha, and now transitioning to Next.js for the speed and SEO benefits of static site generation while still keeping a good amount of dynamic functionality.

## Technical Details

The portfolio website is currently built with Next.js. It uses Netlify CMS for content management, Netlify Forms for the contact form, and Netlify Identity for user authentication.

The website pages are generated dynamically using Netlify CMS. The WebGL games are hosted both on the website itself and on third-party sites. User authentication is handled by Netlify Identity.

Some of the main challenges during the development process were:

1. **Migrating from PHP to Angular**: 

1. **Implementing Netlify Identity**:

1. **Implementing Netlify Forms with Angular Reactive Forms**: 

1. **Migrating from Angular to Next.js**: This required a thorough understanding of both frameworks and careful planning to ensure a smooth transition. Aside from learning the new best practices for Next, the solution involved reconfiguring the project structure, rewriting components, and reintegrating with Netlify CMS, Netlify Forms, and Netlify Identity.
