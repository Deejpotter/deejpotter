import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Deej Potter",
  description:
    "Learn about Deej Potter, a passionate web developer and family man. Discover my journey, interests, and what drives my passion for technology and continuous learning.",
  openGraph: {
    title: "About Me | Deej Potter",
    description:
      "Learn about Deej Potter, a passionate web developer and family man. Discover my journey, interests, and what drives my passion for technology and continuous learning.",
    url: "https://deejpotter.com/about",
    images: [
      {
        url: "/images/deejPotterLogo.png",
        width: 800,
        height: 600,
      },
    ],
  },
  alternates: {
    canonical: "https://deejpotter.com/about",
  },
};
