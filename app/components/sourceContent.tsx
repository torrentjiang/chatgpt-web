import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PGLEFT from "../icons/pg_left.svg";
import PGRIGHT from "../icons/pg_right.svg";
import LOADING from "../icons/loading.svg";
import styles from "./sourceModal.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface ContentProps {
  source: string;
  type: string;
}

type TableRow = {
  [index: string]: string;
};

type TableContent = {
  tableTitle: string;
  tableColumns: { header: string; key: string }[];
  tableData: TableRow[];
};

type seriesType = {
  name: string;
  type: "line" | "bar" | "pie";
  data: number[] | string[];
};

type ChartContent = {
  chartTitle: string;
  xAxisData: string[];
  seriesData: seriesType[];
  legendData: string[];
};

type IdataInterface = {
  type: "table" | "chart" | "text" | "code";
  content: TableContent | ChartContent | string;
};

/**
 * txt文件预览
 * @param fileUrl 文件url
 * @returns
 */
const TextFilePreview = ({ fileUrl }: { fileUrl: string }) => {
  const [fileContents, setFileContents] = useState("");

  // 当组件加载时获取文件内容
  useEffect(() => {
    async function fetchFileContents() {
      try {
        const response = await fetch(fileUrl);
        const contents = await response.text();
        setFileContents(contents);
      } catch (error) {
        console.error("Error fetching file contents:", error);
      }
    }

    fetchFileContents();
  }, [fileUrl]);

  return <div>{fileContents && <pre>{fileContents}</pre>}</div>;
};

/**
 * pdf文件预览
 * @param fileUrl 文件url
 * @returns
 */
const PDFPreview = ({ pdfUrl }: { pdfUrl: string }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const lastPage = () => {
    if (pageNumber == 1) {
      return;
    }
    const page = pageNumber - 1;
    setPageNumber(page);
  };
  const nextPage = () => {
    if (pageNumber == numPages) {
      return;
    }
    const page = pageNumber + 1;
    setPageNumber(page);
  };
  return (
    <div className={styles.view}>
      <div className={styles.pageContainer}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LOADING />}
        >
          <Page pageNumber={pageNumber} width={600} loading={<LOADING />} />
        </Document>
      </div>
      <div className={styles.pageTool}>
        <PGLEFT onClick={lastPage} />
        <PGRIGHT onClick={nextPage} />
      </div>
    </div>
  );
};

export default function SourceContent({ source, type }: ContentProps) {
  useEffect(() => {
    console.log("type, source", type, source);
  }, [source]);

  return (
    <div>
      {type === "txt" && <TextFilePreview fileUrl={source} />}
      {type === "pdf" && <PDFPreview pdfUrl={source} />}
    </div>
  );
}
