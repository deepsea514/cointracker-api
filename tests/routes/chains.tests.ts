import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { IChain } from '../../src/models/chainSchema'

chai.use(chaiHttp)
const chains = chai.request('http://localhost:3000/api/v1/chains')

describe('Testing begins!', () => {
  it('GET / should return chains', (done) => {
    chains
      .get('/')
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
        expect(res.body.data).to.exist
        expect(res.body.data.chains).to.exist
        expect(res.body.data.chains[0]).to.exist
        const firstChain = res.body.data.chains[0] as IChain
        expect(firstChain.name).exist
        expect(firstChain.symbol).exist
        expect(firstChain.chainId).exist
        done()
      })
      .catch((err) => done(err))
  })
})
