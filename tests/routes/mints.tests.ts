import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { CHAINS, EXCHANGES } from '../../src/constants/constants'
import { IMintEvent } from '../../src/models/mintSchema'
chai.use(chaiHttp)
const mints = chai.request('http://localhost:3000/api/v1/mints')

describe('Testing /mints', () => {
  const LIMIT = 2

  it('GET / should return mints for ETH UNI_SWAP', (done) => {
    mints
      .get(`/?chainId=${CHAINS.ETH}&exchange=${EXCHANGES.UNI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.mints).to.exist
        expect(res.body.data.mints.length).to.equal(LIMIT)
        expect(res.body.data.mints[0]).to.exist
        const firstMint = res.body.data.mints[0] as IMintEvent
        console.log(firstMint)

        expect(firstMint._id).to.exist
        expect(firstMint.transactionAddress).to.exist
        expect(firstMint.timestamp).to.exist
        expect(firstMint.blockNumber).to.exist
        expect(firstMint.to).to.exist
        expect(firstMint.sender).to.exist
        expect(firstMint.amountUSD).to.exist
        expect(firstMint.amountETH).to.exist
        expect(firstMint.amount0).to.exist
        expect(firstMint.amount1).to.exist
        expect(firstMint.pairAddress).to.exist
        expect(firstMint.pairLiquidityUSD).to.exist
        expect(firstMint.pairLiquidityETH).to.exist
        expect(firstMint.token0Address).to.exist
        expect(firstMint.token1Address).to.exist
        expect(firstMint.token0Symbol).to.exist
        expect(firstMint.token1Symbol).to.exist
        expect(firstMint.token0PriceUSD).to.exist
        expect(firstMint.token1PriceUSD).to.exist
        expect(firstMint.token0PriceETH).to.exist
        expect(firstMint.token1PriceETH).to.exist
        expect(firstMint.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstMint.AMM).to.exist
        expect(firstMint.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(10000)

  it('GET / should return mints for BSC PANCAKE_SWAP', (done) => {
    mints
      .get(`/?chainId=${CHAINS.BSC}&exchange=${EXCHANGES.PANCAKE_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.mints).to.exist
        expect(res.body.data.mints.length).to.equal(LIMIT)
        expect(res.body.data.mints[0]).to.exist
        const firstMint = res.body.data.mints[0] as IMintEvent
        console.log(firstMint)

        expect(firstMint._id).to.exist
        expect(firstMint.transactionAddress).to.exist
        expect(firstMint.timestamp).to.exist
        expect(firstMint.blockNumber).to.exist
        expect(firstMint.to).to.exist
        expect(firstMint.sender).to.exist
        expect(firstMint.amountUSD).to.exist
        expect(firstMint.amountETH).to.exist
        expect(firstMint.amount0).to.exist
        expect(firstMint.amount1).to.exist
        expect(firstMint.pairAddress).to.exist
        expect(firstMint.pairLiquidityUSD).to.exist
        expect(firstMint.pairLiquidityETH).to.exist
        expect(firstMint.token0Address).to.exist
        expect(firstMint.token1Address).to.exist
        expect(firstMint.token0Symbol).to.exist
        expect(firstMint.token1Symbol).to.exist
        expect(firstMint.token0PriceUSD).to.exist
        expect(firstMint.token1PriceUSD).to.exist
        expect(firstMint.token0PriceETH).to.exist
        expect(firstMint.token1PriceETH).to.exist
        expect(firstMint.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstMint.AMM).to.exist
        expect(firstMint.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(10000)

  it('GET / should return mints for FTM SUSHI_SWAP', (done) => {
    mints
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SUSHI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.mints).to.exist
        expect(res.body.data.mints.length).to.equal(LIMIT)
        expect(res.body.data.mints[0]).to.exist
        const firstMint = res.body.data.mints[0] as IMintEvent
        console.log(firstMint)

        expect(firstMint._id).to.exist
        expect(firstMint.transactionAddress).to.exist
        expect(firstMint.timestamp).to.exist
        expect(firstMint.blockNumber).to.exist
        expect(firstMint.to).to.exist
        expect(firstMint.sender).to.exist
        expect(firstMint.amountUSD).to.exist
        expect(firstMint.amountETH).to.exist
        expect(firstMint.amount0).to.exist
        expect(firstMint.amount1).to.exist
        expect(firstMint.pairAddress).to.exist
        expect(firstMint.pairLiquidityUSD).to.exist
        expect(firstMint.pairLiquidityETH).to.exist
        expect(firstMint.token0Address).to.exist
        expect(firstMint.token1Address).to.exist
        expect(firstMint.token0Symbol).to.exist
        expect(firstMint.token1Symbol).to.exist
        expect(firstMint.token0PriceUSD).to.exist
        expect(firstMint.token1PriceUSD).to.exist
        expect(firstMint.token0PriceETH).to.exist
        expect(firstMint.token1PriceETH).to.exist
        expect(firstMint.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstMint.AMM).to.exist
        expect(firstMint.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(10000)

  it('GET / should return mints for FTM SPIRIT_SWAP', (done) => {
    mints
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SPIRIT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.mints).to.exist
        expect(res.body.data.mints.length).to.equal(LIMIT)
        expect(res.body.data.mints[0]).to.exist
        const firstMint = res.body.data.mints[0] as IMintEvent
        console.log(firstMint)

        expect(firstMint._id).to.exist
        expect(firstMint.transactionAddress).to.exist
        expect(firstMint.timestamp).to.exist
        expect(firstMint.blockNumber).to.exist
        expect(firstMint.to).to.exist
        expect(firstMint.sender).to.exist
        expect(firstMint.amountUSD).to.exist
        expect(firstMint.amountETH).to.exist
        expect(firstMint.amount0).to.exist
        expect(firstMint.amount1).to.exist
        expect(firstMint.pairAddress).to.exist
        expect(firstMint.pairLiquidityUSD).to.exist
        expect(firstMint.pairLiquidityETH).to.exist
        expect(firstMint.token0Address).to.exist
        expect(firstMint.token1Address).to.exist
        expect(firstMint.token0Symbol).to.exist
        expect(firstMint.token1Symbol).to.exist
        expect(firstMint.token0PriceUSD).to.exist
        expect(firstMint.token1PriceUSD).to.exist
        expect(firstMint.token0PriceETH).to.exist
        expect(firstMint.token1PriceETH).to.exist
        expect(firstMint.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstMint.AMM).to.exist
        expect(firstMint.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(10000)

  it('GET / should return mints for FTM PAINT_SWAP', (done) => {
    mints
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.PAINT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.mints).to.exist
        expect(res.body.data.mints.length).to.equal(LIMIT)
        expect(res.body.data.mints[0]).to.exist
        const firstMint = res.body.data.mints[0] as IMintEvent
        console.log(firstMint)

        expect(firstMint._id).to.exist
        expect(firstMint.transactionAddress).to.exist
        expect(firstMint.timestamp).to.exist
        expect(firstMint.blockNumber).to.exist
        expect(firstMint.to).to.exist
        expect(firstMint.sender).to.exist
        expect(firstMint.amountUSD).to.exist
        expect(firstMint.amountETH).to.exist
        expect(firstMint.amount0).to.exist
        expect(firstMint.amount1).to.exist
        expect(firstMint.pairAddress).to.exist
        expect(firstMint.pairLiquidityUSD).to.exist
        expect(firstMint.pairLiquidityETH).to.exist
        expect(firstMint.token0Address).to.exist
        expect(firstMint.token1Address).to.exist
        expect(firstMint.token0Symbol).to.exist
        expect(firstMint.token1Symbol).to.exist
        expect(firstMint.token0PriceUSD).to.exist
        expect(firstMint.token1PriceUSD).to.exist
        expect(firstMint.token0PriceETH).to.exist
        expect(firstMint.token1PriceETH).to.exist
        expect(firstMint.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstMint.AMM).to.exist
        expect(firstMint.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(10000)
})
