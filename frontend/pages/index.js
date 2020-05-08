import React from "react";
import Head from "next/head";
import Links from "../components/footer/links";

const HomePage = () => {
    let time = new Date().toDateString();
    const welcomeStr = "Welcome to Navaz's Home Page";
    const commentLine = "#".repeat(Math.max(time.length, welcomeStr.length));

    let pages = [
        // {name: "My Work", href: "/projects"},
        { name: "Browse Content", href: "/content" },
        { name: "Contact Me", href: "/contact" },
    ];

    return (
        <>
            <Head>
                <title>Navaz Alani's Home Page</title>
                <meta name="Description"
                    content="Navaz Alani's personal site's home page" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <div className="home-container">
                <div id="whoami" className="bg-text">
                    <code><b>{welcomeStr}</b></code><br />
                    <code><i>{time}</i></code><br />
                    <code>{commentLine}</code>
                    <div><br />
                        <code className="command">> </code>
                        <code>whoami<br /></code>
                        <code className="output">
                            Navaz Alani<br />
                            🎓 CS @ UWaterloo<br />
                            👨🏽‍💻 Developer<br />
                            🗺 Toronto
                        </code>
                    </div>
                    <br />
                    <div>
                        <code className="command">> </code>
                        <code>cd ↹<br /></code>
                        <code className="output">
                            {pages.map((page, index) => {
                                return (
                                    <>
                                        <a key={index}
                                            href={page.href}
                                        >
                                            {page.name}<br />
                                        </a>
                                    </>
                                );
                            })}
                        </code>
                    </div>
                    <br />
                    <div>
                        <code className="command">> </code>
                        <code>links<br /></code>
                        <code className="output">Check me out!<br /></code>
                        <Links />
                    </div>
                    <code>{commentLine}</code><br />
                    <code>© 2020 Navaz Alani</code>
                </div>
            </div>
        </>
    );
};

export default HomePage;
