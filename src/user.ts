import api from "./api.js";
import { Server } from "./config.js";

const { users, database } = api.provider();
export async function deleteUser({ userID }: { userID: string }) {
	try {
		let prefs: any = await users.getPrefs(userID);
		if (prefs.detailsDocID) {
			database.deleteDocument(
				Server.databaseID,
				Server.collectionIDUsers,
				prefs.detailsDocID
			);
		}

		await users.delete(userID);
		return { ok: true, message: "user deleted" };
	} catch (error: any) {
		return { ok: true, message: `Error deleting user ${error.message}` };
	}
}
