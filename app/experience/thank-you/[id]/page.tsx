"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FileText, Lightbulb, Home } from "lucide-react";
import { FeedbackComponent } from "@/app/Components/MainMenu/FeedbackComponent";
import Image from "next/image";
import Logo from "@/images/LogoSonderWithText.png";

interface NextStepCardProps {
  title: string;
  description: string;
  linkText: string;
  href: string;
  icon: React.ReactNode;
}

const NextStepCard: React.FC<NextStepCardProps> = ({
  title,
  description,
  linkText,
  href,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center mb-2">
          <div className="bg-[#E6F3F5] p-2 rounded-full mr-3">
            {React.cloneElement(icon as React.ReactElement, {
              className: "text-blue-800 w-5 h-5",
            })}
          </div>
          <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      </div>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-800 font-medium hover:text-[#0077BE] transition-colors duration-300 text-sm"
      >
        {linkText}
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Link>
    </motion.div>
  );
};

export default function Thank_you_page({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="h-screen bg-gradient-to-b from-[#E6F3F5] to-[#F0FCFF] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col"
      >
        <div className="bg-gradient-to-r from-blue-800 to-[#00A9C1] px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-xl text-[#E6F3F5]">
            For Completing Experience {id}
          </p>
        </div>

        <div className="px-6 py-8 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
              We hope you enjoyed this visual learning journey. Your exploration
              of concepts through interactive visualizations is just beginning!
            </p>

            {/* <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Key Concepts Recap</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Linear regression fits a line to data points, aiming to best represent the data based on a scoring system.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span>Traditional linear regression can be heavily influenced by outliers, leading to inaccurate predictions.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>A ridge term is introduced to the score penalize large slopes, helping the model resist the impact of outliers.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>The lambda parameter controls the strength of the ridge term, balancing between fitting the data and resisting outliers.</span>
                </li>
              </ul>
            </div> */}

           

            {/* <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
              What&apos;s Next?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <NextStepCard
                title="Book a Session"
                description="Dive deeper with one-on-one tutoring tailored to your needs."
                linkText="Schedule Now"
                href="https://calendly.com/arnav-oclc/15min"
                icon={<Calendar />}
              />
              <NextStepCard
                title="Customize Learning"
                description="Share your interests to help us create content just for you."
                linkText="Share Interests"
                href="https://forms.gle/PDwVzL8ZhMkuFVGDA"
                icon={<FileText />}
              />
              <NextStepCard
                title="Join Our Mailing List"
                description="Stay updated with our latest developments!"
                linkText="Join Now"
                href="https://9729ede9.sibforms.com/serve/MUIFAObmZioMnx2G7YXhT2i8LY3fpP69uEHzduFFiLncuN1DoMRuJ5yq52HSq-NP2tiHznzse12ITQJ1_v1H2htsWj48ZZmv2UFa9E5WzPurpXUYrJ_4cvEZISQDMt4qksWTSOYcIYOriRPoB6yWnhgFRPQKixzsySU_19sSxMLSB5T6d0bsu7gRVQ4-L3PQM7T9aOldVK-Zo7sH"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                }
              />
            </div> */}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Main Menu
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Thank you for being part of our learning community. We&apos;re
              dedicated to making your educational journey both interactive and
              inspiring.
            </p>
          </div>
        </div>
      </motion.div>

      <FeedbackComponent />
    </div>
  );
}
