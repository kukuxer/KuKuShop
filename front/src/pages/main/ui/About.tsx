import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { socialLinks, stats, theme } from "../../../shared/constants";

export const About: React.FC = () => {
    const handleExplore = () => {
        console.log("Exploring KuKuShop");
    };

    return (
        <div className="min-h-screen bg-black">
            <section
                className={`${theme.bgColor} pt-1 px-4 sm:px-6 lg:px-8 transition-colors duration-500`}
                role="region"
                aria-label="About KuKuShop"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
                            About KuKuShop
                        </h1>
                        <p className="text-gray-300 text-2xl font-bold">
                            Revolutionizing Online Shopping
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text & Button */}
                        <div className="space-y-8">
                            <p className="text-gray-300 text-lg leading-relaxed bg-white/10 p-6 rounded-xl shadow-sm">
                                Welcome to KuKuShop — a platform where innovation meets ease.
                                Whether you're here to build a shop or find deals, we provide the tools and freedom to do it your way.
                            </p>
                            <button
                                onClick={handleExplore}
                                className="bg-white text-black px-8 py-3 rounded-full font-semibold flex items-center gap-3 hover:bg-gray-200 transition-transform duration-300 hover:-translate-y-1"
                                aria-label="Explore KuKuShop"
                            >
                                Explore KuKuShop
                                <FaArrowRight className="text-lg animate-bounce-slow" />
                            </button>
                        </div>

                        {/* Socials with Glow */}
                        <div className="p-8 bg-white/10 rounded-2xl border border-white/10 shadow-md transition-all duration-300 hover:shadow-purple-500/30 hover:ring-2 hover:ring-purple-400/20">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                Connect With Us
                            </h2>
                            <div className="flex justify-center gap-8">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-300 transition-transform duration-300 hover:scale-110"
                                    >
                                        <social.icon className="text-4xl" />
                                        <span className="sr-only">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats with Glow-on-Hover */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/10 rounded-2xl border border-white/10 p-8 shadow-md transition-all duration-300 hover:shadow-purple-500/40 hover:ring-2 hover:ring-purple-400/20 hover:scale-[1.02]"
                            >
                                <stat.icon className="text-white text-5xl mx-auto mb-6" />
                                <h3 className="text-4xl font-bold text-white mb-3 text-center">
                                    {stat.count}
                                </h3>
                                <p className="text-gray-300 font-medium text-center">{stat.label}</p>
                                <p className="text-sm text-gray-400 mt-2 text-center">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Outro */}
                    <div className="mt-20 text-center">
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed bg-white/10 p-6 rounded-xl shadow-sm">
                            Join thousands who’ve discovered the convenience of shopping and selling on KuKuShop. Start your journey today.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
