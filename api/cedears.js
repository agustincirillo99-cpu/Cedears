/*
  Serverless Proxy for BYMA Open Data
*/

const https = require('https');

exports.handler = (event, context, callback) => {
  const options = {
    hostname: 'api.byma.com.ar',
    path: event.path,
    method: event.httpMethod,
    headers: {
      'Content-Type': 'application/json',
      ...event.headers
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      callback(null, {
        statusCode: res.statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: body
      });
    });
  });

  req.on('error', (e) => {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    });
  });

  if (event.body) {
    req.write(event.body);
  }
  req.end();
};
