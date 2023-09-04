import ReactMarkdown from "react-markdown"


function Markdown({ content }: { content: string }) {
    return (
        <ReactMarkdown className="prose">
            {content}
        </ReactMarkdown>
    )
}

export default Markdown
