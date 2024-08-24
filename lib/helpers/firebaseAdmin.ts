import * as firebaseAdmin from "firebase-admin";
import { firebaseConfig } from "@/lib/helpers/firebase";

if (!firebaseAdmin.apps.length) {
	const { privateKey } = JSON.parse(
		process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY ?? ""
	);
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			privateKey: privateKey,
			clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
			projectId: "eb-portfolio-game",
		}),
		databaseURL: firebaseConfig.databaseURL,
	});
}

export { firebaseAdmin };
