const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: "jleong_23",
  host: "localhost",
  database: "attendance",
  password: "@0128193303Postgres",
  port: 5432,
});

// Load JSON files
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

async function seed() {
  try {
    console.log("Seeding kids and attendance...");

    // Optional: clear existing data
    await pool.query("DELETE FROM attendance");

    // Loop over attendanceData
    for (const yearData of attendanceData) {
      const year = yearData.year;

      for (const termData of yearData.terms) {
        const term = termData.term;

        for (const weekData of termData.weeks) {
          const week = weekData.week;
          const date = new Date(weekData.date);

          for (const record of weekData.attendance) {
            const kid = kids.find((k) => k.id === record.kidId);
            if (!kid) continue;

            await pool.query(
              `INSERT INTO attendance
                (kidid, name, week, present, reason, photo, term, created_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
              [
                record.kidId,
                kid.name,
                week,
                record.present,
                "",
                kid.photo,
                term,
                date,
              ]
            );
          }
        }
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
