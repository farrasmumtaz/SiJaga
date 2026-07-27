import React from "react";
import { jakarta } from "@/styles/fonts";

interface CardProps {
  title: string;
  icon: React.ReactNode; // Icon prop for displaying outside the card
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon, children }) => {
  return (
    <div className={` ${jakarta.className} bg-white shadow-lg rounded-3xl p-2 flex flex-col items-center relative mt-4 max-w-[450px] ml-6`}>
      {/* Icon positioned outside the card with more space from the title */}
      <div className="absolute top-[-32px] bg-gradient-to-b from-[#385CBD] to-[#3650A2] p-4 rounded-[20px] text-white">
        {icon}
      </div>
      {/* Title with margin-top to create space from the icon */}
      <h3 className="text-2xl font-bold text-[#3650A2] mb-4 text-center mt-10">
        {title}
      </h3>
      {/* Content */}
      <div className="text-gray-700 text-lg text-center">{children}</div>
      
    </div>
  );
};

export default Card;
