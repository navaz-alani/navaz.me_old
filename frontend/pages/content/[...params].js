import React, {useEffect, useState} from "react";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import getConfig from 'next/config';
import {useRouter} from 'next/router';

const {publicRuntimeConfig} = getConfig();

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

    let [file, setFile] = useState("");
    let [err, setErr] = useState(undefined);

    useEffect(() => {
        if (params !== undefined) {
            console.log(params);
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
                })
                .catch(error => {
                    if (error.response === undefined) {
                        setErr("An unexpected error occurred.")
                    } else {
                        setErr(error.response.data);
                    }
                });
        }
    }, [params]);

    return <>
        {
            (err === undefined && params !== undefined)
                ? (<>
                        <div id="page">
                            {{
                                "articles": (
                                    <ReactMarkdown source={file}/>
                                ),
                            }[params[1]]}
                        </div>
                    </>
                )
                : (params !== undefined)
                ? (
                    <div id="article-error">
                        Sorry, content at
                        <code> "{params.join("/")}" </code>
                        could not be loaded!<br/><br/>
                        The following happened:<br/>
                        <code>`{err}`</code>
                    </div>
                ) : (
                    <div id="article-error">
                        An error occurred while loading this page!
                    </div>
                )
        }
    </>
};

export default Content;
