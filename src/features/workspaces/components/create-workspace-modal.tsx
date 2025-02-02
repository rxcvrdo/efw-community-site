"use"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorspaceModal } from "../store/use-create-workspace-modal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {

    const router = useRouter()
    const [open, setOpen] = useCreateWorspaceModal()
    const [name, setName] = useState("")

    const {mutate, isPending} = useCreateWorkspace()

    const handleClose = () => {
        setOpen(false)
        setName("")
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutate({name}, {
           onSuccess(id){
            toast.success("Space created!")
            router.push(`/workspace/${id}`)
            handleClose()
           } 
        })
    }

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault()

//         mutate ({name})
//         try{
//        const data = await mutate ({
//             name: "workspace 1",
//         }, {
//             onSuccess(data) {
//         },
//         onError(error) {

//         },
            
//        })
//     } catch (error) {

//     }
// }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a community space
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="Community space name e.g 'Producers', 'Painters', 'work "
                    />

                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>

                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}