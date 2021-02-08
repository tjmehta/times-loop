import times, { timesParallel, timesSeries } from '../index'

describe('times-loop', () => {
  it('should invoke callback n times', () => {
    const n = 5
    const cb = jest.fn((i) => i * 2)

    const results = times(n, cb)

    expect(cb.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          0,
        ],
        Array [
          1,
        ],
        Array [
          2,
        ],
        Array [
          3,
        ],
        Array [
          4,
        ],
      ]
    `)
    expect(results).toMatchInlineSnapshot(`
      Array [
        0,
        2,
        4,
        6,
        8,
      ]
    `)
  })
})

describe('timesParallel', () => {
  it('should invoke callback n times', async () => {
    const n = 5
    const cb = jest.fn((i) => Promise.resolve(i * 2))

    const results = await timesParallel(n, cb)

    expect(cb.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          0,
        ],
        Array [
          1,
        ],
        Array [
          2,
        ],
        Array [
          3,
        ],
        Array [
          4,
        ],
      ]
    `)
    expect(results).toMatchInlineSnapshot(`
      Array [
        0,
        2,
        4,
        6,
        8,
      ]
    `)
  })
})

describe('timesSeries', () => {
  it('should invoke callback n times', async () => {
    const n = 5
    const cb = jest.fn((i) => Promise.resolve(i * 2))

    const results = await timesSeries(n, cb)

    expect(cb.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          0,
        ],
        Array [
          1,
        ],
        Array [
          2,
        ],
        Array [
          3,
        ],
        Array [
          4,
        ],
      ]
    `)
    expect(results).toMatchInlineSnapshot(`
      Array [
        0,
        2,
        4,
        6,
        8,
      ]
    `)
  })
})
