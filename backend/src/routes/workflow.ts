import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const {name, objective, instructions } = req.body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        objective,
        instructions,
      },
    });

    console.log("Created workflow:", workflow);

    res.json(workflow);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ error: "Failed to create workflow"});
  }
});

router.get("/", async (req, res) => {
  const workflows = await prisma.workflow.findMany({
    orderBy: {
      createdAt: "desc",

    },
  });
  res.json(workflows);
})

export default router;