import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

function generateToken() {
    return crypto.randomBytes(16).toString("hex");
}
router.post("/",async (req, res) => {
    const{ customerName, email, amountDue, workflowId} = req.body;
    const token = generateToken();
    const newCase = await prisma.case.create({
        data: {
            customerName,
            email,
            amountDue,
            workflowId,
            sessionToken: token,
        },
    });



    await prisma.message.create({
        data:{
            role: "ai",
            content: `Hi ${customerName},this is a reminder regarding your overdue payment of ${amountDue}. Would you like to pay now, schedule a reminder, or get support?`,
            caseId: newCase.id,
        },
    });

    res.json({
        case: newCase,
        sessionLink: `http://localhost:3000/session/${token}`,

    });
});

router.get("/", async(req, res) =>{
    const cases = await prisma.case.findMany({
        include: {
            workflow: true,
            messages: {
                where: {role:"customer"},
                orderBy: { createdAt: "desc"},
                take: 1,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.json(cases);
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const customerCase = await prisma.case.findUnique({
    where: { id: Number(id) },
    include: {
        workflow: true,
        messages: {
            orderBy: {createdAt: "asc" },

        },
        actionLogs: {
            orderBy : { createdAt: "desc" },

        },
        escalation: true,

    },
  });
  if (!customerCase) {
    return res.status(404).json({ error: "Case not found" });
  }

  res.json(customerCase);
});

export default router;