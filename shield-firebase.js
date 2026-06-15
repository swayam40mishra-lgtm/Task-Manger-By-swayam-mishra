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

            alert("Button Click Detected");

            const shieldRef = doc(db, "shield", "current");

            await updateDoc(shieldRef, {

                active: true,
                time: new Date().toLocaleString(),
                message: "Emergency Alert Triggered"

            });

            alert("Firebase Updated");

            console.log("Shield Alert Sent");

        }

        catch(error) {

            alert("ERROR: " + error.message);

            console.error(error);

        }

    });

});
