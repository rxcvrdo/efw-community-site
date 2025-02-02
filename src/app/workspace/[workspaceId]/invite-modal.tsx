import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { toast } from "sonner";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
  
interface InviteModalProps {
   open: boolean;
   setOpen: (open:boolean) => void;
   name: string ;
   joinCode: string 

}

export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode,
} : InviteModalProps) => {

    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new code"
    )

    const {mutate, isPending} = useNewJoinCode();

    const handleNewCode =  async () => {
    
    const ok = await confirm ()

    if (!ok) return;

     mutate({workspaceId}, {
        onSuccess: () => {
            toast.success("Invite code regenrated!")
        },
        onError: () => {
            toast.error("Failed to regenerate invite code")
        }
     } )   
    }

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`

        navigator.clipboard
        .writeText(inviteLink)
        .then(() => toast.success("Invite link copied to clipboard"))
    }

    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader>
                 <DialogTitle>
                    invite others to {name}
                 </DialogTitle>
                 <DialogDescription>
                    Use the code below to invite people to your space
                 </DialogDescription>
                </DialogHeader> 
                <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                    <p className="text-4xl font-bold tracking-widest uppercase">
                        {joinCode}
                    </p>
                    <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    >
                        Copy Code
                        <CopyIcon className="size-4 ml-2" />
                    </Button>
                </div>

                <div className="flex items-center justify-center w-full">
                    <Button disabled={isPending} onClick={handleNewCode} variant="outline" >
                        New Code
                        <RefreshCcw className="size-4 ml-2" />
                    </Button>
                <DialogClose asChild>
                    <Button>
                        Close
                    </Button>
                </DialogClose>

                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}