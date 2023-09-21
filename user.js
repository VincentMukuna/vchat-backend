//@ts-check
import { Permission, Role, ID } from "node-appwrite";
import { Server } from "./config.js";
import * as chatActions from "./chats.js";
import api from "./api.js";

export { addContact, deleteContact, deleteUser };

const { database: db, users: user } = api.provider();

async function addContact({ adderDetailsID, addeeDetailsID }) {
	try {
		//get current contact details
		let adderDetails = await db.getDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			adderDetailsID
		);

		let addeeDetails = await db.getDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			addeeDetailsID
		);

		let adderContactList = new Map(
			//@ts-ignore
			Object.entries(JSON.parse(adderDetails.contacts || "{}"))
		);
		let addeeContactList = new Map(
			//@ts-ignore
			Object.entries(JSON.parse(addeeDetails.contacts || "{}"))
		);

		//check if the contacts exist
		if (adderContactList.has(addeeDetailsID)) {
			return { ok: false, message: "contact exist in your list" };
		}
		if (addeeContactList.has(adderDetailsID)) {
			return { ok: false, message: "contact exist in their list" };
		}
		//create chat
		let chatDoc = await db.createDocument(
			Server.databaseID,
			Server.collectionIDChats,
			ID.unique(),
			{ participants: [adderDetails.$id, addeeDetails.$id] },
			[
				//@ts-ignore
				Permission.read(Role.user(addeeDetails.userID)),
				//@ts-ignore
				Permission.read(Role.user(adderDetails.userID)),
				//@ts-ignore
				Permission.update(Role.user(addeeDetails.userID)),
				//@ts-ignore
				Permission.update(Role.user(adderDetails.userID)),
			]
		);

		//new contactlist
		let newAdderContactList = Object.fromEntries(
			adderContactList.set(addeeDetails.$id, chatDoc.$id)
		);
		let newAddeeContactList = Object.fromEntries(
			addeeContactList.set(adderDetails.$id, chatDoc.$id)
		);

		//upddate adder's details
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			adderDetailsID,
			{
				contacts: JSON.stringify(newAdderContactList),
				changeLog: "addcontact",
			}
		);
		//update addee's contact list
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			addeeDetailsID,
			{
				contacts: JSON.stringify(newAddeeContactList),
				changeLog: "addcontact",
			}
		);

		//success
		return {
			ok: true,
			//@ts-ignore
			message: `Success! You can now message ${addeeDetails.name} on this chat ${chatDoc.$id}`,
		};
	} catch (error) {
		return {
			ok: false,
			message: `some error  ${JSON.stringify(error)} `,
		};
	}
}

async function deleteContact({ deleterDetailsID, deleteeDetailsID }) {
	try {
		//get details doc
		const deleterDetails = await db.getDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			deleterDetailsID
		);
		const deleteeDetails = await db.getDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			deleteeDetailsID
		);

		//extract contact lists
		const deleterContacts = new Map(
			//@ts-ignore
			Object.entries(JSON.parse(deleterDetails.contacts))
		);
		const deleteeContacts = new Map(
			//@ts-ignore
			Object.entries(JSON.parse(deleteeDetails.contacts))
		);

		//check if contacts exist in either contactlists

		if (!deleterContacts.has(deleteeDetailsID)) {
			return {
				ok: false,
				//@ts-ignore
				message: `Seems ${deleteeDetails.name}'s contact isn't on your list anymore `,
			};
		}
		if (!deleteeContacts.has(deleterDetailsID)) {
			return {
				ok: false,
				//@ts-ignore
				message: `Your contact isn't on ${deleteeDetails.name}'s list anymore `,
			};
		}

		//delete chat messages and chatDoc
		let chatID = deleterContacts.get(deleteeDetailsID);

		//delete messages
		await chatActions.clearChatMessages({ chatID });

		//delete chatDoc
		await db.deleteDocument(
			Server.databaseID,
			Server.collectionIDChats,
			chatID
		);
		//remove contact from list
		deleterContacts.delete(deleteeDetailsID);
		deleteeContacts.delete(deleterDetailsID);

		let newDeleterContactsList = JSON.stringify(
			Object.fromEntries(deleterContacts)
		);
		let newDeleteeContactsList = JSON.stringify(
			Object.fromEntries(deleteeContacts)
		);

		//update both deleter's and deletee's docs in database
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			deleterDetailsID,
			{ contacts: newDeleterContactsList, changeLog: "deletecontact" }
		);
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			deleteeDetailsID,
			{ contacts: newDeleteeContactsList, changeLog: "deletecontact" }
		);
		//success
		return {
			ok: true,
			message: `Contact deleted sucessfully`,
		};
	} catch (error) {
		return { ok: false, message: error.message };
	}
}
async function deleteUser({ userID }) {
	try {
		user.delete(userID);
		return { ok: true, message: "User deleted" };
	} catch (error) {
		return { ok: false, message: "Error deleting user " + error.message };
	}
}
