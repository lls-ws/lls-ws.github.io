#!/bin/bash
# Etapa Extra: Remoção de duplicados por prioridade de provedor + Herança de Logo e ID
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${${BASH_SOURCE[0]}}")/.." && pwd)"
CONFIG_DIR="${BASE_DIR}/config"
FAV_DIR="${BASE_DIR}/favorites"
LOG_DIR="${BASE_DIR}/log"

PRIORITY_TXT="${CONFIG_DIR}/providers-priority.txt"
CLEAN_WORDS_TXT="${CONFIG_DIR}/clean-words.txt"

FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"
FAV_IDS="${FAV_DIR}/favorites-ids.txt"
FAV_LOGOS="${FAV_DIR}/favorites-logos.txt"
DUPLICATES_LOG="${LOG_DIR}/duplicates.log"

mkdir -p "${CONFIG_DIR}" "${FAV_DIR}"
touch "${FAV_IDS}" "${FAV_LOGOS}"

# Cria config/providers-priority.txt padrão se não existir
if [ ! -f "${PRIORITY_TXT}" ]; then
    cat << 'EOF' > "${PRIORITY_TXT}"
SamsungTVPlus
LG
TCL
Movieark
WhaleTVPlus
IPTV-org
Redeitv
Olhosnatv
Soultv
EOF
fi

MODO="${1:-check}" # check = apenas simula e gera log | apply = aplica herança e comenta (#) duplicados

python3 - "${PRIORITY_TXT}" "${CLEAN_WORDS_TXT}" "${FAV_CHANNELS}" "${FAV_IDS}" "${FAV_LOGOS}" "${DUPLICATES_LOG}" "${MODO}" << 'EOF'
import sys, re, unicodedata
from datetime import datetime

prio_file, words_file, fav_file, ids_file, logos_file, log_file, modo = sys.argv[1:8]

# 1. Carrega ranking de provedores
prioridades = {}
with open(prio_file, "r", encoding="utf-8") as f:
    idx = 1
    for line in f:
        p = line.strip()
        if p and not p.startswith("#"):
            prioridades[p.lower()] = idx
            idx += 1

# 2. Carrega palavras de limpeza para normalizar o nome base
clean_words = []
try:
    with open(words_file, "r", encoding="utf-8") as f:
        for line in f:
            w = line.strip()
            if w and not w.startswith("#"):
                clean_words.append(re.escape(w))
except FileNotFoundError:
    pass

words_re = re.compile(r"\b(" + "|".join(clean_words) + r")\b", re.IGNORECASE) if clean_words else None

def normalizar_nome(nome):
    s = re.sub(r"^[0-9]+[\s-]*", "", nome)
    s = re.sub(r"[\(\)\[\]\|]", " ", s)
    s = re.sub(r"\s+-\s+", " ", s)
    if words_re:
        s = words_re.sub(" ", s)
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-zA-Z0-9]", "", s).lower()
    return s

# 3. Funções para ler e salvar metadados (IDs e Logos)
def carregar_meta(caminho):
    mapa = {}
    with open(caminho, "r", encoding="utf-8") as f:
        for line in f:
            l = line.rstrip("\r\n")
            if not l or l.startswith("#"): continue
            partes = l.split("#", 2)
            if len(partes) == 3:
                chave = f"{partes[0]}#{partes[1]}"
                mapa[chave] = partes[2]
    return mapa

def salvar_meta(caminho, mapa):
    with open(caminho, "w", encoding="utf-8") as f:
        for chave in sorted(mapa.keys(), key=lambda x: x.lower()):
            f.write(f"{chave}#{mapa[chave]}\n")

mapa_ids = carregar_meta(ids_file)
mapa_logos = carregar_meta(logos_file)

# 4. Lê canais ativos
with open(fav_file, "r", encoding="utf-8") as f:
    linhas = f.readlines()

ativos = []
for i, l in enumerate(linhas):
    txt = l.strip()
    if txt and not txt.startswith("#") and "#" in txt:
        fonte, canal = txt.split("#", 1)
        chave_norm = normalizar_nome(canal)
        rank = prioridades.get(fonte.lower(), 999)
        ativos.append({
            "norm": chave_norm,
            "rank": rank,
            "idx": i,
            "fonte": fonte,
            "canal": canal,
            "chave": f"{fonte}#{canal}"
        })

grupos = {}
for item in ativos:
    grupos.setdefault(item["norm"], []).append(item)

duplicados_para_comentar = set()
relatorio = []
ids_herdados = 0
logos_herdados = 0

for chave_norm, itens in sorted(grupos.items()):
    if len(itens) > 1 and chave_norm != "":
        itens.sort(key=lambda x: (x["rank"], x["idx"]))
        escolhido = itens[0]
        descartados = itens[1:]

        chave_esc = escolhido["chave"]
        id_atual = mapa_ids.get(chave_esc, "").strip()
        logo_atual = mapa_logos.get(chave_esc, "").strip()

        relatorio.append(f"Canal Base: [{chave_norm}]")
        relatorio.append(f"  [MANTIDO]    {chave_esc} (Prioridade: {escolhido['rank']})")

        # Busca ID faltante nos duplicados
        if not id_atual:
            for d in descartados:
                id_dup = mapa_ids.get(d["chave"], "").strip()
                if id_dup:
                    relatorio.append(f"    + ID herdado de [{d['chave']}]: {id_dup}")
                    if modo == "apply":
                        mapa_ids[chave_esc] = id_dup
                    ids_herdados += 1
                    break

        # Busca Logo faltante nos duplicados
        if not logo_atual:
            for d in descartados:
                logo_dup = mapa_logos.get(d["chave"], "").strip()
                if logo_dup:
                    relatorio.append(f"    + Logo herdado de [{d['chave']}]: {logo_dup}")
                    if modo == "apply":
                        mapa_logos[chave_esc] = logo_dup
                    logos_herdados += 1
                    break

        for d in descartados:
            relatorio.append(f"  [DUPLICADO]  {d['chave']} (Prioridade: {d['rank']})")
            duplicados_para_comentar.add(d["idx"])
        relatorio.append("")

data_atual = datetime.now().strftime("%d/%m/%Y às %H:%M:%S")
with open(log_file, "w", encoding="utf-8") as f:
    f.write("==========================================================\n")
    f.write(f"Verificação de Duplicados em: {data_atual} (Modo: {modo})\n")
    f.write(f"Ativos: {len(ativos)} | Duplicados: {len(duplicados_para_comentar)} | IDs herdados: {ids_herdados} | Logos herdados: {logos_herdados}\n")
    f.write("==========================================================\n")
    if relatorio:
        f.write("\n".join(relatorio) + "\n")
    else:
        f.write("Nenhum canal duplicado encontrado!\n")

print(f"Relatório gerado em: {log_file}")
print(f"Duplicados: {len(duplicados_para_comentar)} | IDs para herdar: {ids_herdados} | Logos para herdar: {logos_herdados}")

if modo == "apply":
    if ids_herdados > 0:
        salvar_meta(ids_file, mapa_ids)
    if logos_herdados > 0:
        salvar_meta(logos_file, mapa_logos)
    if duplicados_para_comentar:
        novas_linhas = []
        for i, l in enumerate(linhas):
            if i in duplicados_para_comentar:
                novas_linhas.append("#" + l.lstrip())
            else:
                novas_linhas.append(l)
        with open(fav_file, "w", encoding="utf-8") as f:
            f.writelines(novas_linhas)
    print("[OK] Herança de metadados aplicada e duplicados comentados (#)!")
EOF
