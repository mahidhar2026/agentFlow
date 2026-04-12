import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/:token", async (req, res) =>{
    const { token } = req.params;
    const customerCase = await prisma.case.findUnique({
        where: { sessionToken: token},
        include: {
            workflow: true,
            messages: {
                orderBy: { createdAt: "asc"},
            },
        },
    });

    if (!customerCase){
        return res.status(404).json({ error: "Session not found" });

    }
    res.json(customerCase);
});

export default router;