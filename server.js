var crypto = require('crypto');
 
/**
 * Given Houndify Client Id and Client Key in options objects
 * returns an Express request handler for authenticating Voice Requests.
 * Signs a token/message with Houndify Client Key using the HMAC scheme.
 * The request for authentications will contain "token" query parameter
 * that needs to be signed with secret Client Key.
 *
 * @param {Object} opts - Options
 * @return {Function} An Express request handler
 */
function createAuthenticationHandler(opts) { 
    return function (req, res) {
        var clientKey = opts.clientKey.replace(/-/g, "+").replace(/_/g, "/");
        var clientKeyBin = new Buffer(clientKey, "base64");
        var hash = crypto.createHmac("sha256", clientKeyBin).update(req.query.token).digest("base64");
        var signature = hash.replace(/\+/g, "-").replace(/\//g, "_");
        res.send(signature);
    }
}

var request = require('request');
 
/**
 * Returns a simple Express handler for proxying Text Requests.
 * The handler takes query parameters and houndify headers, 
 * and sends them in the request to backend (GET https://api.houndify.com/v1/text). 
 *
 * @return {Function} An Express request handler
 */
function createTextProxyHandler() {
    return function (req, res) {
        var houndifyHeaders = {};
        for (var key in req.headers) {
            var splitKey = key.toLowerCase().split("-");
            if (splitKey[0] == "hound") {
                var houndHeader = splitKey.map(function(pt) {
                    return pt.charAt(0).toUpperCase() + pt.slice(1);
                }).join("-");
                houndifyHeaders[houndHeader] = req.headers[key];
            }
        }
 
        //GET requests contain Request Info JSON in header.
        //POST requests contain Request Info JSON in body. 
        //Use POST proxy if Request Info JSON is expected to be bigger than header size limit of server
        houndifyHeaders['Hound-Request-Info'] = houndifyHeaders['Hound-Request-Info'] || req.body;
 
        request({
            url: "https://api.houndify.com/v1/text",
            qs: req.query,
            headers: houndifyHeaders
        }, function (err, resp, body) {
            //if there's an request error respond with 500 and err object
            if (err) return res.status(500).send(err.toString());
            
            //else send the response body from backend as it is
            res.status(resp.statusCode).send(body);
        });  
    }
}
