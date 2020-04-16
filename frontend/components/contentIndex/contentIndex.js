import React from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";

/*
* ContentIndex displays the given contentIndex data structure using
* react-bootstrap components. The data structure is guaranteed to have
* the expected schema as it is enforced statically by the backend.
* */
const ContentIndex = ({contentIndex}) => {
    return (
        <Accordion defaultActiveKey={0}>
            {(contentIndex !== undefined)
                ? contentIndex.map((topic, topicNumber) => {
                    return (
                        <Card key={topic.topicID}>
                            <Accordion.Toggle as={Card.Header}
                                              variant="link"
                                              eventKey={topicNumber}
                                              className="topic-name"
                            >
                                {topic.topicName}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={topicNumber}>
                                <Card.Body key={topic.topicID}>
                                    <div className="topic-cards">
                                        {topic.contentTypes.map(ct => {
                                            return ct.resources.map(r => {
                                                return (
                                                    <Card
                                                        bg="light"
                                                        style={{width: '18rem'}}
                                                        className="resource-card"
                                                        key={r.ID}
                                                    >
                                                        <Card.Header>
                                                            <a href={`content/${topic.topicID}/${ct.contentTypeID}/${r.ID}?ttl=${r.name}`}>
                                                                🔗 {r.name}
                                                            </a>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Card.Text>
                                                                {r.description}
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                )
                                            })
                                        })}
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    );
                })
                : <div>Loading...</div>}
        </Accordion>
    );
};

export default ContentIndex;
