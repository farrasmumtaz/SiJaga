import React from 'react';
import { IconType } from 'react-icons';

interface IconCardProps {
  icon: IconType;
  title: string;
  content: React.ReactNode;
  className?: string;
}

const IconCard: React.FC<IconCardProps> = ({ icon: Icon, title, content, className }) => {
  return (
    <div className={`bg-blue-100 shadow-md rounded-lg p-4 flex items-center ${className}`}>
      <Icon className="text-blue-500 text-2xl mr-3" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-700">{content}</p>
      </div>
    </div>
  );
};

export default IconCard;
