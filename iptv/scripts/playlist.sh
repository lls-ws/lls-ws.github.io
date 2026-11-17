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
        if (url == "" || url !~ /^https?:\/\//) {
            print "[AVISO] Canal sem URL http válida ignorado: " canal " (" fonte ")" > "/dev/stderr"
            next
        }


        # 1. Links Ottera com network_id: mantém apenas até network_id=XXXX
        if (url ~ /stream\.ads\.ottera\.tv\/playlist\.m3u8\?network_id=[0-9]+/) {
            sub(/&.*$/, "", url)
        }
        # 2. Links Xumo/CloudFront da LG: mantém identificação inicial e corta a partir de &ads.did=
        else if (url ~ /cloudfront\.net\/hls\/master\.m3u8\?.*xumo_channelId=/) {
            sub(/&ads\.did=.*$/, "", url)
        }
        # 3. Links NewID (Cindie LG): mantém apikey/auth e corta a partir de &ads.live=
        else if (url ~ /ads\.its-newid\.net\/api\/manifest\.m3u8/) {
            sub(/&ads\.live=.*$/, "", url)
        }
        # 4. Links com placeholders/trackers que NÃO usam API de passthrough/id na query
        else if (url ~ /\?/ && url !~ /xumo_channelId=/ && url !~ /channel_id=/ && url !~ /[\?&]id=/) {
            if (url ~ /\[.*\]/ || url ~ /\{\{.*\}\}/ || url ~ /REPLACE_ME/ || url ~ /[\?&]ads\./ || url ~ /[\?&]tag_id=/) {
                sub(/\?.*$/, "", url)
            }
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

WORDS_REGEX=$(tr -d '\r' < "${CLEAN_WORDS_TXT}" | grep -vE '^[[:space:]]*(#|$)' | sed 's/[.[\*^$()+?{|/]/\\&/g' | paste -sd '|' -)

sed -i -E '/^#EXTINF/ {
    h
    s/,[^,]*$//
    x
    s/^.*,//
    s/^[0-9]+[[:space:]-]*//
    s/\(//g
    s/\)//g
    s/\[//g
    s/\]//g
    s/\|//g
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

echo "Ordenando playlist por prioridade de grupos (groups-map-order.txt)..."

GROUPS_ORDER_TXT="${CONFIG_DIR}/groups-map-order.txt"

if [ ! -f "${GROUPS_ORDER_TXT}" ]; then
    cat << 'EOF' > "${GROUPS_ORDER_TXT}"
1#Filmes
2#Séries
3#Ação & Luta
4#Terror & Suspense
5#Comédia & Romance
6#Faroeste & Clássicos
7#TV & Variedades
EOF
fi

python3 - "${GROUPS_ORDER_TXT}" "${OUT_M3U}" << 'EOF'
import sys, re

order_file, m3u_file = sys.argv[1:3]

# 1. Carrega prioridades de grupos (order_number#group_map)
prioridades = {}
with open(order_file, "r", encoding="utf-8") as f:
    for line in f:
        l = line.strip()
        if not l or l.startswith("#") or "#" not in l:
            continue
        num_str, grp = l.split("#", 1)
        try:
            prioridades[grp.strip().lower()] = int(num_str.strip())
        except ValueError:
            pass

# 2. Lê cabeçalho e blocos de canais (#EXTINF + URL)
with open(m3u_file, "r", encoding="utf-8") as f:
    linhas = f.readlines()

cabecalho = linhas[0] if linhas and linhas[0].startswith("#EXTM3U") else "#EXTM3U\n"
entradas = []

i = 1 if linhas and linhas[0].startswith("#EXTM3U") else 0
while i < len(linhas):
    l = linhas[i].rstrip("\r\n")
    if l.startswith("#EXTINF"):
        url = linhas[i + 1].rstrip("\r\n") if (i + 1) < len(linhas) else ""
        m_grp = re.search(r'group-title="([^"]*)"', l)
        grupo = m_grp.group(1) if m_grp else "NOGROUP"
        nome = l.rsplit(",", 1)[-1].strip()
        rank = prioridades.get(grupo.lower(), 999)
        entradas.append((rank, grupo.lower(), nome.lower(), l, url))
        i += 2
    else:
        i += 1

# 3. Ordena por: prioridade do grupo -> nome do grupo -> nome do canal
entradas.sort(key=lambda x: (x[0], x[1], x[2]))

# 4. Reescreve playlist.m3u ordenada
with open(m3u_file, "w", encoding="utf-8") as f:
    f.write(cabecalho.rstrip("\r\n") + "\n")
    for _, _, _, extinf, url in entradas:
        f.write(f"{extinf}\n{url}\n")

print(f"Playlist ordenada com sucesso! ({len(entradas)} canais organizados)")
EOF
