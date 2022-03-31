const dialogflow = require('@google-cloud/dialogflow');
require('dotenv').config();
const express = require('express');

// Your google dialogflow project-id
const PROJECID = process.env.project_id;
console.log(PROJECID)

const CONFIGURATION = {
    credentials: {
        private_key: process.env.private_key.replace(/\\n/g, '\n'),
        client_email: process.env.client_email
    }
}


// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);


// Detect intent method
const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    // The text query request.
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: queryText,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    // console.log(responses);
    const result = responses[0].queryResult;
    console.log(result.fulfillmentText);

    return {
        response: result.fulfillmentText
    };
}

detectIntent('en', 'hello', 'abcd1234')

// detectIntent('en', 'hello', 'abcd1234');

// Start the webapp
const webApp = express();

// Webapp settings
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

// Server Port
const PORT = process.env.PORT || 8080;

// Home route
webApp.get('/', (req, res) => {
    res.send(`Hello World.!`);
});

// Dialogflow route
webApp.post('/dialogflow', async (req, res) => {

    let languageCode = req.body.languageCode;
    let queryText = req.body.queryText;
    let sessionId = req.body.sessionId;

    let responseData = await detectIntent(languageCode, queryText, sessionId);

    res.send(responseData.response);
});

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});