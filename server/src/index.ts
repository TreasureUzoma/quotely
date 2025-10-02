import express, { Request, Response } from "express";
import "dotenv/config";
import { authMiddleware, getContext } from "./middleware/session";
import {
  googleCallback,
  googleSignIn,
  refreshAccessToken,
} from "./handlers/auth";
import {
  createNote,
  deleteNote,
  getAllNotes,
  readNote,
  updateNote,
} from "./handlers/notes";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Quotely Express TypeScript server is healthy");
});

const apiRouter = express.Router();

apiRouter.get("/session", authMiddleware, (req: Request, res: Response) => {
  const context = getContext(req);
  const user = context.user;

  res.json({
    data: user,
    success: true,
    message: "User session active",
  });
});

apiRouter.get("/auth/google", googleSignIn);
apiRouter.get("/auth/google/callback", googleCallback);
apiRouter.get("/refresh-access-token", refreshAccessToken);

apiRouter.get("/notes", authMiddleware, getAllNotes);
apiRouter.get("/notes/:id", authMiddleware, readNote);
apiRouter.delete("/notes/:id", authMiddleware, deleteNote);
apiRouter.put("/notes/:id", authMiddleware, updateNote);
apiRouter.post("/notes", authMiddleware, createNote);

app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
