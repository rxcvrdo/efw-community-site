
import * as RadixAvatar from "@radix-ui/react-avatar";

interface ConversationHeroProps {
    name?: string
    image?: string
}

export const ConversationHero = ({name, image} : ConversationHeroProps)=> {
    const avatarFallback = name?.charAt(0)?.toUpperCase()
    return  (
            <div className="mt-[88px] mx-5 mb-4">
              <div className="flex items-center gap-x-1 mb-2">
                <RadixAvatar.Root className="w-14 h-14 rounded-md overflow-hidden">
                  <RadixAvatar.Image
                    className="w-full h-full object-cover"
                    src={image}
                  />
                  <RadixAvatar.Fallback
                    delayMs={600}
                    className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-800 font-bold text-lg rounded-md"
                  >
                    {avatarFallback}
                  </RadixAvatar.Fallback>
                </RadixAvatar.Root>
                <p className="text-2xl font-bold">{name}</p>
              </div>
              <p className="font-normal text-slate-800 mb-4">
                This conversation is just between you and <strong>{name}</strong>,
              </p>
            </div>
          );
        };