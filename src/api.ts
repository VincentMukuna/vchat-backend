import { Databases, Users, Client, Storage } from "node-appwrite";
import { SERVER } from "./config.js";

let api = {
	sdk: null as null | {
		appwrite: Client;
		database: Databases;
		users: Users;
		storage: Storage;
	},

	provider: () => {
		if (api.sdk) {
			return api.sdk;
		}

		const appwrite = new Client();
		appwrite
			.setEndpoint(SERVER.ENDPOINT)
			.setProject(SERVER.PROJECT_ID)
			.setKey(process.env.APPWRITE_API_KEY as string);
		const users = new Users(appwrite);
		const database = new Databases(appwrite);
		const storage = new Storage(appwrite);

		api.sdk = { appwrite, database, users, storage };
		return api.sdk;
	},
};

export default api;
