import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadTrackerData() {

    try {

        const docRef = doc(db, "tracker", "live");

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {

            console.log("Tracker document not found");
            return;

        }

        const data = docSnap.data();

        console.log(data);

        document.getElementById("tracker-status").textContent =
            data.status || "Unavailable";

        document.getElementById("tracker-message").textContent =
            data.message || "Unavailable";

        document.getElementById("tracker-battery").textContent =
            data.battery ? data.battery + "%" : "--";

        document.getElementById("tracker-distance").textContent =
            data.distance || "--";

        document.getElementById("tracker-lastseen").textContent =
            data["last seen"] || "--";

    }

    catch (error) {

        console.error("Tracker Error:", error);

    }

}

loadTrackerData();
