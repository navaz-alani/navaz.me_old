import React from "react";
import Card from "react-bootstrap/Card";

/*
* ContentIndex displays the given contentIndex data structure using
* react-bootstrap components. The data structure is guaranteed to have
* the expected schema as it is enforced statically by the backend.
* */
const ContentIndex = ({contentIndex}) => {
    return (
        <>
            {(contentIndex !== undefined)
                ? contentIndex.map((topic) => {
                    return (
                        // main card for topic
                        <Card className="topic" key={topic.topicID}>
                            <Card.Header>
                                <h4 className="topic-name">{topic.topicName}</h4>
                            </Card.Header>
                            <Card.Body key={topic.topicID}>
                                <div className="topic-cards">
                                    {topic.contentTypes.map(ct => {
                                        return ct.resources.map(r => {
                                            return (
                                                // a card for each content item
                                                <Card
                                                    bg="light"
                                                    style={{width: '18rem'}}
                                                    className="resource-card"
                                                    key={r.ID}
                                                >
                                                    <Card.Header>
                                                        <a href={
                                                            `content/${topic.topicID}/${ct.contentTypeID}/${r.ID}?ttl=${r.name}
                                                                `}>
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
                        </Card>
                    );
                })
                : <div>Loading...</div>}
        </>
    );
};

export default ContentIndex;
