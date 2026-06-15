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

        /* STATUS */

        document.getElementById("tracker-status").textContent =
            data.status || "Unavailable";

        /* MESSAGE */

        document.getElementById("tracker-message").textContent =
            data.message || "Unavailable";

        /* BATTERY */

        document.getElementById("tracker-battery").textContent =
            data.battery ? data.battery + "%" : "--";

        /* DISTANCE */

        document.getElementById("tracker-distance").textContent =
            data.distance || "--";

        /* LAST SEEN */

        document.getElementById("tracker-lastseen").textContent =
            data.lastSeen || "--";

        /* NEXT FREE TIME */

        document.getElementById("tracker-nextfree").textContent =
            data.nextFree || "--";

        /* MISSIONS */

        document.getElementById("mission1").textContent =
            data.missions?.[0] || "--";

        document.getElementById("mission2").textContent =
            data.missions?.[1] || "--";

        document.getElementById("mission3").textContent =
            data.missions?.[2] || "--";

        /* THOUGHT */

        document.getElementById("tracker-thought").textContent =
            data.thought || "--";

    }

    catch (error) {

        console.error("Tracker Error:", error);

    }

}

loadTrackerData();
