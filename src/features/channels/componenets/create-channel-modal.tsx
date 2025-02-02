import React, { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import { useCreateChannelModal } from "../api/store/use-create-channel-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateChannel } from "../api/use-create-channel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

  export const CreateChannelModal = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()

    const [open, setOpen] = useCreateChannelModal()
    const [name, setName] = useState("")

    const {mutate, isPending} = useCreateChannel()

    const handleClose = () => {
        setName("")
        setOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setName(value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate(
            {name, workspaceId},
            {
            onSuccess: (id) => {
              toast.success("Space successfully created")
              router.push(`/workspace/${workspaceId}/channel/${id}`)
               handleClose() 
            },
            onError: () => {
              toast.error("failed to create channel")
            }
        }
        )
    }
    

    return (
        <Dialog open={open} onOpenChange={handleClose}>
           <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a channel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" >
                <Input 
                value={name}
                disabled={isPending}
                onChange={handleChange}
                required
                autoFocus
                minLength={3}
                maxLength={80}
                placeholder="e.g important-info "
                />
                <div className="flex justify-end">
                    <Button className="bg-black" disabled={false}>
                        Create
                    </Button>

                </div>
              </form>
            </DialogContent> 
        </Dialog>
    )
  }
  