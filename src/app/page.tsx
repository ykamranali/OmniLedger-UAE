import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomeLanding } from "@/components/home/HomeLanding";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900 font-sans">
      <Navbar />
      <HomeLanding />
      <Footer />
    </div>
  );
}
