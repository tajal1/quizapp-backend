import { Injectable } from '@nestjs/common'
import Tesseract, { OEM, PSM } from 'tesseract.js'

const TESSERACT_CORE_VERSION = 'v4.0.0'
const corePath = `https://cdn.jsdelivr.net/npm/tesseract.js-core@${TESSERACT_CORE_VERSION}/tesseract-core.wasm.js`

@Injectable()
export class SyllabusService {
    constructor() {}

    async extractTextFromImage(imagePath: string): Promise<any> {
        console.log(`Starting OCR process for image: ${imagePath}`)
        console.log(`Using Tesseract Core: ${TESSERACT_CORE_VERSION}`)

        try {
            const worker = await Tesseract.createWorker('ben+eng', OEM.LSTM_ONLY, {
                corePath, // <-- This is the crucial addition
                logger: m => console.log(m.status, Math.round(m.progress * 100) + '%')
            })

            // Using PSM.AUTO is often more robust than forcing a single block,
            // as it allows Tesseract to automatically analyze the layout.
            // Let's try this as it's a good general-purpose setting.
            await worker.setParameters({
                tessedit_pageseg_mode: PSM.AUTO
            })

            const {
                data: { text }
            } = await worker.recognize(imagePath)

            console.log('\n--- OCR Result ---')
            console.log(text)
            console.log('--- End of OCR Result ---\n')

            await worker.terminate()
            console.log('OCR process finished successfully.')

            return text
        } catch (error) {
            console.error('An error occurred during the OCR process:', error)
        }
    }

    async parseOcrResult(text: string) {
        const lines = text.split('\n').filter(line => line.trim() !== '')

        const subjects = []
        // Start from the first data row, skipping headers
        for (const line of lines) {
            // Use regex to find lines that start with a Bengali digit followed by a dot.
            const match = line.match(/^(১|২|৩|৪|৫|৬|৭|৮|৯|১০)\.\s*(.*)\s*(\S+)$/)
            console.log('=============>>>>>', match)
            if (match) {
                const [_, serial, subjectName, pageNumber] = match
                subjects.push({
                    serial: serial.trim(),
                    name: subjectName.trim(),
                    page: pageNumber.trim()
                })
            }
        }
        return subjects
    }
}
