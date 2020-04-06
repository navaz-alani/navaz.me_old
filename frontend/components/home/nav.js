import React from "react";
import Nav from "react-bootstrap/Nav";

const HomeNav = () => {
    let links = [
        {name: "Home", href: "/"}
    ];

    return (
        <Nav variant="pills"
             className="home-nav justify-content-center"
             activeKey="/"
        >
            {
                links.map((link, i) => {
                    return <Nav.Item className="home-nav-link">
                        <Nav.Link
                            href={link.href}
                            key={i}
                        >
                            {link.name}
                        </Nav.Link>
                    </Nav.Item>
                })
            }
        </Nav>
    );
};

export default HomeNav;
