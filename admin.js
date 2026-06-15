import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
REFERENCES
========================= */

const trackerRef = doc(db, "tracker", "live");

const quietRef = doc(db, "quietMode", "current");

const shieldRef = doc(db, "shield", "current");

/* =========================
LOAD EXISTING TRACKER DATA
========================= */

async function loadTrackerData() {

try {

    const snap = await getDoc(trackerRef);

    if (!snap.exists()) return;

    const data = snap.data();

    document.getElementById("status").value =
        data.status || "";

    document.getElementById("message").value =
        data.message || "";

    document.getElementById("battery").value =
        data.battery ?? "";

    document.getElementById("distance").value =
        data.distance || "";

    document.getElementById("lastseen").value =
        data.lastSeen || "";

    document.getElementById("nextfree").value =
        data.nextFree || "";

    document.getElementById("mission1").value =
        data.missions?.[0] || "";

    document.getElementById("mission2").value =
        data.missions?.[1] || "";

    document.getElementById("mission3").value =
        data.missions?.[2] || "";

    document.getElementById("thought").value =
        data.thought || "";

}

catch (error) {

    console.error("Load Error:", error);

}

}

loadTrackerData();

/* =========================
SAVE BUTTON
========================= */

const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", async () => {

try {

    const now = new Date().toLocaleString();

    await updateDoc(trackerRef, {

        status:
            document.getElementById("status").value,

        message:
            document.getElementById("message").value,

        battery:
            Number(
                document.getElementById("battery").value
            ),

        distance:
            document.getElementById("distance").value,

        lastSeen:
            now,

        nextFree:
            document.getElementById("nextfree").value,

        missions: [

            document.getElementById("mission1").value,

            document.getElementById("mission2").value,

            document.getElementById("mission3").value

        ],

        thought:
            document.getElementById("thought").value

    });

    document.getElementById("lastseen").value = now;

    alert("Tracker Updated Successfully");

}

catch (error) {

    console.error(error);

    alert("Update Failed");

}

});

/* =========================
QUIET MODE MONITOR
========================= */

onSnapshot(quietRef, (snap) => {

if (!snap.exists()) return;

const data = snap.data();

if (data.active) {

    document.getElementById("quiet-alert").textContent =
        data.type || "Unknown";

    document.getElementById("quiet-time").textContent =
        data.time || "--";

}

else {

    document.getElementById("quiet-alert").textContent =
        "No Active Alert";

    document.getElementById("quiet-time").textContent =
        "--";

}

});

/* =========================
SHIELD MONITOR
========================= */

onSnapshot(shieldRef, (snap) => {

if (!snap.exists()) return;

const data = snap.data();

if (data.status === "active") {

    document.getElementById("shield-alert").textContent =
        data.message || "Emergency Alert";

    let formattedTime = "--";

    try {

        if (data.updatedAt?.toDate) {

            formattedTime =
                data.updatedAt
                    .toDate()
                    .toLocaleString();

        }

    }

    catch (error) {

        console.log(error);

    }

    document.getElementById("shield-time").textContent =
        formattedTime;

}

else {

    document.getElementById("shield-alert").textContent =
        "No Emergency Alert";

    document.getElementById("shield-time").textContent =
        "--";

}

});
