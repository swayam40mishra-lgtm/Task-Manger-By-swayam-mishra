import { doc, updateDoc } from "firebase/firestore";

const shieldRef = doc(db, "shield", "current");

document.getElementById("shield-btn").addEventListener("click", async () => {
    console.log("CLICK WORKING");

    try {
        await updateDoc(shieldRef, {
            status: "active",
            updatedAt: new Date()
        });

        alert("Updated successfully ❤️");

    } catch (err) {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
    }
});
