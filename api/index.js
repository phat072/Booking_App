// app.js
const express = require('express');
const connectedDB = require('./configs/database'); 

const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectedDB();
app.use("/api", routes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

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
          url: "https://booking-res.vercel.app", // URL của server đã triển khai lên Vercel
        },
      ],
    },
    apis: ['./routes/routes.js'], // Đường dẫn tới file chứa các comment swagger
  };
  
  
  const swaggerSpec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));