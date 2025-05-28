import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportDashboardPDFfromPanel(panelRef) {
  if (!panelRef.current) return;
  await new Promise(res => setTimeout(res, 1000));

  // Usa scale: 1 para evitar canvas gigante
  const canvas = await html2canvas(panelRef.current, { scale: 1, backgroundColor: "#fff" });
  const imgData = canvas.toDataURL("image/png");
  console.log('Canvas size:', canvas.width, canvas.height);

  // Define tamaño A4 en px (jsPDF por defecto usa px como userUnit)
  const pdfWidth = 595;  // A4 width in px
  const pdfHeight = 842; // A4 height in px
  let imgWidth = pdfWidth;
  let imgHeight = (canvas.height * pdfWidth) / canvas.width;

  if (imgHeight > pdfHeight) {
    imgHeight = pdfHeight;
    imgWidth = (canvas.width * pdfHeight) / canvas.height;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [pdfWidth, pdfHeight]
  });
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("dashboard-panel.pdf");
}