import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req,res) => {
    const escalatedCases = await prisma.case.findMany({
        where: {
            status: "ESCALATED",
        },
        include: {
            escalation: true,
            workflow: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.json(escalatedCases);
});

export default router;