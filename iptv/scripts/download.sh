#!/bin/bash
# Etapa 1: Download e extração de canais, URLs, logos e IDs
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="${BASE_DIR}/config"
TEMP_DIR="${BASE_DIR}/temp"
FAV_DIR="${BASE_DIR}/favorites"

SOURCES_TXT="${CONFIG_DIR}/sources.txt"
FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"

CHANNELS_TXT="${TEMP_DIR}/channels-names.txt"
URLS_TXT="${TEMP_DIR}/channels-urls.txt"
LOGOS_TXT="${TEMP_DIR}/channels-logos.txt"
IDS_TXT="${TEMP_DIR}/channels-ids.txt"

mkdir -p "${CONFIG_DIR}" "${TEMP_DIR}" "${FAV_DIR}"

if [ ! -f "${SOURCES_TXT}" ]; then
    echo "[ERRO] Arquivo ${SOURCES_TXT} não encontrado!"
    exit 1
fi

echo "=== 1. Baixando listas M3U ==="
rm -f "${TEMP_DIR}"/*.m3u

while IFS='#' read -r SOURCE_NAME SOURCE_URL || [ -n "$SOURCE_NAME" ]; do
    SOURCE_NAME="${SOURCE_NAME//$'\r'/}"
    SOURCE_URL="${SOURCE_URL//$'\r'/}"
    [[ -z "$SOURCE_NAME" || "$SOURCE_NAME" == \#* ]] && continue

    echo "Baixando: ${SOURCE_NAME}..."
    HTTP_CODE=$(curl -4 -k -sL -w "%{http_code}" \
        -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
        -H "Referer: https://apsattv.com" \
        --connect-timeout 20 --max-time 60 \
        "${SOURCE_URL}" -o "${TEMP_DIR}/${SOURCE_NAME}.m3u")

    if [ "$HTTP_CODE" -ne 200 ] || ! grep -q "#EXTM3U" "${TEMP_DIR}/${SOURCE_NAME}.m3u" 2>/dev/null; then
        echo "[ERRO] Falha ao baixar ${SOURCE_NAME} (HTTP ${HTTP_CODE})"
        rm -f "${TEMP_DIR}/${SOURCE_NAME}.m3u"
    fi
done < "${SOURCES_TXT}"

echo "=== 2. Extraindo metadados para temp/ ==="
> "${CHANNELS_TXT}"
> "${URLS_TXT}"
> "${LOGOS_TXT}"
> "${IDS_TXT}"

for M3U_FILE in "${TEMP_DIR}"/*.m3u; do
    [ ! -f "${M3U_FILE}" ] && continue
    NAME_SRC=$(basename "${M3U_FILE}" .m3u)

    tr -d '\r' < "${M3U_FILE}" | awk \
        -v src="${NAME_SRC}" \
        -v f_chan="${CHANNELS_TXT}" \
        -v f_url="${URLS_TXT}" \
        -v f_logo="${LOGOS_TXT}" \
        -v f_id="${IDS_TXT}" '
        /^#EXTINF/ {
            nome = $0
            sub(/.*,/, "", nome)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", nome)
            gsub(/\xc2\xa0/, " ", nome)
            gsub(/[[:space:]]+/, " ", nome)

            logo = ""
            if (match($0, /tvg-logo="[^"]*"/)) {
                logo = substr($0, RSTART + 10, RLENGTH - 11)
            }

            tvgid = ""
            if (match($0, /tvg-id="[^"]*"/)) {
                tvgid = substr($0, RSTART + 8, RLENGTH - 9)
            }

            url = ""
            while (getline > 0) {
                gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
                if ($0 == "" || $0 ~ /^#/) continue
                url = $0
                break
            }

            if (nome != "") {
                print src "#" nome >> f_chan
                print src "#" nome "#" url >> f_url
                print src "#" nome "#" logo >> f_logo
                print src "#" nome "#" tvgid >> f_id
            }
        }
    '
done

for FILE in "${CHANNELS_TXT}" "${URLS_TXT}" "${LOGOS_TXT}" "${IDS_TXT}"; do
    LC_ALL=C sort -f -u "${FILE}" -o "${FILE}"
done

echo "=== 3. Atualizando favorites/favorites-channels.txt ==="
touch "${FAV_CHANNELS}"
cp -f "${FAV_CHANNELS}" "${TEMP_DIR}/prev-channels.txt"

awk -F'#' '
    idx == 1 {
        gsub(/\r/, "", $0)
        if ($0 == "") next
        linha_limpa = $0
        sub(/^#/, "", linha_limpa)
        chave = tolower(linha_limpa)

        if (!(chave in favs) || $0 !~ /^#/) {
            favs[chave] = $0
        }
        next
    }

    idx == 2 {
        gsub(/\r/, "", $0)
        if ($0 == "") next
        chave = tolower($0)

        if (!(chave in favs)) {
            favs[chave] = "#" $0
            novos++
        }
    }

    END {
        for (c in favs) print favs[c]
        print "Novos canais adicionados em favorites-channels.txt: " (novos + 0) > "/dev/stderr"
    }
' idx=1 "${FAV_CHANNELS}" idx=2 "${CHANNELS_TXT}" | LC_ALL=C sort -f -o "${FAV_CHANNELS}"

echo "Download e extração concluídos!"
