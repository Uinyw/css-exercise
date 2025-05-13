import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import EdgeML from "edge-ml";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const datasetCollector = EdgeML.datasetCollector;
let collector;

app.post("/start", async (req, res) => {
  const { context } = req.body;
  try {
    collector = await datasetCollector(
      "https://beta.edge-ml.org",
      "5fe6e50c3fb5001531bbd8e03a8c591f",
      "testingTim7",
      false,
      ["orienAlpha", "orienBeta", "orienGamma"],
      {},
      `Context_${context.label}`
    );
    console.log(
      `Successfully created new dataset for context '${context.label}'`
    );
    res.status(200).send();
  } catch (e) {
    console.log(
      `An error occurred when creating a new dataset for context '${context.label}'.`
    );
    res.status(500).send();
  }
});

app.post("/add", async (req, res) => {
  const { sample } = req.body;
  collector.addDataPoint(sample.timeStamp, "orienAlpha", sample.alpha);
  collector.addDataPoint(sample.timeStamp, "orienBeta", sample.beta);
  collector.addDataPoint(sample.timeStamp, "orienGamma", sample.gamma);
  console.log(`Successfully added datapoint ${JSON.stringify(sample)}`);
  res.status(200).send();
});

app.post("/complete", async (req, res) => {
  await collector.onComplete();
  console.log(
    "Successfully completed data collection for the current context."
  );
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Server started under http://localhost:${port}`);
});
