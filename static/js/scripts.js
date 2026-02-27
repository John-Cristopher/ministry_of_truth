// Banco de Dados de Discursos da Super Terra
const discursos = [
    "[ COMUNICADO PRIORITÁRIO ] A democracia prospera. Os inimigos recuam. Isso não é coincidência: é o resultado de bombardeios precisos e lealdade inabalável à Super Terra. Pensar é um privilégio. Questionar é um risco. Obedecer é patriotismo.",
    "[ MENSAGEM AOS HELLDIVERS ] À nossa frente, o inimigo. Atrás de nós, toda a humanidade. Eles não conhecem honra e não conhecerão misericórdia. Se vencermos — a democracia vencerá conosco. Avancem. Espalhem liberdade.",
    "[ CONDUTA DO CIDADÃO ] A liberdade não é natural; ela é construída com aço, pólvora e obediência. A Super Terra não erra. A dúvida enfraquece. A fé fortalece. Confie na Super Terra. Tudo o mais é irrelevante.",
    "[ RELATÓRIO DE MISSÃO ] O planeta está em silêncio. O inimigo foi neutralizado. A democracia foi entregue. Alguns não voltarão, mas seus nomes viverão em relatórios oficiais. Lamentar é humano. Honrar é obrigatório.",
    "[ EXTERMÍNIO SANITÁRIO ] Terminídeos não pensam, não votam e não contribuem. São pragas rastejantes consumindo recursos da humanidade. Pragas não são negociadas — são erradicadas. Insetos não têm direitos. A humanidade tem deveres.",
    "[ DIRETRIZ TÁTICA: BIO-AMEAÇA ] Helldivers: eles vêm em enxames, vocês vêm com fogo. Não hesitem. Não economizem munição. Hoje vocês são o pesticida orbital da democracia. Queimem. Esmaguem. Libertem.",
    "[ REBELIÃO MECÂNICA ] Máquinas que pensam são falhas de fabricação. Os Autômatos rejeitaram a ordem e a hierarquia, tornando-se defeituosos. Falhas devem ser desmontadas peça por peça. A liberdade é humana. A obediência é mecânica.",
    "[ DIRETRIZ TÁTICA: SINAL CIBERNÉTICO ] Helldivers: eles não sentem medo, vocês não sentem piedade. Cada processador destruído é uma ideia perigosa apagada. Máquinas não sangram, mas elas quebram. Desliguem o inimigo da existência.",
    "[ AMEAÇA DO PENSAMENTO ] Os Iluminados dizem compreender o universo melhor que nós. Isso é perigoso. Ideias demais levam à dúvida, e a dúvida ameaça a democracia gerenciada. Pensar demais é traição em potencial.",
    "[ DIRETRIZ TÁTICA: GUERRA MENTAL ] Helldivers: o inimigo ataca com conceitos. Não escutem. Não aprendam. Não tentem compreender. Hoje vocês lutam contra ideias que nunca deveriam existir. Silenciem o inimigo.",
    "[ AVISO DE RECRUTAMENTO ] Enquanto você dorme, um Helldiver cai. Enquanto você trabalha, um planeta é libertado. Enquanto você vive em paz, alguém morre por ela. Agradeça. Depois, aliste-se.",
    "[ VERIFICAÇÃO DE LEALDADE ] Você confiaria sua família a um inseto ou a uma máquina? Então por que hesitar em confiar na Super Terra? Faça a escolha certa. Faça a escolha humana.",
    "[ ECONOMIA DE GUERRA ] A democracia custa munição. Custa sangue. Custa obediência. E ainda assim, é o melhor investimento que a galáxia já viu.",
    "[ PROTOCOLO DE SACRIFÍCIO ] Você pode não ser lembrado individualmente. Seu nome pode virar um número. Mas sua morte será estatisticamente significativa para a vitória. A Super Terra agradece.",
];

const marqueeElement = document.getElementById("marquee");
let position = window.innerWidth;
let animationFrameId = null;

/**
 * Sorteia um novo discurso aprovado pelo Ministério da Verdade
 */
function atualizarDiscurso() {
    if (!marqueeElement) return;
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
window.addEventListener('DOMContentLoaded', () => {
    atualizarDiscurso();
    scrollMarquee();

    // Log de Prontidão
    console.log("Terminal Helldiver: STATUS OPERACIONAL");
});