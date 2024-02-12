import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();

const hashMap = {};

app.use(express.json());
app.use(cors());

const handleGet = async (req, res) => {
    let values = Object.values(hashMap);
    let result = values.join(";");

    res.status(200).send(result);
};

const handlePost = async (req, res) => {
    const { uuid, message } = req.body;

    hashMap[uuid] = message;

    console.log(`Received and logged: ${message}`);

    res.status(200).send();
};

router.post("/logging-service", handlePost);
router.get("/logging-service", handleGet);

app.use(router);

app.listen(3001);
console.log("Server launched correctly!");
