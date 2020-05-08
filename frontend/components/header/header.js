import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Header = () => {
    return (
        <>
            <Navbar className="bg-nav" variant="dark">
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src="/favicon.ico"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Navaz Alani
                </Navbar.Brand>
                <Nav defaultActiveKey="/">
                    <Nav.Link href="/contact">Contact</Nav.Link>
                    <Nav.Link href="/content">Content Index</Nav.Link>
                </Nav>
            </Navbar>
        </>
    )
}

export default Header;
