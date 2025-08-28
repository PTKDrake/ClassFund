import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import type { User } from "~~/shared/utils/types";
import type { InferSessionFromClient, ClientOptions } from "better-auth/client";
import type { RouteLocationRaw } from "vue-router";

export function useAuth() {
	const url = useRequestURL()
	const headers = import.meta.server ? useRequestHeaders() : undefined
	const client = createAuthClient({
		baseURL: url.origin,
		fetchOptions: {
			headers
		},
		plugins: [adminClient()],
	})

	const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
	const user = useState<User | null>('auth:user', () => null)
	const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

	const fetchSession = async () => {
		if (sessionFetching.value) {
			return
		}
		sessionFetching.value = true
		const { data } = await client.useSession(useFetch)
		session.value = data.value?.session || null

		const userDefaults = {
			image: null,
			role: null,
			banReason: null,
			banned: null,
			banExpires: null,
		}
		user.value = data.value?.user
			? Object.assign({}, userDefaults, data.value.user) as User
			: null
		sessionFetching.value = false
		return data
	}

	if (import.meta.client) {
		client.$store.listen('$sessionSignal', async (signal) => {
			if (!signal)
				return
			await fetchSession()
		})
	}

	return {
		session,
		user,
		loggedIn: computed(() => !!session.value),
		signIn: client.signIn,
		errorCodes: client.$ERROR_CODES,
		async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
			await client.signOut({
				fetchOptions: {
					onSuccess: async () => {
						session.value = null
						user.value = null
						if (redirectTo) {
							await reloadNuxtApp({
								path: redirectTo.toString()
							})
						}
					}
				}
			})
		},
		fetchSession,
		client
	}
}