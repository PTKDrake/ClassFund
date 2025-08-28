import { qrCache } from '~~/server/database/schema'
import { tServer } from '~~/server/utils/i18n'
import { QRPay, BanksObject } from 'vietnam-qr-pay'
import QRCodeStyling from 'qr-code-styling'
import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import nodeCanvas from 'canvas'
import { JSDOM } from 'jsdom'
import { eq, lt, sql } from 'drizzle-orm'
import { useDB } from '~~/server/utils/db'

// Database cache configuration
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

// Database cache functions
async function getCachedQRCode(cacheKey: string) {
  try {
    const db = await useDB()
    const result = await db
      .select()
      .from(qrCache)
      .where(eq(qrCache.cacheKey, cacheKey))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const cache = result[0]
    const cacheAge = Date.now() - cache.createdAt.getTime()

    // Check if cache is still valid
    if (cacheAge > CACHE_TTL) {
      // Delete expired cache
      await db.delete(qrCache).where(eq(qrCache.cacheKey, cacheKey))
      return null
    }

    return cache.qrCodeData
  } catch (error) {
    console.error('Error getting cached QR code:', error)
    return null
  }
}

async function saveCachedQRCode(cacheKey: string, description: string, amount: string, bankNumber: string, qrCodeData: any) {
  try {
    const db = await useDB()
    await db
      .insert(qrCache)
      .values({
        cacheKey,
        description,
        amount,
        bankNumber,
        qrCodeData,
      })
      .onConflictDoUpdate({
        target: qrCache.cacheKey,
        set: {
          qrCodeData,
          createdAt: sql`NOW()`,
        }
      })

    // console.log('QR code cached successfully in database')
  } catch (error) {
    console.error('Error saving QR code cache:', error)
  }
}

async function cleanupExpiredCache() {
  try {
    const expiredTime = new Date(Date.now() - CACHE_TTL)
    const db = await useDB()
    const result = await db
      .delete(qrCache)
      .where(lt(qrCache.createdAt, expiredTime))

    if (result && (result as any).count && (result as any).count > 0) {
      console.log(`Cleaned up ${(result as any).count} expired QR cache entries from database`)
    }
  } catch (error) {
    console.error('Error during cache cleanup:', error)
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Cleanup expired cache entries
    await cleanupExpiredCache()

    // console.log('QR Generate API called at:', new Date().toISOString())
    const body = await readBody(event)
    const { description, amount = runtimeConfig.paymentAmount, bankNumber = runtimeConfig.accountNumber, bankKey = runtimeConfig.bankKey, bankBin = BanksObject[runtimeConfig.bankKey as keyof typeof BanksObject].bin } = body

    // Validate required fields
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: tServer('server.api.qrMissingDescription', undefined, event)
      })
    }

    // Create cache key from description and payment info
    const cacheKey = createHash('md5').update(`${description}-${amount}-${bankNumber}`).digest('hex')

    // Check database cache first
    const cachedData = await getCachedQRCode(cacheKey)
    if (cachedData) {
      // console.log('Returning cached QR from database for description:', description.substring(0, 50) + '...')
      return {
        success: true,
        data: cachedData,
        cached: true
      }
    }

    console.log('Generating new QR for description:', description)

    // Get bank settings (in a real app, this would come from database)
    const bankSettings = {
      bankKey: bankKey,
      bankBin: bankBin,
      bankNumber: bankNumber,
      amount: amount,
      purpose: description
    }

    // Create VietQR using vietnam-qr-pay
    const vietQR = QRPay.initVietQR({
      bankBin: bankSettings.bankBin,
      bankNumber: bankSettings.bankNumber,
      amount: bankSettings.amount,
      purpose: bankSettings.purpose
    })

    // Build the QR content
    const qrContent = vietQR.build()

    // Read logo file from public directory (optimized for server-side)
    // Use __dirname for more reliable path resolution in PM2
    const logoPath = path.join(__dirname, '..', '..', '..', 'public', 'logo.png')
    let logoDataUrl: string | undefined

    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`
        // console.log('Logo loaded successfully, size:', logoBuffer.length, 'bytes')
      } else {
        // Fallback to process.cwd() if __dirname path doesn't work
        const fallbackPath = path.join(process.cwd(), 'public', 'logo.png')
        if (fs.existsSync(fallbackPath)) {
          const logoBuffer = fs.readFileSync(fallbackPath)
          logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`
          console.log('Logo loaded using fallback path')
        }
      }
    } catch (error) {
      console.warn('Could not load logo:', (error as Error).message)
    }

    // Create QR code with styling (optimized for Node.js environment)
    const qrCodeStyling = new QRCodeStyling({
      width: 600,
      height: 600,
      type: "canvas", // Use canvas type for server-side generation
      data: qrContent,
      image: logoDataUrl,
      margin: 10,
      dotsOptions: {
        color: "#000000",
        type: "rounded"
      },
      cornersSquareOptions: {
        color: "#000000",
        type: "extra-rounded"
      },
      cornersDotOptions: {
        color: "#000000",
        type: "dot"
      },
      backgroundOptions: {
        color: "#ffffff"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3,
        margin: 10,
        crossOrigin: "anonymous"
      },
      nodeCanvas,
      jsdom: JSDOM
    })

    // Generate QR code buffer (optimized method for server-side)
    const qrBuffer = await qrCodeStyling.getRawData('png')

    if (!qrBuffer) {
      throw new Error('Failed to generate QR code buffer')
    }

    // Convert to base64 for JSON response
    const base64String = Buffer.isBuffer(qrBuffer)
      ? qrBuffer.toString('base64')
      : await qrBuffer.arrayBuffer().then(buffer => Buffer.from(buffer).toString('base64'))

    const dataUrl = `data:image/png;base64,${base64String}`

    const bufferSize = Buffer.isBuffer(qrBuffer) ? qrBuffer.length : qrBuffer.size
    console.log('QR code generated successfully, size:', bufferSize, 'bytes')

    const responseData = {
      qrCodeUrl: dataUrl,
      description: description,
      amount: amount,
      bankNumber: bankNumber,
      qrContent: qrContent,
      generatedAt: new Date().toISOString()
    }

    // Cache the result to database
    await saveCachedQRCode(cacheKey, description, amount, bankNumber, responseData)

    return {
      success: true,
      data: responseData,
      cached: false
    }

  } catch (error) {
    console.error('QR generation error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.qrFailedGenerate', undefined, event),
      data: (error as Error).message
    })
  }
})
