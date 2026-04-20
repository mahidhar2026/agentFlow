import express from "express";
import cors from "cors";
import workflowRoutes from "./routes/workflow";
import caseRoutes from "./routes/case";
import sessionRoutes from "./routes/session";
import messsageRoutes from "./routes/message";
import escalationRoutes from "./routes/escalation";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/workflow", workflowRoutes);
app.use("/case", caseRoutes);
app.use("/session", sessionRoutes);
app.use("/message", messsageRoutes);
app.use("/escalation", escalationRoutes);

app.get("/", (req, res) => {
    res.send("AgentFlow API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});