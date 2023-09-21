//@ts-check
import chatActions from "./chats";
import userActions from "./user";
import groupActions from "./groups";

module.exports = async function ({ req, res, log }) {
	log("Started");
	log(req.body);

	let status = { ok: false, message: "no action" };

	try {
		let payload = req.body;
		if (payload.action === "secure chatdoc") {
			status = await chatActions.secureChatDoc(payload.params);
		} else if (payload.action === "add contact") {
			status = await userActions.addContact(payload.params);
		} else if (payload.action === "delete contact") {
			status = await userActions.deleteContact(payload.params);
		} else if (payload.action === "delete message") {
			status = await userActions.deleteContact(payload.params);
		} else if (payload.action === "clear messages") {
			status = await chatActions.clearChatMessages(payload.params);
		} else if (payload.action === "add to global chat") {
			status = await groupActions.addToGlobalChat(payload.params);
		} else if (payload.action === "delete user") {
			status = await userActions.deleteUser(payload.params);
		}
	} catch (error) {
		// Handle any potential errors here
		console.error(error);
		status = { ok: false, message: "An error occurred " + error.message };
	}

	return res.json(status);
};
