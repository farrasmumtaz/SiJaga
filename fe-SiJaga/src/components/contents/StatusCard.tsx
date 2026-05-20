import React from "react";
import Image from "next/image";

// Definisi interface
interface StatusCardProps {
  icon: string;
  color: string;
  label: string;
  iconPosition?: "side" | "top";
  labelColor?: string;
  iconSize?: string;
  statusText?: string;
  statusTextColor?: string;
  width?: number; // Tambahkan width
  height?: number; // Tambahkan height
}

// Definisi komponen
const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  color,
  label,
  iconPosition = "side",
  labelColor = "text-white",
  iconSize = "w-20 h-20",
  statusText,
  statusTextColor = "text-gray-500",
  width,
  height
}) => (
  <div
    className={`flex ${
      iconPosition === "top" ? "flex-col items-center " : "items-center space-x-4"
    } ${color} p-6 rounded-lg shadow-md`}
  >
    {/* Ikon */}
    <Image
    src= {icon} 
    alt={label} 
    className={`p-2 rounded-3xl ${iconSize}`}
    width={width}
    height={height}
    />

    {statusText && <p className={`${statusTextColor} text-sm font-medium`}>{statusText}</p>}

    <p className={`${labelColor} font-semibold text-lg`}>{label}</p>
  </div>
);

// Ekspor default
export default StatusCard;
