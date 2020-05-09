import React, { useEffect, useState } from "react";
import Head from "next/head";
import Axios from "axios";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import Spinner from "../../components/spinner/spinner";
import Markdown from "../../components/renderers/markdownRenderer";

const { publicRuntimeConfig } = getConfig();

/*
* Content is a component which parses the URL slug and
* requests the backend for the requested content.
* Articles, which are markdown files are rendered directly
* into the DOM while PDF documents are passed to the browser
* for rendering.
* */
const Content = () => {
    const router = useRouter();
    const params = router.query.params;
    const pageTitle = router.query.ttl;

    let [file, setFile] = useState("");
    let [err, setErr] = useState(undefined);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params !== undefined) {
            let topicID = params[0];
            let contentTypeID = params[1];
            let resourceID = params[2];

            if (contentTypeID === "pdfs") {
                const backendUrl = `${publicRuntimeConfig.BE}/pdfs/${topicID}/${resourceID}`;
                window.location.replace(backendUrl);
            }

            Axios.post(`${publicRuntimeConfig.BE}/content`, {
                topicID: topicID,
                contentTypeID: contentTypeID,
                resourceID: resourceID,
            })
                .then(response => {
                    setFile(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response === undefined) {
                        setErr("An unexpected error occurred.")
                    } else {
                        setErr(error.response.data);
                    }
                    setLoading(false);
                });
        }
    }, [params]);

    return (
        <>
            <Header />
            {(loading)
                ? <Spinner />
                : (err === undefined && params !== undefined)
                    ? <>
                        <div id="page"
                            className="md-window"
                        >
                            {(pageTitle !== undefined)
                                ? <Head>
                                    <title>{pageTitle}</title>
                                    <meta name="Description"
                                        content={`Navaz Alani's content on "${pageTitle}"`} />
                                </Head>
                                : <></>
                            }
                            {{
                                "articles": (
                                    <Markdown source={file} />
                                ),
                                // switch on content type, params[1]
                            }[params[1]]}
                        </div>
                    </>
                    : <div id="page">
                        {(params !== undefined)
                            ? (
                                <div id="article-error">
                                    Sorry, content at
                                    <code> "{params.join("/")}" </code>
                                    could not be loaded!<br /><br />
                                    The following happened:<br />
                                    <code>`{err}`</code>
                                </div>
                            ) : (
                                <div id="article-error">
                                    An error occurred while loading this page!
                                </div>
                            )}
                    </div>}
            <Footer />
        </>);
};

export default Content;
