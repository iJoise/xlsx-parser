const keys = [
  'Артикул',
  'Реализовано экземпляров, шт. (за вычетом возвратов)',
  'Реализовано на сумму, руб. (за вычетом возвратов)',
  'Сумма вознаграждения за продажу, руб.',
  'Расходы на обработку и доставку товаров до покупателя, руб.'
]

const newKeys = [
  'Код товара продавца',
  'Реализовано на сумму, руб.',
  'Выплаты по механикам лояльности партнёров, руб.',
  'Баллы за скидки'
]

export const filteredXLSX = (jsonData: any[], type: 'old' | 'new'): any[] => {
  const filteredKeys = type === 'old' ? keys : newKeys

  return jsonData
    .map((obj: any) => {
      const filteredObj = Object.keys(obj)
        .filter((key) => filteredKeys.includes(key))
        .reduce((acc, key) => {
          acc[key] = obj[key]
          return acc
        }, {} as any)

      if (Object.keys(filteredObj).length === 0) {
        console.warn('Объект не содержит ожидаемых ключей:', obj)
      }

      return filteredObj
    })
    .filter((obj) => Object.keys(obj).length > 0) // Исключаем пустые объекты
}

const isNumeric = (value: string | number): boolean => typeof value === 'number' && !isNaN(value)

export const getUnicArticleAndSum = (filteredData: any[], type: 'old' | 'new'): any[] => {
  const filteredKeys = type === 'old' ? keys : newKeys
  const keysCount = filteredKeys.length

  const result = filteredData
    .filter((item) => !!item[filteredKeys[0]])
    .reduce((acc, item) => {
      const article = item[filteredKeys[0]]

      if (acc[article]) {
        filteredKeys.slice(1).forEach((key) => {
          if (isNumeric(item[key])) {
            acc[article][key] += item[key]
          }
        })
      } else {
        // Создаем базовый объект с первым полем (артикулом/кодом товара)
        const newItem = {
          [filteredKeys[0]]: item[filteredKeys[0]]
        }

        // Добавляем остальные поля на основе количества ключей
        for (let i = 1; i < keysCount; i++) {
          newItem[filteredKeys[i]] = isNumeric(item[filteredKeys[i]]) ? item[filteredKeys[i]] : 0
        }

        acc[article] = newItem
      }

      return acc
    }, {})

  return Object.values<any>(result).map((item: Record<string, number>, index) => {
    const resultItem = { ...item, id: index }

    // Округляем числовые значения
    for (let i = 1; i < keysCount; i++) {
      if (isNumeric(resultItem[filteredKeys[i]])) {
        resultItem[filteredKeys[i]] = parseFloat(resultItem[filteredKeys[i]].toFixed(2))
      }
    }

    return resultItem
  })
}
