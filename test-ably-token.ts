import * as Ably from "ably";
import "dotenv/config";

async function run() {
  const ably = new Ably.Rest(process.env.ABLY_API_KEY as string);
  const token = await ably.auth.createTokenRequest({
    clientId: "AS-D-12345",
    capability: JSON.stringify({
      "notifications:AS-D-12345": ["subscribe"],
      "appointments:AS-D-12345": ["subscribe"],
    }),
  });
  console.log(token);
}
run().catch(console.error);
