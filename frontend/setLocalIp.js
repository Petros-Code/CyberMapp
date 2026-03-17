import { writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";

// Get network ip address
function getLocalIP() {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const localIP = getLocalIP();
writeFileSync(".env.local", `EXPO_PUBLIC_API_URL=http://${localIP}:3000\n`);
