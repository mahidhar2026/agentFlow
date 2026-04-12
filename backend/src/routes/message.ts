import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { analyzeCustomerMessage } from "../utils/aiEngine";
import { analyzeWithLLM } from "../utils/llmEngine";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { token, content } = req.body;

    const customerCase = await prisma.case.findUnique({
      where: { sessionToken: token },
      include: { workflow: true },
    });

    if (!customerCase) {
      return res.status(404).json({ error: "Session not found" });
    }

    
    await prisma.message.create({
      data: {
        role: "customer",
        content,
        caseId: customerCase.id,
      },
    });

    
    let aiResult = await analyzeWithLLM(
      content,
      customerCase.customerName
    );

    if (!aiResult || !aiResult.status || !aiResult.action) {
      console.log("Fallback to rule engine");

      aiResult = analyzeCustomerMessage(
        content,
        customerCase.customerName
      );
    }

    
    await prisma.case.update({
      where: { id: customerCase.id },
      data: {
        status: aiResult.status,
      },
    });

    
    await prisma.actionLog.create({
      data: {
        action: aiResult.action,
        reason: aiResult.reason,
        caseId: customerCase.id,
      },
    });

    
    if (aiResult.status === "ESCALATED") {
      const existingEscalation = await prisma.escalation.findUnique({
        where: { caseId: customerCase.id },
      });

      if (!existingEscalation) {
        await prisma.escalation.create({
          data: {
            reason: aiResult.reason,
            caseId: customerCase.id,
          },
        });
      }
    }

    
    await prisma.message.create({
      data: {
        role: "ai",
        content: aiResult.reply,
        caseId: customerCase.id,
      },
    });

    res.json({
      reply: aiResult.reply,
      status: aiResult.status,
      action: aiResult.action,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;