import React, { useEffect, useState } from "react";
import Axios from "axios";
import Head from "next/head";
import getConfig from "next/config";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ContentIndex from "../../components/contentIndex/contentIndex";
import Spinner from "./../../components/spinner/spinner";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const { publicRuntimeConfig } = getConfig();

const ContentHome = () => {
    let [contentIndex, setContentIndex] = useState(undefined);
    let [err, setErr] = useState(undefined);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (contentIndex === undefined) {
            Axios.get(`${publicRuntimeConfig.BE}/contentIndex`)
                .then(r => {
                    setContentIndex(r.data.index);
                    setLoading(false);
                })
                .catch(e => {
                    setErr(e.data);
                    setLoading(false);
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
                <meta name="Description"
                    content="Index of content served on Navaz Alani's personal website." />
            </Head>
            <Header />
            <Jumbotron id="content-index-jumbo">
                <Container>
                    <h1>📜 Navaz's Content Index</h1>
                    <p>
                        The content served on this page can be found <a
                            href="https://git.navaz.me/navaz.me-content">
                            in this GitHub repository</a>.<br />
                        If you notice an error, please open an <a
                            href="https://git.navaz.me/navaz.me-content/issues/new">
                            issue
                                </a> or <a
                            href="/contact">
                            contact me
                                </a>. Thanks in advance!
                    </p>
                </Container>
            </Jumbotron>
            <div id="page">
                {/* Content Index */}
                {(loading)
                    ? <Spinner />
                    : (err === undefined && contentIndex !== undefined)
                        ? <ContentIndex contentIndex={contentIndex}
                            fileLink={fileLink}
                        />
                        :
                        <div id="content-error">
                            Oh no! 😱<br />
                            Index could not be loaded<br />
                            Please try again later...
                        </div>
                }
            </div>
            <Footer />
        </>
    );
};

export default ContentHome;
