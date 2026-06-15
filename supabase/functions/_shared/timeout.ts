export function mitTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number,
  fehlerText: string
): Promise<T> {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, ms)

  return fn(controller.signal)
    .then(result => {
      clearTimeout(timeout)
      return result
    })
    .catch(err => {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        throw new Error(fehlerText)
      }
      throw err
    })
}
