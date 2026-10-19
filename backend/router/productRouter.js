import { Router } from "express";
import {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controller/productController.js";

const journalRouter = Router();

journalRouter.post("/", createJournal);
journalRouter.get("/", getAllJournals);
journalRouter.get("/:id", getJournalById);
journalRouter.put("/:id", updateJournal);
journalRouter.delete("/:id", deleteJournal);

export default journalRouter;
