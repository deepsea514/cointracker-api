import Mocha from 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)
const request = chai.request('http://localhost:3000/')

describe('Testing begins!', () => {
  it('GET / should return 404', (done) => {
    request
      .get('/')
      .then((res) => {
        expect(res.status).to.eq(404)
        expect(res.body.success).to.be.false
        done()
      })
      .catch((err) => done(err))
  })
})
