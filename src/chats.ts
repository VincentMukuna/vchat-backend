import api from "./api.js";
import { Models } from "node-appwrite";
import { Server } from "./config.js";

const db = api.provider().database;
export interface IChatMessage extends Models.Document {
	chat: IChat;
	senderID: string;
	recepientID: string;
	body: string;
	read: boolean;
	attachments: string[];
}
export interface IChat extends Models.Document {
	chatMessages: IChatMessage[];
	participants: [string, string];
	changeLog?:
		| "newtext"
		| "deletetext"
		| "edittext"
		| "clearmessages"
		| "created";
}

export async function clearChatMessages({ chatId }: { chatId: string }) {
	try {
		let chatDoc = (await db.getDocument(
			Server.databaseID,
			Server.collectionIDChats,
			chatId
		)) as IChat;
		return { ok: false, message: JSON.stringify(chatDoc) };

		// chatDoc.chatMessages?.forEach(async (chat) => {
		// 	try {
		// 		await db.deleteDocument(
		// 			Server.databaseID,
		// 			Server.collectionIDChatMessages,
		// 			chat.$id
		// 		);
		// 	} catch (error) {}
		// });
		// return { ok: true, message: "cleared chat messages" };
	} catch (error: any) {
		return { ok: false, message: "Error getting chat doc" + error.mesage };
	}
}
