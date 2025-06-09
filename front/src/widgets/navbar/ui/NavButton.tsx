import React from "react";
import { Link } from "react-router-dom";

interface NavButtonProps {
    to: string;
    label: string;
    icon: React.ReactElement;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ to, label, icon, onMouseEnter, onMouseLeave }) => {
    return (
        <Link to={to}>
            <button
                className="text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <span className="inline-flex w-5 h-5 items-center justify-center">
                    {icon}
                </span>
                {label}
            </button>
        </Link>
    );
};

export default NavButton;
