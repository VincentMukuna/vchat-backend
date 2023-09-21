import { addContact, deleteContact, deleteUser } from "./user.js";
import { secureChatDoc, clearChatMessages } from "./chats.js";
import { addToGlobalChat } from "./groups.js";
export async function appSwitch({ req, res, log }) {
	let status = { ok: false, message: "no action" };
	log("Body: ", req.body || req.bodyRaw);

	log(JSON.stringify(req.body));

	try {
		let payload = JSON.parse(req.body);
		log("payload " + JSON.stringify(payload));
		if (payload.action === "secure chatdoc") {
			status = await secureChatDoc(payload.params);
		} else if (payload.action === "add contact") {
			status = await addContact(payload.params);
		} else if (payload.action === "delete contact") {
			status = await deleteContact(payload.params);
		} else if (payload.action === "delete message") {
			status = await deleteContact(payload.params);
		} else if (payload.action === "clear messages") {
			status = await clearChatMessages(payload.params);
		} else if (payload.action === "add to global chat") {
			status = await addToGlobalChat(payload.params);
		} else if (payload.action === "delete user") {
			status = await deleteUser(payload.params);
		}
	} catch (error) {
		// Handle any potential errors here
		console.error(error);
		status = { ok: false, message: "An error occurred " + error.message };
	}

	log(status);

	return res.json(status);
}
