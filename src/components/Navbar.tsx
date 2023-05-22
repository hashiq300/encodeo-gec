import { SignInButton, useClerk, useUser } from "@clerk/nextjs"
import { Button, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import Link from "next/link"
import styles from "~/styles/Navbar.module.css"


const Navbar = () => {

    return (
        <nav className={styles.topNav}>
            <div className={styles.navbar}>
                <Link href="/">
                    <Text
                        component="h2"
                        variant="gradient"
                        fz="2rem"
                        fw="bolder"
                        gradient={{ from: 'var(--secondary-clr)', to: 'var(--gradient-clr)', deg: 45 }}
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                    >Decodio</Text>
                </Link>
                <ul className={styles.navLinks}>
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
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
            >Sign in</Button>
        </SignInButton>
    );


    return (
        <div className={styles.userIcon}>
            <Button
                onClick={() => signOut()}
                size="sm"
                px="xs"
                style={{ backgroundColor: "var(--secondary-clr)" }}
            >
                <IconLogout />
                <Text ml="0.25em" mb="-0.2em">
                    Logout
                </Text>
            </Button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.profile_img} src={user.user.profileImageUrl ?? ""} alt={user.user.lastName ?? ""} />

        </div>
    )
}

export default Navbar
