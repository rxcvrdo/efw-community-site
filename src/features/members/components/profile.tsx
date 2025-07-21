import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { AlertTriangle, Loader, MailIcon, XIcon , ChevronDownIcon} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface ProfileProps {
    memberId: Id<"members">;
    onClose: () => void;
};

export const Profile = ({ memberId, onClose }: ProfileProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [LeaveDialog, confirmLeave] = useConfirm(
        "Leave Space",
        "Are you sure you want to leave this space? You will no longer have access to this space.",
    )

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove Member",
        "Are you sure you want to leave remove this member? ",
    )

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change Role",
        "Are you sure you want to change this member's role? ",
    )

    const {data: currentMember, isLoading: isLoadingCurrentMember} = useCurrentMember({
        workspaceId
    })
    const {data: member, isLoading: isLoadingMember} = useGetMember({id:memberId});

    const {mutate: updateMember, isPending: isUpdatingMember} = useUpdateMember();
    const {mutate: removeMember, isPending: isRemovingMember} = useRemoveMember();

    const onRemove= async() => {
        const ok = await confirmRemove()
        if(!ok) {
            return
        }
        removeMember ({
            id: memberId
        }, {
            onSuccess: () => {
                toast.success("Member removed successfully")
                onClose()
            },
            onError: (error) => {
                toast.error("Failed to remove member")
            }
        })
    }

    const onLeave= async () => {
        const ok = await confirmLeave()
        if(!ok) {
            return
        }
        removeMember ({
            id: memberId
        }, {
            onSuccess: () => {
                router.push("/")
                toast.success("you left the space successfully")
                onClose()
            },
            onError: (error) => {
                toast.error("Failed to leave the space")
            }
        })
    }

    const onUpdate= async (role: "mentor" | "mentee") => {
        const ok = await confirmUpdate()
        if(!ok) {
            return
        }
        updateMember({
            id: memberId, role
        }, {
            onSuccess: () => {
                toast.success("Role changed")
                onClose()
            },
            onError: (error) => {
                toast.error("Failed to change role")
            }
        })
    }

        if (isLoadingMember || isLoadingCurrentMember) 
            return (
                <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 h-[49px] border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center h-full gap-y-2">
                <Loader className="animate-spin size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">member not found </p>
                </div>
            </div>
            )
        
    
        if (!member) {
            return (
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center px-4 h-[49px] border-b">
                        <p className="text-lg font-bold">Profile</p>
                        <Button onClick={onClose} size="iconSm" variant="ghost">
                            <XIcon className="size-5 stroke-[1.5]" />
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full gap-y-2">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Member not found </p>
                    </div>
                </div>
    
            )
    
        }

        const avatarFallback = member.user.name?.charAt(0).toUpperCase() || "M"
        
    return (
        <>
        <LeaveDialog />
        <RemoveDialog />
        <UpdateDialog />
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center px-4 h-[49px] border-b">
                <p className="text-lg font-bold">Profile</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[256px] max-h-[256px] size-full" >
                    <AvatarImage src={member.user.image} className="rounded-md"/>
                    <AvatarFallback className=" aspect-square bg-sky-500 text-white text-6xl">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col p-4">
                <p className="text-xl font-bold">{member.user.name}</p>
                {currentMember?.role === "mentor" && 
                currentMember?._id ===memberId ? (
                    <div className="flex items-center gap-2 mt-4">
                   <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full capitalize">
                        {member.role} <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuGroup>
                            <DropdownMenuRadioGroup value={member.role} onValueChange={(role) =>onUpdate(role as "mentor" | "mentee")}>
                            <DropdownMenuRadioItem value="mentor" >
                                Mentor
                            </DropdownMenuRadioItem>

                            <DropdownMenuRadioItem value="mentee" >
                                Mentee
                            </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={onRemove} variant="outline" className="w-full">
                        Remove
                    </Button>
                    </div>
                ): currentMember?._id === memberId && 
                currentMember.role !== "mentor" ? (
                   <div className="mt-4">
                    <Button onClick={onLeave} variant="outline" className="w-full">
                        Leave
                    </Button>
                   </div> 
                ): null}
            </div>
            <Separator />
            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">Contact information</p>
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        <MailIcon className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground"> 
                            Email Address
                        </p>
                        <Link
                        href={`mailto:${member.user.email}`}
                        className="text-sm font-bold text-[#1264a3] hover:underline"
                        >
                        {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}