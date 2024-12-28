import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../layout/footer/Footer";
import hero from "../../assets/hero.png";
const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40">
          <img
            src={hero}
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-32 h-full flex flex-col justify-center">
          <h1 className="font-lobster text-7xl text-white mb-8 drop-shadow-lg">
            FitNutritionHub
          </h1>
          <p className="text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed">
            Your ultimate destination for health and wellness. Discover personalized nutrition plans, 
            workout routines, and connect with a community of health enthusiasts.
          </p>
          <div className="flex gap-6">
            <Link to="/signup">
              <button className="px-12 h-16 bg-white text-[#6374AE] rounded-xl font-wixmadefor 
                font-semibold text-xl hover:bg-[#F2F7FB] transition-colors shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/about">
              <button className="px-12 h-16 border-2 border-white text-white rounded-xl 
                font-wixmadefor font-semibold text-xl hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-wixmadefor font-bold text-[#262C40] text-center mb-16">
            Why Choose FitNutritionHub?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="p-8 bg-[#F2F7FB] rounded-2xl hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#6374AE] rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-wixmadefor font-bold text-[#6374AE] mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-[#262C40] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#6374AE]">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-wixmadefor font-bold text-white mb-8">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Join our community today and get access to personalized nutrition plans, 
            expert advice, and a supportive community.
          </p>
          <Link to="/signup">
            <button className="px-12 h-16 bg-white text-[#6374AE] rounded-xl font-wixmadefor 
              font-semibold text-xl hover:bg-[#F2F7FB] transition-colors shadow-lg">
              Join Now
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Personalized Plans",
    description: "Get customized nutrition and workout plans tailored to your specific goals and preferences."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Support",
    description: "Connect with like-minded individuals, share experiences, and get motivated by success stories."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Expert Resources",
    description: "Access a wealth of expert-curated content, recipes, and workout guides at your fingertips."
  }
];

export default Home;