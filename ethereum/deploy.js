//Thise module help to connect with any outside Node / APT / Network
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')


//This will connect to metamsk rinkbey network
const provider = new HDWalletProvider(
    'basket raise employ piano senior can robust budget actual quote shove panel',
    'https://rinkeby.infura.io/v3/daffa8f6dd5d42479cf903d0ce4c1b3a'
);

const web3 = new Web3(provider);
const web3q = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from acount  ', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] })

    console.log(compiledFactory.interface)
    console.log('Contract deploy to -> ', result.options.address);
    provider.engine.stop();

};
deploy();


