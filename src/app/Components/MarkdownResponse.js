import ReactMarkdown from 'react-markdown'

export default function MarkdownResponse({ entry }) {
    return(<ReactMarkdown
        components={{
            p: ({node, ...props}) => (
            <p className="break-words mb-4 leading-relaxed text-gray-100">
                {props.children}
            </p>
            ),
            
            code: ({node, ...props}) => (
            <code className="break-words font-mono text-sm bg-gray-800/70 text-purple-200 px-1.5 py-0.5 rounded">
                {props.children}
            </code>
            ),
            
            pre: ({node, ...props}) => (
            <div className="relative my-4 rounded-lg overflow-hidden border border-gray-600/50 bg-gray-900/80">
                <div className="flex items-center px-4 py-2 bg-gray-800/80 border-b border-gray-700">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100">
                {props.children}
                </pre>
            </div>
            ),
            
            a: ({node, ...props}) => (
            <a 
                href={props.href} 
                className="break-words underline text-blue-400 hover:text-blue-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
            >
                {props.children}
            </a>
            ),
            
            h1: ({node, ...props}) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {props.children}
            </h1>
            ),
            h2: ({node, ...props}) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {props.children}
            </h2>
            ),
            h3: ({node, ...props}) => (
            <h3 className="text-xl font-semibold mt-4 mb-2 text-purple-300">
                {props.children}
            </h3>
            ),
            
            ul: ({node, ...props}) => (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-200">
                {props.children}
            </ul>
            ),
            ol: ({node, ...props}) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-200">
                {props.children}
            </ol>
            ),
            
            blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-300 bg-gray-800/30 py-2 rounded-r">
                {props.children}
            </blockquote>
            ),
            
            table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                {props.children}
                </table>
            </div>
            ),
            th: ({node, ...props}) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-purple-300 bg-gray-800/80">
                {props.children}
            </th>
            ),
            td: ({node, ...props}) => (
            <td className="px-4 py-2 text-sm text-gray-200 border-t border-gray-700">
                {props.children}
            </td>
            ),
            
            hr: ({node, ...props}) => (
            <hr className="my-6 border-t-2 border-transparent bg-gradient-to-r from-transparent via-purple-500 to-transparent h-0.5" />
            )
        }}
        >
        {entry.answer}
    </ReactMarkdown>);
}