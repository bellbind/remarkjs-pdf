#!/usr/bin/env node
// commandline PDF converter for remark.js html
// $ npm install puppeteer
// $ node convert-pdf.js slide.html slide.pdf

const fs = require("fs");
const path = require("path");
const process = require("process");
const puppeteer = require("puppeteer");

main().catch(err => {
    console.error(err);
    process.exit(20);
});

// check args
function getParams() {
    if (process.argv.length < 4) {
        console.error(`node ${path.basename(__filename)} HTML_PATH PDF_PATH`);
        process.exit(1);
    }
    const html = function asUrl(html) {
        if (/^file:\/\/\//.test(html)) return html;
        if (/^https?:\/\//.test(html)) return html;
        if (!fs.existsSync(html)) {
            console.error(`HTML file not found: ${html}`);
            process.exit(2);
        }
        const absPath = path.resolve(html).replace(/\\/g, "/");
        return `file://${absPath[0] === "/" ? "" : "/"}${absPath}`;
    }(process.argv[2]);
    const pdf = function asPDF(pdf) {
        if (path.extname(pdf) !== ".pdf") {
            console.error(`PDF extension should be ".pdf": ${pdf}`);
            process.exit(3);
        }
        return pdf;
    }(process.argv[3]);
    const name = process.env.REMARKJS_NAME || "slideshow";
    const sizeText = process.env.REMARKJS_SIZE;
    if (sizeText && !/^\d+:\d+$/.test(sizeText)) {
        console.error(`Invalid print size: ${sizeText}`);
        process.exit(4);
    }
    const size = sizeText ? sizeText.split(":").map(s => s >>> 0) : null;
    return {html, pdf, name, size};
};

// main for browser lifecycle
async function main() {
    const params = getParams();
    console.log(`Convert ${params.html} to ${params.pdf} ...`);
    const browser = await puppeteer.launch();
    try {
        await convertPdf(browser, params);
        console.log(`Finished.`);
        await browser.close();
    } catch (err) {
        console.error(err);
        await browser.close();
        process.exit(10);
    }
}
async function convertPdf(browser, {html, pdf, name, size}) {
    const page = await browser.newPage();
    await page.goto(html);

    // 1. check remark.js slideshow features
    const notFound = await page.evaluate(ss => {
        const slideshow = window[ss];
        if (typeof slideshow !== "object") return "slideshow object";
        if (typeof slideshow.getRatio !== "function")
            return "slideshow.getRatio() method";
        if (typeof slideshow.getSlideCount !== "function")
            return "slideshow.getSlideCount() method";
        if (typeof slideshow.gotoNextSlide !== "function")
            return "slideshow.gotoNextSlide() method";
        return "";
    }, name);
    if (notFound) {
        throw Error(`${notFound} of remark.js is not found in the HTML`);
    }

    // 2. inject printing css for fullsheet
    const ratio = await page.evaluate(ss => window[ss].getRatio(), name);
    // size by comparing chrome view-area and pdf view-area
    const [w, h] = size ? size : ratio === "4:3" ? [864, 648] : [1040, 585];
    await page.evaluate((w, h) => {
        const printStyle = document.createElement("style");
        printStyle.textContent = `
@page {
  size: ${w}px ${h}px;
  margin: 0;
}
@media print {
  .remark-slide-scaler {
    left: 0vw !important;
    width: 100vw !important;
    top: 0vh !important;
    height: 100vh !important;
    transform: scale(1) !important;
    box-shadow: none;
  }
}`;
        document.body.appendChild(printStyle);
    }, w, h);

    // 3. once render all pages to mermaid graph rendering
    const pages = await page.evaluate(ss => window[ss].getSlideCount(), name);
    for (let i = 1; i < pages; i++) {
        await page.evaluate(ss => window[ss].gotoNextSlide(), name);
    }

    // 4. print pdf pages with no margin
    const [pw, ph] = await page.evaluate(() => {
        return [window.innerWidth, window.innerHeight]; //maybe same as w,h
    });
    await page.pdf({
        path: pdf, width: `${pw}px`, height: `${ph}px`,
        margin: {top: "0px", right: "0px", bottom: "0px", left: "0px"},
    });
}
