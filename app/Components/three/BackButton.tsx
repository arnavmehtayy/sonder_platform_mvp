import React from "react";
import Link from "next/link";
import { useStore } from "@/app/store";

// A curved back button that takes the user back to the experiences page from each slide of a viztool

const CurvedBackButton = () => {
  const handleBack = () => {
    useStore.setState({
      order: [],
      vizobjs: {},
      title: "",
      questions: {},
      controls: {},
      placement: {},
      scores: {},
      validations: [],
      influenceAdvIndex: {},
    });
  };

  return (
    <Link
      href="/" // link to the main page
      onClick={handleBack}
      className="absolute top-2 left-2 z-10 w-20 h-20 bg-black bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:bg-opacity-40 hover:text-white transition-all duration-300 group"
      title="Back to Experiences"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default CurvedBackButton;
