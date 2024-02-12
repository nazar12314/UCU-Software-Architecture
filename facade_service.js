import express from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const router = express.Router();

app.use(express.json());
app.use(bodyParser.text());
app.use(cors());

const handlePost = async (req, res) => {
    const message = req.body;
    const uuid = uuidv4();

    try {
        await axios.post("http://localhost:3001/logging-service", {
            uuid,
            message,
        });

        res.status(200).send();
    } catch (e) {
        console.log("Logging service is not working!");

        res.status(500).send();
    }
};

const handleGet = async (req, res) => {
    const loggingServiceResponse = await axios.get(
        "http://localhost:3001/logging-service"
    );
    const messagesServiceResponse = await axios.get(
        "http://localhost:3002/messages-service"
    );

    const data = {
        loggingService: loggingServiceResponse.data,
        messagesService: messagesServiceResponse.data,
    };

    console.log(data);

    res.status(200).json(data);
};

router.post("/facade-service", handlePost);
router.get("/facade-service", handleGet);

app.use(router);

app.listen(3000);
console.log("Server launched correctly!");
