const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketSetup = require("./sockets/socketSetup"); // Import your socket setup
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Routes
app.use("/", routes);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.IO with the server
socketSetup(server);
