import React, {useState} from "react";
import Head from "next/head";
import Field from "../../components/field/fields";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import getConfig from "next/config";

const {publicRuntimeConfig} = getConfig();

const ContactPage = () => {
    /**
     * @param {string} label - Field label
     * @param {string} value - initial field value
     * @param {string} type - input type
     * @param {string} placeholder - input placeholder
     * @param {RegExp} pattern - validation regex
     * @param {string} msg - message shown when invalid
     */
    let [err, setErr] = useState("");
    let [succ, setSucc] = useState("");

    const exMessage = "I've got this project that I was hoping we could work on together!";

    let nameField = new Field(
        "Your Name", "", "text", "John Doe",
        /.* .*/, // at least 2 words, space delimited
        "Please enter first & last name"
    );
    let email = new Field(
        "Email Address", "", "email", "john.doe@example.com",
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
    );
    let subject = new Field(
        "Subject", "", "text", "Let's work together!",
        /.{1,}/, // one or more characters
        "Please enter a subject line",
    );
    let message = new Field(
        "Message", "", "textarea", exMessage,
        /.{1,}/, // one or more characters
        "Please enter a message",
    );
    message.setAs("textarea");

    const contactFields = [
        nameField, email,
        subject, message,
    ];

    const handleSubmit = () => {
        let valid = true;
        contactFields.map(f => {
            valid = f.validate();
        });

        if (!valid) {
            return
        }

        const data = {
            "name": nameField.value,
            "addr": email.value,
            "subj": subject.value,
            "body": message.value,
        };

        Axios.post(`${publicRuntimeConfig.BE}/mail`, data)
            .then(_ => {
                contactFields.map(f => f.set(""));
                setSucc("Your message has been sent. I will try to get back to you ASAP!");
            })
            .catch(_ => {
                setSucc(`Message sent.\n
                I will try to get back to you ASAP!`);
                setErr("Error: failed to send email!");
            });
    };

    return (
        <>
            <Head>
                <title>Contact Navaz</title>
            </Head>
            <div id="page" className="contact-page">
                <h1 id="page-title">Contact Navaz</h1>
                <h2 id="page-title">Slide into my inbox 📥</h2><br/>
                <p>This form will email me your message.</p><br/>
                <p>Ensure that your email is correct so that I can respond to you.</p>
                <hr className="divider"/>
                <div id="contact-form">
                    {contactFields.map((f, i) => {
                        return f.paint(i)
                    })}
                </div>
                <Button variant="primary"
                        id="contact-submit"
                        onClick={handleSubmit}
                >
                    Submit
                </Button>
                <div className="submit-response" id="submit-error">
                    {err}
                </div>
                <div className="submit-response" id="submit-success">
                    {succ}
                </div>
            </div>
        </>
    );
};

export default ContactPage;
