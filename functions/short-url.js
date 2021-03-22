/**
 * Serverless Function Requirements
 */
const fetch = require("node-fetch");
const redis = require('redis');
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

/**
 * Shorter App Configurations
 */
const shortUrlSize = 8;
const recaptchaPrivateKey = process.env.RECAPTCHA_PRIVATE_KEY;

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
    let incrementSavedUrlVisits = await redisClient.incr(`url_visits_${uniqueString}`);
    let totalSavedUrls = await redisClient.incr('total_saved_urls');
    redisClient.quit();
    
    return {
        "success": (saveUrl == "OK") ? true:false,
        "shorterUrl": `${process.env.BASE_URL}/r/${uniqueString}`,
        "destinationUrl": destinationUrl,
    }
}

/**
 * Verify if the given recaptcha token is valid.
 * 
 * @param {String} Token generated from the front-end. 
 * @returns Boolean
 */
async function validateRecaptchaToken(token) {
    const validateRecaptchaRequest = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaPrivateKey}&response=${token}`
    });

    const recaptchaResponse = await validateRecaptchaRequest.json();
    return recaptchaResponse;
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
    const validateRequestWithRecaptcha = await validateRecaptchaToken(request.token);

    if(!validateRequestWithRecaptcha.success) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                "success": false,
                "message": "Oops. Try again. Recaptcha validation failed.",
            })
        };
    }

    const generateShorterUrl = await generateUniqueShorterUrl(shortUrlSize, request.url);
    redisClient.quit();
    
    return {
        statusCode: 200,
        body: JSON.stringify(generateShorterUrl)
    };
}