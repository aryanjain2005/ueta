import express from "express";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
