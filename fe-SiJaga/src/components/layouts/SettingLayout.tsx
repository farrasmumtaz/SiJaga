'use client';

import React, { useState } from 'react';
import SettingSection from '../contents/SettingSection';  // Sesuaikan dengan path yang benar
import Sidebar from '../Sidebar';
import { jakarta } from '@/styles/fonts';
const SettingLayout: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false); // Atur state isRegistered sesuai kebutuhan

  const handleRegisterSuccess = () => {
    setIsRegistered(true); // Setel state ketika pendaftaran berhasil
  };

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${jakarta.className} flex-1 p-4`}>
      <SettingSection 
  isRegistered={isRegistered} 
  onRegisterSuccess={handleRegisterSuccess} 
/>

        {/* <Setting isRegistered={isRegistered} /> */}
      </div>
    </div>
  );
};

export default SettingLayout;
