import { createDeflate } from "zlib";
import dynamic from "next/dynamic";

import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";


const Renderer = dynamic(() => import("@/components/renderer"), {ssr: false})

interface MessageProps{
    id:Id<"messages">
    memberId: Id<"members">
    authorImage?:string
    authorName?:string
    isAuthor: boolean
    reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
        count: number
        memberIds: Id<"messages">[]
    }
    >
    body:Doc<"messages">["body"];
    file: string | null | undefined
    createdAt: Doc<"messages">["_creationTime"]
    updatedAt: Doc<"messages">["updatedAt"]
    isEditing: boolean
    isCompact?: boolean
    setEditingId: (id: Id<"messages"> | null) => void
    hideThreadButton? :boolean
    threadCount?:number
    threadImage?: string
    threadTimestamp:number
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, " d MMM, yyyy")} at ${format(date, "h:mm:ss a")}`
}

export const Message = ({
    id, 
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    file,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
}: MessageProps) => {
    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-black-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>
                    <div className="flex flex-col w-full">
                        <Renderer value={body} />
                        <Thumbnail url={file}/>
                        {updatedAt ? (
                            <span className="text-xs text-muted-foreground">(edited)</span>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    const avatarFallback = authorName.charAt(0).toUpperCase(); 

    return (
        <div className="flex items-start gap-3 p-2 hover:bg-black-100/60 group relative">
            <Avatar className="size-8 rounded-md">
                <AvatarImage className="rounded-md" src={authorImage} />
                <AvatarFallback className="rounded-full bg-sky-500 text-white text-xs">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                    <button className="font-bold text-sm text-primary hover:underline">
                        {authorName}
                    </button>
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground hover:underline">
                            {format(new Date(createdAt), "h:mm a")}
                        </button>
                    </Hint>
                </div>
                <Renderer value={body} />
                <Thumbnail url={file}/>
                {updatedAt ? (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                ) : null}
            </div>
        </div>
    );
};
