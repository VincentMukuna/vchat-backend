//@ts-check
import { appSwitch } from "./switch.js";

export default async function ({ req, res, log }) {
	return appSwitch({ req, res, log });
}
