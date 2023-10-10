import api from "./api.js";
import { SERVER } from "./config.js";

const { users, database } = api.provider();
export async function deleteUser({ userID }: { userID: string }) {
	try {
		let prefs: any = await users.getPrefs(userID);
		if (prefs.detailsDocID) {
			database.deleteDocument(
				SERVER.DATABASE_ID,
				SERVER.COLLECTION_ID_USERS,
				prefs.detailsDocID
			);
		}

		await users.delete(userID);
		return { ok: true, message: "user deleted" };
	} catch (error: any) {
		return { ok: true, message: `Error deleting user ${error.message}` };
	}
}
