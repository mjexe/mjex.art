class Network {
	constructor(data) {
		this.data = data;
	}
}

class NSwitch {
	constructor(data, parent) {
		this.data = data;
		this.parent = parent;
	}
}

class Camera {
	constructor(data) {
		this.data = data;
		this.parent = parent;
	}
}

class Device {
	constructor(type, parent, data) {
		this.type = type;
		this.parent = parent;
		this.data = data;

		this.id = self.crypto.randomUUID().substring(0, 8);
		this.ports = [];
	}

	addConnection(port, type, data) {
		this.ports[port] = {'data': data, 'device': new Device(type, this)};
	}
}

export {Network, NSwitch, Camera, Device}
