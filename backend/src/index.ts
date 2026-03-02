import express from "express";
import routes from "./routes";
import "./database/db";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/api", routes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});