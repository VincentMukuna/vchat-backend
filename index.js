//@ts-check
import chatActions from "./chats";
import userActions from "./user";
import groupActions from "./groups";
import { appSwitch } from "./switch";

module.exports = async function ({ req, res, log }) {
	appSwitch({ req, res, log });
};
