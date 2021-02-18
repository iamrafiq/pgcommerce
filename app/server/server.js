const express = require("express");
const dotenv = require("dotenv");
require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const winston = require("winston");
const userRoutes = require("./routes/userRoute.js");
const productRoutes = require("./routes/productRoutes.js");
const { errorHandler, notFound } = require("./middleware/errorMiddleware.js");
const { connectDB } = require("./config/db");
const db = require("./config/database");

const app = express();

// Body parser
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
    parameterLimit: 500,
  })
);

dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Api Routes
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);

// PayPal
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Not found api
app.use(notFound);
// errorHandler
app.use(errorHandler);

// Server static assets in production

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("../client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "../client", "../client/build", "index.html")
//     );
//   });
// }

// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix ../client && npm run build --prefix ../client"

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: winston.stream }));
}

db.authenticate()
  .then(() => {
    console.log("Postgres DB connection has been established successfully.");
  })
  .catch((error) => console.error("Unable to connect to the database:", error));

const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
