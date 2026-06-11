const { BrowserWindow } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CM_TO_IN = 0.5 / 2.54;

function wrapHtmlDocument({ title, styles, body }) {
    return `
        <html>
            <head>
                <style>${styles}</style>
                <title>${title}</title>
            </head>
            <body>${body}</body>
        </html>
    `;
}

async function htmlToPdfBuffer(htmlContent) {
    const win = new BrowserWindow({ show: false, width: 900, height: 1200 });
    const tempHtmlPath = path.join(os.tmpdir(), `pdf-source-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);

    fs.writeFileSync(tempHtmlPath, htmlContent);

    try {
        await win.loadFile(tempHtmlPath);

        return await win.webContents.printToPDF({
            printBackground: true,
            pageSize: 'A4',
            margins: {
                top: CM_TO_IN,
                bottom: CM_TO_IN,
                left: CM_TO_IN,
                right: CM_TO_IN
            }
        });
    } finally {
        win.destroy();
        fs.unlink(tempHtmlPath, () => {});
    }
}

const RECEIPT_STYLES = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: #000;
    }

    ul {
        list-style: none;
    }

    body {
        font-family: Arial, sans-serif;
        width: 21cm;
        height: 29.7cm;
        min-width: 21cm;
        min-height: 29.7cm;
    }

    h1 {
        font-size: 18px;
        text-align: center;
    }

    header>div:first-child {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #000;
        font-weight: 600;
        font-size: 14px;
        padding: 0 5px 3px;
    }

    .info {
        margin-top: 10px;
    }

    .info>p {
        font-size: 12px;
        display: inline-block;
        padding-bottom: 2px;
        border-bottom: 1px solid #000;
    }

    .info>p b {
        text-transform: uppercase;
        font-size: 16px;
    }

    .info>div {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .meses {
        display: grid;
        gap: 0.2cm;
        grid-template-columns: repeat(4, 1fr);
        margin-right: 2px;
    }

    .meses li {
        display: flex;
        justify-content: flex-end;
        gap: 0.2cm;
        font-size: 14px;
    }

    .meses li div {
        height: 0.5cm;
        width: 0.7cm;
        border: 1px solid #000;
    }

    .comprobantes {
        display: flex;
        flex-wrap: wrap-reverse;
        flex-direction: row-reverse;
        justify-content: flex-end;
        margin: 50px 0 180px 10px;
    }

    .recibo-comprobante {
        width: 6.8cm;
        border: 1px solid #000;
        padding: .3cm .2cm;
        font-size: 14px;
    }

    .recibo-comprobante h3 {
        text-align: center;
        margin-bottom: 5px;
    }

    .recibo-comprobante div:nth-child(3) span {
        display: block;
        text-align: center;
        font-size: 12px;
        margin-top: 20px;
    }

    .recibo-comprobante div:nth-child(3) h5 {
        padding: 3px;
        text-align: center;
        border-bottom: 1px solid #000;
        border-top: 1px solid #000;
        font-size: 14px;
        margin-bottom: 5px;
        text-transform: uppercase;
    }

    .recibo-comprobante div:nth-child(4) {
        display: flex;
        justify-content: end;
        align-items: center;
        margin: 10px 0;
        gap: 5px;
    }

    .cuadrado {
        border: 1px solid #000;
        height: 0.6cm;
        min-width: 1.5cm;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const COLLECT_STYLES = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: #000;
    }

    ul {
        list-style: none;
    }

    body {
        font-family: Arial, sans-serif;
        width: 21cm;
        height: 29.7cm;
        min-width: 21cm;
        min-height: 29.7cm;
    }

    span {
        width: 20px;
    }

    thead tr td {
        padding: 10px;
        border-bottom: 1px solid #000;
    }

    tbody tr td {
        padding: 7px 10px;
        border-bottom: 1px solid #eee;
    }

    .cuadrado {
        height: 20px;
        width: 20px;
        border: 1px solid #000;
    }
`;

module.exports = {
    wrapHtmlDocument,
    htmlToPdfBuffer,
    RECEIPT_STYLES,
    COLLECT_STYLES
};
