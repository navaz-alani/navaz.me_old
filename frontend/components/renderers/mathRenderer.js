import TeX from "@matejmazur/react-katex";

const InlineMathRenderer = ({ value }) => {
    return <TeX>{value}</TeX>
}

export default {
    inline: InlineMathRenderer
};
