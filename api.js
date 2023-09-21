import { Databases, Users, Client, Storage } from "node-appwrite";
import { Server } from "./config.js";

/**
 * @typedef {Object} SDKType
 * @property {Client} appwrite - The Appwrite Client instance.
 * @property {Databases} database - The Databases instance.
 * @property {Users} users - The Users instance.
 * @property {Storage} storage - The Storage instance.
 */

let api = {
	/** @type {SDKType | null} */
	sdk: null,

	/**
	 * Provides the SDK instance or creates a new one if it doesn't exist.
	 * @returns {SDKType} The SDK instance.
	 */
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

		api.sdk = { appwrite, database, users, storage };
		return api.sdk;
	},
};

export default api;
