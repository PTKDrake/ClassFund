import { tServer } from '~~/server/utils/i18n'
import { getSettings, initializeDefaultSettings } from '~~/server/utils/settings'

export default defineEventHandler(async (event) => {
  try {
    // Initialize default settings if none exist
    await initializeDefaultSettings()
    
    // Get settings from database
    const settings = await getSettings()
    
    // getSettings() should never return null now due to fallbacks
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedFetchSettings', undefined, event)
    })
  }
})
