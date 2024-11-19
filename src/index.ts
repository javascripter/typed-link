export type Routes = {
  [key: string]: {
    params?: Record<string, string | string[]>
    query?: Record<string, string | string[]>
  }
}

export type StaticRoute = {
  params?: never
  query?: never
}

export type Options<T> = T extends StaticRoute ? StaticRoute : T

function queryToString(query: Record<string, string | string[]>) {
  const urlSearchParams = new URLSearchParams()

  const entries = Object.entries(query)

  for (const [key, values] of entries) {
    if (Array.isArray(values)) {
      for (const value of values) {
        urlSearchParams.append(key, value)
      }
    } else {
      urlSearchParams.set(key, values)
    }
  }

  if (entries.length === 0) {
    return ''
  }

  return `?${urlSearchParams.toString()}`
}

export function createLinkHelper<UserRoutes extends Routes>() {
  return function link<T extends keyof UserRoutes>(
    href: T,
    options: Options<UserRoutes[T]>
  ) {
    const resolvedHref = (href as string)
      .split('/')
      .flatMap((item) => {
        if (item.startsWith('[[...') && item.endsWith(']]')) {
          const key = item.slice('[[...'.length, -']]'.length)
          if (
            options.params?.[key] === undefined ||
            !Array.isArray(options.params[key])
          ) {
            throw new Error(
              `Expected parameter for ${key} to be of type "string[]"`
            )
          }
          return options.params[key]
        }

        if (item.startsWith('[...') && item.endsWith(']')) {
          const key = item.slice('[...'.length, -']'.length)

          if (
            options.params?.[key] === undefined ||
            !Array.isArray(options.params[key])
          ) {
            throw new Error(
              `Expected parameter for ${key} to be of type "string[]"`
            )
          }

          return options.params[key]
        }

        if (item.startsWith('[') && item.endsWith(']')) {
          const key = item.slice(1, -1)
          if (typeof options.params?.[key] !== 'string') {
            throw new Error(
              `Expected parameter for ${key} to be of type "string"`
            )
          }
          return [options.params[key]]
        }

        return [item]
      })
      .join('/')

    return `${resolvedHref}${queryToString(options.query ?? {})}`
  }
}
