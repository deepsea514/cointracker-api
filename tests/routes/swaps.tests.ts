import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { CHAINS, EXCHANGES } from '../../src/constants/constants'
import { ISwapEvent } from '../../src/models/swapSchema'

chai.use(chaiHttp)
const swaps = chai.request('http://localhost:3000/api/v1/swaps')

describe('Testing /swaps', () => {
  const LIMIT = 3

  it('GET / should return swaps for ETH UNI_SWAP', (done) => {
    swaps
      .get(`/?chainId=${CHAINS.ETH}&exchange=${EXCHANGES.UNI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.swaps).to.exist
        expect(res.body.data.swaps.length).to.equal(LIMIT)
        expect(res.body.data.swaps[0]).to.exist
        const firstSwap = res.body.data.swaps[0] as ISwapEvent
        console.log(firstSwap)

        expect(firstSwap._id).to.exist
        expect(firstSwap.transactionAddress).to.exist
        expect(firstSwap.timestamp).to.exist
        expect(firstSwap.blockNumber).to.exist
        expect(firstSwap.to).to.exist
        expect(firstSwap.sender).to.exist
        expect(firstSwap.amountUSD).to.exist
        expect(firstSwap.amountETH).to.exist
        expect(firstSwap.amount0In).to.exist
        expect(firstSwap.amount1In).to.exist
        expect(firstSwap.amount0Out).to.exist
        expect(firstSwap.amount1Out).to.exist
        expect(firstSwap.pairAddress).to.exist
        expect(firstSwap.pairLiquidityUSD).to.exist
        expect(firstSwap.pairLiquidityETH).to.exist
        expect(firstSwap.token0Address).to.exist
        expect(firstSwap.token1Address).to.exist
        expect(firstSwap.token0Symbol).to.exist
        expect(firstSwap.token1Symbol).to.exist
        expect(firstSwap.token0PriceUSD).to.exist
        expect(firstSwap.token1PriceUSD).to.exist
        expect(firstSwap.token0PriceETH).to.exist
        expect(firstSwap.token1PriceETH).to.exist
        expect(firstSwap.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstSwap.AMM).to.exist
        expect(firstSwap.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(50000)

  it('GET / should return swaps for BSC PANCAKE_SWAP', (done) => {
    swaps
      .get(`/?chainId=${CHAINS.BSC}&exchange=${EXCHANGES.PANCAKE_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.swaps).to.exist
        expect(res.body.data.swaps.length).to.equal(LIMIT)
        expect(res.body.data.swaps[0]).to.exist
        const firstSwap = res.body.data.swaps[0] as ISwapEvent
        console.log(firstSwap)

        expect(firstSwap._id).to.exist
        expect(firstSwap.transactionAddress).to.exist
        expect(firstSwap.timestamp).to.exist
        expect(firstSwap.blockNumber).to.exist
        expect(firstSwap.to).to.exist
        expect(firstSwap.sender).to.exist
        expect(firstSwap.amountUSD).to.exist
        expect(firstSwap.amountETH).to.exist
        expect(firstSwap.amount0In).to.exist
        expect(firstSwap.amount1In).to.exist
        expect(firstSwap.amount0Out).to.exist
        expect(firstSwap.amount1Out).to.exist
        expect(firstSwap.pairAddress).to.exist
        expect(firstSwap.pairLiquidityUSD).to.exist
        expect(firstSwap.pairLiquidityETH).to.exist
        expect(firstSwap.token0Address).to.exist
        expect(firstSwap.token1Address).to.exist
        expect(firstSwap.token0Symbol).to.exist
        expect(firstSwap.token1Symbol).to.exist
        expect(firstSwap.token0PriceUSD).to.exist
        expect(firstSwap.token1PriceUSD).to.exist
        expect(firstSwap.token0PriceETH).to.exist
        expect(firstSwap.token1PriceETH).to.exist
        expect(firstSwap.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstSwap.AMM).to.exist
        expect(firstSwap.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(50000)

  it('GET / should return swaps for FTM SUSHI_SWAP', (done) => {
    swaps
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SUSHI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.swaps).to.exist
        expect(res.body.data.swaps.length).to.equal(LIMIT)
        expect(res.body.data.swaps[0]).to.exist
        const firstSwap = res.body.data.swaps[0] as ISwapEvent
        console.log(firstSwap)

        expect(firstSwap._id).to.exist
        expect(firstSwap.transactionAddress).to.exist
        expect(firstSwap.timestamp).to.exist
        expect(firstSwap.blockNumber).to.exist
        expect(firstSwap.to).to.exist
        expect(firstSwap.sender).to.exist
        expect(firstSwap.amountUSD).to.exist
        expect(firstSwap.amountETH).to.exist
        expect(firstSwap.amount0In).to.exist
        expect(firstSwap.amount1In).to.exist
        expect(firstSwap.amount0Out).to.exist
        expect(firstSwap.amount1Out).to.exist
        expect(firstSwap.pairAddress).to.exist
        expect(firstSwap.pairLiquidityUSD).to.exist
        expect(firstSwap.pairLiquidityETH).to.exist
        expect(firstSwap.token0Address).to.exist
        expect(firstSwap.token1Address).to.exist
        expect(firstSwap.token0Symbol).to.exist
        expect(firstSwap.token1Symbol).to.exist
        expect(firstSwap.token0PriceUSD).to.exist
        expect(firstSwap.token1PriceUSD).to.exist
        expect(firstSwap.token0PriceETH).to.exist
        expect(firstSwap.token1PriceETH).to.exist
        // expect(firstSwap.walletAddress).to.exist // TODO: Does not exist in sushiswap :/
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstSwap.AMM).to.exist
        expect(firstSwap.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(50000)

  it('GET / should return swaps for FTM SPIRIT_SWAP', (done) => {
    swaps
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SPIRIT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.swaps).to.exist
        expect(res.body.data.swaps.length).to.equal(LIMIT)
        expect(res.body.data.swaps[0]).to.exist
        const firstSwap = res.body.data.swaps[0] as ISwapEvent
        console.log(firstSwap)

        expect(firstSwap._id).to.exist
        expect(firstSwap.transactionAddress).to.exist
        expect(firstSwap.timestamp).to.exist
        expect(firstSwap.blockNumber).to.exist
        expect(firstSwap.to).to.exist
        expect(firstSwap.sender).to.exist
        expect(firstSwap.amountUSD).to.exist
        expect(firstSwap.amountETH).to.exist
        expect(firstSwap.amount0In).to.exist
        expect(firstSwap.amount1In).to.exist
        expect(firstSwap.amount0Out).to.exist
        expect(firstSwap.amount1Out).to.exist
        expect(firstSwap.pairAddress).to.exist
        expect(firstSwap.pairLiquidityUSD).to.exist
        expect(firstSwap.pairLiquidityETH).to.exist
        expect(firstSwap.token0Address).to.exist
        expect(firstSwap.token1Address).to.exist
        expect(firstSwap.token0Symbol).to.exist
        expect(firstSwap.token1Symbol).to.exist
        expect(firstSwap.token0PriceUSD).to.exist
        expect(firstSwap.token1PriceUSD).to.exist
        expect(firstSwap.token0PriceETH).to.exist
        expect(firstSwap.token1PriceETH).to.exist
        expect(firstSwap.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstSwap.AMM).to.exist
        expect(firstSwap.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(50000)

  it('GET / should return swaps for FTM PAINT_SWAP', (done) => {
    swaps
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.PAINT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.swaps).to.exist
        expect(res.body.data.swaps.length).to.equal(LIMIT)
        expect(res.body.data.swaps[0]).to.exist
        const firstSwap = res.body.data.swaps[0] as ISwapEvent
        console.log(firstSwap)

        expect(firstSwap._id).to.exist
        expect(firstSwap.transactionAddress).to.exist
        expect(firstSwap.timestamp).to.exist
        expect(firstSwap.blockNumber).to.exist
        expect(firstSwap.to).to.exist
        expect(firstSwap.sender).to.exist
        expect(firstSwap.amountUSD).to.exist
        expect(firstSwap.amountETH).to.exist
        expect(firstSwap.amount0In).to.exist
        expect(firstSwap.amount1In).to.exist
        expect(firstSwap.amount0Out).to.exist
        expect(firstSwap.amount1Out).to.exist
        expect(firstSwap.pairAddress).to.exist
        expect(firstSwap.pairLiquidityUSD).to.exist
        expect(firstSwap.pairLiquidityETH).to.exist
        expect(firstSwap.token0Address).to.exist
        expect(firstSwap.token1Address).to.exist
        expect(firstSwap.token0Symbol).to.exist
        expect(firstSwap.token1Symbol).to.exist
        expect(firstSwap.token0PriceUSD).to.exist
        expect(firstSwap.token1PriceUSD).to.exist
        expect(firstSwap.token0PriceETH).to.exist
        expect(firstSwap.token1PriceETH).to.exist
        expect(firstSwap.walletAddress).to.exist
        // expect(firstBurn.walletCategory).to.exist // front end
        expect(firstSwap.AMM).to.exist
        expect(firstSwap.network).to.exist
        done()
      })
      .catch((err) => done(err))
  }).timeout(50000)
})
