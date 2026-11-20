#!/bin/bash
# Create KwickPlayer-LLS
set -e

WORK_DIR="kwick-edit"
DIR_EDIT="${WORK_DIR}/app_src"

API_HOST="https://api.github.com"
REPO_PATH="repos/Kwickflix/kwicktv-roku/releases?per_page=1"
API_URL="${API_HOST}/${REPO_PATH}"

RELEASE_DATA=$(curl -fsSL -H "User-Agent: Mozilla/5.0" "${API_URL}")

DOWNLOAD_URL=$(echo "$RELEASE_DATA" | python3 -c "
import sys, json
data = json.load(sys.stdin)
rel = data[0] if isinstance(data, list) and data else {}
assets = rel.get('assets', [])
print(next((a['browser_download_url'] for a in assets if a['name'].endswith('.zip')), ''))
")

FILE_ZIP=$(basename "$DOWNLOAD_URL")
FILE_LLS="${FILE_ZIP/-Roku-/-LLS-}"

echo "Baixando: ${FILE_ZIP}"
rm -rf "${WORK_DIR}"
mkdir -p "${DIR_EDIT}"
curl -fL -H "User-Agent: Mozilla/5.0" -o "${WORK_DIR}/${FILE_ZIP}" "${DOWNLOAD_URL}"
unzip -q "${WORK_DIR}/${FILE_ZIP}" -d "${DIR_EDIT}"

python3 -c '
import re
p = "kwick-edit/app_src/source/utils/Store.brs"
with open(p, "r", encoding="utf-8", newline="") as f:
    txt = f.read()

pattern = r"function LoadProviders\(\) as object\r?\n\s*raw = RegRead\(\"providers\"\)\r?\n\s*if raw = \"\" then return \[\]"

replacement = """function LoadProviders() as object
    raw = RegRead("providers")
    if raw = ""
        return [{
            id: "lls_tv_default",
            ptype: "m3u",
            name: "LLS TV",
            m3uUrl: "https://lls-ws.github.io/iptv/LLS_TV.m3u",
            epgUrl: "https://lls-ws.github.io/iptv/guide.xml.gz"
        }]
    end if"""

new_txt, count = re.subn(pattern, replacement, txt, count=1)
assert count == 1, "LoadProviders nao encontrada!"
with open(p, "w", encoding="utf-8", newline="") as f:
    f.write(new_txt)
print("Store.brs atualizado!")
'

rm -f KwickPlayer-LLS-*.zip
(cd "${DIR_EDIT}" && zip -qr "../../${FILE_LLS}" .)
rm -rf "${WORK_DIR}"

ls -alh "${FILE_LLS}"
sudo /usr/bin/git_remote.sh "lls-ws.github.io"
