import api from "./api.js";
import { Models, Query } from "node-appwrite";
import { SERVER } from "./config.js";

const { database: db, storage } = api.provider();

export default interface IChatMessage extends Models.Document {
	chat: IChat | string;
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

export async function clearChatMessages({ chatID }: { chatID: string }) {
	try {
		const { documents } = await db.listDocuments(
			SERVER.DATABASE_ID,
			SERVER.COLLECTION_ID_CHAT_MESSAGES,
			[Query.equal("group", chatID), Query.limit(0)]
		);

		let messages = documents as IChatMessage[];

		messages.forEach(async (message) => {
			if (message.attachments.length > 0) {
				message.attachments.forEach((attachment) => {
					storage
						.deleteFile(
							SERVER.BUCKET_ID_CHAT_ATTACHMENTS,
							attachment
						)
						.catch((e) => {});
				});
			}
		});

		await db.updateDocument(
			SERVER.DATABASE_ID,
			SERVER.COLLECTION_ID_CHATS,
			chatID,
			{ chatMessages: [] }
		);

		return { ok: true, message: "cleared chat messages" };
	} catch (error) {
		return { ok: false, message: "Error getting chat doc" };
	}
}
