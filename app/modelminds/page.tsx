'use client'
import React from 'react';
import Image from 'next/image';
import Logo from "@/images/Sonder logo with text.png";
import WhoWeAreImage from "@/images/image.png"
import Link from 'next/link';

const IdeathonPage = () => {
  return (
    <div className="min-h-screen bg-[#F5FDFD]">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cyan-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Overlaid Logo with Link */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="https://www.sonderskills.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image
              src={Logo}
              alt="Sonder"
              width={200}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="relative container mx-auto px-4 py-32 flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold mb-8 animate-fade-in">ModelMinds</h1>
          <p className="text-3xl mb-6">An Artificial Intelligence Challenge</p>
          <p className="text-2xl font-light mb-4">Where Creativity Meets Machine Learning</p>
          <div className="text-center">
            <button 
              onClick={() => window.open('https://forms.gle/zGw2dHrpdxFmkhHY7', '_blank', 'noopener,noreferrer')}
              className="mt-8 px-8 py-3 bg-white text-cyan-700 rounded-full text-lg font-semibold 
                hover:bg-cyan-50 transition-all"
            >
              Register Now
            </button>
            <p className="mt-4 text-sm text-white/80">
              Register individually or with a team of up to 3 members
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 h-[400px] relative overflow-hidden rounded-lg">
              <Image
                src={WhoWeAreImage}
                alt="Research and Machine Learning Visualization"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-cyan-800 mb-8">Who We Are</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We are <span className="font-semibold text-cyan-800">Graduate Student Researchers at UC Berkeley</span>, 
                specializing in <span className="font-semibold text-cyan-800">Large Language Models and Machine 
                Learning</span> technologies. Our research explores the fascinating intersection of AI and creative disciplines.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Through the <span className="font-semibold text-cyan-800">ModelMinds Challenge</span>, we aim to create a 
                platform where technical expertise meets creative vision, fostering an environment for 
                participants to produce <span className="font-semibold text-cyan-800">groundbreaking solutions</span> that 
                bridge the gap between AI technology and creative expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="py-16 bg-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-cyan-800 mb-8 text-center">The Challenge</h2>
            
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  ModelMinds invites participants to explore how machine intelligence 
                  can revolutionize creative disciplines such as music, gaming, art, design, storytelling, and beyond. Whether you're a coder, designer, or 
                  visionary thinker, this challenge is designed to provide a platform for diverse talents to come 
                  together and create groundbreaking solutions.
                </p>

                {/* Submission Requirements - Important, so slightly highlighted */}
                <div className="mt-8 bg-[#F5FDFD] p-8 rounded-xl border border-[#7AE5EC]/30">
                  <h3 className="text-2xl font-semibold text-[#257276] mb-6">Submission Requirements</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 hover:bg-white/50 p-4 rounded-lg transition-colors">
                      <span className="text-[#01A9B2] text-xl mt-1">🎥</span>
                      <div>
                        <p className="font-medium text-[#257276] mb-2">Video Presentation</p>
                        <p className="text-gray-700">A 5-minute video showcasing your project.</p>
                      </div>
                    </div>

                   
                    <div className="flex items-start space-x-4 hover:bg-white/50 p-4 rounded-lg transition-colors">
                      <span className="text-[#01A9B2] text-xl mt-1">💻</span>
                      <div>
                        <p className="font-medium text-[#257276] mb-2">Supporting Materials</p>
                        <p className="text-gray-700">Include any relevant code repositories, presentation slides, or additional documentation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-cyan-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold text-cyan-800 mb-4">Example Focus Areas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-cyan-600">🎨</span>
                      <span>Digital Art & Design</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cyan-600">🎵</span>
                      <span>Music & Audio</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cyan-600">✍️</span>
                      <span>Writing & Storytelling</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cyan-600">🎮</span>
                      <span>Interactive Media</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Tracks - Made more prominent */}
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-cyan-800 mb-6">Challenge Tracks</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-[#F5FDFD] to-white p-8 rounded-xl border border-[#7AE5EC]/30 
                      shadow-lg hover:shadow-xl transition-all">
                      <div className="text-4xl mb-4">💻</div>
                      <h4 className="text-xl font-semibold text-[#257276] mb-4">Track 1: Machine Learning Coding</h4>
                      <p className="text-gray-700">
                        Develop functional ML models or tools that address creative challenges.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F5FDFD] to-white p-8 rounded-xl border border-[#7AE5EC]/30 
                      shadow-lg hover:shadow-xl transition-all">
                      <div className="text-4xl mb-4">🎨</div>
                      <h4 className="text-xl font-semibold text-[#257276] mb-4">Track 2: Design and Ideation</h4>
                      <p className="text-gray-700">
                        Conceptualize and design user-centric solutions leveraging ML.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Don't Know Machine Learning Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#257276] mb-8 text-center">
              Don't Know Machine Learning? No Problem!
            </h2>
            
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700">
                Join our pre-hackathon educational program. Whether you're a complete beginner 
                or looking to expand your skills, we'll guide you through everything you need to know.
              </p>
            </div>

            {/* Simple Timeline */}
            <div className="relative mb-12">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#7AE5EC]/30"></div>
              <div className="relative flex justify-between">
                {/* Workshop 1 */}
                <div className="flex flex-col items-center w-1/2 px-4">
                  <div className="bg-[#F5FDFD] p-4 rounded-xl border border-[#7AE5EC]/30 mb-4 relative">
                    <div className="text-2xl mb-2">📚</div>
                    <h4 className="font-semibold text-[#257276]">Workshop 1</h4>
                    <p className="text-[#01A9B2] font-medium">December 26th</p>
                    <p className="text-gray-700">Foundations of Machine Intelligence</p>
                  </div>
                </div>

                {/* Workshop 2 */}
                <div className="flex flex-col items-center w-1/2 px-4">
                  <div className="bg-[#F5FDFD] p-4 rounded-xl border border-[#7AE5EC]/30 mb-4 relative">
                    <div className="text-2xl mb-2">🛠️</div>
                    <h4 className="font-semibold text-[#257276]">Workshop 2</h4>
                    <p className="text-[#01A9B2] font-medium">December 27th</p>
                    <p className="text-gray-700">Advanced topics in Machine Learning </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                All workshops will be recorded for playback. Exact timings TBA.
              </p>
            </div>

            {/* Rest of content */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* What You'll Learn */}
              <div className="bg-[#F5FDFD] p-6 rounded-xl border border-[#7AE5EC]/30 hover:border-[#7AE5EC] 
                transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📚</span>
                  <h3 className="text-2xl font-semibold text-[#257276]">What You'll Learn</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">Core concepts of classical machine learning and neural networks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">Introduction to large language models</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">Essential programmatic tools and frameworks for AI projects</span>
                  </li>
                </ul>
              </div>

              {/* Who Should Attend */}
              <div className="bg-[#F5FDFD] p-6 rounded-xl border border-[#7AE5EC]/30 hover:border-[#7AE5EC] 
                transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👥</span>
                  <h3 className="text-2xl font-semibold text-[#257276]">Are You...</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">An artist, musician, gamer or creative who wants to enhance your craft with AI?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">A curious learner excited to dive into machine learning with expert mentorship?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#01A9B2] text-lg mt-1">•</span>
                    <span className="text-gray-700">An ML enthusiast ready to apply your skills to real-world creative projects?</span>
                  </li>
                </ul>
                <div className="text-center mt-6">
                  <button 
                    onClick={() => window.open('https://forms.gle/zGw2dHrpdxFmkhHY7', '_blank', 'noopener,noreferrer')}
                    className="px-6 py-2 bg-cyan-700 text-white rounded-full text-sm font-semibold 
                      hover:bg-cyan-600 transition-all"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 bg-[#F5FDFD]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-cyan-800 mb-8 text-center">Prizes</h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Grand Prize Card */}
            <div className="bg-gradient-to-br from-cyan-700 to-cyan-600 p-6 rounded-xl text-white 
              shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Grand Prize</h3>
              <div className="space-y-3">
                <p className="text-white/90">
                  Exclusive mentorship opportunity with UC Berkeley graduate students to:
                </p>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Develop your research project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>5 one-hour mentoring sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Guidance on research methodology</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prize Value Card - Updated from Cash Prizes */}
            <div className="bg-white p-6 rounded-xl border border-[#7AE5EC] shadow-lg 
              hover:shadow-xl transition-all flex flex-col justify-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-[#257276] text-center mb-4">Total Prize Value</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#01A9B2] mb-2">$3,000</p>
                <p className="text-gray-600">Worth of Prizes</p>
                <p className="text-sm text-gray-500 mt-2">
                  Prize distribution will be announced during workshops
                </p>
              </div>
            </div>

            {/* Additional Benefits - Optional, spans full width */}
            <div className="md:col-span-2 bg-[#F5FDFD] p-4 rounded-xl border border-[#7AE5EC]/30 
              text-center mt-2">
              <p className="text-[#257276]">
                All participants will receive certificates and exclusive access to future Sonder events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Dates Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-cyan-800 mb-12 text-center">Important Dates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DateCard 
              title="Education Program" 
              date="December 26th-28th"
              subtitle="(Recorded for Playback)"
              icon="🎓"
            />
            <DateCard 
              title="Office Hours" 
              date="January 2nd, 5th, 6th"
              icon="📅"
            />
            <DateCard 
              title="Submission Deadline" 
              date="January 7th"
              icon="🎯"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F5FDFD]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-cyan-800 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <FaqItem 
              question="What is ModelMinds?" 
              answer="ModelMinds is a hackathon that combines creativity with machine learning. It's designed for both technical and non-technical participants who want to explore the intersection of AI and creative expression."
            />
            <FaqItem 
              question="Do I need prior ML experience?" 
              answer="No! We provide a comprehensive educational program on December 26th to help beginners learn the fundamentals of machine learning. You'll get hands-on experience with state of the art AI technologies."
            />
            <FaqItem 
              question="How do I choose between the two tracks?" 
              answer="Choose the ML Coding track if you want to implement technical solutions. Choose the Design and Ideation track if you prefer focusing on concept development and user experience design without heavy coding."
            />
            <FaqItem 
              question="What kind of support will be available?" 
              answer="We offer office hours on January 2nd, 5th, and 6th where a mentor from our team will be available to help with both technical and design challenges. Additionally, our educational program will provide foundational knowledge."
            />
            <FaqItem 
              question="Is there a cost to participate?" 
              answer="No, ModelMinds is completely free! We believe in making AI education and opportunities accessible to everyone. There are no registration fees or hidden costs associated with participating in either track of the program."
            />
            <FaqItem 
              question="Where will this event be held?" 
              answer="ModelMinds is a fully online program accessible worldwide. All workshops, office hours, and mentoring sessions will be conducted virtually allowing participants to join and collaborate from any location around the globe."
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 bg-white border-t border-[#7AE5EC]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">


            {/* Contact Info */}
            <div className="max-w-2xl mx-auto space-y-4 text-[#257276]">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="flex items-center justify-center gap-2">
                <span>📧</span>
                <a href="mailto:contact@sonder.ai" 
                   className="hover:text-[#01A9B2] transition-colors">
                  info@sonderskills.com
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-6">
                © 2024 ModelMinds. A Sonder Initiative.
              </p>
            </div>

            
          </div>
        </div>
      </section>
    </div>
  );
};

const DateCard = ({ 
  title, 
  date, 
  subtitle,
  icon 
}: { 
  title: string;
  date: string;
  subtitle?: string;
  icon: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-[#7AE5EC] hover:shadow-xl 
    transition-all transform hover:-translate-y-1">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-[#257276] mb-3">{title}</h3>
    <p className="text-lg text-gray-600 mb-1">{date}</p>
    {subtitle && (
      <p className="text-sm text-[#01A9B2] font-medium">
        {subtitle}
      </p>
    )}
  </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-cyan-200 rounded-lg overflow-hidden hover:border-cyan-300 transition-colors">
      <button
        className="w-full px-6 py-4 text-left bg-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-cyan-900">{question}</span>
        <span 
          className={`text-cyan-600 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      <div 
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 py-4 text-gray-600 bg-cyan-50">{answer}</p>
      </div>
    </div>
  );
};

export default IdeathonPage;
