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

 exports.handler = async function(event, context) {
    if(event.httpMethod != 'GET') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                "success": false,
                "message": "Invalid method."
            })
        };
    }

    const splitUrlPathAndGetLast = event.path.substring(1).split('/').pop();
    const getRedirectUrl = await redisClient.get(`url_${splitUrlPathAndGetLast}`);
    const incrementRedirectUrlVisits = await redisClient.incr(`url_visits_${splitUrlPathAndGetLast}`);

    redisClient.quit();

    return {
        statusCode: 301,
        headers: {
            Location: getRedirectUrl
        },
        body: ''
    };
 }