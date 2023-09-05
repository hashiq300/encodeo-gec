import { SignInButton, UserButton, useClerk, useUser } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

import Link from "next/link"
import { Button } from "./ui/button"
import { ModeToggle } from "./ModeToggle"


const Navbar = () => {

    return (
        <nav className="container border-b-2 border-primary">
            <div className="flex justify-between items-center py-5">
                <Link href="/">
                    <h1 className="font-bold text-3xl">Encodeo</h1>
                </Link>
                <ul className="flex items-center gap-4 sm:gap-5  md:gap-8">
                    <ModeToggle />
                    <UserAvatar />
                </ul>
            </div>
        </nav>
    )
}

const UserAvatar = () => {
    const user = useUser();
    const { signOut } = useClerk();

    if (!user.user) return (
        <SignInButton >
            <Button
            >Sign in</Button>
        </SignInButton>
    );


    return (
        <div className="flex md:gap-12 items-center">
            <Button
                className="hidden md:inline-flex"
                onClick={() => signOut()}
            >
                <LogOut className="w-5 h-5 mr-1" />
                <p>
                    Logout
                </p>
            </Button>
            <UserButton afterSignOutUrl="/" />

        </div>
    )
}

export default Navbar
