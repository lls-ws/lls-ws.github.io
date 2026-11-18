#!/bin/bash
# Etapa Extra: Verificação de links quebrados na LLS_TV.m3u com identificação da fonte
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd)"
FAV_DIR="${BASE_DIR}/favorites"
OUT_M3U="${BASE_DIR}/LLS_TV.m3u"
FAV_URLS="${FAV_DIR}/favorites-urls.txt"
BROKEN_LOG="${FAV_DIR}/broken-links.log"

if [ ! -s "${OUT_M3U}" ]; then
    echo "[ERRO] Playlist ${OUT_M3U} não encontrada ou vazia. Rode 'bash run.sh playlist' primeiro."
    exit 1
fi

mkdir -p "${FAV_DIR}"
touch "${FAV_URLS}"

echo "=== Iniciando verificação de links em LLS_TV.m3u ==="
echo "Isso pode levar alguns segundos dependendo do tempo de resposta dos servidores..."
echo ""

QUEBRADOS_TMP=$(mktemp)
TOTAL=0
FALHAS=0

# Cruza LLS_TV.m3u com favorites-urls.txt para recuperar a chave source_name#channel_name
awk -F'#' '
    idx == 1 {
        gsub(/\r/, "", $0)
        if ($0 == "" || $0 ~ /^[[:space:]]*#/) next
        chave = $1 "#" $2
        url_orig = substr($0, length(chave "#") + 1)
        url_base = url_orig
        sub(/\?.*$/, "", url_base)
        mapa_exato[url_orig] = chave
        if (!(url_base in mapa_base)) {
            mapa_base[url_base] = chave
        }
        next
    }
    idx == 2 {
        gsub(/\r/, "", $0)
        if ($0 ~ /^#EXTINF/) {
            grupo = "SEM_GRUPO"
            if (match($0, /group-title="[^"]*"/)) {
                grupo = substr($0, RSTART + 13, RLENGTH - 14)
            }
            nome = $0
            sub(/.*,/, "", nome)
            next
        }
        if ($0 ~ /^http/) {
            url_m3u = $0
            url_m3u_base = url_m3u
            sub(/\?.*$/, "", url_m3u_base)

            chave_origem = "DESCONHECIDO#" nome
            if (url_m3u in mapa_exato) {
                chave_origem = mapa_exato[url_m3u]
            } else if (url_m3u_base in mapa_base) {
                chave_origem = mapa_base[url_m3u_base]
            }

            print chave_origem "|" grupo "|" nome "|" url_m3u
        }
    }
' idx=1 "${FAV_URLS}" idx=2 "${OUT_M3U}" > "${QUEBRADOS_TMP}.list"

TOTAL_CANAIS=$(wc -l < "${QUEBRADOS_TMP}.list")

while IFS='|' read -r CHAVE_ORIGEM GRUPO CANAL URL; do
    ((TOTAL++))
    printf "[%03d/%03d] Testando: %-35s -> " "${TOTAL}" "${TOTAL_CANAIS}" "${CHAVE_ORIGEM}"

    RESP_TMP=$(mktemp)
    INFO=$(curl -s -L --connect-timeout 10 --max-time 18 -A "Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV) AppleWebKit/537.36" -w "%{http_code}|%{content_type}" -o "${RESP_TMP}" "${URL}" 2>/dev/null)

    HTTP_CODE="${INFO%%|*}"
    CONTENT_TYPE="${INFO#*|}"
    PRIMEIRA_LINHA=$(head -c 64 "${RESP_TMP}" | tr -d '\0\r' | head -n 1)

    rm -f "${RESP_TMP}"

    IS_VALID=0
    if [[ "${HTTP_CODE}" == "200" || "${HTTP_CODE}" == "206" ]]; then
        if [[ "${PRIMEIRA_LINHA}" == \#EXTM3U* || "${CONTENT_TYPE}" == *video* || "${CONTENT_TYPE}" == *octet-stream* || "${CONTENT_TYPE}" == *mpegurl* ]]; then
            IS_VALID=1
        fi
    fi

    if [ "${IS_VALID}" -eq 1 ]; then
        echo "[OK]"
    else
        MOTIVO="HTTP ${HTTP_CODE}"
        [ "${HTTP_CODE}" == "000" ] && MOTIVO="TIMEOUT / SEM RESPOSTA"
        [[ "${HTTP_CODE}" == "200" ]] && MOTIVO="HTTP 200 (CONTEÚDO INVÁLIDO: ${CONTENT_TYPE})"

        echo "[FALHA: ${MOTIVO}]"
        echo "${CHAVE_ORIGEM}  |  Grupo: [${GRUPO}]  |  Erro: ${MOTIVO}" >> "${QUEBRADOS_TMP}"
        echo "    URL: ${URL}" >> "${QUEBRADOS_TMP}"
        ((FALHAS++))
    fi
done < "${QUEBRADOS_TMP}.list"

rm -f "${QUEBRADOS_TMP}.list"

echo ""
echo "=========================================================="
echo "Resumo: ${TOTAL} canais testados | ${FALHAS} links com problema"
echo "=========================================================="

DATA_ATUAL=$(date '+%d/%m/%Y às %H:%M:%S')
{
    echo "=========================================================="
    echo "Verificação de Links em: ${DATA_ATUAL}"
    echo "Total testado: ${TOTAL} | Links quebrados: ${FALHAS}"
    echo "=========================================================="
    if [ "${FALHAS}" -gt 0 ]; then
        cat "${QUEBRADOS_TMP}"
    else
        echo "Nenhum link quebrado encontrado! Todos os canais estão online."
    fi
} > "${BROKEN_LOG}"

rm -f "${QUEBRADOS_TMP}"
echo "Relatório salvo em: ${BROKEN_LOG}"
