import React from "react";
import {socialLinks, stats, theme} from "../../../shared/constants"
import {FaArrowRight} from "react-icons/fa";


const AboutSection: React.FC = () => {
    const handleExplore = (): void => {
        console.log("Exploring KuKuShop");
    };

    return (
        <div className="min-h-screen bg-black">
            <section
                className={`${theme.bgColor} pt-1 px-4 sm:px-6 lg:px-8 transition-all duration-500`}
                role="region"
                aria-label="About KuKuShop"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                            About KuKuShop
                        </h1>
                        <p className="text-gray-300 text-2xl font-bold">
                            Revolutionizing Online Shopping
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <p className="text-gray-300 text-lg leading-relaxed backdrop-blur-sm bg-white/5 p-6 rounded-xl">
                                Welcome to KuKuShop, where possibilities meet convenience. Our
                                platform empowers you to create your own shop or simply browse
                                and buy whatever you need. We believe in making e-commerce
                                accessible to everyone, whether you're an aspiring entrepreneur
                                or a smart shopper looking for the best deals.
                            </p>
                            <button
                                onClick={handleExplore}
                                className="bg-white text-black px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1"
                                aria-label="Explore KuKuShop"
                            >
                                Explore KuKuShop
                                <FaArrowRight className="text-lg animate-bounce"/>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div
                                className="p-8 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Connect With Us
                                </h2>
                                <div className="flex justify-center gap-8">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110"
                                        >
                                            <social.icon className="text-4xl"/>
                                            <span className="sr-only">{social.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 p-8 hover:transform hover:-translate-y-2"
                            >
                                <stat.icon
                                    className="text-white text-5xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"/>
                                <h3 className="text-4xl font-bold text-white mb-3">
                                    {stat.count}
                                </h3>
                                <p className="text-gray-300 font-medium">{stat.label}</p>
                                <p className="text-sm text-gray-400 mt-2">{stat.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-white/5 p-6 rounded-xl">
                            Join thousands of satisfied users who have discovered the
                            convenience of shopping and selling on KuKuShop. Your success
                            story begins here.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutSection;
