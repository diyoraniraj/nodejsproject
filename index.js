var express = require("express");
var router = express.Router();
var routes = require("./routes");
const app = express();

app.use(express.json());
app.use(routes);

/* app.use((err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(500).json({
    message: err.message,
  });
}); */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "an error occurred" });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
