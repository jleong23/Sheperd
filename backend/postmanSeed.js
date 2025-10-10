/**
- Used to **test API endpoints** and seed data **through your backend routes**.
- Simulates how a frontend app would create records via API.
- Ensures that the **routes, controllers, and middleware** are working correctly.
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load JSON files using relative paths
const kids = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../frontend/src/data/kids.json"),
    "utf8"
  )
);

const attendanceData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../frontend/src/data/attendance.json"),
    "utf8"
  )
);

const API_URL = process.env.API_URL || "http://localhost:4000";

async function seedKids() {
  console.log("Seeding kids via API...");
  let count = 0;

  try {
    for (const kid of kids) {
      await axios.post(`${API_URL}/kids`, {
        name: kid.name,
        photo: kid.photo || "",
      });
      count++;
      console.log(`Created kid: ${kid.name}`);
    }
    console.log(`Added ${count} kids via API`);
  } catch (err) {
    console.error("Error seeding kids:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

async function seedAttendance() {
  console.log("Seeding attendance via API...");
  let count = 0;

  try {
    for (const yearData of attendanceData) {
      const year = yearData.year;
      console.log(`Processing year ${year}...`);

      for (const termData of yearData.terms) {
        const term = termData.term;
        console.log(`Processing term ${term}...`);

        for (const weekData of termData.weeks) {
          const week = weekData.week;

          for (const record of weekData.attendance) {
            const kid = kids.find((k) => k.id === record.kidId);
            if (!kid) {
              console.warn(
                `Kid with ID ${record.kidId} not found, skipping record`
              );
              continue;
            }

            await axios.post(`${API_URL}/attendance`, {
              kidId: record.kidId,
              name: kid.name,
              week,
              term,
              present: record.present,
              reason: record.reason || "",
              photo: kid.photo || "",
            });

            count++;
            console.log(
              `Inserted attendance for ${kid.name} for week ${week}, term ${term}`
            );
          }
        }
      }
    }
    console.log(`Added ${count} attendance records via API`);
    console.log("All data sent successfully!");
  } catch (err) {
    console.error("Error sending attendance:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

async function seedAll() {
  try {
    await seedKids();
    await seedAttendance();
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seedAll();
