import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAuditPDF(audit) {
  if (!audit) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const primaryColor = [0, 71, 255];
  const darkColor = [11, 23, 42];
  const grayColor = [100, 116, 139];

  // Header Background Banner
  doc.setFillColor(11, 23, 42);
  doc.rect(0, 0, 210, 42, "F");

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("accessiAnalyzer", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 230);
  doc.text("WCAG 2.2 AA & SEO Compliance Audit Report", 14, 26);

  // Date & URL info
  const scanDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.setFontSize(9);
  doc.text("Scanned Date: " + scanDate, 196, 18, { align: "right" });
  doc.text("Target: " + (audit.url || "N/A"), 196, 26, { align: "right" });

  // Score Executive Summary Box
  let startY = 50;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, startY, 182, 34, 4, 4, "FD");

  doc.setTextColor(11, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Audit Scores", 20, startY + 10);

  // Score 1: Accessibility
  doc.setFontSize(16);
  doc.setTextColor(0, 71, 255);
  doc.text(String(audit.wcag?.score || 80) + "/100", 30, startY + 22);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Accessibility Score", 30, startY + 28);

  // Score 2: SEO
  doc.setFontSize(16);
  doc.setTextColor(147, 51, 234);
  doc.text(String(audit.seo?.score || 80) + "/100", 95, startY + 22);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("SEO Score", 95, startY + 28);

  // Score 3: Overall
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text(String(audit.overall?.score || 80) + "/100", 160, startY + 22);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Overall Score", 160, startY + 28);

  // Summary Counts
  startY += 42;
  const criticalCount = (audit.wcag?.breakdown?.critical || 0) + (audit.seo?.breakdown?.critical || 0);
  const majorCount = (audit.wcag?.breakdown?.major || 0) + (audit.seo?.breakdown?.major || 0);
  const totalIssues = (audit.wcag?.issues?.length || 0) + (audit.seo?.issues?.length || 0);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(11, 23, 42);
  doc.text("Issue Summary (" + String(totalIssues) + " Detected)", 14, startY);

  const critStatus = criticalCount === 0 ? "PASSED" : "ACTION REQUIRED";
  const majStatus = majorCount === 0 ? "PASSED" : "NEEDS ATTENTION";

  autoTable(doc, {
    startY: startY + 4,
    head: [["Severity", "Description / Action", "Status"]],
    body: [
      ["Critical", String(criticalCount) + " Critical issues found", critStatus],
      ["Major", String(majorCount) + " Major issues found", majStatus]
    ],
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // Table of Detailed Issues
  let currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : startY + 30) + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(11, 23, 42);
  doc.text("Detailed Issue & Remediation Breakdown", 14, currentY);

  const allIssues = [
    ...(audit.wcag?.issues || []).map(i => ({ ...i, category: "Accessibility (WCAG 2.2)" })),
    ...(audit.seo?.issues || []).map(i => ({ ...i, category: "SEO Best Practice" }))
  ];

  const tableRows = allIssues.map(issue => [
    (issue.id || "ISSUE").replace(/-/g, " ").toUpperCase(),
    issue.category,
    issue.desc || "N/A",
    issue.snippet ? issue.snippet.slice(0, 80) + "..." : (issue.location || "N/A")
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [["Issue ID", "Category", "Description", "Location / Code Snippet"]],
    body: tableRows.length > 0 ? tableRows : [["None", "All checks passed", "No accessibility or SEO issues detected!", "-"]],
    headStyles: { fillColor: darkColor, textColor: 255, fontStyle: "bold" },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 },
      3: { cellWidth: 50 }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // AI Suggestions Section
  if (audit.suggestions && audit.suggestions.length > 0) {
    let suggY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 10;
    if (suggY > 250) {
      doc.addPage();
      suggY = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 23, 42);
    doc.text("AI Actionable Recommendations", 14, suggY);

    const suggRows = audit.suggestions.map(s => [
      s.title || "Recommendation",
      s.priority || "High",
      s.codeSnippet || s.description || "N/A"
    ]);

    autoTable(doc, {
      startY: suggY + 4,
      head: [["Title", "Priority", "Suggested Fix Snippet"]],
      body: suggRows,
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 }
    });
  }

  // Footer / Page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Page " + String(i) + " of " + String(pageCount) + " - Generated by AccessiAnalyzer", 105, 290, { align: "center" });
  }

  // Save PDF file
  const fileName = "AccessiAnalyzer-Audit-Report-" + String(Date.now()) + ".pdf";
  doc.save(fileName);
}
