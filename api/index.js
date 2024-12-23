const express = require("express");
const bodyParser = require("body-parser");

const connectedDB = require("./configs/database");
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const http = require("http");

const socketSetup = require("./sockets/socketSetup");

const app = express();

// Create HTTP server for Express
const server = http.createServer(app);

const port = 8000; // Express port

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
        url: "https://booking-app.vercel.app", // Production URL
      },
      {
        url: "http://localhost:8000", // Local development URL
      },
    ],
  },
  apis: ["./routes/routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Attach routes
app.use("/", routes);

// Socket.IO configuration for backend
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

socketSetup(io); // Call socket setup function to initialize socket handling

// Start the server (only once)
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
