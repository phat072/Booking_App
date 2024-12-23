const express = require("express");
const bodyParser = require("body-parser");
<<<<<<< HEAD
const connectedDB = require('./configs/database');
=======
const connectedDB = require("./configs/database");
>>>>>>> ee53205 (Mô tả thay đổi)
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const http = require("http");
<<<<<<< HEAD
const socketSetup = require("./sockets/socketSetup"); // Import your socket setup

const app = express();
const server = http.createServer(app);    // This is your HTTP server for the Express app
const socketServer = http.createServer(); // Separate socket server
const port = 8000;
const socketPort = 3000;

=======
const socketSetup = require("./sockets/socketSetup");

const app = express();

// Create HTTP server for Express
const server = http.createServer(app);

const port = 8000;  // Express port

// Middleware setup
>>>>>>> ee53205 (Mô tả thay đổi)
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
<<<<<<< HEAD
        url: "https://booking-app.vercel.app",
=======
        url: "http://localhost:8000",  // Make sure this URL is correct for production
>>>>>>> ee53205 (Mô tả thay đổi)
      },
    ],
  },
  apis: ['./routes/routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);
<<<<<<< HEAD
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.IO with the socket server
socketSetup(socketServer);

socketServer.listen(socketPort, () => {
  console.log(`Socket.IO server is running on port ${socketPort}`);
});
=======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

socketSetup(io);  // Call socket setup function to initialize socket handling

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
>>>>>>> ee53205 (Mô tả thay đổi)
