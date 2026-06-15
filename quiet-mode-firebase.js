import { db } from "./firebase.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const migraineBtn = document.getElementById("migraine-btn");
    const periodBtn = document.getElementById("period-btn");

    async function sendQuietMode(type) {

        try {

            const quietRef = doc(db, "quietMode", "current");

            await updateDoc(quietRef, {

                active: true,
                type: type,
                time: new Date().toLocaleString()

            });

            console.log("Quiet Mode Alert Sent");

        }

        catch(error) {

            console.error(error);

        }

    }

    if (migraineBtn) {

        migraineBtn.addEventListener("click", async () => {

            await sendQuietMode("migraine");

        });

    }

    if (periodBtn) {

        periodBtn.addEventListener("click", async () => {

            await sendQuietMode("period");

        });

    }

});
