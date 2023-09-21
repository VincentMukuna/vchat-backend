//@ts-check
import { appSwitch } from "./switch.js";

export default async function ({ req, res, log }) {
	appSwitch({ req, res, log });
}
