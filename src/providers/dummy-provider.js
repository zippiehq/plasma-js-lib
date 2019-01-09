const BaseProvider = require('./base-provider')
const dummy = require('../dummy/dummy-data')

/**
 * Provides dummy results for local testing.
 */
class DummyProvider extends BaseProvider {
  get name () {
    return 'dummy'
  }

  async handle (method, data = []) {
    return new Promise((resolve, reject) => {
      const methods = {
        'pg_getTransaction': this.getTransaction,
        'pg_getBlock': this.getBlock,
        'pg_getBlocks': this.getBlocks,
        'pg_getHeight': this.getHeight
      }

      try {
        let res = methods[method](...data)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

  getTransaction (hash) {
    return dummy.DUMMY_TRANSCTIONS.find((tx) => {
      return tx.hash === hash
    })
  }

  getBlock (block) {
    return dummy.DUMMY_BLOCKS.find((blk) => {
      return blk.number === block
    })
  }

  getBlocks (start, end) {
    return dummy.DUMMY_BLOCKS.filter((block) => {
      return block.number >= start && block.number <= end
    })
  }

  getHeight () {
    return dummy.DUMMY_BLOCKS.reduce((prev, curr) => {
      return (prev.number > curr.number ? prev : curr)
    }).number
  }
}

module.exports = DummyProvider
