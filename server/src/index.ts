import http from "node:http";
import express from "express";
import roomRoutes from "./routes/room";
import { errorHandler, notFound } from "./utils/middlewares";
import { initSocket } from "./utils/socket";

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use((request, _response, next) => {
  if (request.body == null) request.body = {};
  next();
});

app.use(express.json());
app.use("/rooms", roomRoutes);
app.get("/", (_request, response) => {
  response.json("Welcome to the Spar Card Game!");
});
app.use(notFound);
app.use(errorHandler);

server.listen(3000, () => {
  console.log("Game server running on http://localhost:3000");
});
