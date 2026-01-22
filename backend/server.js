import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ตัวอย่าง route
app.get("/announcements", async (req, res) => {
  const data = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

app.post("/announcements", async (req, res) => {
  const { title, content } = req.body;
  const data = await prisma.announcement.create({
    data: { title, content },
  });
  res.json(data);
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
