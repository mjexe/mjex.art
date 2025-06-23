//Written from scratch by Max Lessard 6/8/25
import {Network, Device} from './classes.js';

// var network = new Network();
let network = {};

network['10.29.17.0'] = new Device('switch', null);
network['10.29.17.0'].data = {
	'name': 'Switch 17 Pit 4 Pillar 2 Switch A',
	'shorthand': 'PIT4P2A',
	'zone': 'Pit 4',
	'location': 'Pit 4 Pillar 2',
	'switch#': 'Switch A',
	'subnet': '10.29.17.0',
}

network['10.29.17.0'].addConnection(1, 'camera');

console.log(network)
// console.log(sw17);
