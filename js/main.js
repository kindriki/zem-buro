/* ==========================================================
                    CASES DATA
========================================================== */

let casesData = [];

let current = 0;


/* ==========================================================
                    DOM ELEMENTS
========================================================== */

const container =
    document.getElementById("cases-container");

const modal =
    document.getElementById("modal");

const title =
    document.getElementById("modal-title");

const content =
    document.getElementById("modal-content");

const closeBtn =
    document.getElementById("closeModal");

const backToTop =
    document.getElementById("backToTop");


/* ==========================================================
                    SMOOTH SCROLL NAV
========================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                href === "#" ||
                href === "javascript:void(0)"
            ) {
                return;
            }

            const target =
                document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


/* ==========================================================
                    OPEN MODAL
========================================================== */

function openModal(index) {

    if (
        !casesData.length ||
        !casesData[index]
    ) {
        return;
    }

    current = index;

    const item =
        casesData[index];

    title.textContent =
        item.title || "";

    content.innerHTML = "";


    /* IMAGE */

    if (item.image) {

        const image =
            document.createElement("img");

        image.src =
            item.image;

        image.alt =
            item.title || "Фотография дела";

        image.onerror = () => {

            image.style.display =
                "none";

        };

        content.appendChild(image);

    }


    /* TEXT */

    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        item.full || item.short || "";

    content.appendChild(
        paragraph
    );


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* ==========================================================
                    CLOSE MODAL
========================================================== */

function closeModal() {

    modal.style.opacity = "0";


    setTimeout(() => {

        modal.classList.remove("show");

        modal.style.opacity = "";

        document.body.style.overflow = "";

    }, 200);

}


/* ==========================================================
                    SWITCH CASE
========================================================== */

function switchCase(newIndex) {

    const modalCard =
        document.querySelector(".modal-card");

    if (!modalCard) {
        return;
    }


    modalCard.style.opacity = "0";

    modalCard.style.transform =
        "scale(.98)";


    setTimeout(() => {

        openModal(newIndex);

        modalCard.style.opacity = "";

        modalCard.style.transform = "";

    }, 180);

}


/* ==========================================================
                    NEXT / PREVIOUS
========================================================== */

function nextCase() {

    if (!casesData.length) {
        return;
    }

    current =
        (current + 1)
        % casesData.length;

    switchCase(current);

}


function prevCase() {

    if (!casesData.length) {
        return;
    }

    current =
        (current - 1
        + casesData.length)
        % casesData.length;

    switchCase(current);

}


/* ==========================================================
                    MODAL EVENTS
========================================================== */

if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        closeModal
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );

}


/* ==========================================================
                    KEYBOARD CONTROL
========================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!modal.classList.contains("show")) {
            return;
        }

        if (event.key === "Escape") {

            closeModal();

        }

        if (event.key === "ArrowRight") {

            nextCase();

        }

        if (event.key === "ArrowLeft") {

            prevCase();

        }

    }
);


/* ==========================================================
                    LOAD CASES
========================================================== */

fetch("data/cases.json")

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Не удалось загрузить cases.json"
            );

        }

        return response.json();

    })

    .then(data => {

        if (!Array.isArray(data)) {

            throw new Error(
                "cases.json должен содержать массив"
            );

        }

        casesData = data;


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (!data.length) {

            container.innerHTML = `

                <div class="cases-placeholder">

                    <strong>
                        Практика и результаты
                    </strong>

                    <p>
                        Здесь будут размещены наши
                        успешные дела и результаты.
                        Нажмите на карточку,
                        чтобы увидеть полную информацию.
                    </p>

                </div>

            `;

            return;

        }


        data.forEach((item, index) => {

            const card =
                document.createElement("div");

            card.className =
                "card";


            const image =
                document.createElement("img");

            image.src =
                item.image || "";

            image.alt =
                item.title || "Дело";

            image.onerror = () => {

                image.style.display =
                    "none";

            };


            const heading =
                document.createElement("h3");

            heading.textContent =
                item.title || "";


            const description =
                document.createElement("p");

            description.textContent =
                item.short || "";


            card.appendChild(image);

            card.appendChild(heading);

            card.appendChild(description);


            card.addEventListener(
                "click",
                () => openModal(index)
            );


            container.appendChild(card);

        });


        observeCaseCards();

    })

    .catch(error => {

        console.error(error);


        if (container) {

            container.innerHTML = `

                <div class="cases-placeholder">

                    <strong>
                        Практика и результаты
                    </strong>

                    <p>
                        Здесь будут размещены наши
                        успешные дела и результаты.
                    </p>

                </div>

            `;

        }

    });


/* ==========================================================
                REVEAL ANIMATION
========================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target
                        .classList
                        .add("active");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach(
    element =>
        revealObserver.observe(element)
);


/* ==========================================================
                COUNTER ANIMATION
========================================================== */

const counters =
    document.querySelectorAll(
        ".adv-card h3"
    );


const counterObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }


                const element =
                    entry.target;


                const original =
                    element.textContent
                        .trim();


                const match =
                    original.match(
                        /(\d+)(.*)/
                    );


                if (!match) {
                    return;
                }


                const value =
                    parseInt(
                        match[1],
                        10
                    );


                const suffix =
                    match[2];


                let start = 0;


                const duration =
                    1200;


                const startTime =
                    performance.now();


                function animateCounter(
                    currentTime
                ) {

                    const progress =
                        Math.min(
                            (
                                currentTime
                                - startTime
                            )
                            / duration,
                            1
                        );


                    const eased =
                        1
                        - Math.pow(
                            1 - progress,
                            3
                        );


                    start =
                        Math.floor(
                            value * eased
                        );


                    element.textContent =
                        start + suffix;


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            animateCounter
                        );

                    } else {

                        element.textContent =
                            original;

                    }

                }


                requestAnimationFrame(
                    animateCounter
                );


                counterObserver.unobserve(
                    element
                );

            });

        },

        {
            threshold: 0.5
        }

    );


counters.forEach(
    counter =>
        counterObserver.observe(counter)
);


/* ==========================================================
                CONTACT HOVER
========================================================== */

document
    .querySelectorAll(".contact-card")
    .forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX
                    - rect.left;


                const y =
                    event.clientY
                    - rect.top;


                card.style.background =
                    `radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(255,255,255,.38),
                        transparent 70%
                    )`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.background = "";

            }
        );

    });


/* ==========================================================
                CASE CARDS OBSERVER
========================================================== */

let cardsObserver;


function observeCaseCards() {

    const cards =
        document.querySelectorAll(
            "#cases-container .card"
        );


    if (!cards.length) {
        return;
    }


    cardsObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        cardsObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: .15
            }

        );


    cards.forEach(card => {

        cardsObserver.observe(card);

    });

}


/* ==========================================================
                    HEADER PARALLAX
========================================================== */

window.addEventListener(
    "scroll",
    () => {

        const img =
            document.querySelector(
                ".header-img"
            );


        if (img) {

            const offset =
                window.scrollY * .08;


            img.style.transform =
                `translateY(${offset}px) scale(1.03)`;

        }

    },
    {
        passive: true
    }
);


/* ==========================================================
                    ACTIVE NAVIGATION
========================================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav a"
    );


const navigationObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    const id =
                        entry.target.id;


                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );


                        if (
                            link.getAttribute(
                                "href"
                            )
                            ===
                            "#" + id
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                }

            });

        },

        {
            rootMargin:
                "-25% 0px -60% 0px",

            threshold: 0
        }

    );


sections.forEach(section => {

    navigationObserver.observe(
        section
    );

});


/* ==========================================================
                    BACK TO TOP
========================================================== */

if (backToTop) {

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );

            }

        },
        {
            passive: true
        }
    );


    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ==========================================================
                DETAILS ANIMATION
========================================================== */

document
    .querySelectorAll(
        ".service-card details"
    )
    .forEach(details => {

        details.addEventListener(
            "toggle",
            () => {

                if (details.open) {

                    details.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                }

            }
        );

    });

    
    /* ==========================================================
   ОТЗЫВЫ — ЗАГРУЗКА ИЗ data/reviews.json
========================================================== */

const reviewsContainer = document.getElementById("reviews-container");

if (reviewsContainer) {

    fetch("data/reviews.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Не удалось загрузить reviews.json");
            }

            return response.json();

        })
        .then(reviews => {

            reviewsContainer.innerHTML = "";

            if (!reviews || reviews.length === 0) {

                reviewsContainer.innerHTML = `
                    <div class="review-empty">
                        Отзывы клиентов появятся здесь.
                    </div>
                `;

                return;
            }

            reviews.forEach((review, index) => {

                const article = document.createElement("article");

                article.className = "review-card";

                article.style.animationDelay =
                    `${index * 0.08}s`;

                article.innerHTML = `
                    <div class="review-image-wrap">

                        <img
                            src="${review.image}"
                            alt="Отзыв клиента"
                            loading="lazy"
                        >

                        <div class="review-overlay">
                            <span>Открыть</span>
                        </div>

                    </div>
                `;

                reviewsContainer.appendChild(article);


                /* Открытие скриншота */

                article.addEventListener("click", () => {

                    openReviewModal(review.image);

                });

            });

        })
        .catch(error => {

            console.error(
                "Ошибка загрузки отзывов:",
                error
            );

            reviewsContainer.innerHTML = `
                <div class="review-empty">
                    Отзывы пока не загружены.
                </div>
            `;

        });

}


/* ==========================================================
   МОДАЛЬНОЕ ОКНО ОТЗЫВА
========================================================== */

function openReviewModal(imageSrc) {

    let modal = document.getElementById("review-modal");

    /* Если модального окна ещё нет — создаём его */

    if (!modal) {

        modal = document.createElement("div");

        modal.id = "review-modal";

        modal.className = "review-modal";

        modal.innerHTML = `

            <div class="review-modal-card">

                <button
                    class="review-modal-close"
                    type="button"
                    aria-label="Закрыть отзыв"
                >
                    ×
                </button>

                <img
                    class="review-modal-image"
                    src=""
                    alt="Отзыв клиента"
                >

            </div>

        `;

        document.body.appendChild(modal);


        /* Закрытие по крестику */

        modal
            .querySelector(".review-modal-close")
            .addEventListener("click", closeReviewModal);


        /* Закрытие по пустому месту */

        modal.addEventListener("click", event => {

            if (event.target === modal) {

                closeReviewModal();

            }

        });

    }


    const image =
        modal.querySelector(".review-modal-image");

    image.src = imageSrc;


    /* Показываем */

    requestAnimationFrame(() => {

        modal.classList.add("show");

    });


    document.body.style.overflow = "hidden";

}


/* ==========================================================
   ЗАКРЫТИЕ ОТЗЫВА
========================================================== */

function closeReviewModal() {

    const modal =
        document.getElementById("review-modal");

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow = "";

}


/* ESC — закрытие отзыва */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeReviewModal();

    }

});
/* ==========================================================
   ГОРИЗОНТАЛЬНАЯ ЛЕНТА ОТЗЫВОВ
========================================================== */

const reviewsSlider = document.querySelector("#reviews-container");

const reviewsLeftButton =
    document.querySelector(".reviews-arrow-left");

const reviewsRightButton =
    document.querySelector(".reviews-arrow-right");


if (
    reviewsSlider &&
    reviewsLeftButton &&
    reviewsRightButton
) {

    /*
     * Расстояние одного перелистывания.
     * 310px — ширина карточки
     * 24px — расстояние между карточками
     */

    const reviewStep = 334;


    /* ======================================================
       НАЗАД
    ====================================================== */

    reviewsLeftButton.addEventListener("click", () => {

        reviewsSlider.scrollBy({
            left: -reviewStep,
            behavior: "smooth"
        });

    });


    /* ======================================================
       ВПЕРЁД
    ====================================================== */

    reviewsRightButton.addEventListener("click", () => {

        reviewsSlider.scrollBy({
            left: reviewStep,
            behavior: "smooth"
        });

    });


    /* ======================================================
       ПРОКРУТКА КОЛЕСОМ МЫШИ
       Когда пользователь находится над отзывами,
       вертикальное колесо превращается в горизонтальную
       прокрутку.
    ====================================================== */

    reviewsSlider.addEventListener(
        "wheel",
        (event) => {

            /*
             * Если пользователь прокручивает
             * преимущественно вертикально —
             * переводим движение в горизонтальное.
             */

            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {

                event.preventDefault();

                reviewsSlider.scrollBy({
                    left: event.deltaY,
                    behavior: "auto"
                });

            }

        },
        {
            passive: false
        }
    );

}