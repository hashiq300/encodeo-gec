import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'



function Markdown({ content }: { content: string }) {
    return (
        <ReactMarkdown className="prose prose-shad mb-8" remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    )
}

export default Markdown
