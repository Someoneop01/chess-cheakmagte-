
const fields = [
  ["player", "outPlayer", "PLAYER NAME"],
  ["fideId", "outFideId", "—"],
  ["eventCode", "outEventCode", "—"],
  ["serial", "outSerial", "001"],
  ["state", "outState", "—"],
  ["points", "outPoints", "—"],
  ["rounds", "outRounds", "9"],
  ["rank", "outRank", "—"],
  ["dates", "outDates", "________________"],
  ["venue", "outVenue", "________________"]
];

const get = id => document.getElementById(id);

function val(id, fallback = "—") {
  return get(id)?.value.trim() || fallback;
}

function updateWording(root = document) {
  const text = (id, value) => {
    const el = root.querySelector("#" + id);
    if (el) el.textContent = value;
  };

  text("outNameInText", root.querySelector("#outPlayer")?.textContent || "PLAYER NAME");
  text("outStateInText", root.querySelector("#outState")?.textContent || "STATE / CITY");
  text("outPointsInText", root.querySelector("#outPoints")?.textContent || "—");
  text("outRoundsInText", root.querySelector("#outRounds")?.textContent || "9");
  text("outRankInText", root.querySelector("#outRank")?.textContent || "—");
}

function updateCertificate(root = document) {
  fields.forEach(([inputId, outputId, fallback]) => {
    const output = root.querySelector("#" + outputId);
    if (!output) return;
    const input = get(inputId);
    output.textContent = input?.value.trim() || fallback;
  });
  updateWording(root);
}

function parsePlayers(text) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const p = line.split("|").map(v => v.trim());
    return {
      player: p[0] || "",
      fideId: p[1] || "",
      eventCode: p[2] || "",
      serial: p[3] || "",
      state: p[4] || "",
      points: p[5] || "",
      rounds: p[6] || val("rounds", "9"),
      rank: p[7] || ""
    };
  }).filter(p => p.player);
}

function makeCertificate(player = {}) {
  const page = get("certificate").cloneNode(true);
  page.removeAttribute("id");

  fields.forEach(([inputId, outputId, fallback]) => {
    const output = page.querySelector("#" + outputId);
    if (!output) return;

    const input = get(inputId);
    const value = Object.prototype.hasOwnProperty.call(player, inputId)
      ? player[inputId]
      : input?.value.trim();

    output.textContent = value || fallback;
  });

  updateWording(page);
  return page;
}

function csvParse(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"' && quoted && text[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function importCSV(text) {
  const rows = csvParse(text);
  if (!rows.length) throw new Error("CSV file is empty.");

  const header = rows[0].map(x => x.toLowerCase());
  const expected = ["name", "fide id", "event code", "serial", "state/city", "points", "rounds", "rank"];
  const hasHeader = header.some(x => ["name", "player", "player name"].includes(x));

  const data = hasHeader ? rows.slice(1) : rows;
  const lines = data.map(row => {
    const cells = hasHeader
      ? expected.map((key, i) => {
          const aliases = {
            name: ["name", "player", "player name"],
            "fide id": ["fide id", "fideid"],
            "event code": ["event code", "eventcode"],
            serial: ["serial", "serial number"],
            "state/city": ["state/city", "state", "city"],
            points: ["points", "points scored"],
            rounds: ["rounds", "total rounds"],
            rank: ["rank", "final rank"]
          };
          const idx = header.findIndex(h => aliases[key].includes(h));
          return idx >= 0 ? (row[idx] || "") : "";
        })
      : row.slice(0, 8);

    while (cells.length < 8) cells.push("");
    return cells.join(" | ");
  }).filter(line => line.split("|")[0].trim());

  if (!lines.length) throw new Error("No player names found in CSV.");
  get("bulkPlayers").value = lines.join("\n");
  get("importStatus").textContent = `${lines.length} players imported.`;
  get("validationReport").textContent = "Check the imported rows, then click Generate All Certificates.";
}

get("updateBtn")?.addEventListener("click", () => {
  updateCertificate();
  get("status").textContent = "Preview updated.";
});

get("generateBtn")?.addEventListener("click", () => {
  updateCertificate();
  const players = parsePlayers(get("bulkPlayers").value);
  const pages = get("printPages");
  pages.replaceChildren();

  if (!players.length) {
    get("status").textContent = "Enter at least one player in Bulk Players.";
    return;
  }

  const start = Math.max(1, parseInt(val("serial", "1"), 10) || 1);

  players.forEach((player, index) => {
    if (!player.serial) player.serial = String(start + index).padStart(3, "0");
    if (!player.rounds) player.rounds = val("rounds", "9");
    pages.appendChild(makeCertificate(player));
  });

  get("status").textContent = `${players.length} certificates generated. Click Print / Save PDF.`;
});

get("printBtn")?.addEventListener("click", () => {
  const pages = get("printPages");
  if (!pages.children.length) {
    updateCertificate();
    pages.replaceChildren(makeCertificate());
  }
  window.print();
});

get("resetBtn")?.addEventListener("click", () => {
  ["player", "fideId", "eventCode", "state", "points", "rank", "dates", "venue", "bulkPlayers"]
    .forEach(id => { if (get(id)) get(id).value = ""; });

  get("serial").value = "001";
  get("rounds").value = "9";
  get("printPages").replaceChildren();
  updateCertificate();
  get("status").textContent = "Details reset.";
  get("importStatus").textContent = "";
  get("validationReport").textContent = "";
});

get("downloadTemplateBtn")?.addEventListener("click", () => {
  const csv = "Name,FIDE ID,Event Code,Serial,State/City,Points,Rounds,Rank\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chess-players-template.csv";
  a.click();
  URL.revokeObjectURL(url);
});

get("playerFile")?.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("Please upload a CSV file. Excel files must first be saved as CSV.");
    }
    importCSV(await file.text());
  } catch (error) {
    get("importStatus").textContent = error.message || "Could not import this file.";
  }
});

updateCertificate();
