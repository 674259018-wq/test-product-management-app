import { Op } from "sequelize";
import Journal from "../model/productModel.js";

const allowedCategories = new Set(["วิชาการ", "วิจัย", "ทั่วไป"]);

const normalizeJournalPayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Request body must be a JSON object" };
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const responsible =
    typeof payload.responsible === "string" ? payload.responsible.trim() : "";
  const category = payload.category;
  const date = payload.date;
  const parsedDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00.000Z`)
      : null;
  const rawDescription = payload.description;
  const statusProvided = Object.hasOwn(payload, "status");

  if (title.length < 1 || title.length > 150) {
    return { error: "Title must be between 1 and 150 characters" };
  }
  if (responsible.length < 1 || responsible.length > 100) {
    return { error: "Responsible person must be between 1 and 100 characters" };
  }
  if (!allowedCategories.has(category)) {
    return { error: "Category must be วิชาการ, วิจัย, or ทั่วไป" };
  }
  if (
    !parsedDate ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return { error: "Date must be a valid date in YYYY-MM-DD format" };
  }
  if (
    rawDescription !== undefined &&
    rawDescription !== null &&
    typeof rawDescription !== "string"
  ) {
    return { error: "Description must be text" };
  }

  const description = rawDescription?.trim() || null;
  if (description && description.length > 2000) {
    return { error: "Description must not exceed 2000 characters" };
  }
  if (statusProvided && typeof payload.status !== "boolean") {
    return { error: "Status must be true or false" };
  }

  return {
    values: {
      title,
      responsible,
      category,
      date,
      description,
      ...(statusProvided ? { status: payload.status } : {}),
    },
  };
};

const createJournal = async (req, res, next) => {
  try {
    const result = normalizeJournalPayload(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    const newJournal = await Journal.create(result.values);
    return res.status(201).json(newJournal);
  } catch (error) {
    return next(error);
  }
};
const getAllJournals = async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const category = req.query.category;
    if (category && !allowedCategories.has(category)) {
      return res.status(400).json({ message: "Invalid category filter" });
    }

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { responsible: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;

    const journals = await Journal.findAll({
      where,
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });
    return res.status(200).json(journals);
  } catch (error) {
    return next(error);
  }
};
const getJournalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Journal id is required" });
    }
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    return res.status(200).json(journal);
  } catch (error) {
    return next(error);
  }
};
const updateJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Journal id is required" });
    }
    const result = normalizeJournalPayload(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    await journal.update(result.values);
    return res.status(200).json(journal);
  } catch (error) {
    return next(error);
  }
};
const deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Journal id is required" });
    }

    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    await journal.destroy();
    return res.status(200).json({
      message: "Journal is deleted successfully",
      deletedJournal: journal,
    });
  } catch (error) {
    return next(error);
  }
};

export {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
};
