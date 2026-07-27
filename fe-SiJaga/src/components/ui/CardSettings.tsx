import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`p-10 ml-[800px] mr-[60px] mt-40  bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
