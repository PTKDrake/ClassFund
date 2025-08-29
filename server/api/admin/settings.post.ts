import { tServer } from '~~/server/utils/i18n'
import type { PaymentSettings } from '~~/server/utils/settings';
import { saveSettings } from '~~/server/utils/settings'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { bankKey, bankName, bankBin, accountNumber, accountHolder, paymentAmount } = body

    // Validate required fields
    if (!bankKey || !bankName || !accountNumber || !accountHolder || !paymentAmount) {
      throw createError({
        statusCode: 400,
        statusMessage: tServer('server.api.invalidSettingsData', undefined, event)
      })
    }

    // Validate payment amount
    const amount = parseInt(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: tServer('server.api.invalidPaymentAmount', undefined, event)
      })
    }

    // Save settings to database
    const settings: PaymentSettings = {
      bankKey,
      bankName,
      bankBin: bankBin || '',
      accountNumber,
      accountHolder,
      paymentAmount
    }

    const success = await saveSettings(settings)
    
    if (!success) {
      throw createError({
        statusCode: 500,
        statusMessage: tServer('server.api.failedSaveSettings', undefined, event)
      })
    }

    return {
      success: true,
      data: settings
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedSaveSettings', undefined, event)
    })
  }
})
