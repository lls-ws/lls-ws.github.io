#!/bin/bash
set -e

# 1. Roda a Parte 1 para preparar a pasta de trabalho limpa
bash step1_fetch_epg.sh

# 2. Atualiza o layout no step2_build_zip.sh e recompila o SimpleIPTV-LLS.zip
python3 -c '
p = "step2_build_zip.sh"
with open(p, "r", encoding="utf-8") as f:
    txt = f.read()

old_xml = """\t<Group id="sidebarGroup" translation="[0, 0]" visible="true">
\t\t<Rectangle width="620" height="1080" color="0x0B0F19E6" />
\t\t<Label text="LLS TV • Canais" translation="[50, 45]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" />
\t\t<LabelList
\t\t\tid="list"
\t\t\ttranslation="[50, 110]"
\t\t\titemSize="[520, 56]"
\t\t\tnumRows="15"
\t\t\tsectionDividerTextColor="0x38BDF8FF"
\t\t\tfocusedColor="0xFFFFFFFF"
\t\t\tcolor="0xCBD5E1FF" />
\t</Group>

\t<Group id="epgBanner" translation="[60, 860]" visible="false">
\t\t<Rectangle width="1800" height="170" color="0x0B0F19E6" />
\t\t<Label id="lblChannel" text="" translation="[35, 18]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" width="1730" />
\t\t<Label id="lblNow" text="Carregando guia..." translation="[35, 68]" font="font:SmallBoldSystemFont" color="0xFFFFFFFF" width="1730" />
\t\t<Label id="lblNext" text="" translation="[35, 112]" font="font:SmallSystemFont" color="0x94A3B8FF" width="1730" />
\t</Group>"""

new_xml = """\t<Group id="sidebarGroup" translation="[0, 0]" visible="true">
\t\t<Rectangle width="620" height="800" color="0x0B0F19E6" />
\t\t<Label text="LLS TV • Canais" translation="[50, 35]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" />
\t\t<LabelList
\t\t\tid="list"
\t\t\ttranslation="[50, 95]"
\t\t\titemSize="[520, 56]"
\t\t\tnumRows="11"
\t\t\tsectionDividerTextColor="0x38BDF8FF"
\t\t\tfocusedColor="0xFFFFFFFF"
\t\t\tcolor="0xCBD5E1FF" />
\t</Group>

\t<Group id="epgBanner" translation="[40, 820]" visible="false">
\t\t<Rectangle width="1840" height="220" color="0x0B0F19F2" />
\t\t<Label id="lblChannel" text="" translation="[35, 20]" font="font:LargeBoldSystemFont" color="0x38BDF8FF" width="1770" />
\t\t<Label id="lblNow" text="Carregando guia..." translation="[35, 85]" font="font:MediumBoldSystemFont" color="0xFACC15FF" width="1770" />
\t\t<Label id="lblNext" text="" translation="[35, 145]" font="font:MediumSystemFont" color="0xE2E8F0FF" width="1770" />
\t</Group>"""

assert old_xml in txt, "Bloco XML nao encontrado!"
with open(p, "w", encoding="utf-8") as f:
    f.write(txt.replace(old_xml, new_xml, 1))
print("Layout atualizado com sucesso!")
'

bash step2_build_zip.sh
