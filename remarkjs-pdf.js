// commandline PDF converter for remark.js html
// $ npm install puppeteer
// $ node convert-pdf.js slide.html slide.pdf

const fs = require("fs");
const path = require("path");
const process = require("process");
const puppeteer = require("puppeteer");

main().catch(err => {
    console.error(err);
    process.exit(4);
});

// check args
function getParams() {
    if (process.argv.length < 4) {
        console.error(`node ${path.basename(__filename)} HTML_PATH PDF_PATH`);
        process.exit(1);
    }
    const html = function asUrl(html) {
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
    return {html, pdf};
};

// main for browser lifecycle
async function main() {
    const {html, pdf} = getParams();
    console.log(`Convert ${html} to ${pdf} ...`);
    const browser = await puppeteer.launch();
    try {
        await convertPdf(browser, html, pdf);
        await browser.close();
    } catch (err) {
        await browser.close();
        throw err;
    }
}
async function convertPdf(browser, html, pdf) {
    const page = await browser.newPage();
    await page.goto(html);

    // 1. check remark.js slideshow features
    const notFound = await page.evaluate(() => {
        if (typeof slideshow !== "object") return "slideshow object";
        if (typeof slideshow.getRatio !== "function")
            return "slideshow.getRatio() method";
        if (typeof slideshow.getSlideCount !== "function")
            return "slideshow.getSlideCount() method";
        if (typeof slideshow.gotoNextSlide !== "function")
            return "slideshow.gotoNextSlide() method";
        return "";
    });
    if (notFound) {
        throw Error(`${notFound} of remark.js is not found in the HTML`);
    }

    // 2. inject printing css for fullsheet
    await page.evaluate(() => {
        const ratio = slideshow.getRatio();
        // size by comparing chrome view-area and pdf view-area
        const [w, h] = ratio === "4:3" ? [864, 648] : [1040, 585];
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
    });

    // 3. once render all pages to mermaid graph rendering
    const pages = await page.evaluate(() => slideshow.getSlideCount());
    for (let i = 1; i < pages; i++) {
        await page.evaluate(() => slideshow.gotoNextSlide());
    }

    // 4. print pdf pages with no margin
    const [width, height] = await page.evaluate(() => {
        return [window.innerWidth, window.innerHeight]; //maybe same as w,h
    });
    await page.pdf({
        path: pdf, width: `${width}px`, height: `${height}px`,
        margin: {top: "0px", right: "0px", bottom: "0px", left: "0px"},
    });
}