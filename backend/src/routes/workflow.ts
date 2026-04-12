import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, objective, instructions } = req.body;
  const workflow = await prisma.workflow.create({
    data: {
      name,
      objective,
      instructions,
    },
  });
  res.json(workflow);

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