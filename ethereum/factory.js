import web3 from "./web3";
import campaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(JSON.parse(campaignFactory.interface), '0xE9520EcF26C19413026A53Aba1a47b0030B8a7b5')

export default instance;



