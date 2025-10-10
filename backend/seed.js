const fs = require("fs");
const path = require("path");
const pool = require("./db");

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

async function seed() {
  try {
    console.log("Seeding kids and attendance...");

    // Clear existing data
    await pool.query("DELETE FROM attendance");
    await pool.query("DELETE FROM kids");

    // Reset sequences
    await pool.query("ALTER SEQUENCE kids_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE attendance_id_seq RESTART WITH 1");

    // Seed kids table first
    console.log("Seeding kids table...");
    for (const kid of kids) {
      await pool.query(
        "INSERT INTO kids (id, name, photo) VALUES ($1, $2, $3)",
        [kid.id, kid.name, kid.photo || ""]
      );
    }
    console.log(`Added ${kids.length} kids to the database`);

    // Seed attendance table
    console.log("Seeding attendance table...");
    let attendanceCount = 0;

    for (const yearData of attendanceData) {
      const year = yearData.year;
      console.log(`Processing year ${year}...`);

      for (const termData of yearData.terms) {
        const term = termData.term;
        console.log(`Processing term ${term}...`);

        for (const weekData of termData.weeks) {
          const week = weekData.week;
          const date = new Date(weekData.date);

          for (const record of weekData.attendance) {
            const kid = kids.find((k) => k.id === record.kidId);
            if (!kid) {
              console.warn(`Kid with ID ${record.kidId} not found, skipping record`);
              continue;
            }

            await pool.query(
              `INSERT INTO attendance
                (kidid, name, week, present, reason, photo, term, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                record.kidId,
                kid.name,
                week,
                record.present,
                record.reason || "",
                kid.photo || "",
                term,
                date,
              ]
            );
            attendanceCount++;
          }
        }
      }
    }

    console.log(`Added ${attendanceCount} attendance records to the database`);
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run the seed function
seed();
