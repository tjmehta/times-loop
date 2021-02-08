export default function times<T>(
  count: number,
  callback: (i: number) => T,
): T[] {
  const results: T[] = []

  for (var i = 0; i < count; i++) {
    results.push(callback(i))
  }

  return results
}

export function timesParallel<T>(
  count: number,
  callback: (i: number) => Promise<T>,
): Promise<T[]> {
  const promises = times<Promise<T>>(count, callback)

  return Promise.all(promises)
}

export function timesSeries<T>(
  count: number,
  callback: (i: number) => Promise<T>,
): Promise<T[]> {
  let lastPromise: Promise<T>

  const promises = times<Promise<T>>(count, (i) => {
    lastPromise = i === 0 ? callback(i) : lastPromise.then(() => callback(i))

    return lastPromise
  })

  return Promise.all(promises)
}
