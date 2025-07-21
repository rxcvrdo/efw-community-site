import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic (() => import("@/components/editor"), {ssr:false})

interface ChatInputProps {
    placeholder: string;
    conversationId: Id<"conversations">
}

type CreateMessageValues = {
    conversationId: Id<"conversations">
    workspaceId: Id<"workspaces">
    body: string
    image: Id<"_storage"> |undefined
}


export const ChatInput= ({placeholder, conversationId} : ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const [isPending, setIsPending] = useState(false)
    const editorRef = useRef<Quill | null>(null)

    const {mutate: createMessage} = useCreateMessage()
    const {mutate: generateUploadUrl} = useGenerateUploadUrl();

const workspaceId = useWorkspaceId()
    


const handleSubmit = async ({
    body,
    image
}: {
    body: string;
    image: File | null;
}) => {
 
    console.log ({body, image})
    try{
        setIsPending(true)
        editorRef?.current?.enable(false)

        const values: CreateMessageValues ={
            conversationId,
            workspaceId,
            body,
            image: undefined
        }

        if (image) {
            const url = await generateUploadUrl({}, {throwError: true})

            // console.log({url})

            if (!url) {
                throw new Error("Url not found")
            }

            const result = await fetch(url,{
                method: "POST",
                headers: {"Content-Type": image.type},
                body: image,
             })

             console.log(result)

             if(!result.ok) {
                throw new Error("failed to upload image")
             }
             const {storageId} = await result.json()

             values.image = storageId

             
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