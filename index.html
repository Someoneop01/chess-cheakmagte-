
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
    if (output) output.textContent = val(inputId, fallback);
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

    const value = Object.prototype.hasOwnProperty.call(player, inputId)
      ? player[inputId]
      : val(inputId, fallback);

    output.textContent = value || fallback;
  });

  updateWording(page);
  return page;
}

function safeName(name) {
  return String(name || "Player")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 70);
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

    const cells = hasHeader
      ? expected.map(key => {
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

function getPreparedPlayers() {
  const players = parsePlayers(get("bulkPlayers").value);
  const start = Math.max(1, parseInt(val("serial", "1"), 10) || 1);

  return players.map((player, index) => ({
    ...player,
    serial: player.serial || String(start + index).padStart(3, "0"),
    rounds: player.rounds || val("rounds", "9")
  }));
}

function makePdfDocument() {
  if (!window.jspdf?.jsPDF) {
    throw new Error("PDF library did not load. Check your internet connection and refresh.");
  }

  return new window.jspdf.jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true
  });
}

async function waitForImages(element) {
  if (document.fonts?.ready) await document.fonts.ready;

  const images = [...element.querySelectorAll("img")];
  await Promise.all(images.map(async img => {
    if (!img.complete) {
      await new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }
    if (img.decode) {
      try { await img.decode(); } catch (_) {}
    }
  }));
}

async function certificateToPdfBlob(player) {
  if (!window.html2canvas) {
    throw new Error("PDF image library did not load. Check your internet connection.");
  }

  const stage = document.createElement("div");
  stage.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:1123px",
    "height:794px",
    "z-index:-9999",
    "overflow:hidden",
    "background:#ffffff"
  ].join(";");

  const certificate = makeCertificate(player);
  certificate.style.margin = "0";
  certificate.style.width = "1123px";
  certificate.style.height = "794px";
  certificate.style.boxShadow = "none";

  stage.appendChild(certificate);
  document.body.appendChild(stage);

  try {
    await waitForImages(certificate);

    const canvas = await html2canvas(certificate, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width: 1123,
      height: 794
    });

    const image = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = makePdfDocument();

    pdf.addImage(image, "JPEG", 0, 0, 297, 210, undefined, "FAST");

    return pdf.output("blob");
  } finally {
    stage.remove();
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

get("updateBtn")?.addEventListener("click", () => {
  updateCertificate();
  get("status").textContent = "Preview updated.";
});

get("generateBtn")?.addEventListener("click", () => {
  updateCertificate();

  const players = getPreparedPlayers();
  const pages = get("printPages");
  pages.replaceChildren();

  if (!players.length) {
    get("status").textContent = "Enter at least one player in Bulk Players.";
    return;
  }

  players.forEach(player => pages.appendChild(makeCertificate(player)));
  get("status").textContent = `${players.length} certificates generated.`;
});

get("downloadOneBtn")?.addEventListener("click", async () => {
  try {
    updateCertificate();
    get("status").textContent = "Creating PDF...";

    const player = {
      player: val("player", "PLAYER"),
      serial: val("serial", "001")
    };

    const blob = await certificateToPdfBlob(player);
    downloadBlob(blob, `${safeName(player.player)}_Certificate.pdf`);

    get("status").textContent = "Certificate PDF downloaded.";
  } catch (error) {
    console.error(error);
    get("status").textContent = error.message || "PDF download failed.";
  }
});

get("downloadZipBtn")?.addEventListener("click", async () => {
  const players = getPreparedPlayers();

  if (!players.length) {
    get("status").textContent = "Import or enter players first.";
    return;
  }

  if (!window.JSZip) {
    get("status").textContent = "ZIP library did not load. Check your internet connection.";
    return;
  }

  const button = get("downloadZipBtn");
  button.disabled = true;

  try {
    const zip = new JSZip();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      get("status").textContent =
        `Creating PDF ${i + 1} of ${players.length}: ${player.player}`;

      const blob = await certificateToPdfBlob(player);
      const filename =
        `${String(i + 1).padStart(3, "0")}_${safeName(player.player)}_Certificate.pdf`;

      zip.file(filename, blob);
    }

    get("status").textContent = "Preparing ZIP file...";

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 3 }
    });

    downloadBlob(zipBlob, "Checkmate_Championship_Certificates.zip");
    get("status").textContent = `${players.length} PDFs downloaded in one ZIP.`;
  } catch (error) {
    console.error(error);
    get("status").textContent = error.message || "ZIP creation failed.";
  } finally {
    button.disabled = false;
  }
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
  [
    "player", "fideId", "eventCode", "state", "points",
    "rank", "dates", "venue", "bulkPlayers"
  ].forEach(id => {
    if (get(id)) get(id).value = "";
  });

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
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    "chess-players-template.csv"
  );
});

get("playerFile")?.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("Please upload CSV. Save your Excel file as CSV first.");
    }

    importCSV(await file.text());
  } catch (error) {
    get("importStatus").textContent = error.message || "Could not import file.";
  }
});

updateCertificate();
