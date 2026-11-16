#!/bin/bash
# Etapa 3: Montagem da playlist final playlist.m3u
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd)"
CONFIG_DIR="${BASE_DIR}/config"
FAV_DIR="${BASE_DIR}/favorites"

EPG_TXT="${CONFIG_DIR}/epg.txt"
CLEAN_WORDS_TXT="${CONFIG_DIR}/clean-words.txt"
FORMAT_NAMES_TXT="${CONFIG_DIR}/format-names.txt"

FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"
FAV_IDS="${FAV_DIR}/favorites-ids.txt"
FAV_LOGOS="${FAV_DIR}/favorites-logos.txt"
FAV_URLS="${FAV_DIR}/favorites-urls.txt"
FAV_GROUPS="${FAV_DIR}/favorites-groups.txt"
OUT_M3U="${BASE_DIR}/playlist.m3u"

if [ ! -f "${FAV_CHANNELS}" ]; then
    echo "[ERRO] Arquivo ${FAV_CHANNELS} não encontrado!"
    exit 1
fi

mkdir -p "${CONFIG_DIR}"
touch "${FAV_IDS}" "${FAV_LOGOS}" "${FAV_URLS}" "${FAV_GROUPS}"

# Cria config/clean-words.txt padrão se não existir
if [ ! -f "${CLEAN_WORDS_TXT}" ]; then
    cat << 'EOF' > "${CLEAN_WORDS_TXT}"
Brasil
Portuguese
LITE
TV
Pluto
CANAL 4 FILMES
Grátis
Gratuitas
Brazil
Soul
HD
E Filmes
EOF
fi

# Cria config/format-names.txt padrão se não existir
if [ ! -f "${FORMAT_NAMES_TXT}" ]; then
    cat << 'EOF' > "${FORMAT_NAMES_TXT}"
CINDIE
SONY ONE EMOÇÕES
TOP MIX
EOF
fi

echo "=== Gerando playlist final: ${OUT_M3U} ==="

EPG_URL=""
if [ -s "${EPG_TXT}" ]; then
    EPG_URL=$(tr -d '\r' < "${EPG_TXT}" | grep -vE '^[[:space:]]*(#|$)' | head -n 1 | cut -d '#' -f 2-)
fi

if [ -n "${EPG_URL}" ]; then
    echo "#EXTM3U x-tvg-url=\"${EPG_URL}\"" > "${OUT_M3U}"
else
    echo "#EXTM3U" > "${OUT_M3U}"
fi

awk -F'#' '
    idx == 1 { gsub(/\r/, "", $0); if ($0 != "") ids[tolower($1 "#" $2)] = substr($0, length($1 "#" $2 "#") + 1); next }
    idx == 2 { gsub(/\r/, "", $0); if ($0 != "") logos[tolower($1 "#" $2)] = substr($0, length($1 "#" $2 "#") + 1); next }
    idx == 3 { gsub(/\r/, "", $0); if ($0 != "") urls[tolower($1 "#" $2)] = substr($0, length($1 "#" $2 "#") + 1); next }
    idx == 4 { gsub(/\r/, "", $0); if ($0 != "") groups[tolower($1 "#" $2)] = substr($0, length($1 "#" $2 "#") + 1); next }

    idx == 5 {
        gsub(/\r/, "", $0)
        if ($0 == "" || $0 ~ /^[[:space:]]*#/) next

        fonte = $1
        canal = $2
        chave = tolower(fonte "#" canal)

        url = (chave in urls) ? urls[chave] : ""
        if (url == "") {
            print "[AVISO] Canal sem URL ignorado: " canal " (" fonte ")" > "/dev/stderr"
            next
        }

        id    = (chave in ids)    ? ids[chave]    : ""
        logo  = (chave in logos)  ? logos[chave]  : ""
        grupo = (chave in groups && groups[chave] != "") ? groups[chave] : "NOGROUP"

        printf "#EXTINF:-1 tvg-id=\"%s\" tvg-logo=\"%s\" group-title=\"%s\",%s\n%s\n", id, logo, grupo, canal, url
        total++
    }
    END {
        print "Playlist gerada com sucesso! Total de canais: " (total + 0) > "/dev/stderr"
    }
' idx=1 "${FAV_IDS}" idx=2 "${FAV_LOGOS}" idx=3 "${FAV_URLS}" idx=4 "${FAV_GROUPS}" idx=5 "${FAV_CHANNELS}" >> "${OUT_M3U}"

echo "Limpando tags, números e palavras configuradas em clean-words.txt..."

# Monta a expressão regular com as palavras de clean-words.txt
WORDS_REGEX=$(tr -d '\r' < "${CLEAN_WORDS_TXT}" | grep -vE '^[[:space:]]*(#|$)' | sed 's/[.[\*^$()+?{|]/\\&/g' | paste -sd '|' -)

sed -i -E '/^#EXTINF/ {
    h
    s/,[^,]*$//
    x
    s/^.*,//
    s/^[0-9]+[[:space:]-]*//
    s/\(BR\)//g
    s/\|//g
    s/\(//g
    s/\)//g
    s/[[:space:]]+-[[:space:]]+/ /g
    '"${WORDS_REGEX:+s/\\b(${WORDS_REGEX})\\b//g}"'
    s/^[[:space:]]+//g
    s/[[:space:]]{2,}/ /g
    s/[[:space:]]+$//g
    H
    g
    s/\n/,/
}' "${OUT_M3U}"

echo "Formatando nomes configurados em format-names.txt..."

awk '
    idx == 1 {
        gsub(/\r/, "", $0)
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
        if ($0 != "" && $0 !~ /^#/) {
            alvo[tolower($0)] = 1
        }
        next
    }
    idx == 2 {
        if ($0 ~ /^#EXTINF/) {
            pos = match($0, /,[^,]*$/)
            inicio = substr($0, 1, pos)
            nome = substr($0, pos + 1)

            if (tolower(nome) in alvo) {
                nome = tolower(nome)
                novo_nome = ""
                for (j = 1; j <= length(nome); j++) {
                    c = substr(nome, j, 1)
                    ant = (j == 1) ? " " : substr(nome, j - 1, 1)
                    if (ant == " ") {
                        c = toupper(c)
                    }
                    novo_nome = novo_nome c
                }
                $0 = inicio novo_nome
            }
        }
        print $0
    }
' idx=1 "${FORMAT_NAMES_TXT}" idx=2 "${OUT_M3U}" > "${OUT_M3U}.tmp" && mv "${OUT_M3U}.tmp" "${OUT_M3U}"
