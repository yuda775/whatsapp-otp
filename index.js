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

const app = express();
const port = 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bank Sampah Whatsapp OTP API");
});

app.post("/send-whatsapp-message", async (req, res) => {
  try {
    let { phoneNumber, otpMessage } = req.body;

    if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.replace("0", "62");
    } else {
      return res.json({
        status: false,
        message: "Phone number is not valid",
      });
    }

    const isRegisteredUser = await client.isRegisteredUser(phoneNumber);

    if (!isRegisteredUser) {
      return res.json({
        status: false,
        message: "Phone number is not registered",
      });
    }
    await client.sendMessage(phoneNumber + "@c.us", otpMessage);
    res.json({
      status: true,
      phoneNumber: phoneNumber,
      otpMessage: otpMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Failed to send message",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
