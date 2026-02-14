const fs = require("fs");

const inputFile = "filtered_invoice.csv";
const outputFile = "clubbed_invoice.csv";

const data = fs.readFileSync(inputFile, "utf8");
const lines = data.trim().split("\n");
const headers = lines[0].split(",").map((h) => h.trim());

const grouped = {};

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(",");
  if (values.length < headers.length) continue;
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = (values[idx] || "").trim();
  });
  const hsn = row["HSN/SAC Code"];
  if (!hsn) continue;
  const key = `${row["Invoice No"]}-${hsn}`;
  if (!grouped[key]) {
    grouped[key] = {
      Date: row["Date"],
      "Invoice No": row["Invoice No"],
      "Customer GSTIN number": row["Customer GSTIN number"],
      "Place of Supply": row["Place of Supply"],
      "Name of Customer": row["Name of Customer"],
      "HSN/SAC Code": hsn,
      "Invoice Base Amount (Rs.)": 0,
      "Rate of tax (%)": row["Rate of tax (%)"],
      "SGST (Rs.)": 0,
      "CGST (Rs.)": 0,
      "IGST (Rs.)": 0,
      "Exempted/Nill rated sales (Rs.)": 0,
      "Invoice Total (Rs.)": 0,
    };
  }
  grouped[key]["Invoice Base Amount (Rs.)"] += Number(row["Invoice Base Amount (Rs.)"] || 0);
  grouped[key]["SGST (Rs.)"] += Number(row["SGST (Rs.)"] || 0);
  grouped[key]["CGST (Rs.)"] += Number(row["CGST (Rs.)"] || 0);
  grouped[key]["IGST (Rs.)"] += Number(row["IGST (Rs.)"] || 0);
  grouped[key]["Exempted/Nill rated sales (Rs.)"] += Number(
    row["Exempted/Nill rated sales (Rs.)"] || 0,
  );
  grouped[key]["Invoice Total (Rs.)"] +=
    Number(row["Invoice Base Amount (Rs.)"] || 0) +
    Number(row["SGST (Rs.)"] || 0) +
    Number(row["CGST (Rs.)"] || 0) +
    Number(row["IGST (Rs.)"] || 0) +
    Number(row["Exempted/Nill rated sales (Rs.)"] || 0);
}

const clubbedData = Object.values(grouped).map((item) => ({
  ...item,
  "Invoice Base Amount (Rs.)": item["Invoice Base Amount (Rs.)"].toFixed(2),
  "SGST (Rs.)": item["SGST (Rs.)"].toFixed(2),
  "CGST (Rs.)": item["CGST (Rs.)"].toFixed(2),
  "IGST (Rs.)": item["IGST (Rs.)"].toFixed(2),
  "Exempted/Nill rated sales (Rs.)": item["Exempted/Nill rated sales (Rs.)"].toFixed(2),
  "Invoice Total (Rs.)": item["Invoice Total (Rs.)"].toFixed(2),
}));

const csv = [headers.join(","), ...clubbedData.map((r) => headers.map((h) => r[h]).join(","))].join(
  "\n",
);
fs.writeFileSync(outputFile, csv);
console.log("Clubbed CSV created:", outputFile);
