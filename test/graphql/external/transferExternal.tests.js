// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// Testes
describe('Transfer', () => {
    describe('POST /transfers', () => {
        let token;
        beforeEach(async () => {
            const loginUser = require('../fixture/requisicoes/login/loginUser.json');
            const respostaLogin = await request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            loginUser(username: "julio", password: "123456") {
                                token
                            }
                        }
                    `
                });
            token = respostaLogin.body.data.loginUser.token;
        });

        it('Deve retornar erro: "Saldo insuficiente"', async () => {
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `
                        mutation {
                            createTransfer(from: "julio", to: "priscila", value: 50000) {
                                from
                                to
                                value
                                date
                            }
                        }
                    `
                });
            expect(resposta.body.errors).to.be.an('array').that.is.not.empty;
            expect(resposta.body.errors[0].message).to.equal("Saldo insuficiente");
            expect(resposta.status).to.equal(200);
        });
        
        beforeEach(() => {
            createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json');

        });

        it('Validar que é possivel transferir dinheiro entre duas contas', async () => {
            const createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json');
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.data.createTransfer.from).to.equal("julio");
            expect(resposta.body.data.createTransfer.to).to.equal("priscila");
            expect(resposta.body.data.createTransfer.value).to.equal(15);
        });

        it('Deve retornar erro quando o token não é informado', async () => {
            const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            createTransfer(from: "julio", to: "priscila", value: 100) {
                                from
                                to
                                value
                                date
                            }
                        }
                    `
                });
            expect(resposta.body.errors).to.be.an('array').that.is.not.empty;
            expect(resposta.status).to.equal(200);
        });
    });
});