import React, {useEffect, useState} from "react";
import Axios from "axios";
import Head from "next/head";
import getConfig from "next/config";
import ContentIndex from "../../components/contentIndex/contentIndex";

const {publicRuntimeConfig} = getConfig();

const ContentHome = () => {
    let [contentIndex, setContentIndex] = useState(undefined);
    let [err, setErr] = useState(undefined);

    useEffect(() => {
        if (contentIndex === undefined) {
            Axios.get(`${publicRuntimeConfig.BE}/contentIndex`)
                .then(r => {
                    setContentIndex(r.data.index);
                })
                .catch(e => {
                    setErr(e.data);
                })
        }
    }, [contentIndex]);

    /*
    * fileLink returns a href link to the resource based on its
    * type. PDFs are served to the browser directly from the backend
    * and this has to be taken into account.
    * */
    const fileLink = (rType, rID) => {
        rType = rType.toLowerCase();
        let prefix = (rType !== "pdfs") ? `/content` : `${publicRuntimeConfig.BE}`;

        return `${prefix}/${rType}/${rID}`;
    };

    return (
        <>
            <Head>
                <title>Content Index</title>
            </Head>
            <div id="page">
                <h1 id="page-title">📜 Navaz's Content Index</h1>
                {/* Content Index */}

                {(err === undefined && contentIndex !== undefined)
                    ? <ContentIndex contentIndex={contentIndex} fileLink={fileLink}/>
                    :
                    <div id="content-error">
                        Oh no! 😱<br/>
                        Index could not be loaded<br/>
                        Please try again later...
                    </div>
                }
            </div>
        </>
    );
};

export default ContentHome;
