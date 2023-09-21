//@ts-check
import { Permission, Role, Query } from "node-appwrite";

import { Server } from "./config.js";
import api from "./api.js";
const db = api.provider().database;

export { clearChatMessages, secureChatDoc };

async function secureChatDoc({ docID, senderID, recepientID }) {
	const updatedPermissions = [
		Permission.read(Role.user(senderID)),
		Permission.read(Role.user(recepientID)),
		Permission.update(Role.user(senderID)),
		Permission.update(Role.user(recepientID)),
		Permission.delete(Role.user(senderID)),
	];
	try {
		const updatedDoc = await db.updateDocument(
			"64ccf0b9c1d51c33f904",
			"64d2852dbbed2b51328e",
			docID,
			{},
			updatedPermissions
		);
		return { ok: true, message: "chat secured" };
	} catch (error) {
		return { ok: false, message: error.message };
	}
}

async function clearChatMessages({ chatID }) {
	try {
		let { documents } = await db.listDocuments(
			Server.databaseID,
			Server.collectionIDChatMessages,
			[Query.equal("chatID", chatID)]
		);

		const errors = [];
		documents.forEach(async (message, i) => {
			try {
				await db.deleteDocument(
					Server.databaseID,
					Server.collectionIDChatMessages,
					message.$id
				);
			} catch (error) {
				errors.push(`Error deleting message ${i}\n.${error.message}`);
			}
		});
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDChats,
			chatID,
			{ changeLog: "clear" }
		);
		return { ok: true, message: "Delete operation complete" };
	} catch (error) {
		return {
			ok: false,
			message: `error accessing chat doc ${error.message}`,
		};
	}
}
