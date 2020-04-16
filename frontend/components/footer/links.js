import React from "react";

const Links = () => {
    let links = [
        {
            img: "/GitHub-Mark-Light-120px-plus.png",
            href: "https://git.navaz.me"
        },
        {
            img: "/LI-In-Bug.png",
            href: "https://www.linkedin.com/in/navazalani/"
        },
        {
            img: "/Twitter_bird_logo_2012.svg",
            href: "https://twitter.com/alani_navaz"
        }
    ];

    return (
        <div id="links">
            {links.map((link, index) => {
                return (
                    <a href={link.href}>
                        <img
                            src={link.img}
                            className="link"
                        />
                    </a>
                );
            })}
        </div>
    )
}

export default Links;
