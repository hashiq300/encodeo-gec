import Link from "next/link"
import styles from "~/styles/Navbar.module.css"


const Navbar = () => {
    return (
        <nav className={styles.topNav}>
            <div className={styles.navbar}>
                <h1>Hello</h1>
                <ul className={styles.navLinks}>
                    <li>About</li>
                    <li><Link href="/new">New</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
