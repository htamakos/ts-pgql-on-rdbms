import { LocalDateTime } from '../../src/core/JavaStandardType'

describe('LocalDateTime', (): void => {
  test('should get now', async () => {
    const ldt: LocalDateTime = LocalDateTime.now()
    expect(ldt != null).toBeTruthy()
  })

  test('should parse ISOString', async () => {
    const ldt: LocalDateTime = LocalDateTime.parseISOString(
      new Date().toISOString(),
    )
    expect(ldt != null).toBeTruthy()
  })

  test('should parse with format', async () => {
    const timestampStringValue: string = '2018-12-15 10:10:00+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    expect(ldt != null).toBeTruthy()
  })

  test('MAX_MIN', async () => {
    expect(LocalDateTime.MAX.toString()).toStrictEqual(
      '+999999999-12-31T23:59:59.999999999',
    )
    expect(LocalDateTime.MIN.toString()).toStrictEqual('-999999999-01-01T00:00')
  })

  test('get APIs', async () => {
    const timestampStringValue: string = '2018-12-15 10:10:00+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    expect(ldt.getYear()).toBe(2018)
    expect(ldt.getMonthValue()).toBe(12)
    expect(ldt.getDayOfMonth()).toBe(15)
    expect(ldt.getHour()).toBe(10)
    expect(ldt.getMinute()).toBe(10)
    expect(ldt.getSecond()).toBe(0)
    expect(ldt.getNano()).toBe(0)
    expect(ldt.getDayOfYear()).toBe(349)
  })

  test('plus APIs', async () => {
    const timestampStringValue: string = '2018-01-15 01:10:00+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    expect(ldt.plusYears(1).getYear()).toBe(ldt.getYear() + 1)
    expect(ldt.plusMonths(2).getMonthValue()).toBe(ldt.getMonthValue() + 2)
    expect(ldt.plusDays(1).getDayOfMonth()).toBe(ldt.getDayOfMonth() + 1)
    expect(ldt.plusHours(2).getHour()).toBe(ldt.getHour() + 2)
    expect(ldt.plusMinutes(3).getMinute()).toBe(ldt.getMinute() + 3)
    expect(ldt.plusSeconds(5).getSecond()).toBe(ldt.getSecond() + 5)
    expect(ldt.plusNanos(3).getNano()).toBe(ldt.getNano() + 3)
    expect(ldt.plusWeeks(2).getDayOfYear()).toBeGreaterThan(ldt.getDayOfYear())
  })

  test('minus APIs', async () => {
    const timestampStringValue: string = '2018-08-15 08:10:10+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    expect(ldt.minusYears(1).getYear()).toBe(ldt.getYear() - 1)
    expect(ldt.minusMonths(2).getMonthValue()).toBe(ldt.getMonthValue() - 2)
    expect(ldt.minusDays(1).getDayOfMonth()).toBe(ldt.getDayOfMonth() - 1)
    expect(ldt.minusHours(2).getHour()).toBe(ldt.getHour() - 2)
    expect(ldt.minusMinutes(3).getMinute()).toBe(ldt.getMinute() - 3)
    expect(ldt.minusSeconds(5).getSecond()).toBe(ldt.getSecond() - 5)
    expect(ldt.minusNanos(3).getNano()).toBe(999999997)
    expect(ldt.minusWeeks(2).getDayOfYear()).toBeLessThan(ldt.getDayOfYear())
  })

  test('with APIs', async () => {
    const timestampStringValue: string = '2018-08-15 08:10:10+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    const withYear: number = 2021
    const withMonth: number = 12
    const withDayOfMonth: number = 8
    const withDayOfYear: number = 180
    const withHour: number = 9
    const withMinute: number = 19
    const withSecond: number = 34
    const withNano: number = 8998

    expect(ldt.withYear(withYear).getYear()).toBe(withYear)
    expect(ldt.withMonth(withMonth).getMonthValue()).toBe(withMonth)
    expect(ldt.withDayOfMonth(withDayOfMonth).getDayOfMonth()).toBe(
      withDayOfMonth,
    )
    expect(ldt.withDayOfYear(withDayOfYear).getDayOfYear()).toBe(withDayOfYear)
    expect(ldt.withHour(withHour).getHour()).toBe(withHour)
    expect(ldt.withMinute(withMinute).getMinute()).toBe(withMinute)
    expect(ldt.withSecond(withSecond).getSecond()).toBe(withSecond)
    expect(ldt.withNano(withNano).getNano()).toBe(withNano)
  })
})
