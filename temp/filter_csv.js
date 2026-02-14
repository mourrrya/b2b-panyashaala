const fs = require("fs");
const Papa = require("papaparse");

const inputFile = "c:\\\\Users\\\\virus\\\\Downloads\\\\Invoice.csv";
const outputFile = "filtered_invoice.csv";

const data = fs.readFileSync(inputFile, "utf8");

Papa.parse(data, {
  header: true,
  complete: (results) => {
    const filteredData = results.data.map((row) => ({
      Date: row["Invoice Date"],
      "Invoice No": row["Invoice Number"],
      "Customer GSTIN number": row["GST Identification Number (GSTIN)"],
      "Place of Supply": row["Place of Supply"],
      "Name of Customer": row["Customer Name"],
      "HSN/SAC Code": row["HSN/SAC"],
      "Invoice Base Amount (Rs.)": row["Item Total"], // Assuming Item Total is the base amount per item
      "Rate of tax (%)": row["Item Tax1 %"],
      "SGST (Rs.)": row["SGST"],
      "CGST (Rs.)": row["CGST"],
      "IGST (Rs.)": row["IGST"],
      "Exempted/Nill rated sales (Rs.)": "0.00", // Assuming 0 since not specified
      "Invoice Total (Rs.)": row["Total"],
    }));

    const csv = Papa.unparse(filteredData);
    fs.writeFileSync(outputFile, csv);
    console.log("Filtered CSV created:", outputFile);
  },
});
