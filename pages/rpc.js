import { Rpc } from "../rpc.js"

const component = createElement('div.row.rpc-page', {}, createElement('h2', {text: 'RPC'}))

const rpc = new Rpc(`wontolla-client.anvil.app/_/api/call`)



const result = await rpc.call("test", {'email':"uffeat@gmail.com"});
console.log(`Result: ${JSON.stringify(result)}`);

rpc.call("test", {'email':"uffeat@gmail.com"}, (result) =>
  console.log(`Callback got result: ${JSON.stringify(result)}`)
);

export {component}