export async function createHtml5(head: string, body: string, depth: number): Promise<string> {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <link rel="icon" href="${'../'.repeat(depth)}favicon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${head}
        </head>
        <body>
            ${body}
            <script src="https://unpkg.com/@ethersphere/bee-js/dist/index.browser.min.js"></script>
        </body>
    </html>`
}
