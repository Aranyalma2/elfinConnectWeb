const { Socket } = require("net");
const modbusStream = require("./modbus/Modbus");

const gatewayServerIP = process.env.GATEWAY_SERVER_IP || "localhost";
const gatewayServerPORT = process.env.GATEWAY_SERVER_PORT || "3001";
const gatewayServerTimeout = process.env.GATEWAY_SERVER_TIMEOUT || 30000;

const activeTCPConnections = new Map();

async function createConnection(userID, devicemac) {
	const existingConnectionSet = activeTCPConnections.get(getDeviceKey(userID, devicemac)) || null;
	if (existingConnectionSet) {
		return existingConnectionSet.modbusClient;
	} else {
		return new Promise((resolve, reject) => {
			const clientSocket = new Socket();

			clientSocket.connect(gatewayServerPORT, gatewayServerIP);
			clientSocket.setTimeout(parseInt(gatewayServerTimeout));
			clientSocket.on("timeout", () => {
				console.log("socket timeout");
				removeConnection(userID, devicemac);
			});
			clientSocket.on("connect", () => {
				clientSocket.write(`connme;${userID};${devicemac};1`, () => {
					clientSocket.once("data", (data) => {
						if (JSON.parse(data.toString()).status !== "success") {
							reject("Connection failed: " + JSON.parse(data.toString()).status);
						}

						//data;userID;PLACEHOLDER;PLACEHOLDER;PRIORITY;
						const modbusClient = new modbusStream.Client(`data;${userID};E0;E0;1;`);
						modbusClient.pipe(clientSocket);

						activeTCPConnections.set(getDeviceKey(userID, devicemac), { modbusClient, clientSocket });

						resolve(modbusClient);
					});
				});
			});
			clientSocket.on("error", (err) => {
				console.log("Socket error", err);
				reject(err);
			});
		});
	}
}
//Create key for collection
function getDeviceKey(userID, deviceID) {
	return `${userID}-${deviceID}`;
}

function removeConnection(userID, deviceID) {
	const key = getDeviceKey(userID, deviceID);
	const connection = activeTCPConnections.get(key);
	if (connection) {
		delete connection.modbus;
		connection.clientSocket.destroy();
		activeTCPConnections.delete(key);
	}
}

function getModbusClient(userID, deviceID) {
	return (connection = createConnection(userID, deviceID));
}

module.exports = {
	getModbusClient,
};
