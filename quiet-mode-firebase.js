
import { db } from "./firebase.js";
alert("quiet-mode-firebase loaded");
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
    type: "TEST",
    time: "HELLO"

});

alert("Firebase write completed");

        }

          catch(error) {

    alert("ERROR: " + error.message);

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
