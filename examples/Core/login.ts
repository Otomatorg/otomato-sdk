import { CHAINS, apiServices } from '../../src/index.js';

const main = async () => {
    const address = "0x9b1E25bBbee162A26B67B1fb00cf4d67157656F6"
    let payload = await apiServices.generateLoginPayload(address, CHAINS.ETHEREUM, "abcdef");

    // we replace the payload to fit the signature, don't do that in your implementation
    const signature = '0x92a3b551ff2bc2eb9a3537a0b477af14c33e649c3479c204bb0a4da95bfee89e4ae966e5d555d34c5dfcf3899910c58e936375634f5b0f58978139d25b5b54761b';
    payload = {
        address: '0x9b1E25bBbee162A26B67B1fb00cf4d67157656F6',
        chain_id: '1',
        domain: 'otomato-test.netlify.app',
        expiration_time: '2024-07-16T16:57:34.363Z',
        invalid_before: '2024-07-16T15:57:34.363Z',
        issued_at: '2024-07-16T16:27:34.363Z',
        nonce: '0x4ed46b76a2ccb458bc84bfc3f8aeb43bbc6a2b2f1ae5ee9f10c13ba6bd05f832',
        statement: 'Please ensure that the domain above matches the URL of the current website.',
        version: '1'
    }

    const { token } = await apiServices.getToken(payload, signature);
    const verify = await apiServices.verifyToken(token);
    console.log(token)
    console.log(verify)
}

main();
