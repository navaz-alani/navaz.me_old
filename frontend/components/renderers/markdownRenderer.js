import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import CodeRenderer from "./codeRenderer";
import mathRenderer from "./mathRenderer";

export const Markdown = ({ source }) => {
    const props = {
        escapeHtml: false,
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            code: CodeRenderer,
            inlineMath: mathRenderer.inline
        }
    };
    return (
        <ReactMarkdown {...props} source={source} />
    );
};

export default Markdown;