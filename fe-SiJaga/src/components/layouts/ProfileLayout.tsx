import { jakarta } from "@/styles/fonts";
import Sidebar from "../Sidebar";
import ProfileSection from "../contents/ProfileSection";

export default function ProfileLayout() {
  return (
    <div className={`${jakarta.className} min-h-screen bg-[url('/bg-string2.png')] bg-cover bg-center`}>
      <Sidebar />
      <main className="px-4 py-8 lg:ml-28 lg:px-10">
        <ProfileSection />
      </main>
    </div>
  );
}
