import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDB } from "./db"
import { runtimeConfig } from "./runtimeConfig"
import * as schema from "../database/schema"
import type { User } from "~~/shared/utils/types"
import type { H3Event } from "h3"

export const createBetterAuth = () => betterAuth({
  baseURL: runtimeConfig.public.baseURL,
  trustedOrigins: ['http://localhost:8787', runtimeConfig.public.baseURL],
  secret: runtimeConfig.betterAuthSecret,
  database: drizzleAdapter(getDB(), {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: false, // Disable email/password auth since we only want Google
  },
  user: {
    additionalFields: {
      userName: {
        type: "string",
      },
      firstName: {
        type: "string", 
        required: false, // Allow null initially, will be set in callback
      },
      lastName: {
        type: "string",
        required: false, // Allow null initially, will be set in callback
      }
    },
  },
  socialProviders: {
    google: {
      clientId: runtimeConfig.googleClientId!,
      clientSecret: runtimeConfig.googleClientSecret!,
      scope: ["openid", "email", "profile"],
      // Only allow emails from the specified domain
      allowedDomains: ["st.vimaru.edu.vn"],
      mapProfileToUser: (profile) => {
        return {
          userName: profile.email?.split("@")[0],
          firstName: profile.given_name,
          lastName: profile.family_name
        }
      },
      verifyIdToken: async (token, nonce) => {
          return true;
      }
    },
  },
  plugins: [
      admin({
          defaultRole: "user",
          defaultBanExpiresIn: 60 * 60,
          defaultBanReason: "Spamming",
          impersonationSessionDuration: 1 * 24 * 60 * 60
      })
  ]
})

let _auth: ReturnType<typeof betterAuth>

const isAuthSchemaCommand = process.argv.some(arg => arg.includes('server/database/schema/auth.ts'))
if (isAuthSchemaCommand) {
  _auth = createBetterAuth()
}

export const auth = _auth!

export const useServerAuth = () => {
  if (runtimeConfig.preset == 'node-server') {
    if (!_auth) {
      _auth = createBetterAuth()
    }
    return _auth
  } else {
    return createBetterAuth()
  }
}

export const getAuthSession = async (event: H3Event) => {
  const headers = event.headers
  const serverAuth = useServerAuth()
  const session = await serverAuth.api.getSession({
    headers
  })
  return session
}

export const requireAuth = async (event: H3Event) => {
  const session = await getAuthSession(event)
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  // Save the session to the event context for later use
  event.context.user = session.user
  return session.user as User
}