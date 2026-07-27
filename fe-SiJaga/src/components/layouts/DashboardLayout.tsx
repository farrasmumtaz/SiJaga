import React from "react";
import Sidebar from "../Sidebar";
import DashboardSection from "../contents/DashboardSection";

const DashboardLayout: React.FC = () => {
  return (
    
    <div className="flex bg-[url('/bg-string2.png')] bg-cover bg-center "> 
      <Sidebar />
      <main className="p-6 w-full ">
        <DashboardSection />
      </main>
    </div>
  );
};

export default DashboardLayout;
 