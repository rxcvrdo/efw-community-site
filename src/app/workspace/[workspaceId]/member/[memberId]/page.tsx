"use client"

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversations"
import { useMemberId } from "@/hooks/use-member-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { Conversation } from "./conversation"

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)

    const {data, mutate, isPending} = useCreateOrGetConversation()

    useEffect(() => {
        mutate({
            workspaceId,
            memberId,
        }, {
            onSuccess: (data) => {
                setConversationId(data)
            },
            onError: (error) => {
                console.error("Error fetching conversation:", error)
                toast.error("Error fetching conversation")
            },
            })
    }, [memberId, mutate, workspaceId]);

    if (isPending) {
        return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin size-6 text-muted-foreground" />
        </div>
        )
    }

    
    if (!conversationId) {
        return (
        <div className="flex items-center justify-center h-screen">
            <AlertTriangle className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground"> Conversation not found</span>
        </div>
        )
    }

  return (
    <div>
       <Conversation id={conversationId} />
    </div>
  )
}

export default MemberIdPage