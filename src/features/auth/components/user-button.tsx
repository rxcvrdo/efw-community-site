"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useCurrentUser } from "../api/use-current-users";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";


export const UserButton = () => {
    const {signOut} = useAuthActions()
    const { data, isLoading } = useCurrentUser();
  
    if (isLoading) {
      return <Loader className="size-4 animate-spin text-muted-foreground" />;
    }
  
    if (!data) {
      return null;
    }
  
    const { image, name, email } = data;
  
   
    const avatarFallback = name!.charAt(0).toUpperCase() 

   
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="  outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition px-1 ">
            <AvatarImage alt={name} src={image} />
            <AvatarFallback className="bg-sky-500 rounded-full text-white px-2.5 py-2 " >
              {avatarFallback}

            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuItem onClick={() => signOut()} className="h-10 text-white">
            <LogOut className="size-4 mr-2 " />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  