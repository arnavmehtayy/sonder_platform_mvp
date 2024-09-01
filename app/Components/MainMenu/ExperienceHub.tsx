"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { experiences as exp } from "@/classes/Data/CompleteData";
import { ChevronRight, Activity, Eye } from "lucide-react";
import Image from "next/image";
import Logo from "@/images/Sonder logo with text.png";

/*
  The UI for the main page showing the experience Cards.
  Experience Card: A UI component that displays information about an experience and can be clicked to go to the
  relevant experience page
*/

const ExperienceCard = ({
  name,
  slides,
  index,
  description,
}: {
  name: string;
  slides: string[];
  index: number;
  description: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div // enlarge on hover
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      {/* A link to the first slide of the index'th experience */}
      <Link href={`/experience/${index}/0`} className="block h-full">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* background blue gradient  */}
          <div className="bg-gradient-to-r from-[#01A9B2] to-[#7AE5EC] text-white p-6">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <div className="flex items-center text-sm">
              <Eye size={16} className="mr-2" />
              <span>{slides.length} visualizations</span>
              {/* show the number of visualizations in the experience */}
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-between items-center">
              <span className="text-[#257276] font-semibold flex items-center">
                Start Experience
                <ChevronRight
                  size={20}
                  className={`ml-1 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
                {/* traslate arrow forward when hovering as user feedback to click to go to experience */}
              </span>
              <Activity size={24} className="text-[#18D9E4]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ExperienceHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-neutral-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Image
            src={Logo}
            alt="Company Logo"
            width={217} // Adjust these values to fit the layout
            height={60}
            className="mx-auto"
            priority
          />
        </div>
        <div className="py-12">
          {/* animation when page is first loaded */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-center text-white mb-4"
          >
            A Visual Interactive Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center text-white mb-12"
          >
            Change the way you engage with educational content
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* showing all the experience cards as part of the main page */}
            {exp.map((experience, index) => (
              <ExperienceCard
                key={experience.name}
                name={experience.name}
                slides={experience.slides}
                index={index}
                description={experience.description}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceHub;
