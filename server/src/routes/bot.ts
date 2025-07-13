import { Router } from "express";
import botClient from "../services/grpc-client";

const router: Router = Router();

router.post("/create", (req, res) => {
  const { name, aggression } = req.body;

  botClient.CreateBot({ name, aggression }, (err: any, response: any) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.json(response);
  });
});

export default router;
