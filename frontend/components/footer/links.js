import React from "react";

const Links = () => {
    let links = [
        {
            img: {
                webp: "/webp/GitHub-Mark-Light-64px.webp",
                raw: "/raw/GitHub-Mark-Light-64px.png",
                rawType: "image/png"
            },
            alt: "GitHub logo",
            href: "https://git.navaz.me"
        },
        {
            img: {
                webp: "/webp/LI-In-Bug.webp",
                raw: "/raw/LI-In-Bug.png",
                rawType: "image/png"
            },
            alt: "LinkedIn logo",
            href: "https://www.linkedin.com/in/navazalani/"
        },
        {
            img: "/Twitter_bird_logo_2012.svg",
            alt: "Twitter logo",
            href: "https://twitter.com/alani_navaz"
        }
    ];

    const renderLogo = (img, alt) => {
        if (typeof img === 'object') {
            return <picture>
                <source srcSet={img.webp} type="image/webp" />
                <source srcSet={img.raw} type={img.rawType} />
                <img
                    src={img.raw}
                    className="link"
                    alt={alt}
                />
            </picture>
        }
        return <img
            src={img}
            className="link"
            alt={alt}
        />
    }

    return (
        <div id="links">
            {links.map((link, index) => {
                return (
                    <a href={link.href}
                        key={index}>
                        {renderLogo(link.img, link.alt)}
                    </a>
                );
            })}
        </div>
    )
}

export default Links;
