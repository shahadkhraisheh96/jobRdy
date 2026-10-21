import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for pdfjs in Vite
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization:', e);
}

/**
 * Extracts plain text from an uploaded CV file (.pdf, .docx, .txt, .md, .rtf)
 * @param {File} file 
 * @returns {Promise<{ text: string, fileName: string, fileType: string }>}
 */
export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase();

  // 1. Plain Text / Markdown / RTF files
  if (['txt', 'md', 'rtf', 'text', 'json'].includes(extension)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          text: e.target.result,
          fileName,
          fileType: extension
        });
      };
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // 2. Word Document (.docx)
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value,
      fileName,
      fileType: 'docx'
    };
  }

  // 3. PDF Document (.pdf)
  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    if (!fullText.trim()) {
      throw new Error('Could not extract text from this PDF (it might be a scanned image).');
    }

    return {
      text: fullText.trim(),
      fileName,
      fileType: 'pdf'
    };
  }

  // Fallback try reading as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        text: e.target.result,
        fileName,
        fileType: extension || 'unknown'
      });
    };
    reader.onerror = () => reject(new Error(`Unsupported file type: .${extension}`));
    reader.readAsText(file);
  });
}
