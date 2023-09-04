// import { Loader as Load } from "@mantine/core"
import { Loader2 } from "lucide-react"
import Layout from "./Layout"

const Loader = () => {
    return (
        <Layout>
            <main className="flex min-h-full justify-center items-center">
                <Loader2 className="" />
            </main>
        </Layout>
    )
}

export default Loader
