import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-separator"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types"
import React, { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"

import { TriangleAlert } from "lucide-react"

interface SignInCardProps {
    setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState} : SignInCardProps) => {
    const {signIn} = useAuthActions()
    
    
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const onPasswordSignIn =(e: React.FormEvent <HTMLFormElement>) => {
        e.preventDefault();

        setPending(true)
        signIn("password", {email, password, flow: "signIn"})
        .catch(() => {
            setError("invalid email or password");
        })
        .finally(() => {
            setPending(false)
        })
    }

    const onProviderSignIn = async (value: "google") => {
        setPending(true);
        try {
          await signIn(value);
        } catch (error) {
          console.error("Google sign-in failed:", error);
          alert("Sign-in failed. Please try again.");
        } finally {
          setPending(false);
        }
      };

    return(
        <Card className="w-full h-full p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle>
            Login to continue
            </CardTitle>

          <CardDescription >
            Please use your email or any other service to continue
          </CardDescription>
            
          </CardHeader>
        {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
               <TriangleAlert className="size-4" /> 
                <p>{error}</p>
            </div>
        )}
          <CardContent className="space-y-5 px-0 pb-0">
            <form onSubmit={onPasswordSignIn} className="space-y-2.5">
                <Input
                 disabled={pending}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email"
                 type="email"
                 required
                />

                <Input
                 disabled={pending}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                 type="password"
                 required
                />

                <Button type="submit" className="w-full" size="lg" disabled={false}>
                    Continue
                </Button>


            </form>
            <Separator/>
            <div className="flex clex-col gap-y-2.5">
                <Button disabled={pending}
                onClick={() => onProviderSignIn("google")}
                variant="outline"
                size="lg"
                className="w-full relative "
                >
                    <FcGoogle className="size-5 absolute top-3 left-2.5" />
                    Continue with google
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Don&apos;t have an account? <span onClick={() => setState("signUp")} className="text-sky-700 hover:underline cursor-pointer"> Sign Up</span>
            </p>
          </CardContent>
        
        </Card>
    )
}