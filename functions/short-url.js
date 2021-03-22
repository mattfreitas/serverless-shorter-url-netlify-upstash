/**
 * Serverless Function Requirements
 */
const redis = require('redis');
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

/**
 * Creates a random string.
 * 
 * @source https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 * @param {Number} length 
 * @returns 
 */
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

/**
 * Generates unique random string for a given URL.
 * 
 * @param {Number} String length 
 * @param {String} Destination url (where the user will be redirected) 
 * @returns {Object} 
 */
async function generateUniqueShorterUrl(length, destinationUrl) {
    let uniqueString = makeid(length);
    let shorterUrlExists = await redisClient.get(uniqueString);

    if(shorterUrlExists) {
        return generateUniqueShorterUrl(length);
    }

    let saveUrl = await redisClient.set(`url_${uniqueString}`, destinationUrl);

    return {
        "shorterUrl": `${process.env.BASE_URL}/${uniqueString}`,
        "destinationUrl": destinationUrl,
        "result": saveUrl
    }
}

exports.handler = async function(event, context) {
    if(event.httpMethod != 'POST') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                "success": false,
                "message": "Invalid method."
            })
        };
    }

    const request = JSON.parse(event.body);
    const generateShorterUrl = await generateUniqueShorterUrl(8, request.url);

    return {
        statusCode: 200,
        body: JSON.stringify(generateShorterUrl)
    };
}