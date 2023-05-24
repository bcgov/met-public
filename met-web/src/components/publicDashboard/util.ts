import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

export const generateDashboardPdf = (successCallback: () => void) => {
    return async () => {
        const doc = new jsPDF('p', 'mm');

        const padding = 10;
        const marginTop = 20;
        let top = marginTop;

        const kpi = document.getElementById('kpi');
        if (kpi) {
            const kpiData = await htmlToImage.toPng(kpi);
            doc.addImage(kpiData, 'PNG', padding, top, 190, 55, 'kpi');
        }

        const submissiontrend = document.getElementById('submissiontrend');
        if (submissiontrend) {
            const submissiontrendData = await htmlToImage.toPng(submissiontrend);
            doc.addImage(submissiontrendData, 'PNG', padding, top + 75, 190, 60, 'submissiontrend');
        }

        doc.addPage();

        const question_ids = document.querySelectorAll('[id*="question"]');
        const length = question_ids.length;
        for (let i = 0; i < length; i++) {
            const elements = document.getElementById(question_ids[i].id);
            if (elements) {
                const imgData = await htmlToImage.toPng(elements);
                let elHeight = elements.offsetHeight + 20;
                let elWidth = elements.offsetWidth + 20;
                const pageWidth = doc.internal.pageSize.getWidth();

                if (elWidth > pageWidth) {
                    const ratio = pageWidth / elWidth;
                    elHeight = elHeight * ratio - padding * 2;
                    elWidth = elWidth * ratio - padding * 2;
                }

                const pageHeight = 290;

                if (top + elHeight > pageHeight) {
                    doc.addPage();
                    top = marginTop;
                }
                doc.addImage(imgData, 'PNG', padding, top, elWidth, elHeight, `image${i}`);
                top += elHeight + marginTop;
            }
        }
        window.open(doc.output('bloburl'));
    };
};
