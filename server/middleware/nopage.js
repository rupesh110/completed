// middleware.js
const notFoundMiddleware = (req, res, next) => {
    res.status(404);
  
    if (req.originalUrl.startsWith('/*')) {
      res.json({ error: 'Not found' });
    } else {
      // Send a message to the user before redirecting
      res.send(`
        <html>
          <head>
            <meta http-equiv="refresh" content="3;url=/"> <!-- Redirect after 3 seconds -->
          </head>
          <body>
            <p>Page not found. Redirecting to the main page...</p>
          </body>
        </html>
      `);
    }
  };
  
  export default notFoundMiddleware;
  