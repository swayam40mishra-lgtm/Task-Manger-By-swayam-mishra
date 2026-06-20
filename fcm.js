import { messaging, db } from "./firebase.js";

import {
    getToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function registerDevice() {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            console.log("Notification permission denied");

            return;

        }

        const token = await getToken(messaging, {

            vapidKey: "BCQIAayDGD72lriPU7UXuE8TGyIM_mK_n6Ah4tbKW9QRIWazAGjipY8UdWqec6jiWF5zUtOQR0ckCU4CKadTLeQ"

        });

        console.log("FCM TOKEN:", token);

        await setDoc(
            doc(db, "devices", token),
            {
                token: token,
                createdAt: Date.now()
            }
        );

    }

    catch (error) {

        console.error(error);

    }

}

registerDevice();
