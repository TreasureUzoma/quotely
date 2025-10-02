import { Request, Response } from "express";
import { getContext } from "../middleware/session";
import {
  createNotesSchema,
  getAllNotesSchema,
  updateNotesSchema,
  uuidSchema,
} from "../lib/zod";
import { db } from "../db";
import { notes } from "../db/schema";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

export const createNote = async (req: Request, res: Response) => {
  const body = await req.body;
  const parsed = createNotesSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
      data: null,
    });
  }

  const { content, bgColor } = parsed.data;
  const context = getContext(req);
  const user = context.user;

  try {
    const newNote = await db
      .insert(notes)
      .values({
        content,
        bgColor,
        createdByUUID: user!.id,
      })
      .returning();
    if (newNote.length === 0) {
      throw new Error("Failed to create note in database.");
    }
    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote[0],
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error?.message || "Something went wrong",
        data: null,
      });
    }
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;

  const parsed = uuidSchema.safeParse({ id: noteId });
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
      data: null,
    });
  }

  try {
    const context = getContext(req);
    const user = context.user;

    const deleted = await db
      .delete(notes)
      .where(and(eq(notes.uuid, noteId), eq(notes.createdByUUID, user!.id)))
      .returning({ id: notes.uuid });

    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found or not authorized",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Note deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const readNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;

  const parsed = uuidSchema.safeParse({ id: noteId });
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
      data: null,
    });
  }

  const context = getContext(req);
  const user = context.user;

  try {
    const note = await db
      .select()
      .from(notes)
      .where(and(eq(notes.uuid, noteId), eq(notes.createdByUUID, user!.id)))
      .limit(1);

    if (note.length === 0) {
      // Returns 404 for both 'not found' and 'permission denied' for security
      return res.status(404).json({
        success: false,
        message: "Note not found or permission denied",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Note retrieved successfully",
      data: note[0],
    });
  } catch (err) {
    console.error("Read error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;

  const parsed = uuidSchema.safeParse({ id: noteId });
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
      data: null,
    });
  }
  const body = await req.body;
  const bodyParsed = updateNotesSchema.safeParse(body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      success: false,
      message: bodyParsed.error.issues.map((issue) => issue.message).join(", "),
      data: null,
    });
  }

  const context = getContext(req);
  const user = context.user;

  const { content, bgColor } = bodyParsed.data;
  try {
    const updatedNotes = await db
      .update(notes)
      .set({
        content,
        bgColor,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.uuid, noteId), eq(notes.createdByUUID, user!.id)))
      .returning();
    if (updatedNotes.length === 0) {
      return res.status(403).json({
        data: null,
        message: "Note not found or permission denied.",
        success: false,
      });
    }

    return res.json({
      success: true,
      message: "Note updated successfully",
      data: updatedNotes[0],
    });
  } catch (err) {
    console.error("Read error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  const parsed = getAllNotesSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(", "),
      data: null,
    });
  }

  const { search, sort, page, limit } = parsed.data;

  const pageNumber = page;
  const pageSize = limit;
  const offset = (pageNumber - 1) * pageSize;
  const context = getContext(req);
  const user = context.user;

  try {
    const conditions = [eq(notes.createdByUUID, user!.id)];
    if (search) {
      conditions.push(ilike(notes.content, `%${search}%`));
    }

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(notes)
      .where(and(...conditions));

    const data = await db
      .select({
        id: notes.uuid,
        content: notes.content,
        bgColor: notes.bgColor,
        createdAt: notes.createdAt,
      })
      .from(notes)
      .where(and(...conditions))
      .orderBy(sort === "oldest" ? asc(notes.createdAt) : desc(notes.createdAt))
      .limit(pageSize)
      .offset(offset);

    return res.json({
      success: true,
      message: "Notes retrieved successfully",
      data,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error("Get all notes error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};
