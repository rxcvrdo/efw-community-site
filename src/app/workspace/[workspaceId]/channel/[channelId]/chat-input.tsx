import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload.ts";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

const Editor = dynamic (() => import("@/components/editor"), {ssr:false})

interface ChatInputProps {
    placeholder: string;
}

type CreateMessageValues = {
    channelId: Id<"channels">
    workspaceId: Id<"workspaces">
    body: string
    file: Id<"_storage"> |undefined
}


export const ChatInput= ({placeholder} : ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const [isPending, setIsPending] = useState(false)
    const editorRef = useRef<Quill | null>(null)

    const {mutate: generateUploadUrl} = useGenerateUploadUrl();
    const {mutate: createMessage} = useCreateMessage()

const workspaceId = useWorkspaceId()
    const channelId = useChannelId()


const handleSubmit = async ({
    body,
    file
}: {
    body: string;
    file: File | null;
}) => {
 
    try{
        setIsPending(true)
        editorRef?.current?.enable(false)

        const values: CreateMessageValues ={
            channelId,
            workspaceId,
            body,
            file: undefined
        }

        if (file) {
            const url = await generateUploadUrl({}, {throwError: true})

            console.log({url})

            if (!url) {
                throw new Error("Url not found")
            }

            const result = await fetch(url,{
                method: "POST",
                headers: {"Content-Type": file.type},
                body: file,
             })

             console.log(result)

             if(!result.ok) {
                throw new Error("failed to upload image")
             }
             const {storageId} = await result.json()

             values.file = storageId

             console.log(values)
        }
    await createMessage(values, {throwError: true});

    setEditorKey((prevKey) => prevKey + 1)
} catch(error){
toast.error("failed to send message")
console.log(error)
}finally{
setIsPending(false)
editorRef?.current?.enable(true)
}

}

    
    
    return (
        <div className="px-5 w-full">
            <Editor
            key={editorKey}
            placeHolder={placeholder}
            onSubmit={handleSubmit}
            disabled={isPending}
            innerRef={editorRef}
            variant="create" />
        </div>
    )
}