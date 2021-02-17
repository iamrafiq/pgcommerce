import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

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

app.listen(
  PORT,
  console.log(`Server is running on http://localhost:${PORT}`.yellow.bold)
);
