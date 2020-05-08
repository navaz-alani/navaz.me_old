import React from "react";

const Links = () => {
    let links = [
        {
            img: "/GitHub-Mark-Light-64px.webp",
            alt: "GitHub logo",
            href: "https://git.navaz.me"
        },
        {
            img: "/LI-In-Bug.webp",
            alt: "LinkedIn logo",
            href: "https://www.linkedin.com/in/navazalani/"
        },
        {
            img: "/Twitter_bird_logo_2012.svg",
            alt: "Twitter logo",
            href: "https://twitter.com/alani_navaz"
        }
    ];

    return (
        <div id="links">
            {links.map((link, index) => {
                return (
                    <a href={link.href}
                        key={index}>
                        <img
                            src={link.img}
                            className="link"
                            alt={link.alt}
                        />
                    </a>
                );
            })}
        </div>
    )
}

export default Links;
