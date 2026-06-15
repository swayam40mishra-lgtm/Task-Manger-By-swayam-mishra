import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const trackerRef = doc(db, "tracker", "live");

/* =========================
   LOAD EXISTING DATA
   ========================= */

async function loadData() {

    try {

        const snap = await getDoc(trackerRef);

        if (!snap.exists()) return;

        const data = snap.data();

        document.getElementById("status").value =
            data.status || "";

        document.getElementById("message").value =
            data.message || "";

        document.getElementById("battery").value =
            data.battery || "";

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

    } catch (error) {

        console.error("Load Error:", error);

    }

}

loadData();

/* =========================
   SAVE DATA
   ========================= */

const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", async () => {

    try {

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
                new Date().toLocaleString(),

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

        alert("Tracker Updated Successfully");

        document.getElementById("lastseen").value =
            new Date().toLocaleString();

    }

    catch (error) {

        console.error(error);

        alert("Update Failed");

    }

});

/* =========================
   REALTIME ALERT MONITOR
   ========================= */

onSnapshot(trackerRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    /* Quiet Alert */

    if (data.quietAlert?.type) {

        document.getElementById("quiet-alert").textContent =
            data.quietAlert.type;

        document.getElementById("quiet-time").textContent =
            data.quietAlert.time || "--";

    } else {

        document.getElementById("quiet-alert").textContent =
            "No Active Alert";

        document.getElementById("quiet-time").textContent =
            "--";

    }

    /* Shield Alert */

    if (data.shieldAlert?.active) {

        document.getElementById("shield-alert").textContent =
            "⚠️ Emergency Active";

        document.getElementById("shield-time").textContent =
            data.shieldAlert.time || "--";

    } else {

        document.getElementById("shield-alert").textContent =
            "No Emergency Alert";

        document.getElementById("shield-time").textContent =
            "--";

    }

});
