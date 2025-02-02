import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

import { useState } from "react";

import { useRemoveChannel } from "@/features/channels/api/use-remove-channel.";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
  

interface HeaderProps {
    title: string; 
}



export const Header = ({title} : HeaderProps) => {
    const router = useRouter()
    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete this channel?",
        "You are about to delete this channel. This action is irreversable"
    )

    

    const [editOpen, setEditOpen] = useState(false)

    const [value, setvalue] = useState(title)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
            setvalue(value)
        }

    const {data: member} = useCurrentMember({workspaceId})
    const {mutate: updateChannel, isPending: updatingChannel} = useUpdateChannel()
    const {mutate: removeChannel, isPending: isRemovingChannel} = useRemoveChannel()

    const handleEditOpen = (value:boolean) => {
        if (member?.role !=="mentor") return

        setEditOpen(value)
    }

    const handleSubmit= (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();

     updateChannel({id: channelId, name: value}, {
        onSuccess: () => {
            toast.success("Channel updated");
            setEditOpen(false)
        },
        onError: (error) => {
            toast.error("Failed to update channel")
            console.log(error)
        }
     })
    }

    const handleDelete = async () => {
        const ok = await confirm()

        if (!ok) return

        removeChannel({id: channelId} , {
            onSuccess: () => {
                toast.success("Channel deleted")
                router.push(`/workspace/${workspaceId}`)
            },
            onError: () => {
                toast.error("Failed to delete channel")
            }
        })

    }

    return (
        <div className="bg-white border-b h-[49px] flex items-venter px-4 overflow-hidden" >
        <ConfirmDialog />
        <Dialog>
         <DialogTrigger asChild>
          <Button 
          variant="ghost"
          className="text-lg font-semibold px-2 overflow-hidden w-auto"
          size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
                <DialogTitle>
                    # {title}
                </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
                <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border-bl cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Channel name</p>
                        {member?.role ==="mentor" && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                            Edit
                        </p>
                        )}
                    </div>
                    <p className="text-sm">
                        # {title}
                    </p>
                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename this channel</DialogTitle>
                        <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                            <Input
                            value={value}
                            disabled={updatingChannel}
                            onChange={handleChange}
                            required
                            autoFocus
                            minLength={3}
                            maxLength={80}
                            placeholder="e.g new-channel-name"
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline"
                                    disabled={updatingChannel}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={updatingChannel}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogHeader>
                </DialogContent>
                </Dialog>
                {member?.role ==="mentor" && (
                <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center gap=x=2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600"
                >
                    <TrashIcon className="size-4" />
                    <p className="text-sm font-semibold" >Delete channel</p>
                </button>
                )}
            </div>
          </DialogContent>
         </Dialog> 
        </div>
    )
}