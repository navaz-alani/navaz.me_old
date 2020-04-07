import React, {useEffect, useState} from "react";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import getConfig from 'next/config'
import {useRouter} from 'next/router'

const {publicRuntimeConfig} = getConfig();

/*
* Article is a function component which renders Markdown
* documents retrieved from the backed as HTML.
* */
const Article = () => {
    const router = useRouter();
    const {article} = router.query;

    let [file, setFile] = useState("");
    let [err, setErr] = useState(undefined);

    useEffect(() => {
        if (article !== undefined) {
            Axios.post(`${publicRuntimeConfig.BE}/md`, {
                file: article,
            })
                .then(response => {
                    setFile(response.data);
                })
                .catch(error => {
                    setErr(error.response.data);
                });
        }
    }, [article]);

    return <>
        {
            (err === undefined)
                ? (
                    <div id="page">
                        <ReactMarkdown source={file}/>
                    </div>
                )
                : (
                    <div id="article-error">
                        Sorry, article with ID
                        <code> "{article}" </code>
                        could not be loaded!<br/><br/>
                        The following error occurred:<br/>
                        <code>`{err}`</code>
                    </div>
                )
        }
    </>
};

export default Article;
