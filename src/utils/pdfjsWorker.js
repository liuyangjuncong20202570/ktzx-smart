import * as pdfjsLib from 'pdfjs-dist';

// 手动配置 Web Worker
const workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export {pdfjsLib};
