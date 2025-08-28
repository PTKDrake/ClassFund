import { getDB } from './db'
import { settings } from '../database/schema/app'
import { eq } from 'drizzle-orm'
import { runtimeConfig } from '~~/server/utils/runtimeConfig'
import { BanksObject } from 'vietnam-qr-pay'

export interface PaymentSettings {
  bankKey: string
  bankName: string
  bankBin: string
  accountNumber: string
  accountHolder: string
  paymentAmount: string
}

export async function getSettings(): Promise<PaymentSettings | null> {
  try {
    const db = getDB()
    const settingsData = await db.select().from(settings)
    
    // Convert array of key-value pairs to object
    const settingsObject: Record<string, string> = {}
    settingsData.forEach((setting: any) => {
      settingsObject[setting.key] = setting.value
    })

    // If we have settings in database, return them
    if (Object.keys(settingsObject).length > 0) {
      return {
        bankKey: settingsObject.bankKey || '',
        bankName: settingsObject.bankName || '',
        bankBin: settingsObject.bankBin || '',
        accountNumber: settingsObject.accountNumber || '',
        accountHolder: settingsObject.accountHolder || '',
        paymentAmount: settingsObject.paymentAmount || ''
      }
    }

    // Fallback to runtime config if no database settings
    const defaultBankKey = runtimeConfig.bankKey
    const defaultBank = BanksObject[defaultBankKey as keyof typeof BanksObject] || BanksObject.hdbank
    
    return {
      bankKey: defaultBankKey,
      bankName: defaultBank.name,
      bankBin: defaultBank.bin,
      accountNumber: runtimeConfig.accountNumber,
      accountHolder: runtimeConfig.accountHolder,
      paymentAmount: runtimeConfig.paymentAmount
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // Fallback to hardcoded defaults if everything fails
    return {
      bankKey: runtimeConfig.bankKey,
      bankName: BanksObject[runtimeConfig.bankKey as keyof typeof BanksObject].name,
      bankBin: BanksObject[runtimeConfig.bankKey as keyof typeof BanksObject].bin,
      accountNumber: runtimeConfig.accountNumber,
      accountHolder: runtimeConfig.accountHolder,
      paymentAmount: runtimeConfig.paymentAmount
    }
  }
}

export async function saveSettings(paymentSettings: PaymentSettings): Promise<boolean> {
  try {
    const db = getDB()
    const settingsToSave = [
      { key: 'bankKey', value: paymentSettings.bankKey, description: 'Bank key for QR payment' },
      { key: 'bankName', value: paymentSettings.bankName, description: 'Bank name for QR payment' },
      { key: 'bankBin', value: paymentSettings.bankBin, description: 'Bank BIN for QR payment' },
      { key: 'accountNumber', value: paymentSettings.accountNumber, description: 'Account number for QR payment' },
      { key: 'accountHolder', value: paymentSettings.accountHolder, description: 'Account holder name for QR payment' },
      { key: 'paymentAmount', value: paymentSettings.paymentAmount, description: 'Default payment amount' }
    ]

    // Use upsert to handle both insert and update
    for (const setting of settingsToSave) {
      await db
        .insert(settings)
        .values({
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: settings.key,
          set: {
            value: setting.value,
            description: setting.description,
            updatedAt: new Date()
          }
        })
    }

    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

export async function initializeDefaultSettings(): Promise<void> {
  try {
    const db = getDB()
    const existingSettings = await db.select().from(settings)
    
    // If settings already exist in database, don't initialize
    if (existingSettings.length > 0) {
      return
    }
    const defaultBankKey = runtimeConfig.bankKey
    const defaultBank = BanksObject[defaultBankKey as keyof typeof BanksObject] || BanksObject.hdbank

    const defaultSettings: PaymentSettings = {
      bankKey: defaultBankKey,
      bankName: defaultBank.name,
      bankBin: defaultBank.bin,
      accountNumber: runtimeConfig.accountNumber,
      accountHolder: runtimeConfig.accountHolder,
      paymentAmount: runtimeConfig.paymentAmount
    }

    await saveSettings(defaultSettings)
  } catch (error) {
    console.error('Error initializing default settings:', error)
  }
}
