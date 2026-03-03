// Banco de Dados de Discursos da Super Terra
let discursos = []; // Será preenchido via fetch

const marqueeElement = document.getElementById("marquee");
let position = window.innerWidth;
let animationFrameId = null;

/**
 * Sorteia um novo discurso aprovado pelo Ministério da Verdade.
 * Garante que a lista de discursos não esteja vazia.
 */
function atualizarDiscurso() {
    if (!marqueeElement || discursos.length === 0) return;
    const indice = Math.floor(Math.random() * discursos.length);
    marqueeElement.innerText = discursos[indice];
}

/**
 * Animação fluida do Marquee usando RequestAnimationFrame
 */
function scrollMarquee() {
    if (!marqueeElement) return;

    position -= 2; // Ajuste a velocidade aqui

    if (position < -marqueeElement.offsetWidth) {
        position = window.innerWidth;
        atualizarDiscurso();
    }

    marqueeElement.style.transform = `translateX(${position}px)`;
    animationFrameId = requestAnimationFrame(scrollMarquee);
}

/**
 * Efeito de Sincronização de Sinal (Anti-Dissidência)
 */
function syncSignal() {
    const body = document.body;
    body.style.pointerEvents = "none"; // Impede múltiplos cliques
    body.classList.add("glitch-active");

    console.log("LOG: Re-establishing link with Super Earth High Command...");

    // Efeito sonoro opcional (se você tiver um arquivo de bip de rádio)
    // new Audio('/static/audio/sync.mp3').play();

    setTimeout(() => {
        body.classList.remove("glitch-active");
        window.location.reload();
    }, 600);
}

/**
 * Inicialização Única (Unificada para evitar conflitos)
 */
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/static/js/discursos.json');
        discursos = await response.json();
        atualizarDiscurso(); // Inicia com um discurso aleatório
        scrollMarquee(); // Inicia a animação
    } catch (error) {
        console.error("Falha ao carregar discursos do Ministério:", error);
        marqueeElement.innerText = "[ FALHA NA TRANSMISSÃO - SINAL PERDIDO ]";
    }

    // Log de Prontidão
    console.log("Terminal Helldiver: STATUS OPERACIONAL");
});