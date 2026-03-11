const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure Task API",
      version: "1.0.0",
      description: "API documentation for Secure Task API",
    },
    server: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
