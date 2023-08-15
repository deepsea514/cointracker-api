import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { CHAINS, EXCHANGES } from '../../src/constants/constants'
import { IToken } from '../../src/models/tokenSchema'

chai.use(chaiHttp)
const tokens = chai.request('http://localhost:3000/api/v1/tokens')

describe('Testing /tokens', () => {
  const LIMIT = 2

  it('GET / should return tokens for ETH UNI_SWAP', (done) => {
    tokens
      .get(`/?chainId=${CHAINS.ETH}&exchange=${EXCHANGES.UNI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        console.log(res.body.data)

        expect(res.body.data.tokens).to.exist
        expect(res.body.data.tokens.length).to.equal(LIMIT)
        expect(res.body.data.tokens[0]).to.exist
        const firstToken: IToken = res.body.data.tokens[0]
        console.log(firstToken)

        expect(firstToken._id).to.exist
        expect(firstToken.address).to.exist
        expect(firstToken.symbol).to.exist
        expect(firstToken.name).to.exist
        expect(firstToken.description).to.exist
        expect(firstToken.volume24h).to.exist
        expect(firstToken.volume24hUSD).to.exist
        expect(firstToken.volume24hETH).to.exist
        expect(firstToken.volumeChange24h).to.exist
        expect(firstToken.transactions24h).to.exist
        expect(firstToken.transactions24hChange).to.exist
        // expect(firstToken.verified).to.exist
        expect(firstToken.decimals).to.exist
        expect(firstToken.liquidityUSD).to.exist
        expect(firstToken.liquidityETH).to.exist
        expect(firstToken.liquidityChange24h).to.exist
        // expect(firstToken.logoURI).to.exist
        expect(firstToken.priceUSD).to.exist
        expect(firstToken.priceETH).to.exist
        expect(firstToken.priceChange24h).to.exist
        expect(firstToken.priceUSDChange24h).to.exist
        expect(firstToken.priceETHChange24h).to.exist
        // expect(firstToken.timestamp).to.exist
        // expect(firstToken.blockNumber).to.exist
        expect(firstToken.AMM).to.exist
        expect(firstToken.network).to.exist

        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return tokens for BSC PANCAKE_SWAP', (done) => {
    tokens
      .get(`/?chainId=${CHAINS.BSC}&exchange=${EXCHANGES.PANCAKE_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        console.log(res.body.data)

        expect(res.body.data.tokens).to.exist
        expect(res.body.data.tokens.length).to.equal(LIMIT)
        expect(res.body.data.tokens[0]).to.exist
        const firstToken: IToken = res.body.data.tokens[0]
        console.log(firstToken)

        expect(firstToken._id).to.exist
        expect(firstToken.address).to.exist
        expect(firstToken.symbol).to.exist
        expect(firstToken.name).to.exist
        expect(firstToken.description).to.exist
        expect(firstToken.volume24h).to.exist
        expect(firstToken.volume24hUSD).to.exist
        expect(firstToken.volume24hETH).to.exist
        expect(firstToken.volumeChange24h).to.exist
        expect(firstToken.transactions24h).to.exist
        expect(firstToken.transactions24hChange).to.exist
        // expect(firstToken.verified).to.exist
        expect(firstToken.decimals).to.exist
        expect(firstToken.liquidityUSD).to.exist
        expect(firstToken.liquidityETH).to.exist
        expect(firstToken.liquidityChange24h).to.exist
        // expect(firstToken.logoURI).to.exist
        expect(firstToken.priceUSD).to.exist
        expect(firstToken.priceETH).to.exist
        expect(firstToken.priceChange24h).to.exist
        expect(firstToken.priceUSDChange24h).to.exist
        expect(firstToken.priceETHChange24h).to.exist
        // expect(firstToken.timestamp).to.exist
        // expect(firstToken.blockNumber).to.exist
        expect(firstToken.AMM).to.exist
        expect(firstToken.network).to.exist

        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return tokens for FTM SUSHI_SWAP', (done) => {
    tokens
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SUSHI_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        console.log(res.body.data)

        expect(res.body.data.tokens).to.exist
        expect(res.body.data.tokens.length).to.equal(LIMIT)
        expect(res.body.data.tokens[0]).to.exist
        const firstToken: IToken = res.body.data.tokens[0]
        console.log(firstToken)

        expect(firstToken._id).to.exist
        expect(firstToken.address).to.exist
        expect(firstToken.symbol).to.exist
        expect(firstToken.name).to.exist
        expect(firstToken.description).to.exist
        expect(firstToken.volume24h).to.exist
        expect(firstToken.volume24hUSD).to.exist
        expect(firstToken.volume24hETH).to.exist
        expect(firstToken.volumeChange24h).to.exist
        expect(firstToken.transactions24h).to.exist
        expect(firstToken.transactions24hChange).to.exist
        // expect(firstToken.verified).to.exist
        expect(firstToken.decimals).to.exist
        expect(firstToken.liquidityUSD).to.exist
        expect(firstToken.liquidityETH).to.exist
        expect(firstToken.liquidityChange24h).to.exist
        // expect(firstToken.logoURI).to.exist
        expect(firstToken.priceUSD).to.exist
        expect(firstToken.priceETH).to.exist
        expect(firstToken.priceChange24h).to.exist
        expect(firstToken.priceUSDChange24h).to.exist
        expect(firstToken.priceETHChange24h).to.exist
        // expect(firstToken.timestamp).to.exist
        // expect(firstToken.blockNumber).to.exist
        expect(firstToken.AMM).to.exist
        expect(firstToken.network).to.exist

        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return tokens for FTM SPIRIT_SWAP', (done) => {
    tokens
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.SPIRIT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        console.log(res.body.data)

        expect(res.body.data.tokens).to.exist
        expect(res.body.data.tokens.length).to.equal(LIMIT)
        expect(res.body.data.tokens[0]).to.exist
        const firstToken: IToken = res.body.data.tokens[0]
        expect(firstToken._id).to.exist
        expect(firstToken.address).to.exist
        expect(firstToken.symbol).to.exist
        expect(firstToken.name).to.exist
        expect(firstToken.description).to.exist
        expect(firstToken.volume24h).to.exist
        expect(firstToken.volume24hUSD).to.exist
        expect(firstToken.volume24hETH).to.exist
        expect(firstToken.volumeChange24h).to.exist
        expect(firstToken.transactions24h).to.exist
        expect(firstToken.transactions24hChange).to.exist
        // expect(firstToken.verified).to.exist
        expect(firstToken.decimals).to.exist
        expect(firstToken.liquidityUSD).to.exist
        expect(firstToken.liquidityETH).to.exist
        expect(firstToken.liquidityChange24h).to.exist
        // expect(firstToken.logoURI).to.exist
        expect(firstToken.priceUSD).to.exist
        expect(firstToken.priceETH).to.exist
        expect(firstToken.priceChange24h).to.exist
        expect(firstToken.priceUSDChange24h).to.exist
        expect(firstToken.priceETHChange24h).to.exist
        // expect(firstToken.timestamp).to.exist
        // expect(firstToken.blockNumber).to.exist
        expect(firstToken.AMM).to.exist
        expect(firstToken.network).to.exist

        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)

  it('GET / should return tokens for FTM PAINT_SWAP', (done) => {
    tokens
      .get(`/?chainId=${CHAINS.FTM}&exchange=${EXCHANGES.PAINT_SWAP}&limit=${LIMIT}`)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        console.log(res.body.data)

        expect(res.body.data.tokens).to.exist
        expect(res.body.data.tokens.length).to.equal(LIMIT)
        expect(res.body.data.tokens[0]).to.exist
        const firstToken: IToken = res.body.data.tokens[0]
        expect(firstToken._id).to.exist
        expect(firstToken.address).to.exist
        expect(firstToken.symbol).to.exist
        expect(firstToken.name).to.exist
        expect(firstToken.description).to.exist
        expect(firstToken.volume24h).to.exist
        expect(firstToken.volume24hUSD).to.exist
        expect(firstToken.volume24hETH).to.exist
        expect(firstToken.volumeChange24h).to.exist
        expect(firstToken.transactions24h).to.exist
        expect(firstToken.transactions24hChange).to.exist
        // expect(firstToken.verified).to.exist
        expect(firstToken.decimals).to.exist
        expect(firstToken.liquidityUSD).to.exist
        expect(firstToken.liquidityETH).to.exist
        expect(firstToken.liquidityChange24h).to.exist
        // expect(firstToken.logoURI).to.exist
        expect(firstToken.priceUSD).to.exist
        expect(firstToken.priceETH).to.exist
        expect(firstToken.priceChange24h).to.exist
        expect(firstToken.priceUSDChange24h).to.exist
        expect(firstToken.priceETHChange24h).to.exist
        // expect(firstToken.timestamp).to.exist
        // expect(firstToken.blockNumber).to.exist
        expect(firstToken.AMM).to.exist
        expect(firstToken.network).to.exist

        done()
      })
      .catch((err) => done(err))
  }).timeout(30_000)
})
