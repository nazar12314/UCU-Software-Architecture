import express from "express";
import cors from "cors";
import { Client } from "hazelcast-client";

const port = parseInt(`300` + process.argv[3])
const nodePort = `570` + process.argv[3]

const hazelcastConfig = {
    clusterName: "dev",
    network: {
        clusterMembers: [
            "127.0.0.1:" + nodePort
        ]
    }
};

const app = express();
const router = express.Router();

const hazelcastClient = await Client.newHazelcastClient(hazelcastConfig);
const distMap = await hazelcastClient.getMap("loggingServiceMap");

app.use(express.json());
app.use(cors());

const handleGet = async (req, res) => {
    let values = await distMap.entrySet();

    values = values.map(item => item[1]);

    let result = values.join(", ");

    res.status(200).send(result);
};

const handlePost = async (req, res) => {
    const { uuid, message } = req.body;

    await distMap.put(uuid, message);

    console.log(`Received and logged: ${message}`);

    res.status(200).send();
};

router.post("/logging-service", handlePost);
router.get("/logging-service", handleGet);

app.use(router);

app.listen(port);
console.log("Server launched correctly!");
