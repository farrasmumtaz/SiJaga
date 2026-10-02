import Sidebar from "../Sidebar";
import ApprovalSection from "../contents/ApprovalSection";

const ApprovalLayout = () => {
  return (
    <div className="flex min-h-screen bg-[url('/bg-string2.png')] bg-cover bg-center">
      <Sidebar />
      <main className="w-full">
        <ApprovalSection />
      </main>
    </div>
  );
};

export default ApprovalLayout;
