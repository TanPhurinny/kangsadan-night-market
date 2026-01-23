// import express from "express";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();

// // GET all announcements
// router.get("/", async (req, res) => {
//   try {
//     const data = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET single announcement
// router.get("/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const announcement = await prisma.announcement.findUnique({ where: { id } });
//     res.json(announcement);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // CREATE announcement
// router.post("/", async (req, res) => {
//   try {
//     const { title, content, status } = req.body;
//     const newAnnouncement = await prisma.announcement.create({ data: { title, content, status } });
//     res.json(newAnnouncement);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE announcement
// router.put("/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const { title, content, status } = req.body;
//     const updated = await prisma.announcement.update({
//       where: { id },
//       data: { title, content, status },
//     });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE announcement
// router.delete("/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     await prisma.announcement.delete({ where: { id } });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express"
import { PrismaClient } from "@prisma/client"
import multer from "multer"
import path from "path"

const router = express.Router()
const prisma = new PrismaClient()

/* ===============================
   multer config (เพิ่ม)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/announcements")
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  }
})

const upload = multer({ storage })

/* ===============================
   GET all announcements (เดิม)
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" }
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ===============================
   GET single announcement (เดิม)
================================ */
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    })
    res.json(announcement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ===============================
   CREATE announcement (แก้)
   รองรับอัปโหลดรูป
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, status } = req.body

    const imageUrl = req.file
      ? `/uploads/announcements/${req.file.filename}`
      : null

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        status,
        imageUrl
      }
    })

    res.json(newAnnouncement)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
/* ===============================
   UPDATE announcement (แก้ + รองรับรูป)
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { title, content, status } = req.body

    const data = {
      title,
      content,
      status
    }

    // ถ้ามีอัปโหลดรูปใหม่
    if (req.file) {
      data.imageUrl = `/uploads/announcements/${req.file.filename}`
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


/* ===============================
   DELETE announcement (เดิม)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.announcement.delete({ where: { id } })
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
