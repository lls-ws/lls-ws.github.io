#!/bin/bash
# Etapa 2: Sincronização de IDs, Logos, URLs, Grupos e detecção de novos canais
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${${BASH_SOURCE[0]}}")/.." && pwd)"
CONFIG_DIR="${BASE_DIR}/config"
TEMP_DIR="${BASE_DIR}/temp"
FAV_DIR="${BASE_DIR}/favorites"

GROUPS_MAP_TXT="${CONFIG_DIR}/groups-map.txt"

FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"
FAV_IDS="${FAV_DIR}/favorites-ids.txt"
FAV_LOGOS="${FAV_DIR}/favorites-logos.txt"
FAV_URLS="${FAV_DIR}/favorites-urls.txt"
FAV_GROUPS="${FAV_DIR}/favorites-groups.txt"
NEWS_LOG="${FAV_DIR}/news-channels.log"

TEMP_NAMES="${TEMP_DIR}/channels-names.txt"

if [ ! -f "${FAV_CHANNELS}" ]; then
    echo "[ERRO] Arquivo ${FAV_CHANNELS} não encontrado!"
    exit 1
fi

mkdir -p "${CONFIG_DIR}" "${TEMP_DIR}" "${FAV_DIR}"
touch "${FAV_IDS}" "${FAV_LOGOS}" "${FAV_URLS}" "${FAV_GROUPS}"
touch "${TEMP_NAMES}" "${TEMP_DIR}/channels-ids.txt" "${TEMP_DIR}/channels-logos.txt" "${TEMP_DIR}/channels-urls.txt"

# Cria config/groups-map.txt padrão se não existir
if [ ! -f "${GROUPS_MAP_TXT}" ]; then
    cat << 'EOF' > "${GROUPS_MAP_TXT}"
Séries#Séries|Series|CSI|NCIS|TV Series|FilmRise|Aliens|Sony One Emoções
Clássicos#Clássicos|Classicos|Classic|Classique|Cult|Channel Network
Terror#Terror|Espanto|Halloween|Trash|Medo|Booh!
Suspense#Suspense|Crime|Criminais
Ficção#Sci-Fi|Ficção|Ficcao|Scifi|Dark Matter
Comédia#Comédia|Comedia|Fun
Romance#Romance|Romântica|Romantica|Paixão|Paixao|Luz E Amor|Spark|MyTime
Drama#Drama|Emotion|Touch|Inspiração|Inspiracao|Esperança|Esperanca|Vida Real
Família#Familia|Família|Family|Aventura
Ação#Ação|Acao|Action|Adrenalina|Luta
Variedades#A&E|AXN|Filmzie|Nacionais|Movie Mania|TOP MIX|Sony Channel
Top#AMC|Telecine|Filmelier|Runtime|Cindie|Moviesphere|Film Plus|Netmovies|Sony One Cinema|Sucessos|Studio Universal
EOF
fi

echo "=== 1. Detectando novos canais para news-channels.log ==="

REF_CHANNELS="${TEMP_DIR}/prev-channels.txt"
[ ! -f "${REF_CHANNELS}" ] && REF_CHANNELS="${FAV_CHANNELS}"

NOVOS_TMP=$(mktemp)

awk -F'#' '
    idx == 1 {
        gsub(/\r/, "", $0)
        gsub(/\xc2\xa0/, " ", $0)
        gsub(/[[:space:]]+/, " ", $0)
        if ($0 == "") next
        sub(/^[[:space:]]*#/, "", $0)
        chave = tolower($1 "#" $2)
        conhecidos[chave] = 1
        next
    }
    idx == 2 {
        gsub(/\r/, "", $0)
        gsub(/\xc2\xa0/, " ", $0)
        gsub(/[[:space:]]+/, " ", $0)
        if ($0 == "") next
        chave = tolower($1 "#" $2)
        if (!(chave in conhecidos)) {
            novos[$1 "#" $2] = 1
        }
    }
    END {
        for (c in novos) {
            print c
        }
    }
' idx=1 "${REF_CHANNELS}" idx=2 "${TEMP_NAMES}" | LC_ALL=C sort -f -u > "${NOVOS_TMP}"

QTD_NOVOS=$(wc -l < "${NOVOS_TMP}")

if [ "${QTD_NOVOS}" -gt 0 ]; then
    DATA_ATUAL=$(date '+%d/%m/%Y às %H:%M:%S')
    LOG_TMP=$(mktemp)
    touch "${NEWS_LOG}"

    {
        echo "=========================================================="
        echo "Verificação em: ${DATA_ATUAL} (${QTD_NOVOS} novos canais)"
        echo "=========================================================="
        cat "${NOVOS_TMP}"
        echo ""
        cat "${NEWS_LOG}"
    } > "${LOG_TMP}" && mv "${LOG_TMP}" "${NEWS_LOG}"

    echo "Adicionados ${QTD_NOVOS} novos canais no topo de ${NEWS_LOG}"
else
    echo "Nenhum canal inédito encontrado nesta verificação."
fi

rm -f "${NOVOS_TMP}"

echo "=== 2. Atualizando arquivos de favoritos ==="

ACTIVE_TMP=$(mktemp)
tr -d '\r' < "${FAV_CHANNELS}" | grep -vE '^[[:space:]]*(#|$)' | LC_ALL=C sort -f -u > "${ACTIVE_TMP}"

if [ ! -s "${ACTIVE_TMP}" ]; then
    echo "[AVISO] Nenhum canal ativo (sem '#' no início) encontrado em ${FAV_CHANNELS}."
fi

sync_favorite_file() {
    local TARGET_FILE="$1"
    local TEMP_REF_FILE="$2"
    local DEFAULT_VAL="$3"

    awk -F'#' -v def="${DEFAULT_VAL}" '
        idx == 1 {
            gsub(/\r/, "", $0)
            if ($0 == "") next
            chave = tolower($1 "#" $2)
            val_tmp = substr($0, length($1 "#" $2 "#") + 1)
            tmp_val[chave] = val_tmp
            next
        }

        idx == 2 {
            gsub(/\r/, "", $0)
            if ($0 == "") next
            chave = tolower($1 "#" $2)
            val_man = substr($0, length($1 "#" $2 "#") + 1)
            if (val_man != "") {
                manual_val[chave] = val_man
            }
            next
        }

        idx == 3 {
            gsub(/\r/, "", $0)
            if ($0 == "") next
            chave = tolower($1 "#" $2)

            val = ""
            if (chave in manual_val) {
                val = manual_val[chave]
            } else if (chave in tmp_val && tmp_val[chave] != "") {
                val = tmp_val[chave]
            } else {
                val = def
            }
            print $1 "#" $2 "#" val
        }
    ' idx=1 "${TEMP_REF_FILE}" idx=2 "${TARGET_FILE}" idx=3 "${ACTIVE_TMP}" > "${TARGET_FILE}.tmp" \
    && mv "${TARGET_FILE}.tmp" "${TARGET_FILE}"
}

sync_favorite_file "${FAV_IDS}"    "${TEMP_DIR}/channels-ids.txt"   ""
sync_favorite_file "${FAV_LOGOS}"  "${TEMP_DIR}/channels-logos.txt" ""
sync_favorite_file "${FAV_URLS}"   "${TEMP_DIR}/channels-urls.txt"  ""

# Gera referência de grupos a partir de config/groups-map.txt
MAPPED_GROUPS_REF=$(mktemp)
awk -F'#' '
    idx == 1 {
        gsub(/\r/, "", $0)
        if ($0 == "" || $0 ~ /^[[:space:]]*#/) next
        grp_nome = $1
        grp_padrao = tolower(substr($0, length(grp_nome "#") + 1))
        if (grp_nome != "" && grp_padrao != "") {
            map_ordem[++total_map] = grp_nome
            map_regex[total_map] = grp_padrao
        }
        next
    }
    idx == 2 {
        gsub(/\r/, "", $0)
        if ($0 == "") next
        canal_low = tolower($2)
        grupo_encontrado = ""
        for (m = 1; m <= total_map; m++) {
            if (canal_low ~ map_regex[m]) {
                grupo_encontrado = map_ordem[m]
                break
            }
        }
        print $1 "#" $2 "#" grupo_encontrado
    }
' idx=1 "${GROUPS_MAP_TXT}" idx=2 "${ACTIVE_TMP}" > "${MAPPED_GROUPS_REF}"

sync_favorite_file "${FAV_GROUPS}" "${MAPPED_GROUPS_REF}" "NOGROUP"
rm -f "${MAPPED_GROUPS_REF}" "${ACTIVE_TMP}"

echo "Arquivos sincronizados com sucesso:"
wc -l "${FAV_IDS}" "${FAV_LOGOS}" "${FAV_URLS}" "${FAV_GROUPS}" "${NEWS_LOG}"
