import React from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {gh} from "react-syntax-highlighter/dist/cjs/styles/prism/ghcolors";

const CodeRenderer = ({language, value}) => {
    return (
        <SyntaxHighlighter language={language} style={gh}>
            {value}
        </SyntaxHighlighter>
    );
}

export default CodeRenderer;
