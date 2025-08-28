import { defu } from 'defu';

type MiddlewareOptions = false | {
  only: 'guest' | 'user',
  redirectUserTo?: string,
  redirectGuestTo?: string,
}

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {

  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }

  const { loggedIn, user, fetchSession } = useAuth()
  const redirectOptions = useRuntimeConfig().public.auth
  const { only, redirectUserTo, redirectGuestTo } = defu(to.meta?.auth, redirectOptions)

  await fetchSession()

  if (only === 'guest') {
    if (loggedIn.value) {
      return navigateTo(redirectUserTo)
    } else {
      // Allow guest access to this route
      return
    }
  }

  // If not authenticated, redirect to home
  if (!loggedIn.value) {
    return navigateTo(`${redirectGuestTo}?redirect=${to.fullPath}`)
  }

  // Admin Pages
  const routeBaseName = useRouteBaseName()
  const routeName = routeBaseName(to) as string
  if (routeName?.startsWith('admin') && user.value?.role != 'admin') {
    return navigateTo('/403')
  }

});