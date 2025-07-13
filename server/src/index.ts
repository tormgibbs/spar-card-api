import http from "node:http";
import express from "express";
import botRoutes from "./routes/bot";
import roomRoutes from "./routes/room";
import { errorHandler, notFound } from "./utils/middlewares";
import { initSocket } from "./utils/socket";

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use("/bot", botRoutes);
app.use("/rooms", roomRoutes);

app.use(notFound);
app.use(errorHandler);

server.listen(3000, () => {
	console.log("Game server running on http://localhost:3000");
});
