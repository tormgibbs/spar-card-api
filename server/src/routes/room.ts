import { Router } from "express";
import {
	createRoom,
	getRoom,
	joinRoom,
	playCard,
	startGame,
} from "@/handlers/room";

const router = Router();

router.post("/", createRoom);
router.post("/:id/join", joinRoom);
router.get("/:id", getRoom);
router.post("/:id/start", startGame);
router.post("/:id/play", playCard);

export default router;
