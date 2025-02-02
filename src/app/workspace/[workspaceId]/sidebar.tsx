import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { SidebarButton } from "./sidebar-button"
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"

export const Sidebar = () => {
    const pathName = usePathname()

    return (
        <aside className="w-[70px] h-full bg-[#080808] flex flex-col gap-y-4 pt-[9px] pb-4  ">
           <WorkspaceSwitcher />
           <SidebarButton icon={Home} label="Home" isActive  />
           <SidebarButton icon={MessagesSquare} label="DMs"   />
           <SidebarButton icon={Bell} label="Notifications" />
           <SidebarButton icon={MoreHorizontal} label="More" />
           <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
             <UserButton/>
           </div>

        </aside>
    )
}