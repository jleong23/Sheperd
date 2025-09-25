const axios = require("axios");
const fs = require("fs");

const kids = JSON.parse(
  fs.readFileSync(
    "/Users/jleong_23/Documents/Folders/dreamers-attendance-app/frontend/src/data/kids.json",
    "utf8"
  )
);
const attendanceData = JSON.parse(
  fs.readFileSync(
    "/Users/jleong_23/Documents/Folders/dreamers-attendance-app/frontend/src/data/attendance.json",
    "utf8"
  )
);

async function sendAttendance() {
  try {
    for (const yearData of attendanceData) {
      for (const term of yearData.terms) {
        for (const weekData of term.weeks) {
          const week = weekData.week;
          for (const record of weekData.attendance) {
            const kid = kids.find((k) => k.id === record.kidId);
            if (!kid) continue;

            await axios.post("http://localhost:4000/attendance", {
              kidId: record.kidId,
              name: kid.name,
              week,
              present: record.present,
              reason: "",
              photo: kid.photo,
            });
            console.log(`Inserted ${kid.name} for week ${week}`);
          }
        }
      }
    }
    console.log("All attendance sent successfully!");
  } catch (err) {
    console.error("Error sending attendance:", err.message);
  }
}

sendAttendance();
