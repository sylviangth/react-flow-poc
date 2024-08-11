/* eslint-disable */

import { Code, Link } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { type ReactNode } from "react";
import { BookmarkIcon, TextCursorInputIcon } from "lucide-react";
import RemarkMathPlugin from "remark-math";
import rehypeKatex from 'rehype-katex';
import "katex/dist/katex.min.css";
import { useTheme } from "next-themes";

interface AnchorProps {
  children: ReactNode[];
  href: string;
  id: string;
}
const HighlightedAnchor = ({
  children, href,
}: AnchorProps) => {

  return (
    <>
      <Link
        onClick={() => window.open(href, "_blank")}
        isExternal={href?.startsWith("/knowledge-source/") || href?.startsWith("#") ? false : true}
        showAnchorIcon={href?.startsWith("/knowledge-source/") || href?.startsWith("#") ? false : true}
        className={`my-0 py-0 cursor-pointer inline-flex items-start gap-1 text-sm`}
      >
        {href?.startsWith("/knowledge-source/") && <span><BookmarkIcon size={16} /></span>}
        {href?.startsWith("/note/") && <span><TextCursorInputIcon size={16} /></span>}
        {children[0]}
      </Link>
    </>
  )
}

interface CustomMarkdownProps {
  text: string;
}

export default function CustomMarkdown({ text }: CustomMarkdownProps) {

  const { theme } = useTheme();

  return (
    <ReactMarkdown
      className={`max-w-none prose prose-sm prose-default ${theme && theme.includes("dark") ? "prose-invert" : ""}`}
      // @ts-ignore
      // @eslint-disable-next-line
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[remarkGfm, RemarkMathPlugin]}
      components={{
        a: ({ children, href, id }) => {
          return (
            <HighlightedAnchor
              href={href || ""} id={id || ""}
            >
              {children}
            </HighlightedAnchor>
          )
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={dark}
              language={match[1]}
              PreTag="div"
              lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
              wrapLines={true}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              <Code className="whitespace-pre-wrap">{children}</Code>
            </code>
          )
        },
      }}
    >
      {text || ""}
    </ReactMarkdown>
  )
}