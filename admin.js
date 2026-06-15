import { db } from "./firebase.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", async () => {

    try {

        await updateDoc(
            doc(db, "tracker", "live"),
            {
                status: document.getElementById("status").value,
                message: document.getElementById("message").value,
                battery: Number(document.getElementById("battery").value),
                distance: document.getElementById("distance").value,
                "last seen": document.getElementById("lastseen").value
            }
        );

        alert("Tracker Updated Successfully");

    } catch (error) {

        console.error(error);

        alert("Update Failed");

    }

});
