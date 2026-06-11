const { ipcMain } = require("electron/main")
const db = require('../utils/database')
const path = require('path');
const fs = require('fs');
const os = require('os');
const { wrapHtmlDocument, htmlToPdfBuffer, RECEIPT_STYLES, COLLECT_STYLES } = require('./pdfTemplates');

ipcMain.handle('payment-sheet', async (_, args) => {
    try {
        const response = await generatePDF(args)
        return response
    } catch (error) {
        console.error(error)
        return { status: 'error', message: typeof error === 'string' ? error : error.message }
    }
})

ipcMain.handle('payment-sheet-collect', async (_, args) => {
    try {
        const response = await generatePDFCollect(args)
        return response
    } catch (error) {
        console.error(error)
        return { status: 'error', message: typeof error === 'string' ? error : error.message }
    }
})

function generatePDF({ collect, all, year, price, collectorName, id }) {

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
                const title = id ? 'Planilla de ' + results[0].name : 'Planillas del ' + year

                const body = results.map(e => (
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
                                    <p
                                    style="
                                        font-size: 14px;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 1;
                                        -webkit-box-orient: vertical;
                                        max-width: calc(100% - 25px);
                                        pointer-events: none;
                                        overflow-wrap: break-word;
                                        overflow: hidden;
                                    "
                                    >
                                    ${e.address}
                                    </p>
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
                                <p>${e.neighborhood || '---'}</p>
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
                )).join('')

                const htmlContent = wrapHtmlDocument({ title, styles: RECEIPT_STYLES, body })

                try {
                    const pdfBuffer = await htmlToPdfBuffer(htmlContent)

                    const tempDir = os.tmpdir();
                    const pdfFilename = `${title}-${Date.now()}.pdf`;
                    const pdfPath = path.join(tempDir, pdfFilename);

                    fs.writeFile(pdfPath, pdfBuffer, (err) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            resolve({ pdf: pdfPath, status: 'success' });
                        }
                    });

                    deletePDF(pdfPath)

                } catch (err) {
                    reject(err.message);
                }
            }
        })
    })
}

function generatePDFCollect() {

    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM partner WHERE collect = ? AND status = ?`

        db.all(sql, [2, 'active'], async (error, results) => {
            if (error) {
                reject(error.message)
            } else {
                const body = `
                    <table cellspacing="0">
                        <thead>
                            <tr>
                                <td style="width: 80px;">N°</td>
                                <td>NOMBRE Y APPELIDO</td>
                                <td style="display: flex; gap: 10px">
                                    <span>E</span>
                                    <span>F</span>
                                    <span>M</span>
                                    <span>A</span>
                                    <span>M</span>
                                    <span>J</span>
                                    <span>J</span>
                                    <span>A</span>
                                    <span>S</span>
                                    <span>O</span>
                                    <span>N</span>
                                    <span>D</span>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(e => (`
                            <tr>
                                <td>${e.member_number}</td>
                                <td>${e.name}</td>
                                <td style="display: flex; gap: 10px">
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                    <div class="cuadrado"></div>
                                </td>
                            </tr>
                            `)).join('')}
                        </tbody>
                    </table>
                `

                const htmlContent = wrapHtmlDocument({ title: 'Planilla para cobrador', styles: COLLECT_STYLES, body })

                try {
                    const pdfBuffer = await htmlToPdfBuffer(htmlContent)

                    const tempDir = os.tmpdir();
                    const pdfFilename = `Planilla para cobrador-${Date.now()}.pdf`;
                    const pdfPath = path.join(tempDir, pdfFilename);

                    fs.writeFile(pdfPath, pdfBuffer, (err) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            resolve({ pdf: pdfPath, status: 'success' });
                        }
                    });

                    deletePDF(pdfPath)

                } catch (err) {
                    reject(err.message);
                }
            }
        })
    })
}

async function deletePDF(pdfPath) {
    setTimeout(() => {
        fs.unlink(pdfPath, (err) => {
            if (err) {
                console.error(`Error al eliminar el archivo temporal: ${err.message}`);
            }
        });
    }, 8000)
}
