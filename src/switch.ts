import { clearChatMessages } from "./chats.js";
import { deleteUser } from "./user.js";
export interface IStatus {
	ok: boolean;
	message: string;
}
export async function appSwitch({ req, res, log }: any) {
	let status: IStatus = { ok: false, message: "no action" };
	try {
		let payload = JSON.parse(req.body);
		log(payload);

		if (payload.action === "clear chat messages") {
			status = await clearChatMessages(payload.params);
		} else if (payload.action === "delete user") {
			status = await deleteUser(payload.params);
		}
	} catch (error: any) {
		// Handle any potential errors here
		log(error);
		status = { ok: false, message: "An error occurred " + error.message };
	}

	log(status);

	return res.json(status);
}
