import React from "react";
import Spinner from "react-bootstrap/Spinner";

const MySpinner = () => {
    return (
        <div id="spinner">
            <Spinner animation="grow" />
            <h3>Loading...</h3>
        </div>
    );
}

export default MySpinner;
