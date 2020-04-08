import React, {useEffect, useState} from "react";
import Axios from "axios";
import Head from "next/head";
import getConfig from "next/config";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const {publicRuntimeConfig} = getConfig();

const ContentHome = () => {
    let [index, setIndex] = useState(undefined);
    let [err, setErr] = useState(undefined);

    useEffect(() => {
        if (index === undefined) {
            Axios.get(`${publicRuntimeConfig.BE}/contentIndex`)
                .then(r => {
                    setIndex(r.data.index);
                })
                .catch(e => {
                    setErr(e.data.response);
                })
        }
    }, [index]);

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
                {(err === undefined && index !== undefined)
                    ? (<Tabs id="content-index">
                            {Object.keys(index).map((contentType, kPos) => {
                                return (
                                    // A tab for each content type
                                    <Tab title={contentType} eventKey={contentType}>
                                        {/*A table for content listing*/}
                                        <Table key={kPos}
                                               striped bordered hover
                                               responsive="sm"
                                               size="sm"
                                        >
                                            {/*Document number and title as table headers*/}
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {index[contentType].map((entry, ePos) => {
                                                    let link = fileLink(contentType, entry.fileName);
                                                    return (
                                                        <tr>
                                                            <td>{ePos + 1}</td>
                                                            <td>
                                                                <a href={link}>
                                                                    {entry.title}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                            }
                                            </tbody>
                                        </Table>
                                    </Tab>
                                )
                            })}
                        </Tabs>
                    )
                    : (
                        <div>
                            Content index could not be loaded!
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default ContentHome;
