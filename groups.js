//@ts-check
import { Server } from "./config.js";
import api from "./api.js";
const db = api.provider().database;

async function addToGlobalChat({ userDetailsID }) {
	try {
		//get user grouplist
		let userDetails = await db.getDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			userDetailsID
		);
		//@ts-ignore
		let userGroupListSet = new Set(JSON.parse(userDetails.groups));
		if (userGroupListSet.has(Server.documentIDGlobalChat)) {
			return { ok: false, message: "user already in group" };
		}
		//add global chat to list of groups
		userGroupListSet.add(Server.documentIDGlobalChat);

		//get globalChat group doc
		let globalChatDoc = await db.getDocument(
			Server.databaseID,
			Server.collectionIDGroups,
			Server.documentIDGlobalChat
		);
		//get the IDs of the existing members
		//@ts-ignore
		let membersListSet = new Set(JSON.parse(globalChatDoc.groupMembers));
		//add to it
		membersListSet.add(userDetailsID);
		//update doc in db
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDGroups,
			Server.documentIDGlobalChat,
			{
				groupMembers: JSON.stringify([...membersListSet]),
				changeLog: "addmember",
			}
		);
		//add to users grouplist
		await db.updateDocument(
			Server.databaseID,
			Server.collectionIDUsers,
			userDetailsID,
			{
				groups: JSON.stringify([...userGroupListSet]),
				changeLog: "addgroup",
			}
		);
		return { ok: true, message: "user added to global chat" };
	} catch (error) {
		return {
			ok: false,
			message: "error adding to global chat " + error.message,
		};
	}
}
async function createGroup({ groupAttributes }) {}
async function deleteGroup({ groupID, deleterDetailsID }) {
	//check if user is admin
	//delete group messages
	//remove groupID from members details
	//delete group doc
	//success
}
async function removeMember({ groupID, removerDetailsID, removedDetailsID }) {}
async function addMember({ groupID, adderDetailsID, addeeDetailsID }) {}

export { addToGlobalChat, deleteGroup, removeMember, addMember };
