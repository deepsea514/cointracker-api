import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { CHAINS, EXCHANGES } from '../../src/constants/constants'
import { IBurnEvent } from '../../src/models/burnSchema'

chai.use(chaiHttp)
const burns = chai.request('http://localhost:3000/api/v1/burns')

describe('Testing /burns', () => {
  const LIMIT = 3

  it('GET / should return burns for ETH UNI_SWAP', (done) => {
    burns
      .get(`/?chainId=${CHAINS.ETH}&exchange=${EXCHANGES.UNI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.burns).to.exist
        expect(res.body.data.burns.length).to.equal(LIMIT)
        expect(res.body.data.burns[0]).to.exist
        const firstBurn = res.body.data.burns[0] as IBurnEvent
        console.log(firstBurn)

        expect(firstBurn._id).to.exist
        expect(firstBurn.transactionAddress).to.exist
        expect(firstBurn.timestamp).to.exist
        expect(firstBurn.blockNumber).to.exist
        expect(firstBurn.to).to.exist
        expect(firstBurn.sender).to.exist
        expect(firstBurn.amountUSD).to.exist
        expect(firstBurn.amountETH).to.exist
        expect(firstBurn.amount0).to.exist
        expect(firstBurn.amount1).to.exist
        expect(firstBurn.pairAddress).to.exist
        expect(firstBurn.pairLiquidityUSD).to.exist
        expect(firstBurn.pairLiquidityETH).to.exist
        expect(firstBurn.token0Address).to.exist
        expect(firstBurn.token1Address).to.exist
        expect(firstBurn.token0Symbol).to.exist
        expect(firstBurn.token1Symbol).to.exist
        expect(firstBurn.token0PriceUSD).to.exist
        expect(firstBurn.token1PriceUSD).to.exist
        expect(firstBurn.token0PriceETH).to.exist
        expect(firstBurn.token1PriceETH).to.exist
        expect(firstBurn.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstBurn.AMM).to.exist
        expect(firstBurn.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return burns for BSC PANCAKE_SWAP', (done) => {
    burns
      .get(`/?chainId=${CHAINS.BSC}&exchange=${EXCHANGES.PANCAKE_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.burns).to.exist
        expect(res.body.data.burns.length).to.equal(LIMIT)
        expect(res.body.data.burns[0]).to.exist
        const firstBurn = res.body.data.burns[0] as IBurnEvent
        console.log(firstBurn)

        expect(firstBurn._id).to.exist
        expect(firstBurn.transactionAddress).to.exist
        expect(firstBurn.timestamp).to.exist
        expect(firstBurn.blockNumber).to.exist
        expect(firstBurn.to).to.exist
        expect(firstBurn.sender).to.exist
        expect(firstBurn.amountUSD).to.exist
        expect(firstBurn.amountETH).to.exist
        expect(firstBurn.amount0).to.exist
        expect(firstBurn.amount1).to.exist
        expect(firstBurn.pairAddress).to.exist
        expect(firstBurn.pairLiquidityUSD).to.exist
        expect(firstBurn.pairLiquidityETH).to.exist
        expect(firstBurn.token0Address).to.exist
        expect(firstBurn.token1Address).to.exist
        expect(firstBurn.token0Symbol).to.exist
        expect(firstBurn.token1Symbol).to.exist
        expect(firstBurn.token0PriceUSD).to.exist
        expect(firstBurn.token1PriceUSD).to.exist
        expect(firstBurn.token0PriceETH).to.exist
        expect(firstBurn.token1PriceETH).to.exist
        expect(firstBurn.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstBurn.AMM).to.exist
        expect(firstBurn.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return burns for FTM SUSHI_SWAP', (done) => {
    burns
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SUSHI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.burns).to.exist
        expect(res.body.data.burns.length).to.equal(LIMIT)
        expect(res.body.data.burns[0]).to.exist
        const firstBurn = res.body.data.burns[0] as IBurnEvent
        console.log(firstBurn)

        expect(firstBurn._id).to.exist
        expect(firstBurn.transactionAddress).to.exist
        expect(firstBurn.timestamp).to.exist
        expect(firstBurn.blockNumber).to.exist
        expect(firstBurn.to).to.exist
        expect(firstBurn.sender).to.exist
        expect(firstBurn.amountUSD).to.exist
        expect(firstBurn.amountETH).to.exist
        expect(firstBurn.amount0).to.exist
        expect(firstBurn.amount1).to.exist
        expect(firstBurn.pairAddress).to.exist
        expect(firstBurn.pairLiquidityUSD).to.exist
        expect(firstBurn.pairLiquidityETH).to.exist
        expect(firstBurn.token0Address).to.exist
        expect(firstBurn.token1Address).to.exist
        expect(firstBurn.token0Symbol).to.exist
        expect(firstBurn.token1Symbol).to.exist
        expect(firstBurn.token0PriceUSD).to.exist
        expect(firstBurn.token1PriceUSD).to.exist
        expect(firstBurn.token0PriceETH).to.exist
        expect(firstBurn.token1PriceETH).to.exist
        expect(firstBurn.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstBurn.AMM).to.exist
        expect(firstBurn.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return burns for FTM SPIRIT_SWAP', (done) => {
    burns
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SPIRIT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.burns).to.exist
        expect(res.body.data.burns.length).to.equal(LIMIT)
        expect(res.body.data.burns[0]).to.exist
        const firstBurn = res.body.data.burns[0] as IBurnEvent
        console.log(firstBurn)

        expect(firstBurn._id).to.exist
        expect(firstBurn.transactionAddress).to.exist
        expect(firstBurn.timestamp).to.exist
        expect(firstBurn.blockNumber).to.exist
        expect(firstBurn.to).to.exist
        expect(firstBurn.sender).to.exist
        expect(firstBurn.amountUSD).to.exist
        expect(firstBurn.amountETH).to.exist
        expect(firstBurn.amount0).to.exist
        expect(firstBurn.amount1).to.exist
        expect(firstBurn.pairAddress).to.exist
        expect(firstBurn.pairLiquidityUSD).to.exist
        expect(firstBurn.pairLiquidityETH).to.exist
        expect(firstBurn.token0Address).to.exist
        expect(firstBurn.token1Address).to.exist
        expect(firstBurn.token0Symbol).to.exist
        expect(firstBurn.token1Symbol).to.exist
        expect(firstBurn.token0PriceUSD).to.exist
        expect(firstBurn.token1PriceUSD).to.exist
        expect(firstBurn.token0PriceETH).to.exist
        expect(firstBurn.token1PriceETH).to.exist
        expect(firstBurn.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstBurn.AMM).to.exist
        expect(firstBurn.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return burns for FTM PAINT_SWAP', (done) => {
    burns
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.PAINT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.burns).to.exist
        expect(res.body.data.burns.length).to.equal(LIMIT)
        expect(res.body.data.burns[0]).to.exist
        const firstBurn = res.body.data.burns[0] as IBurnEvent
        console.log(firstBurn)

        expect(firstBurn._id).to.exist
        expect(firstBurn.transactionAddress).to.exist
        expect(firstBurn.timestamp).to.exist
        expect(firstBurn.blockNumber).to.exist
        expect(firstBurn.to).to.exist
        expect(firstBurn.sender).to.exist
        expect(firstBurn.amountUSD).to.exist
        expect(firstBurn.amountETH).to.exist
        expect(firstBurn.amount0).to.exist
        expect(firstBurn.amount1).to.exist
        expect(firstBurn.pairAddress).to.exist
        expect(firstBurn.pairLiquidityUSD).to.exist
        expect(firstBurn.pairLiquidityETH).to.exist
        expect(firstBurn.token0Address).to.exist
        expect(firstBurn.token1Address).to.exist
        expect(firstBurn.token0Symbol).to.exist
        expect(firstBurn.token1Symbol).to.exist
        expect(firstBurn.token0PriceUSD).to.exist
        expect(firstBurn.token1PriceUSD).to.exist
        expect(firstBurn.token0PriceETH).to.exist
        expect(firstBurn.token1PriceETH).to.exist
        expect(firstBurn.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstBurn.AMM).to.exist
        expect(firstBurn.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)
})
