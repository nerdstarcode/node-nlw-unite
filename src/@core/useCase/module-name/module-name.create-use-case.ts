import { RedisClient } from 'src/@core/infra/Redis/RedisClient';

export class NlpHashRedisUseCase {
  private redisClient = RedisClient.create({}).RedisClient
  constructor() {
  }
  async execute(
    query,
  ): Promise<any> {
    const validate = this.validateEntryData(query)
    if (validate.success === false) return validate
    const { word, nMap } = query
    const arrayOfWord = word.split('')
    const arrayOfNLPParts = this.constructPartOfWord({ arrayOfWord, nMap })

    const responses = await this.scanRedisWithPartsOfWord({ arrayOfNLPParts })
    const responseFlat = responses.flat()

    const hashSet = new Set()
    const nlpSearchResults = {}
    this.scoreSearchedWords({ responseFlat, hashSet, responses, nlpSearchResults })
    const countOfSearchs = responses.length

    const sortedNlpSearchResults = this.sortAndFilterEntries({ nlpSearchResults, countOfSearchs })
    return {
      success: true,
      data: { sortedNlpSearchResults, arrayLen: responseFlat.length, hashLen: hashSet.size, hashSet: [...hashSet] }
    }
  }
  validateEntryData({ nMap, word }) {
    if (nMap >= word.length) {
      return { success: false, message: 'O nMap não pode ter um valor igual ou maior que o tamanho da palavra' }
    }
    return { success: true }
  }
  constructPartOfWord({ arrayOfWord, nMap }) {
    return arrayOfWord.map((letter, index) => {
      let NLPbase = ''
      for (let indexMapLeft = index - Math.ceil(nMap / 2); indexMapLeft < index; indexMapLeft++) {
        if (arrayOfWord[indexMapLeft]) NLPbase += arrayOfWord[indexMapLeft]
      }
      NLPbase += arrayOfWord[index]
      for (let indexMapRight = index + 1; indexMapRight <= index + Math.floor(nMap / 2); indexMapRight++) {
        if (arrayOfWord[indexMapRight]) NLPbase += arrayOfWord[indexMapRight]
      }
      return NLPbase
    })
  }
  async scanRedisWithPartsOfWord({ arrayOfNLPParts }: { arrayOfNLPParts: string[] }) {
    const cursor = 0;
    const hashLenRedis = await this.redisClient.hLen('hash-nlp')
    const OptionsRedis = (matchWord: string, len: number) => {
      return { MATCH: `*${matchWord?.trim()?.toUpperCase()}*`, COUNT: len };
    }

    return await Promise.all(
      arrayOfNLPParts.map(async (nlpPart) => {
        const responseRedis = await this.redisClient.hScan('hash-nlp', cursor, OptionsRedis(nlpPart, hashLenRedis))
        return responseRedis.tuples.map((tuple) => tuple.field)
      })
    )
  }
  scoreSearchedWords({ responseFlat, hashSet, responses, nlpSearchResults }) {
    responseFlat.forEach((name) => { hashSet.add(name) })
    responses.forEach((responseNLP) => {
      hashSet.forEach((name: string) => {
        if (responseNLP.includes(name)) {
          if (typeof (nlpSearchResults?.[name]) === 'number') {
            nlpSearchResults[name] = Number(nlpSearchResults?.[name]) + 1
          } else {
            nlpSearchResults[name] = 1
          }
        }
      })
    })
  }
  sortAndFilterEntries({ nlpSearchResults, countOfSearchs }) {
    const entries = Object.entries(nlpSearchResults);
    const filteredEntries = entries.filter(([key, value]: any[]) => (value / countOfSearchs) >= 0.5);
    filteredEntries.sort((a: any, b: any) => b[1] - a[1]);
    return Object.fromEntries(filteredEntries);
  }
}
