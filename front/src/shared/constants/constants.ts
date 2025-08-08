import React from "react";
import {
    FaAccessibleIcon, FaChartLine,
    FaFacebook,
    FaGem, FaGithub,
    FaHome,
    FaInstagram,
    FaMobileAlt,
    FaRunning, FaShoppingCart, FaStore,
    FaTshirt, FaUsers
} from "react-icons/fa";

interface Category {
    id: string;
    name: string;
    icon: React.ElementType;
}

export const categories: Category[] = [
    {id: "jewelry", name: "Jewelry", icon: FaGem},
    {id: "clothing", name: "Clothing", icon: FaTshirt},
    {id: "electronics", name: "Electronics", icon: FaMobileAlt},
    {id: "accessories", name: "Accessories", icon: FaAccessibleIcon},
    {id: "homeGoods", name: "Home Goods", icon: FaHome},
    {id: "sports & outdoors", name: "sports & outdoors", icon: FaRunning},
];


type SocialLink = {
    icon: React.ElementType;
    link: string;
    label: string;
};

export const socialLinks: SocialLink[] = [
    {icon: FaFacebook, link: "https://facebook.com", label: "Facebook"},
    {icon: FaInstagram, link: "https://www.instagram.com/gleebsq/", label: "Instagram"},
    {icon: FaGithub, link: "https://github.com", label: "Github"},
];


type Stat = {
    icon: React.ElementType;
    count: string;
    label: string;
    description: string;
};

export const stats: Stat[] = [
    {
        icon: FaUsers,
        count: "10K+",
        label: "Active Users",
        description:
            "Engaged users actively shopping and selling on our platform",
    },
    {
        icon: FaStore,
        count: "5K+",
        label: "Shops Created",
        description: "Thriving businesses powered by our e-commerce solution",
    },
    {
        icon: FaShoppingCart,
        count: "100K+",
        label: "Products Sold",
        description: "Successful transactions and happy customers",
    },
    {
        icon: FaChartLine,
        count: "85%",
        label: "Growth Rate",
        description: "Year-over-year platform growth and expansion",
    },
];

export const theme = {
    bgColor: "bg-gradient-to-b from-gray-900 to-black",
    accentColor: "bg-white",
    textAccent: "text-white",
};




export const MY_URL = "http://localhost:8080/api";

