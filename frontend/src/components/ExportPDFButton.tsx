'use client';

import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { RefObject } from 'react';

interface Props {
  chartRefs: RefObject<HTMLDivElement | null>[];
}

export const ExportPDFButton = ({ chartRefs }: Props) => {
  const exportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let positionY = 10;

    for (const ref of chartRefs) {
      if (ref.current) {
        try {
          const dataUrl = await domtoimage.toPng(ref.current);
          const img = new Image();
          img.src = dataUrl;

          await new Promise((resolve) => {
            img.onload = () => {
              const imgWidth = 180;
              const imgHeight = (img.height * imgWidth) / img.width;

              if (positionY + imgHeight > 280) {
                pdf.addPage();
                positionY = 10;
              }

              pdf.addImage(img, 'PNG', 15, positionY, imgWidth, imgHeight);
              positionY += imgHeight + 10;
              resolve(true);
            };
          });
        } catch (err) {
          console.error('Erro ao gerar imagem:', err);
        }
      }
    }

    pdf.save('insights.pdf');
  };

  return (
    <button
        onClick={exportPDF}
        className="mb-4 px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-gray-300 rounded-md shadow-sm transition"
    >
        PDFをダウンロード
    </button>
  );
};

