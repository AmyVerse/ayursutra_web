import "dotenv/config";

async function run() {
  const patientAyursutraId = "demo-pat-456"; // from test.ts
  const doctorAyursutraId = "demo-dr-123";   // from test.ts
  
  console.log("Sending POST /api/appointments to localhost:3000...");
  
  try {
    const res = await fetch("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.FLUTTER_API_KEY || "ayursutra_rollar"
      },
      body: JSON.stringify({
        patientAyursutraId,
        doctorAyursutraId,
        dateTime: new Date().toISOString(),
        notes: "Test appointment from local trigger script",
        treatmentType: "General Consultation",
        duration: 30,
        patientName: "Demo Patient"
      })
    });
    
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
