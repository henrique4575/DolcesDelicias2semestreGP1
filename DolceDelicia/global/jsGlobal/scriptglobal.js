document.addEventListener("DOMContentLoaded", function () {
    const currentPage = (document.body.dataset.page || "inicio").trim().toLowerCase();
    const normalizeText = function (value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "")
            .trim();
    };

    document.querySelectorAll(".nav-link, .drawer-link").forEach(function (link) {
        const pageName = link.dataset.page || link.textContent || "";
        const isCurrentPage = normalizeText(pageName) === normalizeText(currentPage);

        if (isCurrentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    const hamburger = document.getElementById("hamburger");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");
    const drawerClose = document.getElementById("drawerClose");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    function abrirMenu() {
        if (!drawer || !overlay || !hamburger) return;
        drawer.classList.add("open");
        overlay.classList.add("active");
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        drawer.setAttribute("aria-hidden", "false");
    }

    function fecharMenu() {
        if (!drawer || !overlay || !hamburger) return;
        drawer.classList.remove("open");
        overlay.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
    }

    if (hamburger) {
        hamburger.addEventListener("click", abrirMenu);
    }

    if (drawerClose) {
        drawerClose.addEventListener("click", fecharMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", fecharMenu);
    }

    drawerLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            fecharMenu();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            fecharMenu();
        }
    });
});