const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const awsConfig = {
    region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

// /api/users/

//GET
router.get('/users', (req, res) => {
    const params = {
        TableName: table,
    };
    //Scan return all items in the table
    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data.Items);
        }
    });
});

router.get('/users/:username', (req, res) => {
    console.log(`Querying for thoughts from ${req.params.username}.`);

    const params = {
        TableName: table,
        KeyConditionExpression: '#un = :user',
        // atrribute property that defines the alias relationship to attribute values
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought',
            '#img': 'image'
        },
        ExpressionAttributeValues: {
            ':user': req.params.username,
        },
        // similar to SELECT in SQL, determines which attributes/columns will be returned
        ProjectionExpression: '#un, #th, #ca, #img',
        // determines the order for the sort. true for ascending and false for descending
        ScanIndexForward: false,
    };

    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.status(500).json(err); // an error occurred
        } else {
            console.log("Query succeeded.");
            res.json(data.Items)
        }
    });

});

// POST
// Create new user
router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            username: req.body.username,
            createdAt: Date.now(),
            thought: req.body.thought,
            image: req.body.image
        },
    };
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.json({ "Added": JSON.stringify(data, null, 2) });
        }
    });
});

module.exports = router;