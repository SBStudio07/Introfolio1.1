
/* =========================================================
   SUMAN.Codex
   Interactive Layer
========================================================= */


/* =========================================================
   DOM
========================================================= */

const bootScreen = document.querySelector(".boot-screen");
const bootEnter = document.querySelector(".boot-enter");

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("a[href^='#']");

const skillBars = document.querySelectorAll(".skill-bar span");
const processBars = document.querySelectorAll(".process-bar span");

const finalTerminal = document.querySelector(".final-terminal-body");

const footer = document.querySelector("footer");


/* =========================================================
   BOOT SEQUENCE
========================================================= */

let systemBooted = false;

function bootSystem() {

    if (systemBooted) return;

    systemBooted = true;

    bootScreen.classList.add("boot-complete");

    setTimeout(() => {

        bootScreen.style.display = "none";

        document.body.classList.add("system-ready");

    }, 650);
}


/*
   The site is intentionally not locked behind
   the boot screen forever.

   Clicking the terminal or pressing Enter
   boots the system.
*/

bootScreen?.addEventListener("click", bootSystem);

bootEnter?.addEventListener("click", bootSystem);

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        bootScreen &&
        !systemBooted
    ) {

        bootSystem();

    }

});


/* =========================================================
   NAVIGATION
========================================================= */

navLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") return;

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
    ".section, .project-card, .skill-category, .file-folder"
);

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);

        });

    },

    {
        threshold: 0.12
    }

);

revealElements.forEach((element) => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================================================
   SKILL BAR ANIMATION
========================================================= */

const barObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const bar = entry.target;

            const targetWidth = bar.style.width;

            bar.style.width = "0%";

            requestAnimationFrame(() => {

                setTimeout(() => {

                    bar.style.width = targetWidth;

                }, 120);

            });

            barObserver.unobserve(bar);

        });

    },

    {
        threshold: 0.4
    }

);

[...skillBars, ...processBars].forEach((bar) => {

    barObserver.observe(bar);

});


/* =========================================================
   PROJECT CARD INTERACTION
========================================================= */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -1.5;

        const rotateY =
            ((x - centerX) / centerX) * 1.5;

        card.style.transform = `
            perspective(900px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-4px)
        `;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


/* =========================================================
   MOUSE LIGHT
========================================================= */

document.addEventListener("mousemove", (event) => {

    const x = event.clientX;
    const y = event.clientY;

    document.documentElement.style.setProperty(
        "--mouse-x",
        `${x}px`
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        `${y}px`
    );

});


/* =========================================================
   ACTIVE TIMELINE NODE
========================================================= */

const timelineItems =
    document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            timelineItems.forEach((item) => {

                item.classList.remove("active");

            });

            entry.target.classList.add("active");

        });

    },

    {
        threshold: 0.6
    }

);

timelineItems.forEach((item) => {

    timelineObserver.observe(item);

});


/* =========================================================
   LIVE TERMINAL CURSOR
========================================================= */

const terminalCursor =
    document.querySelector(".command-cursor");

if (terminalCursor) {

    setInterval(() => {

        terminalCursor.classList.toggle("cursor-hidden");

    }, 550);

}


/* =========================================================
   FAKE TERMINAL
========================================================= */

function createTerminal() {

    const terminal = document.createElement("div");

    terminal.className = "interactive-terminal";

    terminal.innerHTML = `

        <div class="interactive-terminal-header">

            <div class="window-controls">

                <span class="window-dot red"></span>
                <span class="window-dot yellow"></span>
                <span class="window-dot green"></span>

            </div>

            <span>guest@suman-os</span>

        </div>


        <div class="interactive-terminal-output">

            <div>
                Welcome to <span class="blue">Suman.Codex</span>.
            </div>

            <div>
                Type <span class="cyan">help</span> to see available commands.
            </div>

        </div>


        <div class="interactive-terminal-input">

            <span class="blue">guest@suman</span>
            <span>:</span>
            <span class="cyan">~</span>
            <span>$</span>

            <input
                type="text"
                autocomplete="off"
                spellcheck="false"
                aria-label="Terminal command"
            >

        </div>

    `;

    document.body.appendChild(terminal);

    return terminal;

}


/* =========================================================
   TERMINAL COMMANDS
========================================================= */

const terminalCommands = {

    help: `
        Available commands:<br><br>

        <span class="cyan">whoami</span>
        &nbsp; About Suman<br>

        <span class="cyan">skills</span>
        &nbsp;&nbsp; System capabilities<br>

        <span class="cyan">projects</span>
        Projects built<br>

        <span class="cyan">timeline</span>
        Life history<br>

        <span class="cyan">github</span>
        Open-source profile<br>

        <span class="cyan">contact</span>
        Communication protocols<br>

        <span class="cyan">clear</span>
        Clear terminal<br>

        <span class="cyan">sudo</span>
        Don't.
    `,

    whoami: `
        <span class="green">Suman Bhattacharya</span><br>
        Developer / Builder / Student<br>
        Status: <span class="green">actively compiling</span>
    `,

    skills: `
        Loading skill tree...<br><br>

        Python ............ <span class="blue">████████░░</span><br>
        JavaScript ........ <span class="blue">███████░░░</span><br>
        HTML .............. <span class="blue">█████████░</span><br>
        CSS ............... <span class="blue">████████░░</span><br>
        React ............. <span class="purple">█████░░░░░</span><br>
        DSA ............... <span class="purple">███████░░░</span>
    `,

    projects: `
        ~/projects<br><br>

        <span class="blue">WeatherGPT/</span><br>
        <span class="blue">JEE-PYQs/</span><br>
        <span class="blue">Amazon-Clone/</span><br>
        <span class="blue">Roblox/</span>
    `,

    timeline: `
        Loading life.log...<br><br>

        2008 → system initialized<br>
        2018 → curiosity.exe<br>
        2023 → python --init<br>
        2024 → web_dev --installed<br>
        2025 → developer_mode --enabled<br>
        2026 → college --initialized
    `,

    github: `
        GitHub protocol detected.<br><br>
        Redirect disabled in prototype mode.
    `,

    contact: `
        Communication protocols available:<br><br>

        GitHub<br>
        LinkedIn<br>
        Email<br>
        Discord
    `,

    sudo: `
        <span class="red">
        Permission denied.
        </span><br><br>

        Nice try.
    `,

    "sudo hire suman": `
        <span class="red">
        Permission denied.
        </span><br><br>

        But you can still contact me.
    `,

    "rm -rf /life": `
        <span class="red">
        ERROR: Life cannot be deleted.
        </span><br><br>

        Try building something instead.
    `,

    clear: "CLEAR"

};


/* =========================================================
   TERMINAL OPEN
========================================================= */

let interactiveTerminal = null;

function openTerminal() {

    if (interactiveTerminal) {

        interactiveTerminal.remove();

    }

    interactiveTerminal = createTerminal();

    const input =
        interactiveTerminal.querySelector("input");

    input.focus();

    const output =
        interactiveTerminal.querySelector(
            ".interactive-terminal-output"
        );

    input.addEventListener("keydown", (event) => {

        if (event.key !== "Enter") return;

        const command =
            input.value.trim().toLowerCase();

        if (!command) return;

        const commandLine =
            document.createElement("div");

        commandLine.innerHTML = `
            <span class="blue">guest@suman</span>:<span class="cyan">~</span>$
            ${escapeHTML(command)}
        `;

        output.appendChild(commandLine);

        input.value = "";

        if (terminalCommands[command] === "CLEAR") {

            output.innerHTML = "";

            return;

        }

        if (terminalCommands[command]) {

            const response =
                document.createElement("div");

            response.className =
                "terminal-response";

            response.innerHTML =
                terminalCommands[command];

            output.appendChild(response);

        } else {

            const response =
                document.createElement("div");

            response.className =
                "terminal-response";

            response.innerHTML = `
                command not found:
                <span class="red">${escapeHTML(command)}</span>
                <br>
                Type
                <span class="cyan">help</span>
                for available commands.
            `;

            output.appendChild(response);

        }

        interactiveTerminal.scrollTop =
            interactiveTerminal.scrollHeight;

    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return value

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   CTRL + SHIFT + S
========================================================= */

document.addEventListener("keydown", (event) => {

    if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "s"
    ) {

        event.preventDefault();

        openTerminal();

    }

});


/* =========================================================
   KONAMI CODE
========================================================= */

const konamiCode = [

    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"

];

let konamiIndex = 0;

document.addEventListener("keydown", (event) => {

    if (
        event.key ===
        konamiCode[konamiIndex]
    ) {

        konamiIndex++;

        if (
            konamiIndex ===
            konamiCode.length
        ) {

            activateDeveloperMode();

            konamiIndex = 0;

        }

    } else {

        konamiIndex = 0;

    }

});


/* =========================================================
   DEVELOPER MODE
========================================================= */

function activateDeveloperMode() {

    document.body.classList.add(
        "developer-mode"
    );

    const message =
        document.createElement("div");

    message.className =
        "developer-mode-message";

    message.innerHTML = `
        <span class="green">CHEAT MODE ENABLED</span>
        <br>
        You found the source.
    `;

    document.body.appendChild(message);

    setTimeout(() => {

        message.classList.add("show");

    }, 50);

    setTimeout(() => {

        message.classList.remove("show");

    }, 3500);

    setTimeout(() => {

        message.remove();

    }, 4000);

}


/* =========================================================
   SECTION TRACKING
========================================================= */

const sectionObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const id =
                    entry.target.getAttribute("id");

                history.replaceState(
                    null,
                    "",
                    `#${id}`
                );

            });

        },

        {
            threshold: 0.35
        }

    );

sections.forEach((section) => {

    sectionObserver.observe(section);

});


/* =========================================================
   SYSTEM CLOCK
========================================================= */

function updateSystemClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    const clock =
        document.querySelector(".system-clock");

    if (clock) {

        clock.textContent =
            `${hours}:${minutes}:${seconds}`;

    }

}

setInterval(updateSystemClock, 1000);

updateSystemClock();


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear =
    new Date().getFullYear();

if (footer) {

    footer.innerHTML =
        footer.innerHTML.replace(
            "2026",
            currentYear
        );

}


/* =========================================================
   EASTER EGG:
   DOUBLE CLICK LOGO
========================================================= */

const logo =
    document.querySelector(".nav-logo");

logo?.addEventListener(
    "dblclick",
    () => {

        openTerminal();

    }
);


/* =========================================================
   EASTER EGG:
   TYPE "0101"
========================================================= */

let typedSequence = "";

document.addEventListener("keydown", (event) => {

    if (
        event.key !== "0" &&
        event.key !== "1"
    ) {

        typedSequence = "";

        return;

    }

    typedSequence += event.key;

    if (typedSequence.endsWith("0101")) {

        document.body.classList.toggle(
            "binary-mode"
        );

        typedSequence = "";

    }

});


/* =========================================================
   SYSTEM READY
========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add(
        "page-loaded"
    );

});
