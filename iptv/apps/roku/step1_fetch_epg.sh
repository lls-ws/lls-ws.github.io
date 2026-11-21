#!/bin/bash
set -e

WORK_DIR="simple-iptv-edit"
GH_BASE="https://github.com"
REPO_URL="${GH_BASE}/olumalia/SimpleIPTVRoku.git"

SITE_HOST="https://lls-ws.github.io"
M3U_URL="${SITE_HOST}/iptv/LLS_TV.m3u"
EPG_URL="${SITE_HOST}/iptv/guide.xml"

rm -rf "${WORK_DIR}"
git clone --depth 1 "${REPO_URL}" "${WORK_DIR}"

# 1. Atualiza URL padrao no main.brs
sed -i "s|https://tinyurl.com|${M3U_URL}|g" "${WORK_DIR}/source/main.brs"

# 2. Atualiza get_channel_list.brs
cat << 'EOF' > "${WORK_DIR}/components/get_channel_list/get_channel_list.brs"
sub init()
	m.top.functionName = "getContent"
end sub

sub getContent()
	feedurl = m.global.feedurl
	if feedurl = invalid or feedurl = "" then feedurl = "__M3U_URL__"

	searchRequest = CreateObject("roUrlTransfer")
	searchRequest.setURL(feedurl)
	searchRequest.EnableEncodings(true)
	httpsReg = CreateObject("roRegex", "^https:", "")
	if httpsReg.isMatch(feedurl)
		searchRequest.SetCertificatesFile("common:/certs/ca-bundle.crt")
		searchRequest.AddHeader("X-Roku-Reserved-Dev-Id", "")
		searchRequest.InitClientCertificates()
	end if

	text = searchRequest.getToString()

	reHasGroups = CreateObject("roRegex", "group-title=" + chr(34) + "?([^" + chr(34) + "]*)" + chr(34) + "?", "")
	reTvgId = CreateObject("roRegex", "tvg-id=" + chr(34) + "?([^" + chr(34) + "]*)" + chr(34) + "?", "")
	hasGroups = reHasGroups.isMatch(text)

	reLineSplit = CreateObject("roRegex", "(?>\r\n|[\r\n])", "")
	reExtinf = CreateObject("roRegex", "(?i)^#EXTINF:\s*(\d+|-1|-0).*,\s*(.*)$", "")
	rePath = CreateObject("roRegex", "^([^#].*)$", "")

	inExtinf = false
	title = ""
	tvgId = ""
	con = CreateObject("roSGNode", "ContentNode")
	if not hasGroups
		group = con
	end if

	for each line in reLineSplit.Split(text)
		if inExtinf
			maPath = rePath.Match(line)
			if maPath.Count() = 2
				item = group.CreateChild("ContentNode")
				item.url = maPath[1].Trim()
				item.title = title.Trim()
				item.id = tvgId.Trim()
				inExtinf = false
			end if
		end if
		maExtinf = reExtinf.Match(line)
		if maExtinf.Count() = 3
			if hasGroups
				maGrp = reHasGroups.Match(line)
				groupName = "Geral"
				if maGrp.Count() >= 2 and maGrp[1] <> "" then groupName = maGrp[1]
				group = invalid
				for x = 0 to con.getChildCount() - 1
					node = con.getChild(x)
					if node.id = groupName
						group = node
						exit for
					end if
				end for
				if group = invalid
					group = con.CreateChild("ContentNode")
					group.contenttype = "SECTION"
					group.title = groupName
					group.id = groupName
				end if
			end if
			tvgId = ""
			maId = reTvgId.Match(line)
			if maId.Count() >= 2 then tvgId = maId[1]
			title = maExtinf[2]
			inExtinf = true
		end if
	end for

	m.top.content = con
end sub
EOF
sed -i "s|__M3U_URL__|${M3U_URL}|g" "${WORK_DIR}/components/get_channel_list/get_channel_list.brs"

# 3. Cria componente Task leve para ler o guide.xml (EPG)
mkdir -p "${WORK_DIR}/components/get_epg"
cat << 'EOF' > "${WORK_DIR}/components/get_epg/get_epg.xml"
<?xml version="1.0" encoding="utf-8"?>
<component name="get_epg" extends="Task">
	<interface>
		<field id="epgData" type="assocarray"/>
	</interface>
	<script type="text/brightscript" uri="pkg:/components/get_epg/get_epg.brs"/>
</component>
EOF

cat << 'EOF' > "${WORK_DIR}/components/get_epg/get_epg.brs"
sub init()
	m.top.functionName = "fetchEpg"
end sub

function parseXmltvTime(ts as string) as integer
	if len(ts) < 14 then return 0
	dt = CreateObject("roDateTime")
	iso = left(ts, 4) + "-" + mid(ts, 5, 2) + "-" + mid(ts, 7, 2) + "T" + mid(ts, 9, 2) + ":" + mid(ts, 11, 2) + ":" + mid(ts, 13, 2) + "Z"
	dt.FromISO8601String(iso)
	secs = dt.AsSeconds()
	if len(ts) >= 20
		tzPart = mid(ts, 16, 5)
		sign = left(tzPart, 1)
		tzH = val(mid(tzPart, 2, 2))
		tzM = val(mid(tzPart, 4, 2))
		offset = (tzH * 3600) + (tzM * 60)
		if sign = "-" then secs = secs + offset
		if sign = "+" then secs = secs - offset
	end if
	return secs
end function

function formatLocalHHMM(secs as integer) as string
	dt = CreateObject("roDateTime")
	dt.FromSeconds(secs)
	dt.ToLocalTime()
	h = dt.GetHours().ToStr()
	m = dt.GetMinutes().ToStr()
	if len(h) = 1 then h = "0" + h
	if len(m) = 1 then m = "0" + m
	return h + ":" + m
end function

sub fetchEpg()
	req = CreateObject("roUrlTransfer")
	req.SetURL("__EPG_URL__")
	req.EnableEncodings(true)
	req.SetCertificatesFile("common:/certs/ca-bundle.crt")
	req.InitClientCertificates()

	xmlStr = req.GetToString()
	if xmlStr = "" then return

	xml = CreateObject("roXMLElement")
	if not xml.Parse(xmlStr) then return

	nowDt = CreateObject("roDateTime")
	nowSec = nowDt.AsSeconds()

	epgMap = {}
	progs = xml.GetNamedElements("programme")
	for each p in progs
		ch = p@channel
		if ch <> invalid and ch <> ""
			startSec = parseXmltvTime(p@start)
			stopSec = parseXmltvTime(p@stop)
			if stopSec > nowSec
				if not epgMap.DoesExist(ch)
					epgMap[ch] = { nowTitle: "", nowTime: "", nowDesc: "", nextTitle: "", nextTime: "", nextDesc: "" }
				end if
				entry = epgMap[ch]
				titleNodes = p.GetNamedElements("title")
				pTitle = ""
				if titleNodes.Count() > 0 then pTitle = titleNodes[0].GetText()

				descNodes = p.GetNamedElements("desc")
				pDesc = ""
				if descNodes.Count() > 0 then pDesc = descNodes[0].GetText()

				hhmmStart = formatLocalHHMM(startSec)
				hhmmStop = formatLocalHHMM(stopSec)

				if startSec <= nowSec and stopSec > nowSec
					entry.nowTitle = pTitle
					entry.nowTime = hhmmStart + " - " + hhmmStop
					entry.nowDesc = pDesc
				else if startSec > nowSec and entry.nextTitle = ""
					entry.nextTitle = pTitle
					entry.nextTime = hhmmStart + " - " + hhmmStop
					entry.nextDesc = pDesc
				end if
			end if
		end if
	end for

	m.top.epgData = epgMap
end sub
EOF
sed -i "s|__EPG_URL__|${EPG_URL}|g" "${WORK_DIR}/components/get_epg/get_epg.brs"

echo "Parte 1 concluida com sucesso!"
