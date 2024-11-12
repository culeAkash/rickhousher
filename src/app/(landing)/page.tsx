import LandingHero from "@/components/landing-page/landing-hero";
import LandingNavbar from "@/components/landing-page/landing-navbar";
import React from "react";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
    </div>
  );
};

export default LandingPage;
