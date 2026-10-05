import SettingLayout from "@/src/components/layouts/SettingLayout";
import AdminOnly from "@/src/components/AdminOnly";

export default function Settings() {
    return (
        <main>
            <AdminOnly>
                <SettingLayout />
            </AdminOnly>
        </main>
    )

}
