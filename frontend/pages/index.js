import React from "react";
import Head from "next/head";

const HomePage = () => {
    let time = new Date().toDateString();
    const welcomeStr = "Welcome to Navaz's Home Page";
    const commentLine = "#".repeat(Math.max(time.length, welcomeStr.length));

    let pages = [
        {name: "My Work", href: "/projects"},
        {name: "Browse Content", href: "/content"},
        {name: "Contact Me", href: "/contact"},
    ];
    let links = [
        {img: "/GitHub-Mark-Light-120px-plus.png", href: "https://git.navaz.me"},
        {img: "/LI-In-Bug.png", href: "https://www.linkedin.com/in/navazalani/"},
        {img: "/Twitter_bird_logo_2012.svg", href: "https://twitter.com/alani_navaz"}
    ];

    return (
        <>
            <Head>
                <title>Navaz Alani's Home Page</title>
                <link rel="shortcut icon" href="/favicon.ico"/>
            </Head>
            <div className="home-container">
                <div id="whoami" className="bg-text">
                    <code><b>{welcomeStr}</b></code><br/>
                    <code><i>{time}</i></code><br/>
                    <code>{commentLine}</code>
                    <div><br/>
                        <code className="command">> </code>
                        <code>about-me<br/></code>
                        <code className="output">
                            Navaz Alani<br/>
                            🎓 CS @ UWaterloo<br/>
                            👨🏽‍💻 Developer<br/>
                            🗺 Toronto<br/>
                        </code>
                    </div>
                    <div>
                        <code className="command">> </code>
                        <code>goto ↹<br/></code>
                        <code className="output">
                            {
                                pages.map((page, index) => {
                                    return (
                                        <>
                                            {/*tab twice*/}
                                            &emsp;&emsp;
                                            <a key={index}
                                               href={page.href}
                                            >
                                                {page.name}<br/>
                                            </a>
                                        </>
                                    );
                                })
                            }
                        </code>
                    </div>
                    <div>
                        <code className="command">> </code>
                        <code>links<br/></code>
                        <code className="output">Check me out!<br/></code>
                        <div id="links">
                            {
                                links.map((link, index) => {
                                    return (
                                        <a href={link.href}>
                                            <img
                                                src={link.img}
                                                className="link"
                                            />
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <code>{commentLine}</code><br/>
                    <code>© 2020 Navaz Alani</code>
                </div>
            </div>
        </>
    );
};

export default HomePage;
