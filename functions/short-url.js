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

    const redis = require('redis');
    const request = JSON.parse(event.body);
    
    return {
        statusCode: 200,
        body: JSON.stringify(event)
    };
}