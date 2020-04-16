import React from "react";
import Links from "./links"
import getConfig from "next/config";

const {publicRuntimeConfig} = getConfig();

const Footer = () => {
    const license = publicRuntimeConfig.LICENSE;
    return (
        <div id="glob-footer">
            <div id="footer-content">
                <Links/>
            </div>
            <div id="copyright-line">
                {/*Link copyright line to GH License file*/}
                <a href={license}>Navaz Alani © 2020</a>
            </div>
        </div>
    )
}

export default Footer;
