/**
 * @jest-environment node
 */

const {ChainOps} = require('../dist/index');

describe ('ChainOps Oracle API', ()=>{

    it ('should retrieve the gas price for the latest block', async ()=>{

        const chainOps = new ChainOps('sandbox');
        const result = await chainOps.getGasPrice() ;

        expect(result).toHaveProperty('blockNumber');
        expect(result).toHaveProperty('timestamp');
    })

    it ('should retrieve the gas price for a given block', async ()=>{
        const blockNumber = 6815686;
        const chainOps = new ChainOps('sandbox');
        const result = await chainOps.getGasPrice(blockNumber) ;

        expect(result).toHaveProperty('blockNumber');
        expect(result.blockNumber).toEqual(blockNumber.toString());
        expect(result).toHaveProperty('timestamp');

    })
});

