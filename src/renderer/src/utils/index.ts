const keys = [
  'Артикул',
  'Реализовано экземпляров, шт. (за вычетом возвратов)',
  'Реализовано на сумму, руб. (за вычетом возвратов)',
  'Сумма вознаграждения за продажу, руб.',
  'Расходы на обработку и доставку товаров до покупателя, руб.'
]

export const filteredXLSX = (jsonData: any[]): any[] => {
  const filteredData = jsonData.map((obj: any) => {
    return Object.keys(obj)
      .filter((key) => keys.includes(key))
      .reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
      }, {} as any)
  })

  return filteredData
}

const isNumeric = (value: string | number): boolean => typeof value === 'number' && !isNaN(value)

export const getUnicArticleAndSum = (filteredData: any[]): any[] => {
  const result = filteredData
    .filter((item) => !!item['Артикул'])
    .reduce((acc, item) => {
      const article = item[keys[0]]

      if (acc[article]) {
        keys.slice(1).forEach((key) => {
          if (isNumeric(item[key])) {
            acc[article][key] += item[key]
          }
        })
      } else {
        acc[article] = {
          [keys[0]]: item[keys[0]],
          [keys[1]]: isNumeric(item[keys[1]]) ? item[keys[1]] : 0,
          [keys[2]]: isNumeric(item[keys[2]]) ? item[keys[2]] : 0,
          [keys[3]]: isNumeric(item[keys[3]]) ? item[keys[3]] : 0,
          [keys[4]]: isNumeric(item[keys[4]]) ? item[keys[4]] : 0
        }
      }

      return acc
    }, {})

  return Object.values<any>(result).map((item: Record<string, number>, index) => ({
    ...item,
    [keys[1]]: parseFloat(item[keys[1]].toFixed(2)),
    [keys[2]]: parseFloat(item[keys[2]].toFixed(2)),
    [keys[3]]: parseFloat(item[keys[3]].toFixed(2)),
    [keys[4]]: parseFloat(item[keys[4]].toFixed(2)),
    id: index
  }))
}
