const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Breakfast", "Lunch", "Dinner"];
const SEXES = ["Male", "Female"];

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


function generateSunburstData() {
  const rows = [];

  DAYS.forEach(day => {
    TIMES.forEach(time => {
      SEXES.forEach(sex => {
        rows.push({
          day,
          time,
          sex,
          value: random(20, 200)
        });
      });
    });
  });

  return rows;
}

/* ================= API ================= */
app.get("/api/sunburst", (req, res) => {
  let data = generateSunburstData();

  const { day, time, sex } = req.query;

  if (day) data = data.filter(d => d.day === day);
  if (time) data = data.filter(d => d.time === time);
  if (sex) data = data.filter(d => d.sex === sex);

  res.json(data);
});

app.listen(3000, () =>
  console.log("API running → http://localhost:3000/api/sunburst")
);
