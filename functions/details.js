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
    const getRedirectUrlVisits = await redisClient.get(`url_visits_${splitUrlPathAndGetLast}`);

    if(getRedirectUrlVisits == null) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                "success": false,
                "message": "Invalid code."
            })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            "success": true,
            "message": "Visits retrieved.",
            "data"   : {
                "visitsCount": parseInt((!getRedirectUrlVisits) ? 0:getRedirectUrlVisits)
            }
        })
    };
 }