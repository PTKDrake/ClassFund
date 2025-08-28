export const generateRuntimeConfig = () => {
    return {
        preset: process.env.NUXT_NITRO_PRESET,
        betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
        googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
        databaseUrl: process.env.NUXT_DATABASE_URL,
        bankKey: process.env.NUXT_BANK_KEY || 'hdbank',
        accountNumber: process.env.NUXT_ACCOUNT_NUMBER || '099704070058389',
        accountHolder: process.env.NUXT_ACCOUNT_HOLDER || 'Phạm Trung Kiên',
        paymentAmount: process.env.NUXT_PAYMENT_AMOUNT || '276000',
        public: {
            baseURL: process.env.NUXT_APP_URL || 'http://localhost:3000',
            appName: process.env.NUXT_APP_NAME || 'ClassFund',
            appEnv: process.env.NODE_ENV || 'development',
            auth: {
                redirectUserTo: '/',
                redirectGuestTo: '/login',
            }
        }
    }
}

const runtimeConfigInstance = generateRuntimeConfig()

export const runtimeConfig = runtimeConfigInstance