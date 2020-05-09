import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";
import "./content/styles.css";
import "./contact/styles.css";
import "./../components/footer/styles.css";
import "./../components/header/styles.css";
import "./../components/spinner/styles.css";
import 'katex/dist/katex.min.css';

const Site = ({ Component, pageProps }) => {
    return <Component {...pageProps} />;
};

export default Site;
