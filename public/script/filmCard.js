export function filmCard(elementId, { title, release_date, poster_path, overview }) {
    const year = release_date ? release_date.split("-")[0] : "N/A";
    const container = document.getElementById(elementId);

    let modal = document.getElementById("film-modal");

    if (!modal) {
        modal = document.createElement("dialog");
        modal.id = "film-modal";
        modal.innerHTML = `
            <div class="modal-content">
                <img class="modal-poster" alt="">
                <div class="modal-info">
                    <h2 class="modal-title"></h2>
                    <p class="modal-year"></p>
                    <p class="modal-overview"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    }

    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = document.createElement("img");
    poster.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
    poster.alt = title;
    poster.loading = "lazy";

    card.appendChild(poster);
    container.appendChild(card);

    card.addEventListener("click", () => {
        modal.querySelector(".modal-poster").src =
            `https://image.tmdb.org/t/p/w500${poster_path}`;

        modal.querySelector(".modal-poster").alt = title;
        modal.querySelector(".modal-title").textContent = title;
        modal.querySelector(".modal-year").textContent = year;
        modal.querySelector(".modal-overview").textContent =
            overview || "Nincs elérhető leírás.";

        modal.showModal();
    });
}