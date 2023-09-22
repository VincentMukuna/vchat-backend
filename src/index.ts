//@ts-check
import { appSwitch } from "./switch.js";

export default async function ({ req, res, log }: any) {
	return appSwitch({ req, res, log });
}
