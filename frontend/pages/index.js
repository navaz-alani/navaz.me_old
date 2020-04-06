import React from "react";
import Head from "next/head";
import HomeNav from "../components/home/nav";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

const HomePage = () => {
    return (
        <div id="main-container">
            <Head>
                <title>👨🏽‍💻 Navaz's Home Page</title>
            </Head>
            <HomeNav/>
            <Jumbotron id="home-jumbo">
                <h1>Welcome to `navaz.me`</h1>
                <h2>A bit about me:</h2>
                <p>
                    I'm Navaz Alani and this is my personal site.
                    <br/>
                </p>
                <p>
                    <Button variant="primary">Learn more</Button>
                </p>
            </Jumbotron>
        </div>
    );
};

export default HomePage;
