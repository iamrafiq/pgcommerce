const express = require("express");
const dotenv = require("dotenv");
require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const winston = require("winston");

const { errorHandler, notFound } = require("./middleware/errorMiddleware.js");
const { connectDB } = require("./config/db");
const { sequelize } = require("./models/index");
const depricatedUserRoutes = require("./routes/userRoute.js");
const depricatedProductRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const clusterRoutes = require("./routes/cluster");
const fileRoutes = require("./routes/file");
const productRoutes = require("./routes/product");
const admin = require('firebase-admin');
var serviceAccount = require('./config/firebaseConfig.json');

const firebaseConfig = require('./config/firebaseConfig')

const app = express();

//middleware
app.use(morgan("dev"));
// Body parser
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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
app.use("/api/users", depricatedUserRoutes);
app.use("/api/product", depricatedProductRoutes);

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", clusterRoutes);
app.use("/api", fileRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);


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


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://DATA_BASE_URL.firebaseio.com"
});


sequelize
  .authenticate()
  .then(() => {
    console.log("Postgres DB connection has been established successfully.");
  })
  .catch((error) => console.error("Unable to connect to the database:", error));

// const port = process.env.PORT || 8000;
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
