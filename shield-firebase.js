import { db } from "./firebase.js";
import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const shieldRef = doc(db, "shield", "current");

document.getElementById("shield-btn").addEventListener("click", async () => {
    console.log("CLICK WORKING");

    try {
        await setDoc(shieldRef, {
            status: "active",
            updatedAt: new Date(),
            message: "Emergency Alert Triggered"
        }, { merge: true });

        alert("Updated successfully ❤️");

    } catch (err) {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
    }
});
