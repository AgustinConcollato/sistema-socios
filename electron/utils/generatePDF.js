const { ipcMain } = require("electron/main")
const puppeteer = require("puppeteer")
const db = require('../utils/database')

ipcMain.handle('payment-sheet', async (_, args) => {
    try {
        const response = await generateAllPDF(args)
        return response
    } catch (error) {
        console.log(error)
    }
})

function generateAllPDF({ collect, all, year, price, collectorName, id }) {

    return new Promise((resolve, reject) => {

        let sql = ''
        let value = []

        if (!id) {
            if (all) {
                sql = `SELECT * FROM partner WHERE status = 'active'`
            } else {
                sql = `
                    SELECT *
                    FROM partner
                    WHERE collect = ?
                    AND status = 'active';
                `
                value.push(collect)
            }
        } else {
            sql = 'SELECT * FROM partner WHERE id = ?'
            value.push(id)
        }

        db.all(sql, value, async (error, results) => {
            if (error) {
                reject(error.message)
            } else {
                const htmlContent = `             
                    <html>
                            <head>
                                <style>
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
                                </style>
                                <title>${id ? 'Planilla de ' + results[0].name : 'Planillas del ' + year}</title>
                            </head>

                            <body>
                                ${results.map(e => (
                    `<h1>PARROQUIA "SAN RAFAEL"</h1>
                                <header>
                                    <div>
                                        <p>AÑO: ${year}</p>
                                        <p>Cobrador: ${e.collect == 1 ? 'Secretaría parroquial' : collectorName}</p>
                                    </div>
                                    <div class="info">
                                        <p>APORTANTE: <b>${e.member_number} - ${e.name}</b></p>
                                        <div>
                                            <div style="width: 7.5cm;">
                                                <p style="font-size: 14px">${e.address}</p>
                                                <p style="font-size: 14px">${e.neighborhood || '---'}</p>
                                                <div style="margin-top: 15px; display: inline-flex; gap: 5px; align-items: center; font-size: 14px;">Valor cuota <div class="cuadrado">$${price}</div></div>
                                            </div>
                                            <ul class="meses">
                                                <li> Enero
                                                    <div></div>
                                                </li>
                                                <li> Febrero
                                                    <div></div>
                                                </li>
                                                <li> Marzo
                                                    <div></div>
                                                </li>
                                                <li> Abril
                                                    <div></div>
                                                </li>
                                                <li> Mayo
                                                    <div></div>
                                                </li>
                                                <li> Junio
                                                    <div></div>
                                                </li>
                                                <li> Julio
                                                    <div></div>
                                                </li>
                                                <li> Agosto
                                                    <div></div>
                                                </li>
                                                <li> Septiembre
                                                    <div></div>
                                                </li>
                                                <li> Octubre
                                                    <div></div>
                                                </li>
                                                <li> Noviembre
                                                    <div></div>
                                                </li>
                                                <li> Diciembre
                                                    <div></div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </header>
                                <section class="comprobantes">
                                    ${Array.from({ length: 12 }).map((_, i) => (
                        `<div class="recibo-comprobante">
                                            <h3>PARROQUIA "SAN RAFAEL"</h3>
                                            <p style="text-align: center;">PERIODO: ${i + 1}/${year}</p>
                                            <div>
                                                <span>APORTANTE</span>
                                                <h5>${e.name}</h5>
                                                <p>${e.address}</p>
                                                <p>${e.neighborhood}</p>
                                            </div>
                                            <div>
                                                <span>Valor cuota</span>
                                                <div class="cuadrado"></div>
                                            </div>
                                            <p style="text-align: start; font-size: 12px;">Cobrador: ${e.collect == 1 ? 'Secretaría parroquial' : collectorName}</p>
                                        </div>`
                    )).join('')}
                                </section>
                                `
                )).join('')}
                            </body>
                    </html>
                `

                const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                const page = await browser.newPage()
                await page.setContent(htmlContent, { waitUntil: 'load' })

                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '0.5cm',
                        bottom: '0.5cm',
                        left: '0.5cm',
                        right: '0.5cm'
                    }
                });

                const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`

                await browser.close();

                resolve({ pdf: pdfBase64, status: 'success' });
            }
        })
    })
}