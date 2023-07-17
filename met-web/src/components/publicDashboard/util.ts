import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { Map } from 'maplibre-gl';
import { INITIAL_ZOOM, MAP_STYLE } from 'components/map';
import { Map as IMap } from 'models/analytics/map';

const toPng = async (element: HTMLElement): Promise<string> => {
    try {
        return await htmlToImage.toPng(element);
    } catch (error) {
        console.error('Error converting element to PNG:', error);
        return '';
    }
};

const addImageToPdf = (doc: jsPDF, imageData: string, x: number, y: number, width: number, height: number): void => {
    try {
        doc.addImage(imageData, 'PNG', x, y, width, height);
    } catch (error) {
        console.error('Error adding image to PDF:', error);
    }
};

export const getMapImageDataUrl = async (projectMapData: IMap | null): Promise<string> => {
    const mapContainer = document.getElementById('printableMapContainer');
    if (!mapContainer || !projectMapData) return '';

    // Create a maplibre-gl.Map instance
    const map = new Map({
        container: mapContainer,
        style: MAP_STYLE,
        center: [projectMapData.longitude, projectMapData.latitude],
        zoom: INITIAL_ZOOM,
    });

    // Wait for the map to load completely
    await new Promise((resolve) => {
        map.on('idle', resolve);
    });

    let imageDataUrl = '';

    try {
        imageDataUrl = map.getCanvas().toDataURL();
    } catch (error) {
        console.error('Error getting map image data URL:', error);
    }

    return imageDataUrl;
};

export const generateDashboardPdf = async (
    projectMapData: IMap | null,
    handlePdfExportProgress = (_value: number) => {
        /* unimplemented*/
    },
) => {
    const doc = new jsPDF('p', 'mm');

    const padding = 10;
    const marginTop = 20;
    let top = marginTop;

    const emailsSent = document.getElementById('kpi-emails-sent');
    if (emailsSent) {
        const emailsSentData = await toPng(emailsSent);
        addImageToPdf(doc, emailsSentData, padding + 15, top, 70, 70);
    }
    handlePdfExportProgress(20);

    const surveysCompleted = document.getElementById('kpi-surveys-completed');
    if (surveysCompleted) {
        const surveysCompletedData = await toPng(surveysCompleted);
        addImageToPdf(doc, surveysCompletedData, padding + 95, top, 70, 70);
    }
    handlePdfExportProgress(40);

    const mapImageDataURL = await getMapImageDataUrl(projectMapData);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Map\n\n', padding + 55, top + 80);
    addImageToPdf(doc, mapImageDataURL, padding + 55, top + 85, 75, 75);
    doc.addPage();
    handlePdfExportProgress(60);

    const submissiontrend = document.getElementById('submissiontrend');
    if (submissiontrend) {
        const submissiontrendData = await toPng(submissiontrend);
        addImageToPdf(doc, submissiontrendData, padding, 10, 190, 60);
        handlePdfExportProgress(80);
    }

    doc.addPage();

    const question_ids = document.querySelectorAll('[id*="question"]');
    const count_question_ids = question_ids.length;
    const remaining_percentage_unit = 20 / count_question_ids;
    const length = question_ids.length;
    for (let i = 0; i < length; i++) {
        const elements = document.getElementById(question_ids[i].id);
        if (elements) {
            const imgData = await toPng(elements);
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
            addImageToPdf(doc, imgData, padding, top, elWidth, elHeight);
            handlePdfExportProgress(80 + remaining_percentage_unit * i);
            top += elHeight + marginTop;
        }
    }
    window.open(doc.output('bloburl'));
};
