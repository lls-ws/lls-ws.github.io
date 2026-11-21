#!/bin/bash
set -e

WORK_DIR="simple-iptv-edit"
FILE_LLS="SimpleIPTV-LLS.zip"

SITE_HOST="https://lls-ws.github.io"
M3U_URL="${SITE_HOST}/iptv/LLS_TV.m3u"

XML_NS="http://w3.org"
ROKU_XSD="http://roku.com"

# Garante indices corretos nos arquivos da Parte 1 caso o navegador tenha cortado colchetes
python3 -c '
p1 = "simple-iptv-edit/components/get_channel_list/get_channel_list.brs"
with open(p1, "r", encoding="utf-8") as f:
    t1 = f.read()
t1 = t1.replace("item.url = maPath.Trim()", "item.url = maPath[1].Trim()")
t1 = t1.replace("maGrp <> \"\"", "maGrp[1] <> \"\"").replace("groupName = maGrp\n", "groupName = maGrp[1]\n")
t1 = t1.replace("tvgId = maId\n", "tvgId = maId[1]\n").replace("title = maExtinf\n", "title = maExtinf[2]\n")
with open(p1, "w", encoding="utf-8") as f:
    f.write(t1)

p2 = "simple-iptv-edit/components/get_epg/get_epg.brs"
with open(p2, "r", encoding="utf-8") as f:
    t2 = f.read()
t2 = t2.replace("titleNodes.GetText()", "titleNodes[0].GetText()")
with open(p2, "w", encoding="utf-8") as f:
    f.write(t2)
'

# 4. Atualiza MainScene.xml (Video tela cheia + Menu lateral sobreposto + Barra EPG)
cat << 'EOF' > "${WORK_DIR}/components/MainScene/MainScene.xml"
<?xml version="1.0" encoding="UTF-8"?>
<component name="MainScene" extends="Scene" xmlns:xsi="__XML_NS__" xsi:noNamespaceSchemaLocation="__ROKU_XSD__">
<script type="text/brightscript" uri="pkg:/components/MainScene/MainScene.brs"/>
<children>
	<Video id="Video" translation="[0, 0]" width="1920" height="1080" />

	<!-- Painel Lateral Esquerdo (Canais) -->
	<Group id="sidebarGroup" translation="[40, 20]" visible="true">
		<Rectangle width="620" height="790" color="0x0B0F19E6" />
		<Label text="LLS TV • Canais" translation="[25, 25]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" />
		<LabelList id="list" translation="[25, 95]" itemSize="[570, 62]" numRows="10" sectionDividerTextColor="0x38BDF8FF" focusedColor="0x0B0F19FF" color="0xCBD5E1FF" />
	</Group>

	<!-- Painel Lateral Direito (Sinopse / Descrição EPG) -->
	<Group id="descGroup" translation="[1140, 20]" visible="false">
		<Rectangle width="740" height="790" color="0x0B0F19F2" />
		<Label id="lblDescHeader" text="SINOPSE" translation="[30, 25]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" width="680" />
		<Label id="lblDescTitle" text="" translation="[30, 75]" font="font:MediumBoldSystemFont" color="0xFACC15FF" width="680" wrap="true" maxLines="2" />
		<Group id="descViewport" translation="[30, 175]" clippingRect="[0, 0, 680, 585]" focusable="true"><Group id="descContent" translation="[0, 0]" /></Group>
	</Group>

	<!-- Banner Inferior de EPG -->
	<Group id="epgBanner" translation="[40, 825]" visible="false">
		<Rectangle width="1840" height="230" color="0x0B0F19F2" />
		<Label id="lblChannel" text="" translation="[30, 20]" font="font:MediumBoldSystemFont" color="0x38BDF8FF" width="1780" />
		<Label id="lblNow" text="Carregando guia..." translation="[30, 70]" font="font:LargeBoldSystemFont" color="0xFACC15FF" width="1780" />
		<Label id="lblNext" text="" translation="[30, 145]" font="font:SmallSystemFont" color="0xE2E8F0FF" width="1780" />
	</Group>

	<Timer id="osdTimer" repeat="false" duration="5" />
	<get_channel_list id="get_channel_list" control="STOP" />
	<get_epg id="get_epg" control="STOP" />
	<save_feed_url id="save_feed_url" control="STOP" />
</children>
</component>
EOF
sed -i "s|__XML_NS__|${XML_NS}|g" "${WORK_DIR}/components/MainScene/MainScene.xml"
sed -i "s|__ROKU_XSD__|${ROKU_XSD}|g" "${WORK_DIR}/components/MainScene/MainScene.xml"

# 5. Atualiza MainScene.brs
cat << 'EOF' > "${WORK_DIR}/components/MainScene/MainScene.brs"
sub init()
	m.top.backgroundURI = "pkg:/images/rsgde_bg_hd.jpg"
	if m.global.feedurl = invalid or m.global.feedurl = "" then m.global.feedurl = "__M3U_URL__"

	m.save_feed_url = m.top.FindNode("save_feed_url")
	m.get_channel_list = m.top.FindNode("get_channel_list")
	m.get_channel_list.ObserveField("content", "SetContent")
	m.get_epg = m.top.FindNode("get_epg")
	m.get_epg.ObserveField("epgData", "onEpgLoaded")

	m.sidebarGroup = m.top.FindNode("sidebarGroup")
	m.list = m.top.FindNode("list")
	m.list.ObserveField("itemSelected", "onListChannelSelected")
	m.list.ObserveField("itemFocused", "onListChannelFocused")

	m.descGroup = m.top.FindNode("descGroup")
	m.lblDescTitle = m.top.FindNode("lblDescTitle")
	m.descViewport = m.top.FindNode("descViewport")
	m.descContent = m.top.FindNode("descContent")
	m.descScrollY = 0
	m.descMaxScroll = 0

	m.video = m.top.FindNode("Video")
	m.video.ObserveField("state", "checkState")

	m.epgBanner = m.top.FindNode("epgBanner")
	m.lblChannel = m.top.FindNode("lblChannel")
	m.lblNow = m.top.FindNode("lblNow")
	m.lblNext = m.top.FindNode("lblNext")

	m.osdTimer = m.top.FindNode("osdTimer")
	m.osdTimer.ObserveField("fire", "hideOsd")

	m.flatChannels = []
	m.currentIndex = 0
	m.epgMap = {}

	m.get_channel_list.control = "RUN"
	m.get_epg.control = "RUN"
end sub

sub SetContent()
	root = m.get_channel_list.content
	if root = invalid then return
	m.list.content = root
	m.flatChannels = []

	if root.getChildCount() > 0 and root.getChild(0).getChildCount() > 0
		for s = 0 to root.getChildCount() - 1
			sec = root.getChild(s)
			for c = 0 to sec.getChildCount() - 1
				m.flatChannels.Push({ node: sec.getChild(c), secIdx: s, itemIdx: c })
			end for
		end for
	else
		for c = 0 to root.getChildCount() - 1
			m.flatChannels.Push({ node: root.getChild(c), secIdx: 0, itemIdx: c })
		end for
	end if

	m.sidebarGroup.visible = true
	m.descGroup.visible = false
	m.list.SetFocus(true)
	if m.flatChannels.Count() > 0 then playChannelByIndex(0, false)
end sub

sub onEpgLoaded()
	if m.get_epg.epgData <> invalid
		m.epgMap = m.get_epg.epgData
		updateEpgBanner()
	end if
end sub

sub onListChannelFocused()
	idx = getFlatIndexFromList()
	if idx >= 0 and idx < m.flatChannels.Count() then showEpgForNode(m.flatChannels[idx].node)
end sub

sub onListChannelSelected()
	idx = getFlatIndexFromList()
	if idx >= 0 then playChannelByIndex(idx, true)
end sub

function getFlatIndexFromList() as integer
	if m.list.content = invalid then return -1
	if m.list.content.getChild(0).getChild(0) = invalid
		return m.list.itemFocused
	else
		itemRel = m.list.itemFocused
		for i = 0 to m.list.currFocusSection - 1
			itemRel = itemRel - m.list.content.getChild(i).getChildCount()
		end for
		for k = 0 to m.flatChannels.Count() - 1
			if m.flatChannels[k].secIdx = m.list.currFocusSection and m.flatChannels[k].itemIdx = itemRel then return k
		end for
	end if
	return -1
end function

sub playChannelByIndex(idx as integer, closeSidebar as boolean)
	if m.flatChannels.Count() = 0 then return
	if idx < 0 then idx = m.flatChannels.Count() - 1
	if idx >= m.flatChannels.Count() then idx = 0

	m.currentIndex = idx
	content = m.flatChannels[idx].node

	if closeSidebar
		m.descGroup.visible = false
		m.sidebarGroup.visible = false
		m.list.SetFocus(false)
		m.descViewport.SetFocus(false)
		m.top.SetFocus(true)
	end if

	showEpgForNode(content)
	if m.video.content <> invalid and m.video.content.url = content.url then return

	content.streamFormat = "hls"
	content.HttpSendClientCertificates = true
	content.HttpCertificatesFile = "common:/certs/ca-bundle.crt"
	m.video.EnableCookies()
	m.video.SetCertificatesFile("common:/certs/ca-bundle.crt")
	m.video.InitClientCertificates()

	m.video.content = content
	m.video.trickplaybarvisibilityauto = false
	m.video.control = "play"
end sub

sub showEpgForNode(chNode as object)
	if chNode = invalid then return
	m.lblChannel.text = chNode.title
	tvgId = chNode.id

	if tvgId <> "" and m.epgMap.DoesExist(tvgId)
		info = m.epgMap[tvgId]
		if info.nowTitle <> ""
			m.lblNow.text = "AGORA (" + info.nowTime + "): " + info.nowTitle
			m.lblDescTitle.text = info.nowTitle + " (" + info.nowTime + ")"
		else
			m.lblNow.text = "AGORA: Programação não informada"
			m.lblDescTitle.text = chNode.title
		end if
		m.lblNext.text = ""
		if info.nextTitle <> "" then m.lblNext.text = "A SEGUIR (" + info.nextTime + "): " + info.nextTitle

		nowDescTxt = "Sem sinopse disponível para o programa atual."
		if info.nowDesc <> invalid and info.nowDesc <> "" then nowDescTxt = info.nowDesc
		nextHeaderTxt = ""
		nextDescTxt = ""
		if info.nextTitle <> ""
			nextHeaderTxt = "A SEGUIR (" + info.nextTime + "): " + info.nextTitle
			if info.nextDesc <> invalid and info.nextDesc <> "" then nextDescTxt = info.nextDesc
		end if
		renderColoredDesc(nowDescTxt, nextHeaderTxt, nextDescTxt)
	else
		m.lblNow.text = "Guia de programação indisponível para este canal"
		m.lblNext.text = ""
		m.lblDescTitle.text = chNode.title
		renderColoredDesc("Guia de programação indisponível para este canal.", "", "")
	end if

	m.epgBanner.visible = true
	m.osdTimer.control = "stop"
	m.osdTimer.control = "start"
end sub


sub renderColoredDesc(nowTxt as string, nextHdr as string, nextTxt as string)
	if m.descContent = invalid then return
	while m.descContent.getChildCount() > 0
		m.descContent.RemoveChildIndex(0)
	end while

	m.descScrollY = 0
	m.descContent.translation = [0, 0]
	curY = 0

	lbl1 = CreateObject("roSGNode", "Label")
	lbl1.width = 670
	lbl1.wrap = true
	lbl1.font = "font:SmallSystemFont"
	lbl1.color = "0xF8FAFCFF"
	lbl1.translation = [0, curY]
	lbl1.text = nowTxt
	m.descContent.AppendChild(lbl1)
	curY = curY + lbl1.boundingRect().height + 32

	if nextHdr <> ""
		lblHdr = CreateObject("roSGNode", "Label")
		lblHdr.width = 670
		lblHdr.wrap = true
		lblHdr.font = "font:SmallBoldSystemFont"
		lblHdr.color = "0xFACC15FF"
		lblHdr.translation = [0, curY]
		lblHdr.text = nextHdr
		m.descContent.AppendChild(lblHdr)
		curY = curY + lblHdr.boundingRect().height + 14

		if nextTxt <> ""
			lbl2 = CreateObject("roSGNode", "Label")
			lbl2.width = 670
			lbl2.wrap = true
			lbl2.font = "font:SmallSystemFont"
			lbl2.color = "0x93C5FDFF"
			lbl2.translation = [0, curY]
			lbl2.text = nextTxt
			m.descContent.AppendChild(lbl2)
			curY = curY + lbl2.boundingRect().height + 20
		end if
	end if

	if curY > 585
		m.descMaxScroll = curY - 585
	else
		m.descMaxScroll = 0
	end if
end sub


sub syncListToCurrentChannel()
	if m.list.content = invalid or m.flatChannels.Count() = 0 then return
	if m.currentIndex < 0 or m.currentIndex >= m.flatChannels.Count() then return

	entry = m.flatChannels[m.currentIndex]
	if m.list.content.getChild(0).getChild(0) = invalid
		m.list.jumpToItem = m.currentIndex
	else
		flatListIdx = 0
		for s = 0 to entry.secIdx - 1
			flatListIdx = flatListIdx + m.list.content.getChild(s).getChildCount()
		end for
		flatListIdx = flatListIdx + entry.itemIdx
		m.list.jumpToItem = flatListIdx
	end if
end sub

sub updateEpgBanner()
	if m.currentIndex >= 0 and m.currentIndex < m.flatChannels.Count() then showEpgForNode(m.flatChannels[m.currentIndex].node)
end sub

sub hideOsd()
	if not m.sidebarGroup.visible and not m.descGroup.visible then m.epgBanner.visible = false
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
	if not press then return false

	if not m.sidebarGroup.visible and not m.descGroup.visible
		if key = "up"
			playChannelByIndex(m.currentIndex - 1, false)
			return true
		else if key = "down"
			playChannelByIndex(m.currentIndex + 1, false)
			return true
		else if key = "left" or key = "back"
			syncListToCurrentChannel()
			m.sidebarGroup.visible = true
			m.list.SetFocus(true)
			updateEpgBanner()
			return true
		else if key = "OK"
			updateEpgBanner()
			return true
		else if key = "options"
			showdialog()
			return true
		end if
	else if m.sidebarGroup.visible and not m.descGroup.visible
		if key = "left"
			m.descGroup.visible = true
			m.list.SetFocus(false)
			m.descViewport.SetFocus(true)
			return true
		else if key = "right"
			m.sidebarGroup.visible = false
			m.list.SetFocus(false)
			m.top.SetFocus(true)
			hideOsd()
			return true
		else if key = "options"
			showdialog()
			return true
		end if
	else if m.descGroup.visible
		if key = "down"
			if m.descMaxScroll > 0
				m.descScrollY = m.descScrollY - 80
				if m.descScrollY < -m.descMaxScroll then m.descScrollY = -m.descMaxScroll
				m.descContent.translation = [0, m.descScrollY]
			end if
			return true
		else if key = "up"
			if m.descScrollY < 0
				m.descScrollY = m.descScrollY + 80
				if m.descScrollY > 0 then m.descScrollY = 0
				m.descContent.translation = [0, m.descScrollY]
			end if
			return true
		else if key = "right" or key = "back"
			m.descGroup.visible = false
			m.descViewport.SetFocus(false)
			m.sidebarGroup.visible = true
			m.list.SetFocus(true)
			return true
		else if key = "options"
			showdialog()
			return true
		end if
	end if
	return false
end function

sub checkState()
	if m.video.state = "error"
		m.lblNow.text = "Erro ao reproduzir canal (" + str(m.video.errorCode).Trim() + "): " + m.video.errorMsg
		m.epgBanner.visible = true
	end if
end sub

sub showdialog()
	kd = createObject("roSGNode", "KeyboardDialog")
	kd.backgroundUri = "pkg:/images/rsgde_bg_hd.jpg"
	kd.title = "URL DA PLAYLIST M3U"
	kd.buttons = ["OK", "Restaurar LLS TV", "Salvar"]
	kd.optionsDialog = true
	m.top.dialog = kd
	m.top.dialog.text = m.global.feedurl
	m.top.dialog.keyboard.textEditBox.cursorPosition = len(m.global.feedurl)
	m.top.dialog.keyboard.textEditBox.maxTextLength = 300
	kd.observeFieldScoped("buttonSelected", "onKeyPress")
end sub

sub onKeyPress()
	if m.top.dialog.buttonSelected = 0
		m.global.feedurl = m.top.dialog.text
		m.save_feed_url.control = "RUN"
		m.top.dialog.close = true
		m.get_channel_list.control = "RUN"
	else if m.top.dialog.buttonSelected = 1
		m.top.dialog.text = "__M3U_URL__"
	else if m.top.dialog.buttonSelected = 2
		m.global.feedurl = m.top.dialog.text
		m.save_feed_url.control = "RUN"
	end if
end sub
EOF
sed -i "s|__M3U_URL__|${M3U_URL}|g" "${WORK_DIR}/components/MainScene/MainScene.brs"

# Limpa arquivos desnecessarios e empacota o ZIP final
rm -f "${WORK_DIR}/SimpleIPTVRoku.zip" "${WORK_DIR}/1.m3u" "${WORK_DIR}/README.md"
rm -rf "${WORK_DIR}/.git"

rm -f "${FILE_LLS}"
(cd "${WORK_DIR}" && zip -qr "../${FILE_LLS}" .)
rm -rf "${WORK_DIR}"

ls -alh "${FILE_LLS}"
sudo /usr/bin/git_remote.sh "lls-ws.github.io"
