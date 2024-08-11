"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, FileText, Lightbulb, Home } from 'lucide-react';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import Image from 'next/image';
import Logo from '@/images/LogoSonderWithText.png';

interface NextStepCardProps {
    title: string;
    description: string;
    linkText: string;
    href: string;
    icon: React.ReactNode;
}

const NextStepCard: React.FC<NextStepCardProps> = ({ title, description, linkText, href, icon }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex items-center mb-2">
                    <div className="bg-[#E6F3F5] p-2 rounded-full mr-3">
                        {React.cloneElement(icon as React.ReactElement, { className: "text-blue-800 w-5 h-5" })}
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
            </div>
            <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-800 font-medium hover:text-[#0077BE] transition-colors duration-300 text-sm">
                {linkText}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                    <p className="text-xl text-[#E6F3F5]">For Completing Experience {id}</p>
                </div>
                
                <div className="px-6 py-8 flex-grow flex flex-col justify-between">
                    <div>
                        <p className="text-lg text-gray-700 mb-6 text-center max-w-3xl mx-auto">
                            We hope you enjoyed this visual learning journey. Your exploration of complex concepts through interactive visualizations is just beginning!
                        </p>

                        <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">What&apos;s Next?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <NextStepCard
                                title="Book a Session"
                                description="Dive deeper with one-on-one tutoring tailored to your needs."
                                linkText="Schedule Now"
                                href="https://calendly.com/your-booking-link"
                                icon={<Calendar />}
                            />
                            <NextStepCard
                                title="Customize Learning"
                                description="Share your interests to help us create content just for you."
                                linkText="Share Interests"
                                href="https://forms.google.com/your-interests-form"
                                icon={<FileText />}
                            />
                            <NextStepCard
                                title="Suggest Ideas"
                                description="Have a brilliant idea? Let us bring it to life!"
                                linkText="Submit Idea"
                                href="https://forms.google.com/your-suggestion-form"
                                icon={<Lightbulb />}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                            <Home className="w-5 h-5 mr-2" />
                            Back to Main Menu
                        </Link>

                        
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                            Thank you for being part of our learning community. We&apos;re dedicated to making your educational journey both interactive and inspiring.
                        </p>
                    </div>
                </div>
            </motion.div>

            
            <FeedbackComponent />
        </div>
    );
}