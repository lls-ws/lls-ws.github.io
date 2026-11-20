bash step1_fetch_epg.sh

python3 -c '
p = "step2_build_zip.sh"
with open(p, "r", encoding="utf-8") as f:
    txt = f.read()

old_xml = """\t<Group id="sidebarGroup" translation="" visible="true">
\t\t<Rectangle width="620" height="800" color="0x0B0F19E6" />
\t\t<Label text="LLS TV • Canais" translation="" font="font:MediumBoldSystemFont" color="0x38BDF8FF" />
\t\t<LabelList
\t\t\tid="list"
\t\t\ttranslation=""
\t\t\titemSize=""
\t\t\tnumRows="11"
\t\t\tsectionDividerTextColor="0x38BDF8FF"
\t\t\tfocusedColor="0xFFFFFFFF"
\t\t\tcolor="0xCBD5E1FF" />
\t</Group>

\t<Group id="epgBanner" translation="" visible="false">
\t\t<Rectangle width="1840" height="220" color="0x0B0F19F2" />
\t\t<Label id="lblChannel" text="" translation="" font="font:LargeBoldSystemFont" color="0x38BDF8FF" width="1770" />
\t\t<Label id="lblNow" text="Carregando guia..." translation="" font="font:MediumBoldSystemFont" color="0xFACC15FF" width="1770" />
\t\t<Label id="lblNext" text="" translation="" font="font:MediumSystemFont" color="0xE2E8F0FF" width="1770" />
\t</Group>"""

new_xml = """\t<Group id="sidebarGroup" translation="" visible="true">
\t\t<Rectangle width="620" height="790" color="0x0B0F19E6" />
\t\t<Label text="LLS TV • Canais" translation="" font="font:MediumBoldSystemFont" color="0x38BDF8FF" />
\t\t<LabelList
\t\t\tid="list"
\t\t\ttranslation=""
\t\t\titemSize=""
\t\t\tnumRows="10"
\t\t\tsectionDividerTextColor="0x38BDF8FF"
\t\t\tfocusedColor="0xFFFFFFFF"
\t\t\tcolor="0xCBD5E1FF" />
\t</Group>

\t<Group id="epgBanner" translation="" visible="false">
\t\t<Rectangle width="1840" height="230" color="0x0B0F19F2" />
\t\t<Label id="lblChannel" text="" translation="" font="font:MediumBoldSystemFont" color="0x38BDF8FF" width="1770" />
\t\t<Label id="lblNow" text="Carregando guia..." translation="" font="font:LargeBoldSystemFont" color="0xFACC15FF" width="1770" />
\t\t<Label id="lblNext" text="" translation="" font="font:MediumSystemFont" color="0xE2E8F0FF" width="1770" />
\t</Group>"""

assert old_xml in txt, "Bloco XML nao encontrado!"
with open(p, "w", encoding="utf-8") as f:
    f.write(txt.replace(old_xml, new_xml, 1))
print("Ajuste fino aplicado com sucesso!")
'

bash step2_build_zip.sh
