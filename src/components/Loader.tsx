import { Loader as Load } from "@mantine/core"
import Layout from "./Layout"

const Loader = () => {
    return (
        <Layout>
            <main style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Load />
            </main>
        </Layout>
    )
}

export default Loader
