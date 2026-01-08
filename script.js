// ---- SAME DATA AS px.data.tips() (partial) ----
const df = [
  {total_bill:16.99, day:"Sun", time:"Dinner", sex:"Female"},
  {total_bill:10.34, day:"Sun", time:"Dinner", sex:"Male"},
  {total_bill:21.01, day:"Sun", time:"Dinner", sex:"Male"},
  {total_bill:23.68, day:"Sun", time:"Dinner", sex:"Male"},
  {total_bill:24.59, day:"Sun", time:"Dinner", sex:"Female"},
  {total_bill:25.29, day:"Sun", time:"Dinner", sex:"Male"},
  {total_bill:8.77,  day:"Sun", time:"Dinner", sex:"Male"}
];

// ---- BUILD HIERARCHY (px.sunburst equivalent) ----
const map = {};
df.forEach(r => {
  const d = r.day;
  const t = `${r.day}/${r.time}`;
  const s = `${r.day}/${r.time}/${r.sex}`;

  map[d] = (map[d] || 0) + r.total_bill;
  map[t] = (map[t] || 0) + r.total_bill;
  map[s] = (map[s] || 0) + r.total_bill;
});

const labels = [];
const parents = [];
const values = [];

Object.keys(map).forEach(k => {
  const parts = k.split("/");
  labels.push(parts.at(-1));
  parents.push(parts.length === 1 ? "" : parts.slice(0,-1).join("/"));
  values.push(map[k]);
});

// ---- RENDER SUNBURST ----
Plotly.newPlot("sunburst", [{
  type: "sunburst",
  labels,
  parents,
  values,
  branchvalues: "total"
}]);

// ---- TABLE ----
function renderTable(data) {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");
  thead.innerHTML = tbody.innerHTML = "";

  if (!data.length) return;

  Object.keys(data[0]).forEach(k => {
    const th = document.createElement("th");
    th.innerText = k;
    thead.appendChild(th);
  });

  data.forEach(r => {
    const tr = document.createElement("tr");
    Object.values(r).forEach(v => {
      const td = document.createElement("td");
      td.innerText = v;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

renderTable(df);

// ---- CLICK CALLBACK (Dash → JS) ----
document.getElementById("sunburst")
.on("plotly_click", e => {

  let data = df;
  let clickPath = "ALL";

  if (e.points.length) {
    const id = e.points[0].id.split("/");

    if (id.length === 3)
      data = df.filter(r => r.day===id[0] && r.time===id[1] && r.sex===id[2]);
    else if (id.length === 2)
      data = df.filter(r => r.day===id[0] && r.time===id[1]);
    else
      data = df.filter(r => r.day===id[0]);

    clickPath = id.join(" ");
  }

  document.getElementById("title").innerText =
    `Selected from Sunburst Chart: ${clickPath}`;

  renderTable(data);
});
