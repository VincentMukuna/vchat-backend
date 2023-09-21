const { Databases, Users, Client, Storage } = require("node-appwrite");
const Server = require("./config");

let api = {
	sdk: null,

	provider: () => {
		if (api.sdk) {
			return api.sdk;
		}

		const appwrite = new Client();
		appwrite
			.setEndpoint(Server.endpoint)
			.setProject(Server.projectID)
			.setKey(process.env.APPWRITE_API_KEY);
		const users = new Users(appwrite);
		const database = new Databases(appwrite);
		const storage = new Storage(appwrite);

		this.sdk = { appwrite, database, users, storage };
		return this.sdk;
	},
};

module.exports = api;
