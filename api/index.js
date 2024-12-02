const express = require("express");
const bodyParser = require("body-parser");
const connectedDB = require('./configs/database'); 
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const http = require("http");
const socketSetup = require("./sockets/socketSetup"); // Import your socket setup

const app = express();
const server = http.createServer(app);    
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectedDB();

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple Express API",
    },
    servers: [
      {
        url: "https://booking-app.vercel.app",
      },
    ],
  },
  apis: ['./routes/routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", routes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Initialize Socket.IO with the server
socketSetup(server);

server.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
  console.log(`WebSocket (Socket.IO) server is accessible at ws://localhost:${port}`);
});