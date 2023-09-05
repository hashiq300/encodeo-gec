import React from 'react'
import Navbar from './Navbar'
import { ThemeProvider } from './ThemeProvider'
type LayoutProps = {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Navbar />
            {children}
        </ ThemeProvider>
    )
}

export default Layout
