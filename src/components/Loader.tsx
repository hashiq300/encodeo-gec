import { Loader as Load } from "lucide-react"
import Layout from "./Layout"

const Loader = () => {
    return (
        <Layout>
            <main className="flex min-h-full justify-center items-center">
                <Load className="w-10 h-10 mt-16 animate-spin" />
            </main>
        </Layout>
    )
}

export default Loader
