import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

const Site = ({ Component, pageProps }) => {
    return <Component {...pageProps}/>;
};

export default Site;
