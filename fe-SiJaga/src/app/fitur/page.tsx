import { jakarta } from "@/styles/fonts"
import FiturLayout from "@/src/components/layouts/Fiturlayout"
import Footer from "@/src/components/Footer"
import Header from "@/src/components/Header"

export default function Fitur() {
    return (
        <main className={`${jakarta.className} pt-12 z-[999]`}>
            <Header/>
            <FiturLayout/>
            <Footer/>
        </main>
    
    )
}