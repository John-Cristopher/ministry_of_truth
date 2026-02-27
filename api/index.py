import requests
import random
import time
from flask import Flask, render_template, abort
import datetime

app = Flask(__name__, template_folder="../templates", static_folder="../static")

# Configurações de Cache Simples (Memória)
cache = {"data": None, "last_update": 0}
CACHE_TIMEOUT = 300  # 5 minutos em segundos

API_BASE = "https://api.helldivers2.dev/api/v1"

FRASES_PATRIOTICAS = [
    "A dor é temporária, a glória da Super Terra é eterna.",
    "Democracia Gerenciada: O único caminho para a Paz.",
    "A dúvida é o primeiro passo para a traição.",
    "A Liberdade não tem preço, mas custa muita munição.",
    "Lembre-se: O fogo amigo é uma ilusão de ótica.",
    "A verdade não muda. Apenas é reforçada.",
    "Super Terra não observa você. Ela confia em você.",
    "Democracia Gerenciada: eficiência acima da emoção.",
    "Quem questiona a ordem, questiona a própria liberdade.",
    "Obediência é o idioma universal da paz.",
    "A unidade é nossa maior arma.",
    "A informação correta é munição estratégica.",
    "A Super Terra não falha. Ela recalibra.",
    "Sacrifício individual, vitória coletiva.",
    "A vigilância constante é o preço da estabilidade.",
    "O caos é ausência de direção. Nós fornecemos direção.",
    "Toda transmissão é um ato de patriotismo.",
    "Pensamento alinhado é progresso garantido.",
    "A ordem precede a prosperidade.",
    "Lealdade é a verdadeira forma de liberdade.",
]

MINISTERIO_DB = [
    {
        "titulo": "Arquivo Histórico",
        "label": "Status",
        "texto": "Registros revisados e harmonizados com a versão oficial.",
    },
    {
        "titulo": "Departamento de Revisão",
        "label": "Operação",
        "texto": "Narrativas inconsistentes foram recalibradas.",
    },
    {
        "titulo": "Centro de Transparência",
        "label": "Relatório",
        "texto": "A clareza informacional aumentou 12% neste ciclo.",
    },
    {
        "titulo": "Controle Narrativo",
        "label": "Diretriz",
        "texto": "Versões paralelas da realidade foram unificadas.",
    },
    {
        "titulo": "Divisão de Memória Coletiva",
        "label": "Atualização",
        "texto": "Eventos passados foram otimizados para estabilidade.",
    },
    {
        "titulo": "Vigilância Estratégica",
        "label": "Monitoramento",
        "texto": "Fluxos de opinião permanecem sob supervisão.",
    },
    {
        "titulo": "Unidade de Consenso",
        "label": "Progresso",
        "texto": "Índice de concordância pública em ascensão.",
    },
]


def get_faction_data(owner_id):
    factions = {
        0: ("DISPUTADO", "#ffffff"),
        1: ("SUPER TERRA", "#00ffff"),
        2: ("TERMINIDS", "#ff9800"),
        3: ("AUTOMATONS", "#f44336"),
        4: ("ILLUMINATE", "#9c27b0"),
    }
    return factions.get(owner_id, ("SISTEMA GALÁCTICO", "#888"))


def fetch_api_data():
    """Busca dados brutos da API com tratamento de erro robusto."""
    headers = {
        "X-Super-Client": "ministry-webapp",
        "X-Super-Contact": "seu-email@exemplo.com",
    }
    try:
        # Timeout de 10s para evitar que o servidor trave se a API estiver lenta
        planets_resp = requests.get(f"{API_BASE}/planets", headers=headers, timeout=10)
        orders_resp = requests.get(
            f"{API_BASE}/assignments", headers=headers, timeout=10
        )

        # Se a API retornar erro de servidor (503/500), levanta exceção
        planets_resp.raise_for_status()

        return planets_resp.json(), orders_resp.json()
    except Exception as e:
        print(f"Erro na comunicação orbital: {e}")
        return None, None


def get_data():
    global cache
    curr_time = time.time()

    # Retorna cache se ainda estiver válido
    if cache["data"] and (curr_time - cache["last_update"] < CACHE_TIMEOUT):
        return cache["data"]

    planets_raw, orders_raw = fetch_api_data()

    if planets_raw is None:
        return None  # Indica falha crítica para o front-end

    processed = []
    priority_ids = []

    # Extração de IDs de Ordens Maiores
    if orders_raw and isinstance(orders_raw, list):
        for o in orders_raw:
            tasks = o.get("setting", {}).get("tasks", [])
            for task in tasks:
                values = task.get("values", [])
                if len(values) >= 3:
                    priority_ids.append(values[2])

    for p in planets_raw:
        stats = p.get("statistics") or {}
        p["statistics"] = {
            "deaths": stats.get("deaths") or 0,
            "kills": stats.get("kills") or 0,
            "playerCount": stats.get("playerCount") or 0,
        }
        f_name, f_color = get_faction_data(p.get("owner"))
        p["faction_br"] = f_name
        p["color"] = f_color
        processed.append(p)

    # Lógica de Filtros
    data = {
        "democracia": [
            p for p in processed if p["index"] in priority_ids or p.get("event")
        ],
        "top_mortes": sorted(
            processed, key=lambda x: x["statistics"]["deaths"], reverse=True
        )[:3],
        "top_frentes": sorted(
            processed, key=lambda x: x["statistics"]["playerCount"], reverse=True
        )[:3],
    }

    # Atualiza Cache
    cache["data"] = data
    cache["last_update"] = curr_time
    return data


# --- HANDLERS DE ERRO ---


@app.route("/favicon.ico")
def favicon():
    return "", 204  # Retorna "No Content" e evita o erro 404


@app.errorhandler(404)
def page_not_found(e):
    # Retorna uma página customizada com tema de "Censurado pelo Ministério"
    return render_template("404.html"), 404


@app.errorhandler(500)
@app.errorhandler(503)
def server_error(e):
    return render_template("503.html"), 503


@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    return response


# --- ROTAS ---


@app.route("/")
def index():
    report_data = get_data()
    if report_data is None:
        abort(503)  # Força a página de erro se a API falhar

    frase_do_dia = random.choice(FRASES_PATRIOTICAS)
    return render_template("index.html", data=report_data, quote=frase_do_dia)


@app.route("/ministerio_da_verdade")
def ministerio_da_verdade():
    frases = [
        "A VERDADE É ABSOLUTA.",
        "DESINFORMAÇÃO É TRAIÇÃO.",
        "SUPERTERA OBSERVA.",
        "TRANSPARÊNCIA É PODER.",
        "A ORDEM GARANTE A PAZ.",
    ]

    dados = {
        "status_sistema": "OPERACIONAL",
        "nivel_propaganda": f"{random.randint(87, 100)}%",
        "cidadania_monitorada": f"{random.randint(1000000, 9000000)}",
        "atualizacao": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "frase": random.choice(frases),
        "cards_extra": random.sample(MINISTERIO_DB, 4),
    }

    return render_template("ministerio_da_verdade.html", dados=dados)


if __name__ == "__main__":
    app.run(debug=True)
