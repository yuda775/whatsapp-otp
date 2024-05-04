import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = whatsapp;

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.initialize();

export const app = express();
const port = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bank Sampah Whatsapp OTP API");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
