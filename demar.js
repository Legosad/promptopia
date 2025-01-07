document.querySelector("#ncc-more-info").addEventListener("click", (event) => {
    event.preventDefault();

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.append(overlay);

    // Create the popup
    const popUp = document.createElement("div");
    popUp.textContent = "This is a dynamically generated pop-up";
    popUp.classList.add("popup");
    document.body.append(popUp);

    // Blur the main content
    document.querySelector(".entry-content").classList.add("body-blurred");

    // Show the overlay and popup with fade-in effect
    overlay.style.display = "block";
    popUp.style.display = "block";
    setTimeout(() => {
        popUp.style.opacity = "1"; // Trigger the fade-in effect
    }, 10);

    // Close the popup when the overlay is clicked
    overlay.addEventListener("click", () => {
        popUp.style.opacity = "0"; // Fade-out effect
        setTimeout(() => {
            popUp.remove();
            overlay.remove();
            document.querySelector(".entry-content").classList.remove("body-blurred");
        }, 300); // Match the transition duration
    });
});
