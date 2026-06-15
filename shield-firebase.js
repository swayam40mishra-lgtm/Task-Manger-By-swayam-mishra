import { db } from "./firebase.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const shieldBtn = document.getElementById("shield-btn");

    if (!shieldBtn) return;

    shieldBtn.addEventListener("click", async () => {

        try {

            const shieldRef = doc(db, "shield", "current");

            await updateDoc(shieldRef, {

                active: true,
                time: new Date().toLocaleString(),
                message: "Emergency Alert Triggered"

            });

            console.log("Shield Alert Sent");

        }

        catch(error) {

            console.error(error);

        }

    });

});
