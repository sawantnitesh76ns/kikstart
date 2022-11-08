const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // Contracts expecting javascript object thats why we parse it
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' })
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    })

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )

})

describe('Campaign', () => {
    it('Deployes a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(factory.options.address);
    })

    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    })

    it('Allow people to contribute money and maekd them as approiver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        })

        const isContributer = await campaign.methods.approvers(accounts[1]).call;
        assert(isContributer);
    })

    it('require a minimunm contribution ', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '90',
                from: accounts[2]
            })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('Allow manager to make payment request', async () => {
        await campaign.methods
            .createRequest('Buy Batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy Batteries', request.description)
    })

    it('process request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1]);

        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance)
        assert(balance > 104)
    })
})