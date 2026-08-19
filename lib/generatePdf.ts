import jsPDF from 'jspdf';
import { PredictionResponse } from '@/types/api';

export function generateResultPdf(result: PredictionResponse, imageUrl: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 60;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('NeuroSight — Detection Report', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  y += 18;
  doc.text(new Date().toLocaleString(), margin, y);
  doc.setTextColor(0);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Detected Condition', margin, y);
  y += 22;
  doc.setFontSize(24);
  doc.text(result.tumor_type, margin, y);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, margin, y);
  y += 30;

  try {
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = imgWidth * 0.75;
    doc.addImage(imageUrl, 'JPEG', margin, y, imgWidth, imgHeight);
    y += imgHeight + 30;
  } catch {
    // unsupported image format — skip embedding
  }

  if (y > 650) {
    doc.addPage();
    y = 60;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Detections', margin, y);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  if (result.boxes?.length) {
    result.boxes.forEach((box, i) => {
      if (y > 760) {
        doc.addPage();
        y = 60;
      }
      doc.text(
        `${i + 1}. ${box.label} — ${(box.score * 100).toFixed(1)}%  [(${Math.round(box.x1)}, ${Math.round(
          box.y1
        )}) - (${Math.round(box.x2)}, ${Math.round(box.y2)})]`,
        margin,
        y
      );
      y += 18;
    });
  } else {
    doc.text('No regions detected.', margin, y);
    y += 18;
  }

  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Analysis Info', margin, y);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Processing time: ${result.inference_time?.toFixed(2) ?? 'N/A'}s`, margin, y);
  y += 16;
  doc.text(
    `Image resolution: ${result.image_shape ? `${result.image_shape[1]}×${result.image_shape[0]}` : 'N/A'}`,
    margin,
    y
  );
  y += 34;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(140);
  const disclaimer =
    'This AI-powered analysis is for research and educational purposes only. It is not a substitute for professional medical diagnosis. Always consult a qualified healthcare professional.';
  doc.text(doc.splitTextToSize(disclaimer, pageWidth - margin * 2), margin, y);

  doc.save(`neurosight-report-${Date.now()}.pdf`);
}