#!/bin/bash
# Script Gerenciador Principal - IPTV
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE}")" && pwd)"
TEXT_EDITOR="featherpad"

# Diretórios
CONFIG_DIR="${BASE_DIR}/config"
SCRIPTS_DIR="${BASE_DIR}/scripts"
FAV_DIR="${BASE_DIR}/favorites"

# Scripts das etapas
SCRIPT_DOWNLOAD="${SCRIPTS_DIR}/download.sh"
SCRIPT_FAVORITES="${SCRIPTS_DIR}/favorites.sh"
SCRIPT_PLAYLIST="${SCRIPTS_DIR}/playlist.sh"
SCRIPT_GITHUB="${SCRIPTS_DIR}/github.sh"
SCRIPT_CHECK="${SCRIPTS_DIR}/check.sh"

SCRIPT_DEDUPE="${SCRIPTS_DIR}/dedupe.sh"
FILE_PRIORITY="${CONFIG_DIR}/providers-priority.txt"
FILE_DUPLICATES_LOG="${FAV_DIR}/duplicates.log"

# Arquivos de configuração e edição
FILE_SOURCES="${CONFIG_DIR}/sources.txt"
FILE_EPG="${CONFIG_DIR}/epg.txt"
FILE_README="${BASE_DIR}/README.md"

FILE_NEWS_LOG="${FAV_DIR}/news-channels.log"
FILE_BROKEN_LOG="${FAV_DIR}/broken-links.log"

FILE_GROUPS_MAP="${CONFIG_DIR}/groups-map.txt"
FILE_GROUPS_ORDER="${CONFIG_DIR}/groups-map-order.txt"

FILE_FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"
FILE_FAV_IDS="${FAV_DIR}/favorites-ids.txt"
FILE_FAV_LOGOS="${FAV_DIR}/favorites-logos.txt"
FILE_FAV_URLS="${FAV_DIR}/favorites-urls.txt"
FILE_FAV_GROUPS="${FAV_DIR}/favorites-groups.txt"
FILE_OUT_M3U="${BASE_DIR}/LLS_TV.m3u"

show_help() {
    echo "====================================================================="
    echo "  GERENCIADOR DE PLAYLIST IPTV"
    echo "====================================================================="
    echo "Uso: bash $0 {comando}"
    echo ""
    echo "Comandos de Execução:"
    echo "  download     -> Baixa listas e atualiza favorites-channels.txt"
    echo "  favorites    -> Sincroniza IDs, Logos, URLs e Grupos dos ativos"
    echo "  playlist     -> Gera a playlist final LLS_TV.m3u"
    echo "  all          -> Executa todas as 3 etapas em sequência"
    echo "  update       -> Envia alterações e LLS_TV.m3u para o GitHub"
    echo ""
    echo "Comandos de Edição e Visualização:"
    echo "  edit-sources -> Abre sources.txt e epg.txt no editor"
    echo "  edit-groups  -> Abre groups-map.txt e favorites-groups.txt no editor"
    echo "  edit-config  -> Abre clean-words.txt e format-names.txt no editor"
    echo "  edit-docs    -> Abre README.md no editor"
    echo "  edit-favs    -> Abre favorites-channels.txt para ativar canais"
    echo "  edit-meta    -> Abre Logos, IDs e URLs para edição manual"
    echo "  news         -> Abre news-channels.log no editor"
    echo "  show         -> Abre a playlist final LLS_TV.m3u no editor"
    echo "  check        -> Testa todos os links da LLS_TV.m3u e gera broken-links.log"
    echo "  disable-broken -> Comenta (#) em favorites-channels.txt os canais do broken-links.log"
    echo "  dedupe       -> Lista canais duplicados em duplicates.log sem alterar nada"
    echo "  dedupe-apply -> Comenta (#) os duplicados mantendo só o melhor provedor"
    echo "  edit-prio    -> Abre providers-priority.txt para definir ordem dos provedores"
    echo "======================================================================"
}

case "$1" in
    download)
        bash "${SCRIPT_DOWNLOAD}"
        ;;
    favorites)
        bash "${SCRIPT_FAVORITES}"
        ;;
    playlist)
        bash "${SCRIPT_PLAYLIST}"
        ;;
    all)
        bash "${SCRIPT_DOWNLOAD}" && \
        bash "${SCRIPT_FAVORITES}" && \
        bash "${SCRIPT_PLAYLIST}"
        ;;
    update)
        bash "${SCRIPT_GITHUB}"
        ;;
    edit-sources)
        mkdir -p "${CONFIG_DIR}"
        touch "${FILE_SOURCES}" "${FILE_EPG}"
        ${TEXT_EDITOR} "${FILE_SOURCES}" "${FILE_EPG}" &
        ;;
    edit-groups)
        mkdir -p "${CONFIG_DIR}" "${FAV_DIR}"
        touch "${FILE_GROUPS_MAP}" "${FILE_GROUPS_ORDER}" "${FILE_FAV_GROUPS}"
        ${TEXT_EDITOR} "${FILE_GROUPS_MAP}" "${FILE_GROUPS_ORDER}" "${FILE_FAV_GROUPS}" &
        ;;
    edit-config)
        mkdir -p "${CONFIG_DIR}"
        touch "${CONFIG_DIR}/clean-words.txt" "${CONFIG_DIR}/format-names.txt"
        ${TEXT_EDITOR} "${CONFIG_DIR}/clean-words.txt" "${CONFIG_DIR}/format-names.txt" &
        ;;
    edit-docs)
        mkdir -p "${CONFIG_DIR}"
        touch "${FILE_README}"
        ${TEXT_EDITOR} "${FILE_README}" &
        ;;
    edit-favs)
        if [ ! -f "${FILE_FAV_CHANNELS}" ]; then
            echo "[AVISO] Arquivo não existe ainda. Rode 'bash $0 download' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_FAV_CHANNELS}" &
        ;;
    edit-meta)
        if [ ! -f "${FILE_FAV_LOGOS}" ]; then
            echo "[AVISO] Arquivos não existem ainda. Rode 'bash $0 favorites' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_FAV_LOGOS}" "${FILE_FAV_IDS}" "${FILE_FAV_URLS}" &
        ;;
    news)
        if [ ! -f "${FILE_NEWS_LOG}" ]; then
            echo "[AVISO] Arquivo news-channels.log ainda não existe (nenhum canal novo registrado)."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_NEWS_LOG}" &
        ;;
    show)
        if [ ! -f "${FILE_OUT_M3U}" ]; then
            echo "[AVISO] Playlist final não encontrada. Rode 'bash $0 playlist' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_OUT_M3U}" &
        ;;
    check)
        bash "${SCRIPT_CHECK}"
        if [ -f "${FILE_BROKEN_LOG}" ]; then
            ${TEXT_EDITOR} "${FILE_BROKEN_LOG}" &
        fi
        ;;
    disable-broken)
        if [ ! -f "${FILE_BROKEN_LOG}" ]; then
            echo "[AVISO] Arquivo broken-links.log não encontrado. Rode 'bash $0 check' primeiro."
            exit 1
        fi

        awk -F'  \\|  ' '
            idx == 1 {
                gsub(/\r/, "", $0)
                if ($0 ~ /^[A-Za-z0-9_-]+#/) {
                    quebrados[tolower($1)] = 1
                }
                next
            }
            idx == 2 {
                gsub(/\r/, "", $0)
                if ($0 != "" && $0 !~ /^[[:space:]]*#/ && (tolower($0) in quebrados)) {
                    print "#" $0
                    desativados++
                } else {
                    print $0
                }
            }
            END {
                print "Canais quebrados desativados (#) em favorites-channels.txt: " (desativados + 0) > "/dev/stderr"
            }
        ' idx=1 "${FILE_BROKEN_LOG}" idx=2 "${FILE_FAV_CHANNELS}" > "${FILE_FAV_CHANNELS}.tmp" \
        && mv "${FILE_FAV_CHANNELS}.tmp" "${FILE_FAV_CHANNELS}"
        ;;
    dedupe)
        chmod +x "${SCRIPT_DEDUPE}"
        bash "${SCRIPT_DEDUPE}" check
        [ -f "${FILE_DUPLICATES_LOG}" ] && ${TEXT_EDITOR} "${FILE_DUPLICATES_LOG}" &
        ;;
    dedupe-apply)
        chmod +x "${SCRIPT_DEDUPE}"
        bash "${SCRIPT_DEDUPE}" apply
        ;;
    edit-prio)
        mkdir -p "${CONFIG_DIR}"
        touch "${FILE_PRIORITY}"
        ${TEXT_EDITOR} "${FILE_PRIORITY}" &
        ;;

    *)
        show_help
        exit 1
        ;;
esac
