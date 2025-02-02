import React, { useState } from "react";

import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
    
  } from "@/components/ui/dialog"

import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";

import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";


  interface OptionsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void
    initialValue: string;
  }
  

export const OptionsModal = ({open,
    setOpen, initialValue
    
}: OptionsModalProps) => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this space?",
        "This action is irreversible"
    )

    const [value, setValue] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)

    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace} = useUpdateWorkspace()

    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkspace()

    const handleEdit =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

    

        updateWorkspace({
         id: workspaceId,
         name: value,
        },{
            onSuccess: () => {
                toast.success("Your space has been updated")
                setEditOpen(false)
            },
            onError: () => {
                toast.error("Failed to update workspace")
            }
        })
    }

    const handleRemove =  async () => {
        const ok = await confirm()

        if(!ok) return 

        removeWorkspace({
            id:workspaceId
        },{
            
            onSuccess: () => {
                toast.success("Your space has been removed")
                router.replace("/")
            },
            onError: () => {
                toast.error("Failed to remove workspace")
            }
        })
    }

    return (
    <>
    <ConfirmDialog/>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-black overflow-hidden" >
            <DialogHeader className="p-4 border-b bg-white">
                <DialogTitle>
                    {value}
                </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2 bg-black text-white">
               <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                <div className="px-4 py-4  bg-black rounded-lg cursor-pointer hover:bg-gray-50 hover:text-black ">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                            Workspace name
                        </p>
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                            Edit
                        </p>

                    </div>
                    <p className="text-sm">
                        {value}
                    </p>

                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rename this space</DialogTitle>  

                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleEdit} >
                       <Input 
                       value={value}
                       disabled={isUpdatingWorkspace}
                       onChange={(e) => setValue(e.target.value)}
                       required
                       autoFocus
                       minLength={3}
                       maxLength={70}
                       placeholder="space name e.g 'Work', 'Personal', 'Jome'"
                       /> 
                       <DialogFooter>
                        <DialogClose asChild>
                            <Button value="outline" disabled={isUpdatingWorkspace}>
                                Cancel
                            </Button>

                        </DialogClose>
                        <Button disabled={isUpdatingWorkspace}>
                            Save
                        </Button>
                       </DialogFooter>

                    </form>
                </DialogContent>
                </Dialog>
                <button
                disabled={isRemovingWorkspace}
                onClick={handleRemove}
                className="flex items-center gap-x-2 px-5 py-4  bg-black rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 "
                >
                    <TrashIcon className="size-4" />
                    <p className="text-sm font-semibold" >Delete workspace</p>
                </button>
            </div>

        </DialogContent>
    </Dialog>
    </> 
    )
}