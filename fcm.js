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

        alert("FCM STARTED");

        alert("Current Permission: " + Notification.permission);

        const permission = await Notification.requestPermission();

        alert("After Request: " + permission);

        if (permission !== "granted") {

            alert("Permission not granted");
            return;

        }

        const token = await getToken(messaging, {
            vapidKey: "BCQIAayDGD72lriPU7UXuE8TGyIM_mK_n6Ah4tbKW9QRIWazAGjipY8UdWqec6jiWF5zUtOQR0ckCU4CKadTLeQ"
        });

        alert("TOKEN GENERATED");

        console.log("FCM TOKEN:", token);

        await setDoc(
            doc(db, "devices", token),
            {
                token: token,
                createdAt: Date.now()
            }
        );

        alert("SAVED TO FIRESTORE");

    }

    catch (error) {

        alert("ERROR: " + error.message);
        console.error(error);

    }

}

registerDevice();

