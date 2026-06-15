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
        data.battery !== undefined
            ? data.battery + "%"
            : "--";

    document.getElementById("tracker-distance").textContent =
        data.distance || "--";

    document.getElementById("tracker-lastseen").textContent =
        data.lastSeen || "--";

    document.getElementById("tracker-nextfree").textContent =
        data.nextFree || "--";

    document.getElementById("mission1").textContent =
        data.missions?.[0] || "--";

    document.getElementById("mission2").textContent =
        data.missions?.[1] || "--";

    document.getElementById("mission3").textContent =
        data.missions?.[2] || "--";

    document.getElementById("tracker-thought").textContent =
        data.thought || "--";

}

catch (error) {

    console.error("Tracker Error:", error);

}

}

loadTrackerData();
