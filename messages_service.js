import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

const handleGet = async (req, res) => {
    res.status(200).send("Not implemented yet!");
};

router.get("/messages-service", handleGet);

app.use(router);

app.listen(3002);
console.log("Server launched correctly!");
