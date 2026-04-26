import * as Ably from "ably";
import "dotenv/config";

async function run() {
  const doctorId = "AS-D-DEMO";
  
  // Create a token request for the doctor
  const serverAbly = new Ably.Rest(process.env.ABLY_API_KEY as string);
  const tokenRequest = await serverAbly.auth.createTokenRequest({
    clientId: doctorId,
    capability: JSON.stringify({
      [`notifications:${doctorId}`]: ["subscribe"],
    }),
  });

  // Client connects using the token request
  const clientAbly = new Ably.Realtime({
    authCallback: (data, cb) => cb(null, tokenRequest)
  });

  const channel = clientAbly.channels.get(`notifications:${doctorId}`);
  
  channel.subscribe("new-notification", (msg) => {
    console.log("RECEIVED MESSAGE:", msg.data);
    clientAbly.close();
    process.exit(0);
  });

  clientAbly.connection.on("connected", async () => {
    console.log("Client connected. Publishing message from server...");
    
    // Server publishes
    const serverChannel = serverAbly.channels.get(`notifications:${doctorId}`);
    await serverChannel.publish("new-notification", { hello: "world" });
    console.log("Server published.");
  });

  setTimeout(() => {
    console.log("Timeout!");
    process.exit(1);
  }, 10000);
}
run().catch(console.error);
