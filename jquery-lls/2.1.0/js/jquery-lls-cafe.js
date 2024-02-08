/* =========================================================
 * menuOpcoesCafe.js
 * http://lls.net.br/
 * ========================================================= */

function menuOpcoesCafe(posicaoMenu, tipo) {
	
	var dados = {
		id: 0,
		pagina: 1,
		tipoOperacao: 0,
		posicaoItem: tipo,
		posicaoItemMenu: posicaoMenu,
		click: "click",
		textoLabel: "find"
	}
	
	switch (tipo) {
		case 1: 
			
			dados.tipo = "GR";
			dados.tituloImprimi = "Guia de Recebimento";
			dados.nomeTabela = "Entcafe";
			dados.nomeTabelaCadastro = [];
			dados.nomeTabelaLancamento = ["Entlote", "Lote", "Servcafe"];
			dados.nomeBotaoLancamento = "Desdobrar";
			
			break;
		case 2: 
			
			dados.tipo = "OS";
			dados.tituloImprimi = "Ordem de Serviço";
			dados.nomeTabela = "Oscafe";
			dados.nomeTabelaCadastro = ["Despejo"];
			dados.nomeTabelaLancamento = ["Oslote", "Despejo", "Lote", "Servcafe"];
			dados.nomeBotaoLancamento = "Finalizar";
			
			break;
		case 3: 
			
			dados.tipo = "GE";
			dados.tituloImprimi = "Guia de Embarque";
			dados.nomeTabela = "Saicafe";
			dados.nomeTabelaCadastro = ["Despejo"];
			dados.nomeTabelaLancamento = ["Sailote", "Despejo", "Servcafe"];
			dados.nomeBotaoLancamento = "Finalizar";
			
			break;
		case 4: 
			
			dados.tipo = "GT";
			dados.tituloImprimi = "Guia de Transferência";
			dados.nomeTabela = "Tracafe";
			dados.nomeTabelaCadastro = ["Despejo"];
			dados.nomeTabelaLancamento = ["Tralote", "Despejo", "Lote"];
			dados.nomeBotaoLancamento = "Finalizar";
			
			break;
		case 5: 
			
			dados.tipo = "Baixa";
			dados.nomeTabela = "Servicocafe";
			dados.nomeTabelaCadastro = [];
			dados.nomeTabelaLancamento = ["Baixacafe", "Baixacafe"];
			dados.nomeBotaoLancamento = "Baixar";
			
			break;	
		case 6: 
			dados.nomeTabela = "Faturacafe";
			break;
		case 7: 
			dados.nomeTabela = "Extratocafe";
			break;
		case 8: 
			dados.nomeTabela = "Saldocafe";
			break;
		case 9: 
			dados.nomeTabela = "Sintetizacafe";
			break;
	}
	
	return dados;
	
}
/* =========================================================
 * menuCafe.js
 * http://lls.net.br/
 * ========================================================= */

function menuCafe(menu, posicaoMenu) {
	
	var menuItens = [
		{
			separator: true,
			titulo: "Lançamentos",
			icone: "import",
			texto: "Entrada de " + menu.titulo
		},
		{
			icone: "open",
			texto: "Serviço de " + menu.titulo
		},
		{
			icone: "export",
			texto: "Saída de " + menu.titulo
		},
		{
			icone: "transfer",
			texto: "Transferência de " + menu.titulo
		},
		{
			separator: true,
			titulo: "Cobrança",
			icone: "save",
			texto: "Entrada de Cobrança de " + menu.titulo
		},
		{
			separator: true,
			titulo: "Faturamento",
			icone: "usd",
			texto: "Efetuar Faturamento de " + menu.titulo
		}
	];
	
	return criarMenu(menu, menuItens, posicaoMenu);
	
}
/* =========================================================
 * setEventoDesdobrasCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setEventoDesdobrasCafeFormacao(dados, formulario) {
	
	var input = formulario.find('#desdobras' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	input.bind("propertychange change click keyup input paste", function(event) {
			
		input.valid();
		
		eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
		
	});
	
	input.rules('add', {
		required: true,
		number: true,
		min: 1,
		messages: { 
			required: "É necessário informar a quantidade de desdobras!",
			min: "Quantidade de desdobras menor que {0}!"
		}
	});
	
	formulario.find('#linha_tab' + dados.nomeTabela + '2').click(function(e){
		
		eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
		
	});
	
}
/* =========================================================
 * arredondaPesoCafe.js
 * http://lls.net.br/
 * ========================================================= */

function arredondaPesoCafe(valores) {
	
	valores["inteiro"] = valores.peso ^ 0;
	valores["decimal"] = Number((valores.peso - valores.inteiro).toFixed(2));
		
	if (valores.decimal < 0.50 || valores.decimal >= 0.60) {
		valores.peso = Math.round(valores.peso);
	}
	else valores.peso = Number(valores.inteiro) + 0.5;
	
}
/* =========================================================
 * removeTotalTabelaCafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaCafe(idLinha, nomeTabela) {
	
	idLinha = idLinha.replace('#', '');
	
	var sacas = $('#tbodyLista' + nomeTabela).find('#' + idLinha).find("#tdSacas").find('p').text();
	var peso = $('#tbodyLista' + nomeTabela).find('#' + idLinha).find("#tdPeso").find('p').text();
	
	sacas = formataNumeroSacasSql(sacas);
	peso = formataNumeroSql(peso);
	
	var tfootTotalSacas = $('#tfoottableLista' + nomeTabela)
		.find('#nomeRodape' + nomeTabela).find("#totalSacas").find('p');
	
	var tfootTotalPeso = $('#tfoottableLista' + nomeTabela)
		.find('#nomeRodape' + nomeTabela).find("#totalPeso").find('p');
	
	var totalSacas = tfootTotalSacas.text();
	var totalPeso = tfootTotalPeso.text();
	
	totalSacas = formataNumeroSacasSql(totalSacas);
	totalPeso = formataNumeroSql(totalPeso);
	
	totalSacas = totalSacas - sacas;
	totalPeso = totalPeso - peso;
	
	if (totalSacas > 0) {
		
		totalSacas = formataNumeroSacasCafe(totalSacas);
		totalPeso = formataNumero(totalPeso, 2, false, false, "", " kg");
		
		tfootTotalSacas.empty().text(totalSacas);
		tfootTotalPeso.empty().text(totalPeso);
		
		var tfootTotalQtd = $("#tfoottableLista" + nomeTabela)
			.find("#nomeRodape" + nomeTabela).find('#rodapeTotal' + nomeTabela).find('p');
		
		var totalQtd = tfootTotalQtd.text().split(':');
		
		totalQtd[1] = Number(totalQtd[1]) - 1;
		
		tfootTotalQtd.empty().text(totalQtd[0] + ": " + totalQtd[1]);
		
	}
	else {
		
		$('#tfoottableLista' + nomeTabela).empty();
		
		$('#paginaLista' + nomeTabela).hide();
		
		$('#nomeProcura' + nomeTabela)
			.find('#spanGroupPrint' + nomeTabela + 'FazendaProdutor').hide();
		
	}
	
}
/* =========================================================
 * removeTotalTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaCafeFormacao(dados) {
	
	var idLinha = '#' + dados.nomeTabela.toLowerCase() + '_' + dados.id;
	
	var tdSacas = $('#tbody' + dados.nomeTabela).find(idLinha).find('#tdSacas').find('p');
	var tdPeso = $('#tbody' + dados.nomeTabela).find(idLinha).find('#tdPeso').find('p');
	
	var sacasRemovidas = formataNumeroSacasSql(tdSacas.text());
	var pesoRemovido = formataNumeroSql(tdPeso.text());
	
	dados.sacas = 0;
	dados.peso = 0.00;
	
	var rowCount = $('#tbody' + dados.nomeTabela).find('tr').length;
	
	if (rowCount == 1) $("#tfoottable" + dados.nomeTabela).find("#nomeRodape" + dados.nomeTabela).remove();
	else setTotalTabelaCafeFormacao(dados, sacasRemovidas, pesoRemovido);
	
	$(idLinha).remove();
	
	setTipoRelatorioCafe(dados);
	
	eventoListaCadastroCore(menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem));
	
}
/* =========================================================
 * formularioRelatorioCafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioCafe(dados) {
	
	var tipo = 3;
	
	if (dados.tipo != "GR") tipo = 4;
	
	return formularioRelatorioNomeDataTipoCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		tipo
	);
	
}
/* =========================================================
 * setDadosFormularioCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioCafeFormacao(dados, formulario, tipo) {
	
	var lote = eval ('pegaTabela'+ dados.nomeTabela + '(dados)');
	
	lote["tipoOperacao"] = dados.tipoOperacao;
	lote["nomeTabela"] = dados.nomeTabela;
	lote["nomeTabelaCadastro"] =  dados.nomeTabelaCadastro;
	
	var campos = {
		sacas: "Sacas",
		peso: "Peso"
	}
	
	jQuery.each( campos, function( i, value ) {
		
		formulario.find('#' + i + 'Altera' + dados.nomeTabela).val(lote[i]);
		
	});
	
	setValoresCafeFormacao(lote, formulario, tipo);
	
	eval ('formataDados' + dados.nomeTabela + '(lote)');
	
	jQuery.each( lote, function( i, value ) {
		
		if (i == dados.campoProcura.toLowerCase()) {
		
			formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura)
					  .val(value).attr('disabled', true);
					  
		}
		else if (i == 'id' + dados.campoProcura) {
		
			formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura)
					  .val(value);
					  
		}
		else {
			
			if (i == 'peneira') {
				
				$('#nome' + dados.nomeTabela + dados.campoProcura + 'Mensagem')
					.text(value).show();
				
				$('#spanGroupSearch' + dados.nomeTabela + dados.campoProcura).unbind();
				
			}
			else formulario.find('#' + i + dados.nomeTabela).val(value).attr('disabled', false);
		}
		
	});
	
	if (dados.campoProcura == 'Lote') {
	
		jQuery.each( campos, function( i, value ) {
			
			var valor = lote[i + 'Saldo'];
			
			if (value == 'Peso') {
				
				valor = formataNumero(valor, 2, false, true, "", " kg");
				
				var media = lote[i + 'Media'];
				
				formulario.find('#' + i + dados.nomeTabela).val(lote.peso).attr('disabled', true);
				formulario.find('#' + i + "Media" + dados.nomeTabela).val(media).attr('disabled', true);
				
			}
			
			formulario.find('#' + i + 'Saldo' + dados.nomeTabela).val(valor).attr('disabled', true);
			
		});
		
		setValoresCafeFormacao(dados, formulario, tipo);

	}
	
	formulario.find('#sacas' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * pegaNomeColunasCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasCafeFormacao(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ações",
		lote: "Lote",
		peneira: "Peneira",
		pilha: "Pilha",
		observacao: "Observação",
		sacas: "Sacas",
		peso: "Peso"
	};
	
	switch (tipo) {
		case 1: 
			nomesColunas.visualizar = "Excluir";
			break;
		case 5: 
			delete nomesColunas["visualizar"];
			nomesColunas["id"] = "";
			nomesColunas["sacasAltera"] = "";
			nomesColunas["pesoAltera"] = "";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosTabelaCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaCafe(dados, trTabela, botaoVisualizar) {
	
	if (trTabela == null) {
		
		$("#id" + dados.nomeTabelaCadastro).val(dados.idCadastro);
		
		setTipoRelatorioCafe(dados);
		eventoListaCadastroCore(menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem));
		
	}
	else {
	
		trTabela.append(tabelaCelula(botaoVisualizar, "text-center", "texto", "tdBotao"))
				.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
				.append(tabelaCelula(dados.lote, "text-center", "texto", "tdLote"));
			
		setDadosColunaHideCore(dados, trTabela);
		
		trTabela.append(tabelaCelula(formataNumeroSacasCafe(dados.sacas), "text-right", "texto", "tdSacas"))
				.append(tabelaCelula(dados.peso, "text-right", "texto", "tdPeso"));
				
	}
	
}
/* =========================================================
 * imprimirGuiaCafe.js
 * http://lls.net.br/
 * ========================================================= */

function imprimirGuiaCafe(dados, mensagem, tipo) {
	
	var msg = 'Deseja imprimir a ' + dados.tituloImprimi;
	
	if (mensagem == null) mensagem = msg + ': ' + dados.array.titulo;
	else {
		mensagem = mensagem.substring(0, mensagem.indexOf('!')) + "!" + '<br>' + msg + ': ' +
			mensagem.split('!').splice(-1);
	}
	
	var url = "guia" + dados.nomeTabela;;
	
	if (!$('#botaoAlterar' + dados.nomeTabela).is(':visible') && tipo == null) {
	
		url += "Fechada";
		
	}
	
	mostraDialogOpcao(
		mensagem,
		"texto_cor_verde",
		"table",
		tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)')),
		dados.id,
		dados.nomeTabela,
		"Imprimir",
		url
	);
	
}
/* =========================================================
 * calculaValorServicoCafe.js
 * http://lls.net.br/
 * ========================================================= */

function calculaValorServicoCafe(dados) {
	
	var valores = {
		preco: 0,
		valor: 0,
		sacas: Number($('#sacas' + dados.nomeTabela).val()),
		idPreco: $('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco').val()
	}
	
	if (valores.idPreco > 0 && valores.sacas > 0) {
		
		var textoServicocafe = $('#nomeProcuraCadastro' + dados.nomeTabela + 'PrecoDivInput span').text();
		
		var textoServicocafeArray = textoServicocafe.split(' ');
		
		valores.preco = formataNumeroSql(textoServicocafeArray[1]);
		
	}
	
	valores.valor = valores.preco * valores.sacas;
	
	$('#valor' + dados.nomeTabela).val(formataNumero(valores.valor, 2, false, false, "R$ ", "")).valid();
	
	$('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco2').val(1);
	
}
/* =========================================================
 * eventoSalvarCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarCafeFormacao(dados) {
	
	var cafe = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados)');
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela + dados.nomeTabelaCadastro,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(cafe),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				cafe.lote["data"] = cafe.cadastro.data;
				cafe.lote["indexStatus"] = resposta.indexStatus;
				cafe.lote["idCadastro"] = resposta.idCadastro;
				cafe.lote["posicaoItem"] = dados.posicaoItem;
				cafe.lote["posicaoItemMenu"] = dados.posicaoItemMenu;
				cafe.lote["tipoOperacao"] = dados.tipoOperacao;
				cafe.lote["nomeTabela"] = dados.nomeTabela;
				cafe.lote["nomeTabelaCadastro"] =  dados.nomeTabelaCadastro;
				cafe.lote["nomeTabelaLancamento"] =  dados.nomeTabelaLancamento;
				
				if (dados.campoProcura == "Peneira") {
					cafe.lote["peneira"] = $("#nomeProcuraCadastro" + dados.nomeTabela + dados.campoProcura).val();
				}
				else {
					cafe.lote["peneira"] = $('#nome' + dados.nomeTabela + dados.campoProcura + 'Mensagem').text();
					cafe.lote.lote = $("#nomeProcuraCadastro" + dados.nomeTabela + dados.campoProcura).val();
				}
				
				limpaDadosFormularioCafeFormacao(dados);
				
				if($('#tbody' + dados.nomeTabela)
					.find("#" + dados.nomeTabela + 
						  "_" + resposta.id).length > 0) {
					
					dados.tipoOperacao = 1;
					
					if (cafe.lote.id == 0) {
					
						cafe.lote.id = resposta.id;
						
						var valores = pegaValoresTabelaCafeFormacao(cafe.lote);
						
						cafe.lote.sacas = Number(cafe.lote.sacas) + valores.sacas;
						cafe.lote.peso = cafe.lote.peso + valores.peso;
						
					}
					
				}
				
				cafe.lote.id = resposta.id;
				
				if (dados.tipoOperacao == 0) {
					
					setLinhaTabelaCafeFormacao(cafe.lote);
					addTotalTabelaCafeFormacao(cafe.lote);
					
				}
				else {
					
					mudaLinhaTabelaCafeFormacao(cafe.lote);
					alteraTotalTabelaCafeFormacao(cafe.lote);
					
				}
				
				$("#divDialogAltera" + dados.nomeTabela).dialog( "close" );
				
				$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
					.find("#spanGroupSearch" + dados.nomeTabelaCadastro + "FazendaProdutor")
						.unbind();
				
				eval ("setDadosTabela" + dados.nomeTabelaCadastro + "(cafe.lote)");
				
			}
			
			mostraDialog(
				mensagem,
				cor_texto,
				"table",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * setEventosCamposDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposCafeFormacao(dados, formulario, tipo) {
	
	setEventosCamposCafe(dados, formulario, tipo);
	
	if (tipo == 1) {
	
		var rule = {};
	
		if (dados.nomeTabela = "Lote") rule = {checkDesdobrasLote: true};
		else rule = {checkDesdobrasDespejo: true};
		
		formulario.find('#id' + dados.nomeTabela).rules('add', rule);

	}
		
	setValoresCafeFormacao(dados, formulario, tipo);
	
	addEventoCampoProcuraCafe(dados, formulario, dados.campoProcura);
	
}
/* =========================================================
 * eventoSalvarCafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarCafe(dados) {
	
	var cafe = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(cafe),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			if (resposta.status == "200") {
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
				
				dados = menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados.id = resposta.id;
				
				dados["indexStatus"] = resposta.indexStatus;
				dados["data"] = cafe.cadastro.data;
				
				setDadosFormularioRelatorioCore(dados);
				
				if (dados.tipo == "GR") imprimirGuiaCafe(dados, mensagem, 1);
				else {
					
					mostraDialog(
						mensagem,
						"texto_cor_verde",
						"table",
						tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
					);
					
				}
				
			}
			else {
				
				mostraDialog(
					mensagem,
					"texto_cor_vermelho",
					"table",
					tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
				);
				
			}
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * setEventosCamposCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposCafe(dados, formulario, tipo) {
	
	var campos = {
		sacas: "Sacas",
		peso: "Peso"
	}
	
	if (tipo != null) delete campos["peso"];
	
	jQuery.each( campos, function( i, value ) {
	
		var input = formulario.find('#' + i + dados.nomeTabela);
		
		input.bind("propertychange change click keyup input paste", function(event) {
			
			input.valid();
			
			if (i == "sacas") formulario.find('#peso' + dados.nomeTabela).valid();
			
		});
		
		var valorTexto = 1;
		if (i == "peso") valorTexto = formataNumero(valorTexto, 2, false, true, "", " kg");
		
		input.rules('add', {
			required: true,
			number: true,
			min: 1,
			messages: { 
				required: "É necessário informar a quantidade de " + i + "!",
				min: "Quantidade de " + i + " menor que " + valorTexto
			}
		});
	
	});
	
}
/* =========================================================
 * checkValoresCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresCafeFormacao(dados, formulario) {
	
	var campo = {
		id: $("#idnomeProcuraCadastro" + dados.nomeTabela + "FazendaProdutor").val(),
		sacas: $('#sacas' + dados.nomeTabela).val()
	}
	
	if (campo.id == 0 || campo.sacas == 0) {
		formulario.find('#botaoNovo' + dados.nomeTabelaCadastro[0]).hide();
	}
	else formulario.find('#botaoNovo' + dados.nomeTabelaCadastro[0]).show();
	
}
/* =========================================================
 * setTotalTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setTotalTabelaCafeFormacao(dados, sacasAnterior, pesoAnterior) {
	
	var tfootTotalSacas = $("#tfoottable" + dados.nomeTabela)
		.find("#nomeRodape" + dados.nomeTabela).find('#totalSacas').find('p');
		
	var tfootTotalPeso = $("#tfoottable" + dados.nomeTabela)
		.find("#nomeRodape" + dados.nomeTabela).find('#totalPeso').find('p');
	
	var totalSacas = formataNumeroSacasSql(tfootTotalSacas.text());
	var totalPeso = formataNumeroSql(tfootTotalPeso.text());
	
	totalSacas = totalSacas - sacasAnterior + Number(dados.sacas);
	totalPeso = totalPeso - pesoAnterior + formataNumeroSql(dados.peso);
	
	totalSacas = formataNumeroSacasCafe(totalSacas);
	totalPeso = formataNumero(totalPeso, 2, false, false, "", " kg");
	
	tfootTotalSacas.empty().text(totalSacas);
	tfootTotalPeso.empty().text(totalPeso);
	
	if (sacasAnterior == 0 || dados.sacas == 0) {
		
		var tfootTotalQtd = $("#tfoottable" + dados.nomeTabela)
			.find("#nomeRodape" + dados.nomeTabela).find('#totalQtd').find('p');
		
		var totalQtd = tfootTotalQtd.text().split(':');
		
		if (sacasAnterior == 0) totalQtd[1] = Number(totalQtd[1]) + 1;
		else totalQtd[1] = Number(totalQtd[1]) - 1;
		
		tfootTotalQtd.empty().text(totalQtd[0] + ": " + totalQtd[1]);
		
	}
	
}
/* =========================================================
 * alteraTotalTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function alteraTotalTabelaCafeFormacao(dados) {
	
	var valores = pegaValoresTabelaCafeFormacao(dados);
	
	var tdSacas = $('#tbody' + dados.nomeTabela)
		.find("#" + dados.nomeTabela + "_" + dados.id)
		.find('#tdSacas').find('p');
	
	var tdPeso = $('#tbody' + dados.nomeTabela)
		.find("#" + dados.nomeTabela + "_" + dados.id)
		.find('#tdPeso').find('p');
	
	tdSacas.empty().text(formataNumeroSacasCafe(dados.sacas));
	tdPeso.empty().text(dados.peso);
	
	setTotalTabelaCafeFormacao(dados, valores.sacas, valores.peso);
	
}
/* =========================================================
 * setValoresCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setValoresCafeFormacao(dados, formulario, tipo) {
	
	var campos = {
		sacas: "Sacas",
		peso: "Peso"
	}
	
	if (tipo > 1) delete campos["peso"];
	
	jQuery.each( campos, function( key, campo ) {
		
		var valor = getTotalRestanteCafeFormacao(dados, formulario, campo, tipo);
		
		var msgExcedida = "";
		
		if (valor.min > valor.max) msgExcedida = "Quantidade excedida de " +
			campo.toLowerCase() + "!";
		
		jQuery.each( valor, function( i, value ) {
			
			if (!msgExcedida) {
				
				var texto = " menor que ";
				if (i == 'max') texto = " maior que ";
				
				var valorTexto = value;
				if (campo == "Peso") valorTexto = formataNumero(valorTexto, 2, false, true, "", " kg");
				
				msg = "Quantidade de " + campo.toLowerCase() + texto + valorTexto;
				
			}
			else msg = msgExcedida;
			
			var input = formulario.find('#' + campo.toLowerCase() + dados.nomeTabela);
			
			var rule = {};
			
			if (i == "min") rule = {min: value, messages: {min: msg}};
			else rule = {max: value, messages: {max: msg}};
			
			input.rules('remove', i)
			input.rules('add', rule);
			
		});
		
	});
	
}
/* =========================================================
 * setLinhaTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaCafeFormacao(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados)');
	
	var tbody = $('#tbody' + dados.nomeTabela);
	
	var tr = setIdTabelaCadastro(dados, tbody);
	
	var arrayBotoes = {altera: "", remove: ""};
	
	if (dados.tipoOperacao == 1) arrayBotoes = {remove: ""};
	
	tr.append(tabelaBotoes(dados.id, "", arrayBotoes))
	  .append(tabelaCelula(dados.lote, "text-center", "texto", "tdLote"))
	  .append(tabelaCelula(dados.peneira, "text-center", "texto", "tdPeneira"))
	  .append(tabelaCelula(dados.pilha, "text-center", "texto", "tdPilha"))
	  .append(tabelaCelula(dados.observacao, "text-center", "texto", "tdObservacao"))
	  .append(tabelaCelula(formataNumeroSacasCafe(dados.sacas), "text-right", "texto", "tdSacas"))
	  .append(tabelaCelula(dados.peso, "text-right", "texto", "tdPeso"));
	
	setBotoesTabelaCafeFormacao(dados, tr);
	
	tbody.append(tr);
	
}
/* =========================================================
 * pegaValoresTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function pegaValoresTabelaCafeFormacao(dados) {
	
	var tdSacas = $('#tbody' + dados.nomeTabela)
		.find("#" + dados.nomeTabela + "_" + dados.id)
		.find('#tdSacas').find('p');
	
	var tdPeso = $('#tbody' + dados.nomeTabela)
		.find("#" + dados.nomeTabela + "_" + dados.id)
		.find('#tdPeso').find('p');
	
	return {
		sacas: formataNumeroSacasSql(tdSacas.text()),
		peso: formataNumeroSql(tdPeso.text())
	}
	
}
/* =========================================================
 * limpaDadosFormularioCafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioCafe(nomeTabela) {
	
	var formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	var dados = eval ("pegaNomeColunas" + nomeTabela + "(1)");
	
	jQuery.each( dados, function( i, value ) {
		
		if (i == 'fazenda') limpaCampoSqlProcura("FazendaProdutor", "nome");
		else formulario.find('#' + i + nomeTabela).val('');
		
	});
	
	formulario.find('#observacao' + nomeTabela).val('');
	
	return formulario;
		
}
/* =========================================================
 * mudaLinhaTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function mudaLinhaTabelaCafeFormacao(dados) {
	
	var tbody = $('#tbody' + dados.nomeTabela);
	
	var tr = tbody.find('#' + dados.nomeTabela.toLowerCase() + '_' + dados.id);
								
	formataDadosCafeFormacao(dados);
	
	var arrayColunaBotoes = { altera: "", remove: "" };
	
	tr.find("#tdBotoes").replaceWith(tabelaBotoes(dados.id, dados.nome, arrayColunaBotoes));
	tr.find("#tdPeneira").replaceWith(tabelaCelula(dados.peneira, "text-center", "texto", "tdPeneira"));
	tr.find("#tdPilha").replaceWith(tabelaCelula(dados.pilha, "text-center", "texto", "tdPilha"));
	tr.find("#tdObservacao").replaceWith(tabelaCelula(dados.observacao, "text-center", "texto", "tdObservacao"));
	
	dados.tipoOperacao = 0;
	
	setBotoesTabelaCafeFormacao(dados, tr);
	
}
/* =========================================================
 * addTotalTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function addTotalTabelaCafeFormacao(dados) {
	
	var rowCount = $('#tbody' + dados.nomeTabela).find('tr').length;
	
	if (rowCount == 1) {
		
		dados["totalQtd"] = 1;
		dados["totalSacas"] = formataNumeroSacasSql(dados.sacas);
		dados["totalPeso"] = formataNumeroSql(dados.peso);
		
		setDadosRodapeCafeFormacao(dados);
		
	}
	else setTotalTabelaCafeFormacao(dados, 0, 0);
	
}
/* =========================================================
 * checkLotesTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function checkLotesTabelaCafeFormacao(dados, formulario) {
	
	jQuery.validator.addMethod("checkLotes" + dados.nomeTabela,
		function(value, element) {
		
			var lote = {
				nomeTabela: dados.nomeTabelaCadastro,
				nomeTabelaCadastro: dados.nomeTabela
			}
			
			var rowCount = jQuery($('#tbody' + lote.nomeTabela)).find('tr').length;
			
			var msg = 'É necessário efetuar o despejo de lotes!';
			
			if (rowCount > 0) {
				
				var totalSacasRestante = getTotalRestanteCafeFormacao(lote, formulario, "Sacas", 1);
				
				if (totalSacasRestante.min == 1 && totalSacasRestante.max == 0) return true;
				else msg = "A quantidade das sacas informada e despejadas são diferentes!";
				
			}
			
			mostraDialog(
				msg,
				'texto_cor_vermelho',
				'table',
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
			return false;
		
		}, ""
	);
	
}
/* =========================================================
 * pegaNomeColunasCafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasCafe() {
	
	return { 
		visualizar: "Ver",
		data: "Data",
		lote: "Lote",
		produtor: "Produtor",
		fazenda: "Fazenda",
		sacas: "Sacas",
		peso: "Peso"
	};
		
}
/* =========================================================
 * checkRemoveLinhaTabela.js
 * http://lls.net.br/
 * ========================================================= */

function checkRemoveLinhaTabela(dados) {
	
	var line = $('#tbody' + dados.nomeTabela)
		.find('#' + dados.nomeTabela.toLowerCase() + '_' + dados.id).index();
	
	var rowCount = jQuery($('#tbody' + dados.nomeTabela)).find('tr').length;
	
	if (rowCount == line + 1) removeCadastroTabelaCore(dados);
	else {
		
		mostraDialog(
			'Proibido remover!<br>Primeiro remova a última linha!',
			'texto_cor_vermelho',
			'table',
			tituloPainelCadastro(3, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
		);
		
	}
	
}
/* =========================================================
 * validarFormularioDespejoCafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioDespejoCafe(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'FazendaProdutor');
	
	checkLotesTabelaCafeFormacao(dados, formulario);
	
}
/* =========================================================
 * setDadosRodapeCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeCafeFormacao(dados) {
	
	var paragrafo1 = paragrafo('text-center texto', 'texto');
	var paragrafo2 = paragrafo('text-right texto', 'texto');
	var paragrafo3 = paragrafo('text-right texto', 'texto');
	
	var titulo = eval ('pegaNomeColunas' + dados.nomeTabela + '(4)');
	
	titulo = titulo.split(' ');
	
	paragrafo1.append("Total de " + titulo[0] + ": " + dados.totalQtd);
	paragrafo2.append(formataNumeroSacasCafe(dados.totalSacas));
	paragrafo3.append(formataNumero(dados.totalPeso, 2, false, false, "", " kg"));
		
	var th1 = th().append(paragrafo1).attr('id', 'totalQtd').attr('colspan', 5);
	var th2 = th().append(paragrafo2).attr('id', 'totalSacas');
	var th3 = th().append(paragrafo3).attr('id', 'totalPeso');
	
	var trRodape = tr('nomeRodape' + dados.nomeTabela, '')
		.append(th1).append(th2).append(th3);
	
	$("#tfoottable" + dados.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * setBotoesExcluirDialogCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setBotoesExcluirDialogCafe(dados) {
	
	for(var i = 0; i < dados.array.lancamentos.length - 1; i++) {
	
		var posicaoAba = i + 3;
	
		if($('#linha_tab' + dados.nomeTabela + posicaoAba).is(":visible")) {
		
			$('#theadtable' + dados.nomeTabelaLancamento[i] + ' tr th:nth-child(1)').hide();
			$('#tbody' + dados.nomeTabelaLancamento[i] + ' tr td:nth-child(1)').hide();
			$('#tfoottable' + dados.nomeTabelaLancamento[i] + ' tr th:nth-child(1)').attr('colspan','4');
			
		}
		else {
			
			var posicaoAba = i + 2;
			
			var titulo = $('#linha_tab' + dados.nomeTabela + posicaoAba + ' a').text();
			
			if (titulo == "Despejo" && dados.nomeTabela != "Saicafe") {
				
				$('#theadtable' + dados.nomeTabelaLancamento[i] + ' tr th:nth-child(1)').hide();
				$('#tbody' + dados.nomeTabelaLancamento[i] + ' tr td:nth-child(1)').hide();
				$('#tfoottable' + dados.nomeTabelaLancamento[i] + ' tr th:nth-child(1)').attr('colspan','4');
				
			}
			
		}

	}
	
}
/* =========================================================
 * removeLinhaTabelaCafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeLinhaTabelaCafe(id, fechado, nomeTabela) {
	
	var tipo = $("#tipo" + nomeTabela).val();
	
	if (fechado == 'Sim' && tipo != 2) {
		
		var idLinha = '#' + nomeTabela.toLowerCase() + '_' + id;
		
		eval ("removeTotalTabela" + nomeTabela+ "('" + idLinha + "', '" + nomeTabela + "')");
		
		$('#tbodyLista' + nomeTabela).find(idLinha).remove();
		
	}
	
}
/* =========================================================
 * getTotalRestanteCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function getTotalRestanteCafeFormacao(dados, formulario, campo, tipo) {
	
	var rowCount = jQuery($('#tbody' + dados.nomeTabela)).find('tr').length;
	
	var valorAltera = getValorAlteraCafeFormacao(campo, formulario, dados.nomeTabela);
	
	var totalDesdobra = 0;
	
	if (rowCount > 0) {
		
		var tfootTotal = $("#tfoottable" + dados.nomeTabela)
			.find("#nomeRodape" + dados.nomeTabela).find('#total' + campo).find('p');
		
		if (campo == "Sacas") totalDesdobra = formataNumeroSacasSql(tfootTotal.text());
		else totalDesdobra = formataNumeroSql(tfootTotal.text());
		
		totalDesdobra = totalDesdobra - valorAltera;
		
	}
	
	if (valorAltera > 0) rowCount--;
	
	var totalRecebido = getTotalRecebidoCafeFormacao(campo, dados.nomeTabelaCadastro);
	
	var totalRestante = totalRecebido - totalDesdobra;
	
	totalRestante = Math.round(totalRestante * 100) / 100;
	
	if (tipo == 1) {
	
		var qtdDesdobras = $('#desdobras' + dados.nomeTabelaCadastro).val();
		
		qtdDesdobras = qtdDesdobras - rowCount;
		
		if (qtdDesdobras <= 0) {
			if (totalRestante == 0) return {min: 1, max: 0};
			else return {min: 0, max: -1};
		}
		else {
			if (totalRestante == 0) return {min: 1, max: 0};
			else {
				if (qtdDesdobras == 1) return {min: totalRestante, max: totalRestante};
				else return {min: 1, max: totalRestante - qtdDesdobras + 1};
			}
		}

	}
	else {
		
		var valorSaldo = getTotalRecebidoCafeFormacao(campo, "Saldo" + dados.nomeTabela);
		
		if (valorAltera > 0) {
			
			valorSaldo = Number(valorSaldo) + Number(valorAltera);
			
			if (totalRestante > valorSaldo) totalRestante = valorSaldo;
			
		}
		else {
			
			if (valorSaldo == 0) totalRestante = 0;
			if (totalRestante > valorSaldo) totalRestante = valorSaldo;
			
		}
		
		totalRestante = Math.round(totalRestante * 100) / 100;
		
		if (totalRestante <= 0) return {min: 1, max: 0};
		else return {min: 1, max: totalRestante};
		
	}
	
}
/* =========================================================
 * pegaDadosFormularioCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioCafeFormacao(dados) {
	
	var lote = {
		id: $("#id" + dados.nomeTabela).val(),
		lote: $("#lote" + dados.nomeTabela).val(),
		sacas: $("#sacas" + dados.nomeTabela).val(),
		peso: formataNumeroSql($("#peso" + dados.nomeTabela).val()),
		pilha: $("#pilha" + dados.nomeTabela).val(),
		observacao: encodeURIComponent( unescape($("#observacao" + dados.nomeTabela).val()))
	}
	
	var idCampoProcura = {
		id: $("#idnomeProcuraCadastro" + dados.nomeTabela + dados.campoProcura).val()
	};
	
	var cafe = eval ("pegaDadosFormulario" + dados.nomeTabelaCadastro + "(dados.nomeTabelaCadastro)");
	
	return {
		lote: lote,
		cadastro: cafe.cadastro,
		idCampoProcura: idCampoProcura
	};
	
}
/* =========================================================
 * getTotalRecebidoCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function getTotalRecebidoCafeFormacao(campo, nomeTabelaCadastro) {
	
	var totalRecebido = $("#" + campo.toLowerCase() + nomeTabelaCadastro).val();
	
	if (campo == "Peso") totalRecebido = formataNumeroSql(totalRecebido);
	
	return totalRecebido;
	
}
/* =========================================================
 * setBotoesTabelaCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function setBotoesTabelaCafeFormacao(dados, tr) {
	
	var url = "";
	
	if (dados.tipoOperacao == 0) {
		
		url = 'remove' + dados.nomeTabela + dados.nomeTabelaCadastro;
		
		var urlBotaoAlterar = 'alteraCadastroTabelaCore(' + JSON.stringify(dados) + ')';
			
		tr.find('#botaoAlterar_' + dados.id)
			.attr('onclick', urlBotaoAlterar)
			.attr('title', "Alterar " + dados.titulo);
		
	}
	else url = 'remove' + dados.nomeTabelaCadastro;
	
	dados["url"] = url;
	
	var urlBotaoRemover = 'remove' + dados.nomeTabela + '(' + JSON.stringify(dados) + ')';
	
	tr.find('#botaoRemover_' + dados.id)
		.attr('onclick', urlBotaoRemover)
		.attr('title', "Remover " + dados.titulo);
	
}
/* =========================================================
 * eventoSalvarDesdobrasCafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarDesdobrasCafe(dados) {
	
	var cafe = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	$.ajax({
		type: "POST",
		url: 'salva' + dados.nomeTabela,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(cafe),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			if (resposta.status == "200") {
				
				$('#divDialogAltera' + dados.nomeTabela).empty();
				$('#divDialogAltera' + dados.nomeTabela).remove();
				$('#divDialogAltera' + dados.nomeTabela).dialog( "close" );
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados)');
				
				var qtdTipo = $('#tipo' + dados.nomeTabelaCadastro).find("option").length;
				
				dados["indexStatus"] = qtdTipo - 2;
				
				setTipoRelatorioCafe(dados);
				
				dados = menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem);
				
				eventoListaCadastroCore(dados);
				
				dados.id = cafe.cadastro.id;
				
				imprimirGuiaCafe(dados, mensagem);
					
			}
			else {
				
				mostraDialog(
					mensagem,
					"texto_cor_vermelho",
					'table',
					tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
				);
				
			}
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * formataNumeroSacasCafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataNumeroSacasCafe(numero) {
	
	var sacas = formataNumero(Number(numero), 1, false, true, "", "");
		
	sacas = sacas.split(',');
	
	return sacas[0] + " scs";
	
}
/* =========================================================
 * setTipoRelatorioCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setTipoRelatorioCafe(dados) {
	
	var tipo = $('#tipo' + dados.nomeTabelaCadastro).val();
	var qtdTipo = $('#tipo' + dados.nomeTabelaCadastro).find("option").length;
	
	if (tipo != null) {
	
		if (tipo <= qtdTipo - 2 ) {
			if (dados.indexStatus != null) $('#tipo' + dados.nomeTabelaCadastro).val(dados.indexStatus);
			else $('#tipo' + dados.nomeTabelaCadastro).val(0);
		}

	}
		
}
/* =========================================================
 * setDadosFormularioCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioCafe(dados) {
	
	eval ("formataDados" + dados.nomeTabela + "(dados.array)");
	
	var formulario = eval ("formulario" + dados.nomeTabela + "(dados)");
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, eval('pegaNomeColunas' + dados.nomeTabela + '(3)')),
		'Altera' + dados.nomeTabela
	);
	
	jQuery.each( dados.array, function( i, value ) {
		
		if (i == 'produtor') {
			
			formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
				.val(value)
				.attr('disabled', 'disabled');
				
		}
		else if (i == 'fazenda') {
			
			formulario.find('#nome' + dados.nomeTabela + 'FazendaProdutorMensagem')
				.text(value)
				.show();
			
		}
		else if (i == 'idProdutor') {
			
			formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor2')
				.val(value);
			
		}
		else if (i == 'idFazenda') {
			
			formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
				.val(value);
			
		}
		else formulario.find('#' + i + dados.nomeTabela).val(value);
		
	});
	
	formulario.find('#sacas' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * limpaDadosFormularioCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioCafeFormacao(dados) {
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	var lote = eval ('pegaNomeColunas' + dados.nomeTabela + '(5)');
	
	jQuery.each( lote, function( i, value ) {
		
		if (i == dados.campoProcura.toLowerCase()) {
		
			limpaCampoSqlProcuraCore(dados, "nome");
			
		}
		else formulario.find('#' + i + dados.nomeTabela).val('');
		
	});
	
}
/* =========================================================
 * setDadosFormularioDespejoCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioDespejoCafe(dados) {
	
	setDadosFormularioCafe(dados);
	
	dados.tipoOperacao = 0;
	dados.nomeTabelaLancamento.splice(0, 1);
	
	for(var j = 0; j < dados.array.lancamentos.length; j++) {
		
		var count = 0;
		
		var lancamentosTabela = dados.array.lancamentos[j];
			
		for(var i = 0; i < lancamentosTabela.length; i++) {
		
			lancamentosTabela[i]["idCadastro"] = dados.id;
			
			count++;
			
		}
		
		if (count > 0) {
		
			$('#' + dados.nomeTabela.toLowerCase() + 'Form')
				.find("#spanGroupSearch" + dados.nomeTabela + "FazendaProdutor")
					.unbind();
			
		}
		
	}
	
	setDadosTabelaLancamentoCore(dados);
	
}
/* =========================================================
 * limpaDadosFormularioDesdobrasCafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioDesdobrasCafe(dados) {
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	var cadastro = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	var campos = cadastro.cadastro;
	
	jQuery.each( campos, function( i, value ) {
		
		formulario.find('#' + i + dados.nomeTabela).val('');
		
	});
	
}
/* =========================================================
 * setDadosRodapeCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeCafe(rodape) {
	
	var titulo = eval ("pegaNomeColunas" + rodape.nomeTabela + "(3)");
	
	titulo = titulo.split(' ');
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de " + titulo[0] + "s: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right', 'texto').append(formataNumeroSacasCafe(rodape[0].sacas));
	var paragrafo3 = paragrafo('text-right', 'texto').append(formataNumero(rodape[0].peso, 2, false, false, "", " kg"));
	
	var th1 = th().append(paragrafo1).attr('id', 'rodapeTotal' + rodape.nomeTabela);
	var th2 = th().append(paragrafo2).attr('id', 'totalSacas');
	var th3 = th().append(paragrafo3).attr('id', 'totalPeso');
		
	var trRodape = tr('nomeRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodape);
	
	var totalColunas = $('#tableLista' + rodape.nomeTabela).find('thead th:visible').length;
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	totalColunas = totalColunas - 2;
	
	if (produtor == 0) th1.attr('colspan', totalColunas);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th1.attr('colspan', totalColunas);
			
		}
		else th1.attr('colspan', totalColunas);
		
	}
	
}
/* =========================================================
 * validarFormularioCoreFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioCoreFormacao(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	jQuery.validator.addMethod("checkLotes" + dados.nomeTabela,
		function(value, element) {
		
			var lote = {
				nomeTabela: dados.nomeTabelaLancamento[0],
				nomeTabelaCadastro: dados.nomeTabela
			}
			
			var rowCount = jQuery($('#tbody' + lote.nomeTabela)).find('tr').length;
			
			var msg = 'É necessário desdobrar o lote!';
			
			if (rowCount > 0) {
				
				var totalDesdobras = $('#desdobras' + dados.nomeTabela).val();
				
				if (rowCount == totalDesdobras) {
					
					var totalSacasRestante = getTotalRestanteCafeFormacao(lote, formulario, "Sacas", 1);
					
					if (totalSacasRestante.min == 1 && totalSacasRestante.max == 0) {
					
						var totalPesoRestante = getTotalRestanteCafeFormacao(lote, formulario, "Peso", 1);
						
						if (totalPesoRestante.min == 1 && totalPesoRestante.max == 0) return true;
						else msg = "Os valores dos pesos informado e desdobrados são diferentes!"; 
						
					}
					else msg = "Os valores das sacas informada e desdobradas são diferentes!";
						
				}
				else msg = "O número de desdobras informada e a quantidade desdobradas são diferentes!";
				
			}
			
			mostraDialog(
				msg,
				'texto_cor_vermelho',
				'table',
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(4)'))
			);
			
			return false;
		
		}, ""
	);
	
}
/* =========================================================
 * addEventoCampoProcuraCafe.js
 * http://lls.net.br/
 * ========================================================= */

function addEventoCampoProcuraCafe(dados, formulario, campoProcura) {
	
	var rule = {};
	
	switch (dados.nomeTabela) {
		case "Despejo":
			rule = {checkIdDespejoLote: true};
			break;
		case "Lote":
			rule = {checkIdLotePeneira: true};
			break;
		case "Entcafe":
			rule = {checkIdEntcafeFazendaProdutor: true};
			break;
		case "Oscafe":
			rule = {checkIdOscafeFazendaProdutor: true};
			break;
		case "Saicafe":
			rule = {checkIdSaicafeFazendaProdutor: true};
			break;
		case "Tracafe":
			rule = {checkIdTracafeFazendaProdutor: true};
			break;
		case "Servcafe":
			rule = {checkIdServcafePreco: true};
			break;
		case "Servicocafe":
			rule = {checkIdServicocafeFazendaProdutor: true};
			break;
	}
	
	formulario.find("#nomeProcuraCadastro" + dados.nomeTabela + campoProcura)
		.rules('add', rule);
	
}
/* =========================================================
 * getValorAlteraCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function getValorAlteraCafeFormacao(campo, formulario, nomeTabela) {
	
	var valorAltera = formulario.find('#' + campo.toLowerCase() + 'Altera' + nomeTabela).val();
	
	if (valorAltera == null) valorAltera = 0;
	
	return valorAltera;
	
}
/* =========================================================
 * setFormularioCafe.js
 * http://lls.net.br/
 * ========================================================= */

function setFormularioCafe(dados, formulario) {
	
	formulario.find('#lote' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-size", "15px");
		
	if (dados.lote != null) formulario.find('#lote' + dados.nomeTabela).val(dados.lote);
	
	formulario.find('#peso' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	formulario.find('#sacas' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px")
		.bind("propertychange change click keyup input paste", function(event) {
		
			calculaLiquidoCafe(dados.nomeTabela);
		
	});
	
	eval ("setEventosCampos" + dados.nomeTabela + "(dados, formulario)");
	
}
/* =========================================================
 * formataDadosCafeFormacao.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosCafeFormacao(dados) {
	
	dados.peso = formataNumero(dados.peso, 2, false, false, "", " kg");
	dados.observacao = decodeURIComponent(dados.observacao);
	
	dados["titulo"] = dados.lote;
	
	dados["alterar"] = 0;
	dados["remover"] = 0;
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraCafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraCafe(id) {
	
	var dados = {
		id: $('#id' + id).val(),
		nome: $('#' + id).val()
	}
	
	return dados;
	
}
/* =========================================================
 * calculaLiquidoCafe.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoCafe(nomeTabela) {
	
	var valorSacas = $('#sacas' + nomeTabela).val();
	
	var valorLiquido = valorSacas * 60.5;
	
	$('#peso' + nomeTabela).val(formataNumero(valorLiquido, 2, false, false, "", " kg"));
	
}
/* =========================================================
 * formataNumeroSacasSql.js
 * http://lls.net.br/
 * ========================================================= */

function formataNumeroSacasSql(numero) {
	
	return Number(numero.replace(' scs', '').replace('.', ''));
	
}
/* =========================================================
 * setDadosTabelaPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaPeneira(peneira) {
	
	formataDadosPeneira(peneira);
	
	var $idLinha = "peneira_" + peneira.id;
	
	var $urlBotao = 'mostraCadastro("' + peneira.id + '" , "Peneira")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar", "", "eye-open", "0", "btn btn-primary btn-xs", "button", $urlBotao
	);
	
	var $tbody = $("#listaPeneiraForm #tableListaPeneira #tbodyListaPeneira");
	
	if (peneira.tipoOperacao == 0) {
		
		var $tr = tr($idLinha, "");
		
		$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
		$tr.append(tabelaCelula(peneira.nome, "text-left", "texto", "tdNome"));
		
		$tbody.append($tr);
		
	}
	else {
		
		var $tr = $tbody.find("#" + $idLinha);
		
		$tr.find("#tdBotao").replaceWith(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
		$tr.find("#tdNome").replaceWith(tabelaCelula(peneira.nome, "text-left", "texto", "tdNome"));
		
	}
	
}
/* =========================================================
 * pegaDadosSqlProcuraPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraPeneira(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
		
		return {
			value: data.nome,
			data: {
				id: data.id
			}
		};
		
	});

}
/* =========================================================
 * limpaDadosFormularioPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioPeneira() {
	
	$("#idPeneira").val("0");
	$("#nomePeneira").val("");
	
}
/* =========================================================
 * pegaDadosFormularioPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioPeneira(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		nome: encodeURIComponent( unescape($("#nome" + nomeTabela).val()))
	}
	
	return dados;
	
}
/* =========================================================
 * validarFormularioPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioPeneira(tipoOperacao, nomeTabela, formulario) {
	
	formulario.validate({
        ignore: ".ignore",
        highlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).addClass('glyphicon-remove');
			jQuery(element).closest('.form-group').addClass('has-error has-feedback');
			
		},
		unhighlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).removeClass('glyphicon-remove');
			jQuery(element).closest('.form-group').removeClass('has-error has-feedback');
			
		},
        validClass:'success',
        errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.form-group').length) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		},
		rules: {
			nomePeneira: {required: true, noSpace: true}
        },
        messages: {
			nomePeneira: "É necessário informar o nome!"
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarPeneira(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraPeneira(id) {
	
	return pegaDadosCampoSqlProcuraCafe(id);
	
}
/* =========================================================
 * setDadosFormularioPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioPeneira(peneira) {
	
	formataDadosPeneira(peneira);
	
	$("#divDialogAlteraPeneira").empty();
	
	$("#divDialogAlteraPeneira").remove();
	
	var formulario = formularioPeneira(peneira.id, peneira.nomeTabela);
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, eval('pegaNomeColunas' + peneira.nomeTabela + '(3)')), "Altera" + peneira.nomeTabela);
	
	formulario.find("#idPeneira").val(peneira.id);
	formulario.find("#nomePeneira").val(peneira.nome);
	
}
/* =========================================================
 * removeTotalTabelaPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaPeneira(idLinha) {}
/* =========================================================
 * campoSqlProcuraPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraPeneira(suggestion, tipo) {
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<h5 class="' + 'list-group-item-heading"' + '>' + suggestion.value + '</h5>' +
		'</div>';
					
	}
	else {
		
		return {
			texto: "",
			valor: suggestion.value
		};
		
	}
	
}
/* =========================================================
 * formularioPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function formularioPeneira(idPeneira, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $formTela = $("<div/>").attr({id: $idTela});
	
	var $campoNome = campoTextoHorizontal("nome" + nomeTabela, "text", "Nome", 9, 2, "", false, 50);
	
	$formTela.append($campoNome);
	
	var $formulario = formularioCadastro(idPeneira, nomeTabela, 2, 4, $formTela);
	
	return $formulario;
	
}
/* =========================================================
 * campoTextoProcuraPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoProcuraPeneira() {
	
	return input("nomeProcura", "text", "form-control", "", false, 50);
	
}
/* =========================================================
 * setDadosDialogPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogPeneira(peneira) {
	
	formataDadosPeneira(peneira);
	
	var $idLinha = "trPeneiraDialog_" + peneira.id;
	
	var $trPeneira = tr($idLinha, "");
	
	$trPeneira.append(tabelaCelula(peneira.nome, "text-left", "texto", "tdNome"));	
	
	setDadosDialogCadastro(peneira, null, $trPeneira);
	
}
/* =========================================================
 * pegaProcuraPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraPeneira(pagina) {
	
	var dados = {
		"id": pagina,
		"nome": $("#nomeProcura").val()
	}
	
	return dados;
	
}
/* =========================================================
 * setDadosRodapePeneira.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapePeneira(rodape) {
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Peneiras: " + rodape[0].qtd);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd').attr('colspan', 2);
	
	var trRodape = tr('nomeRodape' + rodape.nomeTabela, '').append(th1);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * eventoSalvarPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarPeneira(tipoOperacao, nomeTabela) {
	
	var peneira = pegaDadosFormularioPeneira(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: "salvaPeneira",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({peneira: peneira}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioPeneira();
				
				$("#divDialogAlteraPeneira").empty();
				
				$("#divDialogAlteraPeneira").remove();
				
				$("#divDialogAlteraPeneira").dialog( "close" );
				
				peneira["tipoOperacao"] = tipoOperacao;
				
				if (tipoOperacao == 0) {
					
					eventoListaCadastro(1, nomeTabela);
					
				}
				else {
					
					setDadosTabelaPeneira(peneira);
					
				}
				
			}
			else {
				
				$cor_texto = "texto_cor_vermelho";
				
			}
			
			mostraDialog(
				$mensagem,
				$cor_texto,
				"table",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * pegaNomeColunasPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasPeneira(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		nome: "Nome"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Cadastro de Peneiras";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * formataDadosPeneira.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosPeneira(peneira) {
	
	peneira.nome = decodeURIComponent(peneira.nome);
	
	peneira["alterar"] = 0;
	peneira["remover"] = 1;
	
	$('#nomeProcuraBotaoAdd').hide();
	
}
/* =========================================================
 * setLinhaTabelaDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaDespejo(dados) {
	
	setLinhaTabelaCafeFormacao(dados);
	
}
/* =========================================================
 * removeTotalTabelaDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaDespejo(dados) {
	
	if (dados.tipoOperacao == 1) {
		
		dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
		
		$('#divDialogVisualiza' + dados.nomeTabelaLancamento).empty();
		$('#divDialogVisualiza' + dados.nomeTabelaLancamento).remove();
		$('#divDialogVisualiza' + dados.nomeTabelaLancamento).dialog( "close" );
		
	}
	
	removeTotalTabelaCafeFormacao(dados);
	
	if (dados.tipoOperacao == 0) {
	
		var rowCount = $('#tbody' + dados.nomeTabela).find('tr').length;
		
		if (rowCount == 0) {
		
			$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
				.find("#spanGroupSearch" + dados.nomeTabelaCadastro + "FazendaProdutor")
					.click(function(){
					
						$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
							.find('#idnomeProcuraCadastro' + dados.nomeTabelaCadastro + 'FazendaProdutor')
								.val(0);
					
						$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
							.find('#idnomeProcuraCadastro' + dados.nomeTabelaCadastro + 'FazendaProdutor2')
								.val(0);
					
						$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
							.find('#nome' + dados.nomeTabelaCadastro + 'FazendaProdutorMensagem')
								.text('').hide().trigger('change');
						
						$('#' + dados.nomeTabelaCadastro.toLowerCase() + 'Form')
							.find('#nomeProcuraCadastro' + dados.nomeTabelaCadastro + 'FazendaProdutor')
								.removeAttr('disabled').val("").focus();
								
					});
					
		}
		
	}
	
}
/* =========================================================
 * pegaDadosFormularioDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioDespejo(dados) {
	
	var despejo = pegaDadosFormularioCafeFormacao(dados);
	
	despejo.lote["saldoSacas"] = $("#sacasAltera" + dados.nomeTabela).val();
	despejo.lote["saldoPeso"] = $("#pesoAltera" + dados.nomeTabela).val();
	
	var idFazenda = {
		id: $("#idnomeProcuraCadastro" + dados.nomeTabelaCadastro + "FazendaProdutor").val()
	}
	
	var idFazendaDestino = {
		id: $("#idnomeProcuraCadastro" + dados.nomeTabelaCadastro + "DestinoFazendaProdutor").val()
	}
	
	if (idFazendaDestino != null) despejo["idFazendaDestino"] = idFazendaDestino;
	
	despejo["idFazenda"] = idFazenda;
	
	return despejo;
	
}
/* =========================================================
 * removeDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function removeDespejo(dados) {
	
	dados["idLote"] = {id: dados.id};
	dados["idCadastro"] = {id: dados.idCadastro};
	
	removeCadastroTabelaCore(dados);
	
}
/* =========================================================
 * formataDadosDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosDespejo(dados) {
	
	formataDadosCafeFormacao(dados);
	
}
/* =========================================================
 * setDadosRodapeDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeDespejo(dados) {
	
	setDadosRodapeCafeFormacao(dados);
	
}
/* =========================================================
 * eventoSalvarDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarDespejo(dados) {
	
	eventoSalvarCafeFormacao(dados);
	
}
/* =========================================================
 * pegaTabelaDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaDespejo(dados) {

	var ids = {
		idLote : {id: dados.id},
		idCadastro: {id: dados.idCadastro}
	}
	
	var lote = getJsonCore("acha" + dados.nomeTabela + dados.nomeTabelaCadastro, ids);
	
	return lote;
	
}
/* =========================================================
 * validarFormularioDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioDespejo(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'Lote');
	
}
/* =========================================================
 * pegaNomeColunasDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasDespejo(tipo) {
	
	var nomesColunas = pegaNomeColunasCafeFormacao(tipo);
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Despejo de Lotes";
			break;
		case 4: 
			nomesColunas = "Despejos de Lotes de Café";
			break;
		case 5: 
			nomesColunas["sacasSaldo"] = "";
			nomesColunas["pesoSaldo"] = "";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setEventosCamposDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposDespejo(dados, formulario) {
	
	setEventosCamposCafeFormacao(dados, formulario, 2);
	
	formulario.find('#sacas' + dados.nomeTabela)
		.bind("propertychange change click keyup input paste", function(event) {
		
			calculaLiquidoDespejo(dados);
		
	});
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura + 'DivInput span')
		.on('change', function() {
		
		var idLote = $('#idnomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura).val();
		
		var sacas = 0;
		var peso = 0;
		
		if (idLote > 0) {
		
			var textoLote = formulario.find('#nome' + dados.nomeTabela + dados.campoProcura + 'Mensagem').text();
			
			var textoLoteArray = textoLote.split('#');
			
			sacas = textoLoteArray[0];
			peso = textoLoteArray[1];
			sacasTotal = textoLoteArray[2];
			pesoTotal = textoLoteArray[3];
			observacao = textoLoteArray[4];
			pilha = textoLoteArray[5];
			
			formulario.find('#sacasSaldo' + dados.nomeTabela).val(sacas);
			formulario.find('#pesoSaldo' + dados.nomeTabela).val(peso);
			formulario.find('#sacasTotal' + dados.nomeTabela).val(sacasTotal);
			formulario.find('#pesoTotal' + dados.nomeTabela).val(pesoTotal);
			formulario.find('#observacao' + dados.nomeTabela).val(observacao);
			formulario.find('#pilha' + dados.nomeTabela).val(pilha);
			
			formulario.find('#sacas' + dados.nomeTabela).attr("disabled", false);
			
			formulario.find('#nome' + dados.nomeTabela + dados.campoProcura + 'Mensagem')
				.text(textoLoteArray[6]);
			
			setValoresCafeFormacao(dados, formulario, 2);
			
		}
		else {
			
			formulario.find('#sacasSaldo' + dados.nomeTabela).val('');
			formulario.find('#pesoSaldo' + dados.nomeTabela).val('');
			formulario.find('#sacasTotal' + dados.nomeTabela).val('');
			formulario.find('#pesoTotal' + dados.nomeTabela).val('');
			formulario.find('#observacao' + dados.nomeTabela).val('');
			formulario.find('#pilha' + dados.nomeTabela).val('');
			
			formulario.find('#sacas' + dados.nomeTabela).attr("disabled", true);
			
		}
		
	});
	
}
/* =========================================================
 * formularioDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function formularioDespejo(dados) {
	
	var campoSacasAltera = campoOculto("sacasAltera" + dados.nomeTabela, 0);
	var campoPesoAltera = campoOculto("pesoAltera" + dados.nomeTabela, 0);
	var campoSacasTotal = campoOculto("sacasTotal" + dados.nomeTabela, 0);
	var campoPesoTotal = campoOculto("pesoTotal" + dados.nomeTabela, 0);
	var campoObservacao = campoOculto("observacao" + dados.nomeTabela, "");
	var campoPilha = campoOculto("pilha" + dados.nomeTabela, "");
	
	dados["campoProcura"] = "Lote";
	
	var campoLote = campoSqlProcuraTextoCore({
		textoLabel: "Lote",
		nomeTabela: dados.nomeTabela,
		nomeTabelaCadastro: dados.nomeTabelaCadastro,
		campoProcura: dados.campoProcura,
		placeholder: "Digite o número do lote",
		tamanhoCampo: 'col-xs-9 col-md-6',
		tamanhoLabel: 'col-xs-3',
		minChars: 5,
		maxlength: 10
	});
	
	var campoSacasSaldo = campoNumeroHorizontal(
		"sacasSaldo" + dados.nomeTabela, "Saldo Sacas",
		'col-xs-9 col-md-6', 'col-xs-3',
		0, 3, false, false, "", "", "disabled"
	);
	
	var campoPesoSaldo = campoNumeroHorizontal(
		"pesoSaldo" + dados.nomeTabela, "Saldo Peso",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-9 col-md-6', 'col-xs-3',
		0, 3, false, false, "", "", "disabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 7, false, false, "", " kg", "enabled"
	);
	
	var formTela = $("<div/>")
		.addClass("form-horizontal")
		.append(campoLote)
		.append(campoSacasSaldo)
		.append(campoPesoSaldo)
		.append(campoSacas)
		.append(campoPeso)
		.append(campoObservacao)
		.append(campoPilha)
		.append(campoSacasAltera)
		.append(campoPesoAltera)
		.append(campoSacasTotal)
		.append(campoPesoTotal);
		
	
	var formulario = formularioCadastroCore(dados, formTela);
	
	setFormularioCafe(dados, formulario);
	
	formulario.find('#sacasSaldo' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	formulario.find('#pesoSaldo' + dados.nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura)
		.addClass("text-uppercase");
	
	return formulario;
	
}
/* =========================================================
 * calculaLiquidoDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoDespejo(dados) {
	
	var valores = {
		peso: 0.00,
		sacas: Number($('#sacas' + dados.nomeTabela).val()),
		sacasTotal: Number($('#sacasTotal' + dados.nomeTabela).val()),
		pesoTotal: Number($('#pesoTotal' + dados.nomeTabela).val()),
		sacasSaldo: Number($('#sacasSaldo' + dados.nomeTabela).val()),
		pesoSaldo: formataNumeroSql($('#pesoSaldo' + dados.nomeTabela).val())
	}
	
	if (valores.sacas == valores.sacasSaldo) valores.peso = valores.pesoSaldo;
	else if (valores.sacas == valores.sacasTotal) valores.peso = valores.pesoTotal;
	else {
		
		valores.peso = valores.sacas * (valores.pesoTotal / valores.sacasTotal);
		
		arredondaPesoCafe(valores);
		
	}
	
	$('#peso' + dados.nomeTabela).val(formataNumero(valores.peso, 2, false, false, "", " kg"));
	
}
/* =========================================================
 * setDadosFormularioDespejo.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioDespejo(dados, formulario) {
	
	setDadosFormularioCafeFormacao(dados, formulario, 2);
	
}
/* =========================================================
 * removeTotalTabelaEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaEntcafe(idLinha, nomeTabela) {
	
	removeTotalTabelaCafe(idLinha, nomeTabela);
	
}
/* =========================================================
 * setDadosTabelaEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaEntcafe(dados, trTabela, botaoVisualizar) {
	
	setDadosTabelaCafe(dados, trTabela, botaoVisualizar);
	
}
/* =========================================================
 * limpaDadosFormularioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioEntcafe(nomeTabela) {
	
	var formulario = limpaDadosFormularioCafe(nomeTabela);
	
	formulario.find('#nota' + nomeTabela).val('');
	formulario.find('#valor' + nomeTabela).val('');
	formulario.find('#placa' + nomeTabela).val('');
	formulario.find('#tiket' + nomeTabela).val('');
	formulario.find('#sacasNota' + nomeTabela).val('');
	formulario.find('#pesoNota' + nomeTabela).val('');
	
}
/* =========================================================
 * formataDadosEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosEntcafe(entcafe) {
	
	entcafe.data = formataData(entcafe.data);
	entcafe.placa = pegaPlacaMascara(entcafe.placa);
	entcafe.valor = formataNumero(entcafe.valor, 2, false, false, "R$ ", "");
	entcafe.peso = formataNumero(entcafe.peso, 2, false, false, "", " kg");
	entcafe.pesoNota = formataNumero(entcafe.pesoNota, 2, false, false, "", " kg");
	entcafe.produtor = decodeURIComponent(entcafe.produtor);
	entcafe.fazenda = decodeURIComponent(entcafe.fazenda);
	entcafe.observacao = decodeURIComponent(entcafe.observacao);
	entcafe.usuario = decodeURIComponent(entcafe.usuario);

	var status = "Aberta";
	
	entcafe["textoCobrar"] = "Não";
	
	entcafe["indexStatus"] = 0;
	
	if (entcafe.fechado) {
		
		status = "Fechada";
		
		entcafe.indexStatus = 1;
	
	}
	
	if (entcafe.cobrar) entcafe["textoCobrar"] = "Sim";
	
	entcafe.fechado = status;
	
	entcafe["titulo"] = entcafe.lote;
	
	entcafe["alterar"] = 0;
	entcafe["lancamento"] = 0;
	entcafe["imprimir"] = 0;
	entcafe["remover"] = 0;
	
}
/* =========================================================
 * setDadosDialogEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogEntcafe(dados) {
	
	formataDadosEntcafe(dados.array);
	
	var textoProdutor = juntaTituloTexto('Produtor', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda', dados.array.fazenda);
	
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoTiket = juntaTituloTexto('Ticket', dados.array.ticket);
	var textoPlaca = juntaTituloTexto('Placa', dados.array.placa);
	var textoUsuario = juntaTituloTexto('Usuário', dados.array.usuario);
	
	var textoNota = juntaTituloTexto('Número Nota', dados.array.nota);
	var textoValor = juntaTituloTexto('Valor Nota', dados.array.valor);
	var textoSacasNota = juntaTituloTexto('Sacas Nota', formataNumeroSacasCafe(dados.array.sacasNota));
	var textoPesoNota = juntaTituloTexto('Peso Nota', dados.array.pesoNota);
	
	var textoLote = juntaTituloTexto('Lote', dados.array.lote);
	var textoStatus = juntaTituloTexto('Status', dados.array.fechado);
	var textoCobrar = juntaTituloTexto('Cobrar Descarga', dados.array.textoCobrar);
	var textoSacas = juntaTituloTexto('Sacas Recebidas', formataNumeroSacasCafe(dados.array.sacas));
	var textoPeso = juntaTituloTexto('Peso Recebido', dados.array.peso);
	var textoDesdobras = juntaTituloTexto('Desdobras', dados.array.desdobras);
	
	var nomesColunas = {
		"coluna1": "Dados da Entrada",
		"coluna2": "Dados da Nota",
		"coluna3": "Dados do Lote"
	};
	
	var colunaDadosEntrada = {
		"coluna1": textoProdutor,
		"coluna2": textoFazenda,
		"coluna3": textoData,
		"coluna4": textoTiket,
		"coluna5": textoPlaca,
		"coluna6": textoUsuario
	};
	
	var colunaDadosNota = {
		"coluna1": textoNota,
		"coluna2": textoValor,
		"coluna3": textoSacasNota,
		"coluna4": textoPesoNota
	};
	
	var colunaDadosLote = {
		lote: textoLote,
		status: textoStatus,
		cobrar: textoCobrar
	};
	
	if (dados.array.indexStatus == 1) {
	
		colunaDadosLote["sacas"] = textoSacas;
		colunaDadosLote["peso"] = textoPeso;
		colunaDadosLote["desdobras"] = textoDesdobras;
		
	}
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDadosEntrada, 'text-left', 'texto', 'tdDadosEntrada'))
		   .append(juntaColunas(colunaDadosNota, 'text-left', 'texto', 'tdDadosNota'))
		   .append(juntaColunas(colunaDadosLote, 'text-left', 'texto', 'tdDadosLote'));
	
	setDadosDialogImprimirCore(dados, nomesColunas, trDados);
	
	setBotoesExcluirDialogCafe(dados);
	
}
/* =========================================================
 * setEventosCamposEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposEntcafe(dados, formulario) {
	
	setEventosCamposCafe(dados, formulario);
	
	addEventoCampoProcuraCafe(dados, formulario, "FazendaProdutor");
	
	formulario.find('#placa' + dados.nomeTabela).prop('disabled', true);
	formulario.find('#ticket' + dados.nomeTabela).prop('disabled', true);
	
}
/* =========================================================
 * removeLinhaTabelaEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeLinhaTabelaEntcafe(id, fechado, nomeTabela) {
	
	removeLinhaTabelaCafe(id, fechado, nomeTabela);
	
}
/* =========================================================
 * formularioRelatorioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioEntcafe(dados) {
	
	return formularioRelatorioCafe(dados);
	
}
/* =========================================================
 * setDadosFormularioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioEntcafe(dados) {
	
	setDadosFormularioCafe(dados);
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	if ($('#ticket' + dados.nomeTabela).val() > 0) {
	
		formulario.find("#spanGroupSearch" + dados.nomeTabela + "FazendaProdutor")
			.unbind();
		
	}
	
	$('#sacas' + dados.nomeTabela).val(dados.array.sacasNota);
	$('#peso' + dados.nomeTabela).val(dados.array.pesoNota);
	
}
/* =========================================================
 * validarFormularioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioEntcafe(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'FazendaProdutor');
	
}
/* =========================================================
 * pegaDadosFormularioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioEntcafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		lote: $("#lote" + nomeTabela).val(),
		nota: $("#nota" + nomeTabela).val(),
		valor: formataNumeroSql($("#valor" + nomeTabela).val()),
		placa: pegaPlacaTexto($("#placa" + nomeTabela).val().toUpperCase()),
		ticket: $("#ticket" + nomeTabela).val(),
		sacasNota: $("#sacas" + nomeTabela).val(),
		pesoNota: formataNumeroSql($("#peso" + nomeTabela).val()),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	var idFazenda = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val()
	}
	
	return {
		cadastro: cadastro,
		idFazenda: idFazenda
	};
		
}
/* =========================================================
 * formularioEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioEntcafe(dados) {
	
	var guia = getJson("getGuia" + dados.nomeTabela);
	
	dados.lote = guia.lote;
	
	var campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var divProdutor = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoProdutor);
	
	var campoTicket = campoNumeroHorizontal(
		"ticket" + dados.nomeTabela, "Ticket",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 11, false, true, "", "disabled"
	);
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		true, "-3", "0", formataData(guia.data),
		'enabled'
	).removeClass("has-feedback");
	
	var campoPlaca = campoPlacaHorizontal(
		"placa" + dados.nomeTabela, "Placa",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', false
	);
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback");
	
	var campoNota = campoTextoHorizontal(
		'nota' + dados.nomeTabela, 'text', 'Número Nota',
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		'', false, 10, "enabled"
	).removeClass("has-feedback");
	
	var campoValor = campoNumeroHorizontal(
		"valor" + dados.nomeTabela, "Valor Nota",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 9, false, true, "R$ ", "", "enabled"
	).removeClass("has-feedback");
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas Nota",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso Nota",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-7 col-md-6')
		.append(campoTicket)
		.append(campoPlaca)
		.append(campoSacas)
		.append(campoPeso);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-5 col-md-6')	
		.append(campoData)
		.append(campoLote)
		.append(campoNota)
		.append(campoValor);
	
	var divDados = $("<div/>")
		.addClass("form-horizontal")
		.append(divColuna1)
		.append(divColuna2);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divProdutor)
		.append(divDados);

	var formTela2 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * pegaProcuraEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraEntcafe(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * setDadosRodapeEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeEntcafe(rodape) {
	
	setDadosRodapeCafe(rodape);
	
}
/* =========================================================
 * eventoSalvarEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarEntcafe(dados) {
	
	eventoSalvarCafe(dados);
	
}
/* =========================================================
 * pegaNomeColunasEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasEntcafe(tipo) {
	
	var nomesColunas = pegaNomeColunasCafe();
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Entrada de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * nomeTabsEntcafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsEntcafe(tipo) {
	
	switch (tipo) {
		case 1: 
			return { 
				tabEntcafe1: "Dados",
				tabEntcafe2: "Observações"
			};
			
			break;
		case 2: 
			return { 
				tabEntcafe1: "Dados",
				tabEntcafe2: "Desdobras",
				tabEntcafe3: "Cobrança"
			};

			break;
	}
	
}
/* =========================================================
 * nomeTabsEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsEntlote() {
	
	var $nomesTabs = { 
		tabEntlote1: "Dados do Recebimento",
		tabEntlote2: "Desdobras de Lotes"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * formularioEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function formularioEntlote(dados) {
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "enabled"
	);
	
	var campoDesdobras = campoNumeroHorizontal(
		"desdobras" + dados.nomeTabela, "Desdobras",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		0, 2, false, false, "", "", "enabled"
	);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8")
		.append(campoLote)
		.append(campoSacas)
		.append(campoPeso)
		.append(campoDesdobras);
	
	var formTela2 = telaTabelaCore(dados, 2);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * limpaDadosFormularioEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioEntlote(dados) {
	
	limpaDadosFormularioDesdobrasCafe(dados);
	
	$("#lote" + dados.nomeTabela).val('');
	
}
/* =========================================================
 * validarFormularioEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioEntlote(dados, formulario) {
	
	validarFormularioCoreFormacao(dados, formulario);
	
}
/* =========================================================
 * pegaNomeColunasEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasEntlote(tipo) {
	
	return "Entrada de Café";
	
}
/* =========================================================
 * setEventosCamposEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposEntlote(dados, formulario) {
	
	setEventosCamposCafe(dados, formulario);
	
	setEventoDesdobrasCafeFormacao(dados, formulario);
	
	formulario.find('#sacas' + dados.nomeTabela)
		.bind("propertychange change click keyup input paste", function(event) {
			
			eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
		
	});
	
	formulario.find('#peso' + dados.nomeTabela)
		.bind("propertychange change click keyup input paste", function(event) {
			
			eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
		
	});
	
	formulario.find('#peso' + dados.nomeTabela)
		.on('focusout',function () {
			
			var valores = { peso: formataNumeroSql($('#peso' + dados.nomeTabela).val()) }
			
			arredondaPesoCafe(valores);
			
			formulario.find('#peso' + dados.nomeTabela)
				.val(formataNumero(valores.peso, 2, false, false, "", " kg"));
			
	});
	
	var rule = {checkLotesEntlote: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaLancamento[0])
		.rules('add', rule);
	
}
/* =========================================================
 * setDadosTabelaEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaEntlote(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	setDadosTabelaCafe(dados);
	
}
/* =========================================================
 * checkValoresEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresEntlote(dados, formulario) {
	
	var valores = {
		sacas: Number($('#sacas' + dados.nomeTabela).val()),
		peso: formataNumeroSql($('#peso' + dados.nomeTabela).val()),
		desdobras: Number($('#desdobras' + dados.nomeTabela).val())
	}
	
	if (valores.sacas == 0 || valores.peso == 0 || valores.desdobras == 0) {
		formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).hide();
	}
	else formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).show();
	
}
/* =========================================================
 * setDadosFormularioEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioEntlote(dados) {
	
	setDadosFormularioCore(dados);
	
	var campoCobrar = caixaVerificacaoHorizontal(
		'cobrar' + dados.nomeTabela,
		'Cobrar Descarga'
	);
	
	$('#botaoFormGroup').before(campoCobrar);
	
	$('#cobrar' + dados.nomeTabela).prop('checked', dados.array.cobrar);
	
	$('#desdobras' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * eventoSalvarEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarEntlote(dados) {
	
	eventoSalvarDesdobrasCafe(dados);
	
}
/* =========================================================
 * pegaDadosFormularioEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioEntlote(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		sacas: $("#sacas" + nomeTabela).val(),
		peso: formataNumeroSql($("#peso" + nomeTabela).val()),
		desdobras: $("#desdobras" + nomeTabela).val(),
		cobrar: $("#cobrar" + nomeTabela).prop('checked')
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * formataDadosEntlote.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosEntlote(dados) {
	
	if (dados.desdobras == 0) dados.desdobras++;
	
	eval ('formataDados' + dados.nomeTabelaLancamento[0] + '(dados.array)');
	
}
/* =========================================================
 * formularioLote.js
 * http://lls.net.br/
 * ========================================================= */

function formularioLote(dados) {
	
	var lote = criaNumeroLote(dados.nomeTabela, dados.nomeTabelaCadastro);
	
	var campoSacasAltera = campoOculto("sacasAltera" + dados.nomeTabela, 0);
	var campoPesoAltera = campoOculto("pesoAltera" + dados.nomeTabela, 0);
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-9 col-md-6', 'col-xs-3',
		'', true, 10, "disabled"
	);
	
	var campoPeneira = campoSqlProcuraTexto(
		"Peneira",
		dados.nomeTabela,
		"Peneira",
		"Digite o nome da peneira",
		'col-xs-9 col-md-6', 'col-xs-3', 1
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-9 col-md-6', 'col-xs-3',
		0, 3, false, true, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 7, false, false, "", " kg", "enabled"
	);
	
	var campoPilha = campoTextoHorizontal(
		'pilha' + dados.nomeTabela, 'text', 'Pilha',
		'col-xs-9 col-md-6', 'col-xs-3',
		'', false, 10, "enabled"
	);
	
	var campoObservacao = campoTextoHorizontal(
		'observacao' + dados.nomeTabela, 'text', 'Observação',
		'col-xs-9 col-md-6', 'col-xs-3',
		'', false, 50, "enabled"
	);
	
	var formTela = $("<div/>")
		.addClass("form-horizontal")
		.append(campoLote)
		.append(campoPeneira)
		.append(campoSacas)
		.append(campoPeso)
		.append(campoPilha)
		.append(campoObservacao)
		.append(campoSacasAltera)
		.append(campoPesoAltera);
	
	var formulario = formularioCadastroCore(dados, formTela);
	
	setFormularioCafe(dados, formulario);
	
	if (dados.id == 0) campoLote.find('#lote' + dados.nomeTabela).val(lote);
	
	return formulario;
	
}
/* =========================================================
 * campoSqlProcuraLote.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraLote(suggestion, tipo) {
	
	var peso = formataNumero(suggestion.data.peso, 2, false, false, "", " kg");
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<span class="' + 'badge"' + '><i>Sacas: ' + formataNumeroSacasCafe(suggestion.data.sacas) + '</i></span>' +
			'<h5 class="' + 'list-group-item-heading"' + '>' + suggestion.value + '</h5>' +
			'<p class="' + 'list-group-item-text"' + '><b><i>' +
				suggestion.data.peneira + ' ' + '</i></b></p>' +
		'</div>';
					
	}
	else {
		
		var texto = suggestion.data.sacas + '#' + peso + '#' +
			suggestion.data.sacasTotal + '#' + suggestion.data.pesoTotal + '#' +
			suggestion.data.observacao + '#' + suggestion.data.pilha + '#' + suggestion.data.peneira;
		
		return {
			texto: texto,
			valor: suggestion.value
		};
		
	}
	
}
/* =========================================================
 * setDadosRodapeLote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeLote(dados) {
	
	setDadosRodapeCafeFormacao(dados);
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraLote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraLote(dados, id) {
	
	var valores = pegaDadosCampoSqlProcuraCafe(id);
	
	valores.id = $('#idnomeProcuraCadastro' + dados.nomeTabelaCadastro + 'FazendaProdutor').val();
	
	return valores;
	
}
/* =========================================================
 * pegaNomeColunasLote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasLote(tipo) {
	
	var nomesColunas = pegaNomeColunasCafeFormacao(tipo);
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Lote de Café";
			break;
		case 4: 
			nomesColunas = "Desdobras de Lotes de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setLinhaTabelaLote.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaLote(dados) {
	
	setLinhaTabelaCafeFormacao(dados);
	
}
/* =========================================================
 * criaLoteLote.js
 * http://lls.net.br/
 * ========================================================= */

function criaNumeroLote(nomeTabela, nomeTabelaCadastro) {
	
	var lote = $('#lote' + nomeTabelaCadastro).val();
	
	var rowCount = jQuery($('#tbody' + nomeTabela)).find('tr').length;
	
	var letra = colName(rowCount);
	
	return lote + '/' + letra.toUpperCase();
	
}

function colName(n) {
	var ordA = 'a'.charCodeAt(0);
	var ordZ = 'z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
  
	var s = "";
	while(n >= 0) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}
	return s;
}
/* =========================================================
 * eventoSalvarLote.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarLote(dados) {
	
	eventoSalvarCafeFormacao(dados);
	
}
/* =========================================================
 * setEventosCamposLote.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposLote(dados, formulario) {
	
	dados["campoProcura"] = "Peneira";
	
	setEventosCamposCafeFormacao(dados, formulario, 1);
	
	formulario.find('#sacas' + dados.nomeTabela)
		.bind("propertychange change click keyup input paste", function(event) {
		
			eval ('calculaLiquido' + dados.nomeTabela + '(dados)');
			
			formulario.find('#peso' + dados.nomeTabela).valid();
		
	});
	
}
/* =========================================================
 * removeLote.js
 * http://lls.net.br/
 * ========================================================= */

function removeLote(dados) {
	
	checkRemoveLinhaTabela(dados);
	
}
/* =========================================================
 * removeTotalTabelaLote.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaLote(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	removeTotalTabelaCafeFormacao(dados);
	
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).empty();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).remove();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).dialog( "close" );
	
}
/* =========================================================
 * pegaTabelaLote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaLote(dados) {

	var lote = getJsonById("acha" + dados.nomeTabela + dados.nomeTabelaCadastro, dados.id);
	
	return lote;
	
}
/* =========================================================
 * validarFormularioLote.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioLote(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'Peneira');
	
	jQuery.validator.addMethod('checkDesdobras' + dados.nomeTabela,
		function (value, element) { 		
			
			var desdobras = $('#desdobras' + dados.nomeTabelaCadastro).val();
			
			var totalSacasRecebido = getTotalRecebidoCafeFormacao("Sacas", dados.nomeTabelaCadastro);
				
			var totalPesoRecebido = getTotalRecebidoCafeFormacao("Peso", dados.nomeTabelaCadastro);
			
			var check = {
				msg: "",
				campo: "desdobras"
			}
			
			if (totalSacasRecebido == 0 || totalPesoRecebido == 0 || desdobras == 0) {
				
				if (totalSacasRecebido == 0 ) check.campo = "sacas";
				else if (totalPesoRecebido == 0 ) check.campo = "peso";
				
				check.msg = "É necessário informar a quantidade de " + check.campo;
				
			}
			else {
				
				var rowCount = jQuery($('#tbody' + dados.nomeTabela)).find('tr').length;
	
				var totalDesdobras = $('#' + check.campo + dados.nomeTabelaCadastro).val();
							
				var valorAltera = getValorAlteraCafeFormacao("Sacas", formulario, dados.nomeTabela);
							
				if (rowCount == totalDesdobras && valorAltera == 0) {
					
					check.msg = "Quantidade de " + check.campo + " excedidas!";
					
				}
				else return true;
				
			}
			
			$("#divDialogAltera" + dados.nomeTabela).dialog( "close" );
				
			$('#divDialogAltera' + dados.nomeTabelaCadastro)
				.find('#tab' + dados.nomeTabelaCadastro + '2').removeClass('in active');
				
			$('#divDialogAltera' + dados.nomeTabelaCadastro)
				.find('#linha_tab' + dados.nomeTabelaCadastro + '2').removeClass('active');
				
			$('#divDialogAltera' + dados.nomeTabelaCadastro)
				.find('#tab' + dados.nomeTabelaCadastro + '1').addClass('in active');
				
			$('#divDialogAltera' + dados.nomeTabelaCadastro)
				.find('#linha_tab' + dados.nomeTabelaCadastro + '1').addClass('active');
				
			$('#divDialogAltera' + dados.nomeTabelaCadastro)
				.find('#' + check.campo + dados.nomeTabelaCadastro).focus();
			
			mostraDialog(
				check.msg,
				'texto_cor_vermelho',
				'table',
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(4)'))
			);
			
			return false;
			
		}, ''
	);
	
}
/* =========================================================
 * calculaLiquidoLote.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoLote(dados) {
	
	var valores = {
		media: 0,
		peso: 0.00,
		sacasTabela: 0,
		pesoTabela: 0.00,
		sacas: Number($('#sacas' + dados.nomeTabela).val()),
		sacasDesdobras: Number($('#sacas' + dados.nomeTabelaCadastro).val()),
		pesoDesdobras: formataNumeroSql($('#peso' + dados.nomeTabelaCadastro).val())
	}
	
	valores.media = valores.pesoDesdobras / valores.sacasDesdobras;
	
	var trLote = $('#nomeRodape' + dados.nomeTabela);
	
	if (trLote != null) {
		valores.sacasTabela = formataNumeroSacasSql(trLote.find('#totalSacas').find('p').text());
		valores.pesoTabela = formataNumeroSql(trLote.find('#totalPeso').find('p').text());
	}
	
	if (valores.sacas == (valores.sacasDesdobras - valores.sacasTabela)) {
		valores.peso = valores.pesoDesdobras - valores.pesoTabela;
	}
	else {
		
		valores.peso = valores.sacas * valores.media;
		
		arredondaPesoCafe(valores);
		
	}
	
	$('#peso' + dados.nomeTabela).val(formataNumero(valores.peso, 2, false, false, "", " kg"));

}
/* =========================================================
 * setDadosFormularioLote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioLote(dados, formulario) {
	
	setDadosFormularioCafeFormacao(dados, formulario, 1);
	
}
/* =========================================================
 * pegaDadosFormularioLote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioLote(dados) {
	
	return pegaDadosFormularioCafeFormacao(dados);
	
}
/* =========================================================
 * formataDadosLote.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosLote(dados) {
	
	formataDadosCafeFormacao(dados);
	
}
/* =========================================================
 * pegaDadosSqlProcuraLote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraLote(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
		
		return {
			value: data[1],
			data: {
				id: data[0],
				sacas: data[2],
				peso: data[3],
				sacasTotal: data[4],
				pesoTotal: data[5],
				observacao: data[6],
				pilha: data[7],
				peneira: data[8]
			}
		};
		
	});

}
/* =========================================================
 * pegaProcuraOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraOscafe(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * removeLinhaTabelaOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeLinhaTabelaOscafe(id, fechado, nomeTabela) {
	
	removeLinhaTabelaCafe(id, fechado, nomeTabela);
	
}
/* =========================================================
 * limpaDadosFormularioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioOscafe(nomeTabela) {
	
	var formulario = limpaDadosFormularioCafe(nomeTabela);
	
	formulario.find('#autorizacao' + nomeTabela).val('');
	formulario.find('#instrucoes' + nomeTabela).val('');
	
}
/* =========================================================
 * validarFormularioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioOscafe(dados, formulario) {
	
	validarFormularioDespejoCafe(dados, formulario);
	
}
/* =========================================================
 * pegaNomeColunasOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasOscafe(tipo) {
	
	var nomesColunas = pegaNomeColunasCafe();
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Serviço de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosDialogOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogOscafe(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados.array)');
	
	var textoProdutor = juntaTituloTexto('Produtor', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda', dados.array.fazenda);
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoUsuario = juntaTituloTexto('Usuário', dados.array.usuario);
	
	var textoLote = juntaTituloTexto('Lote', dados.array.lote);
	var textoSacas = juntaTituloTexto('Sacas', formataNumeroSacasCafe(dados.array.sacas));
	var textoPeso = juntaTituloTexto('Peso', dados.array.peso);
	var textoStatus = juntaTituloTexto('Status', dados.array.statusCafe);
	
	var nomesColunas = {
		"coluna1": "Dados do Serviço",
		"coluna2": "Dados do Lote"
	};
	
	var colunaDadosServico = {
		"coluna1": textoProdutor,
		"coluna2": textoFazenda,
		"coluna3": textoData,
		"coluna4": textoUsuario
	};
	
	var colunaDadosLote = {
		lote: textoLote,
		sacas: textoSacas,
		peso: textoPeso,
		status: textoStatus
	};
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDadosServico, 'text-left', 'texto', 'tdDadosServico'))
		   .append(juntaColunas(colunaDadosLote, 'text-left', 'texto', 'tdDadosLote'));
	
	if (dados.array.indexStatus == 2) {
		
		nomesColunas["coluna3"] = "Resultado do Serviço";
		
		var textoDesdobras = juntaTituloTexto('Desdobras', dados.array.desdobras);
		var textoSacasQuebra = juntaTituloTexto('Sacas Quebra', formataNumeroSacasCafe(dados.array.sacasQuebra));
		var textoPesoQuebra = juntaTituloTexto('Peso Quebra', dados.array.pesoQuebra);
		var textoSacasAcrescimo = juntaTituloTexto('Sacas Acrescimo', formataNumeroSacasCafe(dados.array.sacasAcrescimo));
		var textoPesoAcrescimo = juntaTituloTexto('Peso Acrescimo', dados.array.pesoAcrescimo);
		var textoSacasResultado = juntaTituloTexto('Sacas Resultado', formataNumeroSacasCafe(dados.array.sacasResultado));
		var textoPesoResultado = juntaTituloTexto('Peso Resultado', dados.array.pesoResultado);
		
		var colunaResultadoServico = {
			desdobras: textoDesdobras,
			sacasQuebra: textoSacasQuebra,
			pesoQuebra: textoPesoQuebra,
			sacasAcrescimo: textoSacasAcrescimo,
			pesoAcrescimo: textoPesoAcrescimo,
			sacasResultado: textoSacasResultado,
			pesoResultado: textoPesoResultado
		};
		
		trDados.append(juntaColunas(colunaResultadoServico, 'text-left', 'texto', 'tdResultadoServico'));
		
	}
	
	setDadosDialogImprimirCore(dados, nomesColunas, trDados);
	
	if (dados.array.instrucoes != '' && dados.array.instrucoes != null) {
		
		tbodyCadastro = $('#tbodyDialog' + dados.nomeTabela);
		
		trObservacao = tbodyCadastro.find('#trObservacao' + dados.nomeTabela);
		
		if (dados.array.observacao != '' && dados.array.observacao != null) {
			
			trObservacao.remove();
			
			var trInstrucoes = tr('', '')
				.append(tabelaCelula(dados.array.observacao, 'text-left', 'texto', 'tdObservacao'))
				.append(tabelaCelula(dados.array.instrucoes, 'text-left', 'texto', 'tdInstrucoes')
					.attr('colspan', 2));
			
			tbodyCadastro.append(trInstrucoes);
			
		}
		else {
			
			var trInstrucoes = tr('', '')
				.append(tabelaCelula(dados.array.instrucoes, 'text-left', 'texto', 'tdInstrucoes')
					.attr('colspan', 3));
			
			tbodyCadastro.append(trInstrucoes);
			
		}
		
	}
	
	setBotoesExcluirDialogCafe(dados);
	
}
/* =========================================================
 * formularioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioOscafe(dados) {
	
	var guia = getJson("getGuia" + dados.nomeTabela);
	
	dados.lote = guia.lote;
	
	var campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var divProdutor = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoProdutor);
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		true, "-3", "0", formataData(guia.data),
		'enabled'
	).removeClass("has-feedback");
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback");
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 8, false, false, "", " kg", "disabled"
	).removeClass("has-feedback");
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-7 col-md-6')
		.append(campoSacas)
		.append(campoPeso);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-5 col-md-6')	
		.append(campoData)
		.append(campoLote);
	
	var divDados = $("<div/>")
		.addClass("form-horizontal")
		.append(divColuna1)
		.append(divColuna2);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divProdutor)
		.append(divDados);
	
	var formTela2 = telaTabelaCore(dados, 1);
	var formTela3 = formularioObservacaoCore(dados.nomeTabela, "instrucoes", 9);
	var formTela4 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2, formTela3, formTela4]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * nomeTabsOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsOscafe(tipo) {
	
	switch (tipo) {
		case 1: 
			return { 
				tabOscafe1: "Dados",
				tabOscafe2: "Despejo",
				tabOscafe3: "Instruções",
				tabOscafe4: "Observações"
			};
			
			break;
		case 2: 
			return { 
				tabOscafe1: "Dados",
				tabOscafe2: "Despejo",
				tabOscafe3: "Lotes",
				tabOscafe4: "Cobrança"
			};

			break;
	}
	
}
/* =========================================================
 * setDadosTabelaOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaOscafe(dados, trTabela, botaoVisualizar) {
	
	setDadosTabelaCafe(dados, trTabela, botaoVisualizar);
	
}
/* =========================================================
 * eventoSalvarOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarOscafe(dados) {
	
	eventoSalvarCafe(dados);
	
}
/* =========================================================
 * setDadosRodapeOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeOscafe(rodape) {
	
	setDadosRodapeCafe(rodape);
	
}
/* =========================================================
 * pegaDadosFormularioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioOscafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		lote: $("#lote" + nomeTabela).val(),
		sacas: $("#sacas" + nomeTabela).val(),
		peso: formataNumeroSql($("#peso" + nomeTabela).val()),
		instrucoes: encodeURIComponent( unescape($("#instrucoes" + nomeTabela).val())),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * formataDadosOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosOscafe(oscafe) {
	
	oscafe.data = formataData(oscafe.data);
	oscafe.peso = formataNumero(oscafe.peso, 2, false, true, "", " kg");
	oscafe.pesoQuebra = formataNumero(oscafe.pesoQuebra, 2, false, true, "", " kg");
	oscafe.pesoAcrescimo = formataNumero(oscafe.pesoAcrescimo, 2, false, true, "", " kg");
	oscafe.pesoResultado = formataNumero(oscafe.pesoResultado, 2, false, true, "", " kg");
	oscafe.produtor = decodeURIComponent(oscafe.produtor);
	oscafe.fazenda = decodeURIComponent(oscafe.fazenda);
	oscafe.instrucoes = decodeURIComponent(oscafe.instrucoes);
	oscafe.observacao = decodeURIComponent(oscafe.observacao);
	oscafe.usuario = decodeURIComponent(oscafe.usuario);
	
	oscafe["titulo"] = oscafe.lote;
	
	oscafe["alterar"] = 0;
	oscafe["lancamento"] = 0;
	oscafe["imprimir"] = 0;
	oscafe["remover"] = 0;
	
}
/* =========================================================
 * formularioRelatorioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioOscafe(dados) {
	
	return formularioRelatorioCafe(dados);
	
}
/* =========================================================
 * removeTotalTabelaOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaOscafe(idLinha, nomeTabela) {
	
	removeTotalTabelaCafe(idLinha, nomeTabela);
	
}
/* =========================================================
 * setEventosCamposOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposOscafe(dados, formulario) {
	
	setEventosCamposCafe(dados, formulario);
	
	addEventoCampoProcuraCafe(dados, formulario, "FazendaProdutor");
	
	formulario.find('#linha_tab' + dados.nomeTabela + '2').click(function(e){
		
		checkValoresCafeFormacao(dados, formulario);
		
	});
	
	var rule = {checkLotesOscafe: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaCadastro)
		.rules('add', rule);
	
}
/* =========================================================
 * setDadosFormularioOscafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioOscafe(dados) {
	
	setDadosFormularioDespejoCafe(dados);
	
}
/* =========================================================
 * checkValoresOslote.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresOslote(dados, formulario) {
	
	var cadastro = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	var campo = cadastro.cadastro;
	
	var valores = {
		sacas: Number(campo.sacasDespejo) - Number(campo.sacasQuebra) + Number(campo.sacasAcrescimo),
		peso: campo.pesoDespejo - campo.pesoQuebra + campo.pesoAcrescimo
	}
	
	arredondaPesoCafe(valores);
	
	$('#sacas' + dados.nomeTabela).val(valores.sacas);
	$('#peso' + dados.nomeTabela).val(formataNumero(valores.peso, 2, false, false, "", " kg"));
	
	if (campo.desdobras == 0) {
		formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).hide();
	}
	else formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).show();
	
}
/* =========================================================
 * limpaDadosFormularioOslote.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioOslote(dados) {
	
	limpaDadosFormularioDesdobrasCafe(dados);
	
	$('#lote' + dados.nomeTabela).val('');
	$('#sacas' + dados.nomeTabela).val(0);
	$('#peso' + dados.nomeTabela).val(0);
	
}
/* =========================================================
 * pegaNomeColunasOslote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasOslote(tipo) {
	
	return "Ordem de Serviço de Café";
	
}
/* =========================================================
 * pegaDadosFormularioOslote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioOslote(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		desdobras: $('#desdobras' + nomeTabela).val(),
		sacasDespejo: $('#sacasDespejo' + nomeTabela).val(),
		sacasQuebra: $('#sacasQuebra' + nomeTabela).val(),
		sacasAcrescimo: $('#sacasAcrescimo' + nomeTabela).val(),
		pesoDespejo: formataNumeroSql($('#pesoDespejo' + nomeTabela).val()),
		pesoQuebra: formataNumeroSql($('#pesoQuebra' + nomeTabela).val()),
		pesoAcrescimo: formataNumeroSql($('#pesoAcrescimo' + nomeTabela).val())		
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * setDadosFormularioOslote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioOslote(dados) {
	
	setDadosFormularioCore(dados);
	
	$('#desdobras' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * nomeTabsOslote.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsOslote() {
	
	return { 
		tabOslote1: "Dados",
		tabOslote2: "Lotes",
		tabOslote3: "Cobrança"
	};
	
}
/* =========================================================
 * eventoSalvarOslote.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarOslote(dados) {
	
	eventoSalvarDesdobrasCafe(dados);
	
}
/* =========================================================
 * formularioOslote.js
 * http://lls.net.br/
 * ========================================================= */

function formularioOslote(dados) {
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback").css("font-weight", "Bold").css("font-size", "15px");
	
	var campoDesdobras = campoNumeroHorizontal(
		"desdobras" + dados.nomeTabela, "Desdobras",
		'col-xs-6 col-sm-6 col-lg-8', 'col-xs-6 col-sm-6 col-lg-4',
		0, 2, false, false, "", "", "enabled"
	).css("font-weight", "Bold").css("font-size", "15px");
	
	var divLote = $("<div/>").addClass('col-xs-6 col-md-6').append(campoLote);
	var divDesdobras = $("<div/>").addClass('col-xs-6 col-md-6').append(campoDesdobras);
	
	var divCampos1 = $("<div/>")
		.addClass("form-horizontal")
		.append(divLote)
		.append(divDesdobras);
	
	var campoSacasDespejo = campoNumeroHorizontal(
		"sacasDespejo" + dados.nomeTabela, "Sacas",
		'col-xs-6 col-sm-6 col-lg-8', 'col-xs-6 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "disabled"
	).css("font-weight", "Bold").css("font-size", "15px");
	
	var campoPesoDespejo = campoNumeroHorizontal(
		"pesoDespejo" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	).css("font-weight", "Bold").css("font-size", "15px");
	
	var divSacasDespejo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoSacasDespejo);
	var divPesoDespejo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPesoDespejo);
	
	var divCampos2 = $("<div/>")
		.addClass("form-horizontal")
		.append(divSacasDespejo)
		.append(divPesoDespejo);
	
	var campoQuebra = campoNumeroHorizontal(
		"sacasQuebra" + dados.nomeTabela, "Quebra",
		'col-xs-6 col-sm-6 col-lg-8', 'col-xs-6 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPesoQuebra = campoNumeroHorizontal(
		"pesoQuebra" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "enabled"
	);
	
	var divQuebra = $("<div/>").addClass('col-xs-6 col-md-6').append(campoQuebra);
	var divPesoQuebra = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPesoQuebra);
	
	var divCampos3 = $("<div/>")
		.addClass("form-horizontal")
		.append(divQuebra)
		.append(divPesoQuebra);
	
	var campoAcrescimo = campoNumeroHorizontal(
		"sacasAcrescimo" + dados.nomeTabela, "Acréscimo",
		'col-xs-6 col-sm-6 col-lg-8', 'col-xs-6 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPesoAcrescimo = campoNumeroHorizontal(
		"pesoAcrescimo" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "enabled"
	);
	
	var divAcrescimo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoAcrescimo);
	var divPesoAcrescimo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPesoAcrescimo);
	
	var divCampos4 = $("<div/>")
		.addClass("form-horizontal")
		.append(divAcrescimo)
		.append(divPesoAcrescimo);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Resultado",
		'col-xs-6 col-sm-6 col-lg-8', 'col-xs-6 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "disabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	var divSacas = $("<div/>").addClass('col-xs-6 col-md-6').append(campoSacas);
	var divPeso = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPeso);
	
	var divCampos5 = $("<div/>")
		.addClass("form-horizontal")
		.append(divSacas)
		.append(divPeso);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")
		.append(divCampos1)
		.append(divCampos2)
		.append(divCampos3)
		.append(divCampos4)
		.append(divCampos5);
	
	dados.nomeTabelaLancamento.splice(0, 1);
	
	var arrayTela = [];
	
	arrayTela[0] = formTela1;
	
	for(var i = 0; i < dados.nomeTabelaLancamento.length; i++) {
		
		arrayTela[i+1] = telaTabelaCore(dados, 2, i);
		
	}
	
	var formulario = formularioLancamentoCore(dados, arrayTela);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * setEventosCamposOslote.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposOslote(dados, formulario) {
	
	setEventoDesdobrasCafeFormacao(dados, formulario);
	
	var valores = {
		sacas: dados.array.sacasDespejo,
		peso: formataNumeroSql(dados.array.pesoDespejo)
	}
	
	var campos = {
		quebra: "Quebra",
		acrescimo: "Acrescimo"
	}
	
	jQuery.each( campos, function( i, campo ) {
		
		var tipos = {
			sacas: "sacas",
			peso: "peso"
		}
		
		jQuery.each( tipos, function( j, campoTipo ) {
		
			var input = formulario.find('#' + j + campo + dados.nomeTabela);
			
			input.bind("propertychange change click keyup input paste", function(event) {
				
				input.valid();
				
				eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
				
			});
			
			var valorTexto = valores[j];
			
			if (campoTipo == "peso") {
				
				valorTexto = formataNumero(valores[j], 2, false, true, "", " kg");
				
				input.on('focusout',function () {
						
						var valor = { peso: formataNumeroSql(input.val()) }
						
						arredondaPesoCafe(valor);
						
						input.val(formataNumero(valor.peso, 2, false, true, "", " kg"));
						
				});
				
			}
			
			input.rules('add', {
				number: true,
				max: valores[j],
				messages: { 
					max: "Quantidade de " + campo.toLowerCase() + " maior que " + valorTexto
				}
			});
		
		});
		
	});
	
	var rule = {checkLotesOslote: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaLancamento[0])
		.rules('add', rule);
	
	formulario.find('#linha_tab' + dados.nomeTabela + '3').click(function(e){
		
		var desdobras = $('#desdobras' + dados.nomeTabela).val();
		
		var rowCount = formulario.find('#tbody' + dados.nomeTabelaLancamento[0]).find('tr').length;
		
		if (rowCount != desdobras || desdobras == 0) {
			formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[1]).hide();
		}
		else formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[1]).show();
		
	});
	
}
/* =========================================================
 * validarFormularioOslote.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioOslote(dados, formulario) {
	
	validarFormularioCoreFormacao(dados, formulario);
	
}
/* =========================================================
 * setDadosTabelaOslote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaOslote(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	setDadosTabelaCafe(dados);
	
}
/* =========================================================
 * formataDadosOslote.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosOslote(dados) {
	
	if (dados.desdobras == 0) dados.desdobras++;
	
	eval ('formataDados' + dados.nomeTabelaLancamento[0] + '(dados.array)');
	
	dados.array.pesoDespejo = formataNumero(dados.array.pesoDespejo, 2, false, false, "", " kg");
	dados.array.pesoQuebra = formataNumero(dados.array.pesoQuebra, 2, false, true, "", " kg");
	dados.array.pesoAcrescimo = formataNumero(dados.array.pesoAcrescimo, 2, false, true, "", " kg");
	
}
/* =========================================================
 * removeLinhaTabelaSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeLinhaTabelaSaicafe(id, fechado, nomeTabela) {
	
	removeLinhaTabelaCafe(id, fechado, nomeTabela);
	
}
/* =========================================================
 * limpaDadosFormularioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioSaicafe(nomeTabela) {
	
	var formulario = limpaDadosFormularioCafe(nomeTabela);
	
	formulario.find('#destino' + nomeTabela).val('');
	
}
/* =========================================================
 * setEventosCamposSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposSaicafe(dados, formulario) {
	
	setEventosCamposCafe(dados, formulario);
	
	var input = formulario.find('#destino' + dados.nomeTabela);
		
	input.bind("propertychange change click keyup input paste", function(event) {
		
		input.valid();
		
	});
	
	input.rules('add', {
		messages: { required: "É necessário informar o destino" }
	});
	
	addEventoCampoProcuraCafe(dados, formulario, "FazendaProdutor");
	
	formulario.find('#linha_tab' + dados.nomeTabela + '2').click(function(e){
		
		checkValoresCafeFormacao(dados, formulario);
		
	});
	
	var rule = {checkLotesSaicafe: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaCadastro)
		.rules('add', rule);
	
}
/* =========================================================
 * formularioRelatorioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioSaicafe(dados) {
	
	return formularioRelatorioCafe(dados);
	
}
/* =========================================================
 * formularioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioSaicafe(dados) {
	
	var guia = getJson("getGuia" + dados.nomeTabela);
	
	dados.lote = guia.lote;
	
	var campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var campoDestino = campoTextoHorizontal(
		'destino' + dados.nomeTabela, 'text', 'Destino',
		'col-xs-9 col-md-6', 'col-xs-3',
		'', true, 50, "enabled"
	);
	
	var divProdutor = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoProdutor)
		.append(campoDestino);
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		true, "-3", "0", formataData(guia.data),
		'enabled'
	).removeClass("has-feedback");
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback");
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 4, false, false, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 8, false, false, "", " kg", "disabled"
	).removeClass("has-feedback");
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-7 col-md-6')
		.append(campoSacas)
		.append(campoPeso);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-5 col-md-6')
		.append(campoData)
		.append(campoLote);
	
	var divDados = $("<div/>")
		.addClass("form-horizontal")
		.append(divColuna1)
		.append(divColuna2);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divProdutor)
		.append(divDados);
	
	var formTela2 = telaTabelaCore(dados, 1);
	var formTela3 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2, formTela3]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * nomeTabsSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsSaicafe(tipo) {
	
	switch (tipo) {
		case 1: 
			return { 
				tabSaicafe1: "Dados",
				tabSaicafe2: "Despejo",
				tabSaicafe3: "Observações"
			};
			
			break;
		case 2: 
			return { 
				tabSaicafe1: "Dados",
				tabSaicafe2: "Despejo",
				tabSaicafe3: "Cobrança"
			};

			break;
	}
	
}
/* =========================================================
 * pegaDadosFormularioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioSaicafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		lote: $("#lote" + nomeTabela).val(),
		sacas: $("#sacas" + nomeTabela).val(),
		peso: formataNumeroSql($("#peso" + nomeTabela).val()),
		destino: encodeURIComponent( unescape($("#destino" + nomeTabela).val())),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * formataDadosSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSaicafe(saicafe) {
	
	saicafe.data = formataData(saicafe.data);
	saicafe.peso = formataNumero(saicafe.peso, 2, false, true, "", " kg");
	saicafe.pesoSaida = formataNumero(saicafe.pesoSaida, 2, false, true, "", " kg");
	saicafe.destino = decodeURIComponent(saicafe.destino);
	saicafe.produtor = decodeURIComponent(saicafe.produtor);
	saicafe.fazenda = decodeURIComponent(saicafe.fazenda);
	saicafe.observacao = decodeURIComponent(saicafe.observacao);
	saicafe.usuario = decodeURIComponent(saicafe.usuario);
	
	if (saicafe.cobrar) saicafe["textoCobrar"] = "Sim";
	else saicafe["textoCobrar"] = "Não";
	
	saicafe["titulo"] = saicafe.lote;
	
	saicafe["alterar"] = 0;
	saicafe["lancamento"] = 0;
	saicafe["imprimir"] = 0;
	saicafe["remover"] = 0;
	
}
/* =========================================================
 * setDadosDialogSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogSaicafe(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados.array)');
	
	var textoProdutor = juntaTituloTexto('Produtor', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda', dados.array.fazenda);
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoDestino = juntaTituloTexto('Destino', dados.array.destino);
	var textoUsuario = juntaTituloTexto('Usuário', dados.array.usuario);
	
	var textoLote = juntaTituloTexto('Lote', dados.array.lote);
	var textoSacas = juntaTituloTexto('Sacas', formataNumeroSacasCafe(dados.array.sacas));
	var textoPeso = juntaTituloTexto('Peso', dados.array.peso);
	var textoStatus = juntaTituloTexto('Status', dados.array.statusCafe);
	var textoCobrar = juntaTituloTexto('Cobrar Carga', dados.array.textoCobrar);
	
	var nomesColunas = {
		"coluna1": "Dados da Saída",
		"coluna2": "Dados do Lote"
	};
	
	var colunaDadosSaida = {
		"coluna1": textoProdutor,
		"coluna2": textoFazenda,
		"coluna3": textoData,
		"coluna4": textoDestino,
		"coluna5": textoUsuario
	};
	
	var colunaDadosLote = {
		lote: textoLote,
		sacas: textoSacas,
		peso: textoPeso,
		status: textoStatus,
		cobrar: textoCobrar
	};
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDadosSaida, 'text-left', 'texto', 'tdDadosSaida'))
		   .append(juntaColunas(colunaDadosLote, 'text-left', 'texto', 'tdDadosLote'));
		   
	if (dados.array.indexStatus == 2) {
		
		nomesColunas["coluna3"] = "Resultado da Saída";
		
		var textoTicket = juntaTituloTexto('Ticket', dados.array.ticket);
		var textoSacasSaida = juntaTituloTexto('Sacas Saída', formataNumeroSacasCafe(dados.array.sacasSaida));
		var textoPesoSaida = juntaTituloTexto('Peso Saída', dados.array.pesoSaida);
		
		var colunaResultadoSaida = {
			ticket: textoTicket,
			sacasSaida: textoSacasSaida,
			pesoSaida: textoPesoSaida,
		};
		
		trDados.append(juntaColunas(colunaResultadoSaida, 'text-left', 'texto', 'tdResultadoSaida'));
		
	}
	
	setDadosDialogImprimirCore(dados, nomesColunas, trDados);
	
	setBotoesExcluirDialogCafe(dados);

}
/* =========================================================
 * setDadosFormularioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioSaicafe(dados) {
	
	setDadosFormularioDespejoCafe(dados);
	
}
/* =========================================================
 * pegaProcuraSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraSaicafe(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * validarFormularioSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioSaicafe(dados, formulario) {
	
	validarFormularioDespejoCafe(dados, formulario);
	
}
/* =========================================================
 * pegaNomeColunasSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSaicafe(tipo) {
	
	var nomesColunas = pegaNomeColunasCafe();
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Saída de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosRodapeSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSaicafe(rodape) {
	
	setDadosRodapeCafe(rodape);
	
}
/* =========================================================
 * setDadosTabelaSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSaicafe(dados, trTabela, botaoVisualizar) {
	
	setDadosTabelaCafe(dados, trTabela, botaoVisualizar);
	
}
/* =========================================================
 * removeTotalTabelaSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaSaicafe(idLinha, nomeTabela) {
	
	removeTotalTabelaCafe(idLinha, nomeTabela);
	
}
/* =========================================================
 * eventoSalvarSaicafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarSaicafe(dados) {
	
	eventoSalvarCafe(dados);
	
}
/* =========================================================
 * pegaDadosFormularioSailote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioSailote(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		ticket: $('#ticket' + nomeTabela).val(),
		sacas: $('#sacas' + nomeTabela).val(),
		peso: formataNumeroSql($('#peso' + nomeTabela).val()),
		sacasDespejo: $('#sacasDespejo' + nomeTabela).val(),
		pesoDespejo: formataNumeroSql($('#pesoDespejo' + nomeTabela).val()),
		cobrar: $("#cobrar" + nomeTabela).prop('checked'),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * validarFormularioSailote.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioSailote(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
}
/* =========================================================
 * eventoSalvarSailote.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarSailote(dados) {
	
	eventoSalvarDesdobrasCafe(dados);
	
}
/* =========================================================
 * pegaNomeColunasSailote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSailote(tipo) {
	
	return "Saída de Café";
	
}
/* =========================================================
 * setEventosCamposSailote.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposSailote(dados, formulario) {
	
	var input = formulario.find('#ticket' + dados.nomeTabela);
		
	input.bind("propertychange change click keyup input paste", function(event) {
		
		input.valid();
		
	});
	
	input.rules('add', {
		messages: { required: "É necessário informar o número do ticket" }
	});
	
	input = formulario.find('#sacas' + dados.nomeTabela);
	
	input.bind("propertychange change click keyup input paste", function(event) {
			
		eval ("checkValores" + dados.nomeTabela + "(dados, formulario)");
		
		input.valid();
		
	});
		
	input = formulario.find('#peso' + dados.nomeTabela);
			
	input.on('focusout',function () {
			
		var valor = { peso: formataNumeroSql(input.val()) }
		
		arredondaPesoCafe(valor);
		
		input.val(formataNumero(valor.peso, 2, false, true, "", " kg"));
			
	});
	
}
/* =========================================================
 * formataDadosSailote.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSailote(dados) {
	
	dados.array.pesoDespejo = formataNumero(dados.array.pesoDespejo, 2, false, false, "", " kg");
	
}
/* =========================================================
 * setDadosTabelaSailote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSailote(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	setDadosTabelaCafe(dados);
	
}
/* =========================================================
 * checkValoresSailote.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresSailote(dados, formulario) {
	
	var valores = {
		sacas: Number($('#sacas' + dados.nomeTabela).val()),
		peso: formataNumeroSql($('#peso' + dados.nomeTabela).val()),
		sacasDespejo: Number($('#sacasDespejo' + dados.nomeTabela).val()),
		pesoDespejo: formataNumeroSql($('#pesoDespejo' + dados.nomeTabela).val())
	}
	
	valores.peso = valores.sacas * (valores.pesoDespejo / valores.sacasDespejo);
	
	arredondaPesoCafe(valores);
	
	$('#peso' + dados.nomeTabela).val(formataNumero(valores.peso, 2, false, false, "", " kg"));

	$('#sacas' + dados.nomeTabela).rules('remove', 'min');
	$('#sacas' + dados.nomeTabela).rules('remove', 'max');
	$('#sacas' + dados.nomeTabela)
		.rules('add', {
			min: valores.sacasDespejo,
			max: valores.sacasDespejo,
			messages: {
				min: "Quantidade de sacas menor que {0}",
				max: "Quantidade de sacas maior que {0}"
			}
		});
	
}
/* =========================================================
 * limpaDadosFormularioSailote.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioSailote(dados) {
	
	limpaDadosFormularioDesdobrasCafe(dados);
	
	$('#lote' + dados.nomeTabela).val('');
	
}
/* =========================================================
 * setDadosFormularioSailote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioSailote(dados) {
	
	setDadosFormularioCore(dados);
	
	var campoCobrar = caixaVerificacaoHorizontal(
		'cobrar' + dados.nomeTabela,
		'Cobrar Carga'
	);
	
	$('#botaoFormGroup').before(campoCobrar);
	
	$('#cobrar' + dados.nomeTabela).prop('checked', dados.array.cobrar);
	
	$('#sacas' + dados.nomeTabela)
		.val($('#sacasDespejo' + dados.nomeTabela).val());
		
	$('#peso' + dados.nomeTabela)
		.val($('#pesoDespejo' + dados.nomeTabela).val());
	
	$('#ticket' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * formularioSailote.js
 * http://lls.net.br/
 * ========================================================= */

function formularioSailote(dados) {
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback").css("font-weight", "Bold").css("font-size", "15px");
	
	var campoTicket = campoTextoHorizontal(
		'ticket' + dados.nomeTabela, 'text', 'Ticket',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "enabled"
	);
	
	var divLote = $("<div/>").addClass('col-xs-6 col-md-6').append(campoLote);
	var divTicket = $("<div/>").addClass('col-xs-6 col-md-6').append(campoTicket);
	
	var divCampos1 = $("<div/>")
		.addClass("form-horizontal")
		.append(divLote)
		.append(divTicket);
	
	var campoSacasDespejo = campoNumeroHorizontal(
		"sacasDespejo" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "disabled"
	).css("font-weight", "Bold").css("font-size", "15px");
	
	var campoPesoDespejo = campoNumeroHorizontal(
		"pesoDespejo" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	).removeClass("has-feedback").css("font-weight", "Bold").css("font-size", "15px");
	
	var divSacasDespejo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoSacasDespejo);
	var divPesoDespejo = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPesoDespejo);
	
	var divCampos2 = $("<div/>")
		.addClass("form-horizontal")
		.append(divSacasDespejo)
		.append(divPesoDespejo);
	
	var campoSacasReal = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Saída",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 4, false, false, "", "", "enabled"
	);
	
	var campoPesoReal = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 8, false, false, "", " kg", "enabled"
	);
	
	var divSacasReal = $("<div/>").addClass('col-xs-6 col-md-6').append(campoSacasReal);
	var divPesoReal = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPesoReal);
	
	var divCampos3 = $("<div/>")
		.addClass("form-horizontal")
		.append(divSacasReal)
		.append(divPesoReal);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal panel-group")
		.append(divCampos1)
		.append(divCampos2)
		.append(divCampos3);
	
	var formTela2 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * nomeTabsSailote.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsSailote() {
	
	return { 
		tabSailote1: "Dados da Finalização",
		tabSailote2: "Observações"
	};
	
}
/* =========================================================
 * removeLinhaTabelaTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeLinhaTabelaTracafe(id, fechado, nomeTabela) {
	
	removeLinhaTabelaCafe(id, fechado, nomeTabela);
	
}
/* =========================================================
 * setDadosDialogTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogTracafe(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados.array)');
	
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoProdutor = juntaTituloTexto('Produtor Origem', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda Origem', dados.array.fazenda);
	var textoProdutorDestino = juntaTituloTexto('Produtor Destino', dados.array.produtorDestino);
	var textoFazendaDestino = juntaTituloTexto('Fazenda Destino', dados.array.fazendaDestino);
	var textoUsuario = juntaTituloTexto('Usuário', dados.array.usuario);
	
	var textoLote = juntaTituloTexto('Lote', dados.array.lote);
	var textoSacas = juntaTituloTexto('Sacas', formataNumeroSacasCafe(dados.array.sacas));
	var textoPeso = juntaTituloTexto('Peso', dados.array.peso);
	var textoStatus = juntaTituloTexto('Status', dados.array.statusCafe);
	
	var textoDesdobras = juntaTituloTexto('Desdobras', dados.array.desdobras);
	var textoSacasResultado = juntaTituloTexto('Sacas Resultado', formataNumeroSacasCafe(dados.array.sacasResultado));
	var textoPesoResultado = juntaTituloTexto('Peso Resultado', dados.array.pesoResultado);
	
	var nomesColunas = {
		"coluna1": "Dados da Transferência",
		"coluna2": "Dados do Lote"
	};
	
	var colunaDadosTransferencia = {
		data: textoData,
		textoProdutor: textoProdutor,
		textoFazenda: textoFazenda,
		textoProdutorDestino: textoProdutorDestino,
		textoFazendaDestino: textoFazendaDestino,
		textoUsuario: textoUsuario
	};
	
	var colunaDadosLote = {
		lote: textoLote,
		sacas: textoSacas,
		peso: textoPeso,
		status: textoStatus
	};
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDadosTransferencia, 'text-left', 'texto', 'tdDadosTransferencia'))
		   .append(juntaColunas(colunaDadosLote, 'text-left', 'texto', 'tdDadosLote'));
	
	if (dados.array.indexStatus == 2) {
		
		nomesColunas["coluna3"] = "Resultado da Transferência"
		
		var textoTicket = juntaTituloTexto('Ticket', dados.array.ticket);
		var textoSacasSaida = juntaTituloTexto('Sacas Saída', formataNumeroSacasCafe(dados.array.sacasSaida));
		var textoPesoSaida = juntaTituloTexto('Peso Saída', dados.array.pesoSaida);
		
		var colunaResultadoTransferencia = {
			desdobras: textoDesdobras,
			sacasResultado: textoSacasResultado,
			pesoResultado: textoPesoResultado
		};
		
		trDados.append(juntaColunas(colunaResultadoTransferencia, 'text-left', 'texto', 'tdResultadoTransferencia'));
		
	}
	
	setDadosDialogImprimirCore(dados, nomesColunas, trDados);
	
	setBotoesExcluirDialogCafe(dados);
	
}
/* =========================================================
 * removeTotalTabelaTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaTracafe(idLinha, nomeTabela) {
	
	removeTotalTabelaCafe(idLinha, nomeTabela);
	
}
/* =========================================================
 * limpaDadosFormularioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioTracafe(nomeTabela) {
	
	limpaDadosFormularioCafe(nomeTabela);
	
	$('#nomeProcuraCadastro' + nomeTabela + 'DestinoFazendaProdutor')
		.attr('disabled', false).val('');
			
	$('#nome' + nomeTabela + 'FazendaProdutorDestinoMensagem')
		.text('').show();
		
	$('#idnome' + 'ProcuraCadastro' + nomeTabela + 'DestinoFazendaProdutor2')
		.val(0);
		
	$('#idnome' + 'ProcuraCadastro' + nomeTabela + 'DestinoFazendaProdutor')
		.val(0);
	
}
/* =========================================================
 * setEventosCamposTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposTracafe(dados, formulario) {
	
	dados.campoProcura = "FazendaProdutor";
	
	setEventosCamposCafe(dados, formulario);
	
	addEventoCampoProcuraCafe(dados, formulario, dados.campoProcura);
	
	formulario.find('#linha_tab' + dados.nomeTabela + '2').click(function(e){
		
		eval ('checkValores' + dados.nomeTabela + '(dados, formulario)');
		
	});
	
	var rule = {checkIdTracafeDestinoFazendaProdutor: true};
	
	formulario.find("#nomeProcuraCadastro" + dados.nomeTabela + "Destino" + dados.campoProcura)
		.rules('add', rule);
	
	rule = {checkIdIgualTracafeDestinoFazendaProdutor: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaCadastro)
		.rules('add', rule);
	
	rule = {checkLotesTracafe: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaCadastro)
		.rules('add', rule);
	
}
/* =========================================================
 * setDadosFormularioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioTracafe(dados) {
	
	setDadosFormularioDespejoCafe(dados);
	
	$('#nomeProcuraCadastro' + dados.nomeTabela + 'DestinoFazendaProdutor')
		.val(dados.array.produtorDestino)
		.attr('disabled', 'disabled');
			
	$('#nome' + dados.nomeTabela + 'DestinoFazendaProdutorMensagem')
		.text(dados.array.fazendaDestino)
		.show();
		
	$('#idnomeProcuraCadastro' + dados.nomeTabela + 'DestinoFazendaProdutor2')
		.val(dados.array.idProdutorDestino);
		
	$('#idnomeProcuraCadastro' + dados.nomeTabela + 'DestinoFazendaProdutor')
		.val(dados.array.idFazendaDestino);
	
}
/* =========================================================
 * validarFormularioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioTracafe(dados, formulario) {
	
	dados.campoProcura = "FazendaProdutor";
	
	validarFormularioDespejoCafe(dados, formulario);
	
	validarIdCore(dados.nomeTabela + "Destino", dados.campoProcura);
	
	jQuery.validator.addMethod('checkIdIgual' + dados.nomeTabela + "Destino" + dados.campoProcura,
		function (value, element) { 		
			
			var id = {
				origem: $('#idnomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura).val(),
				destino: $('#idnomeProcuraCadastro' + dados.nomeTabela + "Destino" + dados.campoProcura).val()
			}
			
			if (id.origem == 0 || id.destino == 0) return true;
			if (id.origem > 0 && id.origem != id.destino) return true;
			
			mostraDialog(
				'Produtor de destino igual ao produtor de origem!',
				'texto_cor_vermelho',
				'table',
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
			$('#spanGroupSearch' + dados.nomeTabela + "Destino" + dados.campoProcura).click();
			
			return false;
			
		}, ''
	);
	
}
/* =========================================================
 * nomeTabsTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsTracafe(tipo) {
	
	switch (tipo) {
		case 1: 
			return { 
				tabTracafe1: "Dados",
				tabTracafe2: "Despejo",
				tabTracafe3: "Observações"
			};
			
			break;
		case 2: 
			return { 
				tabTracafe1: "Dados",
				tabTracafe2: "Despejo",
				tabTracafe3: "Lotes"
			};

			break;
	}
	
}
/* =========================================================
 * pegaDadosFormularioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioTracafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		lote: $("#lote" + nomeTabela).val(),
		sacas: $("#sacas" + nomeTabela).val(),
		peso: formataNumeroSql($("#peso" + nomeTabela).val()),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	var idFazendaDestino = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "DestinoFazendaProdutor").val()
	}
	
	return {
		cadastro: cadastro,
		idFazendaDestino: idFazendaDestino
	};
	
}
/* =========================================================
 * formularioRelatorioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioTracafe(dados) {
	
	return formularioRelatorioCafe(dados);
	
}
/* =========================================================
 * setDadosRodapeTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeTracafe(rodape) {
	
	setDadosRodapeCafe(rodape);
	
}
/* =========================================================
 * pegaProcuraTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraTracafe(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * checkValoresTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresTracafe(dados, formulario) {
	
	var campo = {
		sacas: $('#sacas' + dados.nomeTabela).val(),
		idOrigem: $('#idnomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura).val(),
		idDestino: $('#idnomeProcuraCadastro' + dados.nomeTabela + "Destino" + dados.campoProcura).val()
	}
	
	if (campo.idOrigem == 0 || campo.idDestino == 0 || campo.sacas == 0) {
		
		$('#theadtable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').hide();
		$('#tbody' + dados.nomeTabelaCadastro[0] + ' tr td:nth-child(1)').hide();
		$('#tfoottable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').attr('colspan','4');
		
		formulario.find('#botaoNovo' + dados.nomeTabelaCadastro[0]).hide();
		
	}
	else if (campo.idOrigem == campo.idDestino) {
		
		mostraDialog(
			'Produtor de destino igual ao produtor de origem!',
			'texto_cor_vermelho',
			'table',
			tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
		);
		
		$('#spanGroupSearch' + dados.nomeTabela + "Destino" + dados.campoProcura).click();
		
		$('#theadtable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').hide();
		$('#tbody' + dados.nomeTabelaCadastro[0] + ' tr td:nth-child(1)').hide();
		$('#tfoottable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').attr('colspan','4');
		
		formulario.find('#botaoNovo' + dados.nomeTabelaCadastro[0]).hide();
		
	}
	else {
		
		$('#theadtable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').show();
		$('#tbody' + dados.nomeTabelaCadastro[0] + ' tr td:nth-child(1)').show();
		$('#tfoottable' + dados.nomeTabelaCadastro[0] + ' tr th:nth-child(1)').attr('colspan','5');
		
		formulario.find('#botaoNovo' + dados.nomeTabelaCadastro[0]).show();
	}
	
}
/* =========================================================
 * pegaNomeColunasTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasTracafe(tipo) {
	
	var nomesColunas = pegaNomeColunasCafe();
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Transferência de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosTabelaTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaTracafe(dados, trTabela, botaoVisualizar) {
	
	setDadosTabelaCafe(dados, trTabela, botaoVisualizar);
	
}
/* =========================================================
 * eventoSalvarTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarTracafe(dados) {
	
	eventoSalvarCafe(dados);
	
}
/* =========================================================
 * formataDadosTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosTracafe(tracafe) {
	
	tracafe.data = formataData(tracafe.data);
	tracafe.peso = formataNumero(tracafe.peso, 2, false, true, "", " kg");
	tracafe.pesoResultado = formataNumero(tracafe.pesoResultado, 2, false, true, "", " kg");
	tracafe.produtor = decodeURIComponent(tracafe.produtor);
	tracafe.fazenda = decodeURIComponent(tracafe.fazenda);
	tracafe.produtorDestino = decodeURIComponent(tracafe.produtorDestino);
	tracafe.fazendaDestino = decodeURIComponent(tracafe.fazendaDestino);
	tracafe.observacao = decodeURIComponent(tracafe.observacao);
	tracafe.usuario = decodeURIComponent(tracafe.usuario);
	
	tracafe["titulo"] = tracafe.lote;
	
	tracafe["alterar"] = 0;
	tracafe["lancamento"] = 0;
	tracafe["imprimir"] = 0;
	tracafe["remover"] = 0;
	
}
/* =========================================================
 * formularioTracafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioTracafe(dados) {
	
	var guia = getJson("getGuia" + dados.nomeTabela);
	
	dados.lote = guia.lote;
	
	var campoProdutorOrigem = campoSqlProcuraTexto(
		"Origem",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor de origem",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var campoProdutorDestino = campoSqlProcuraTexto(
		"Destinatário",
		dados.nomeTabela + "Destino",
		"FazendaProdutor",
		"Digite o nome do produtor de destino",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var divProdutor = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoProdutorOrigem)
		.append(campoProdutorDestino);
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		true, "-3", "0", formataData(guia.data),
		'enabled'
	).removeClass("has-feedback");
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback");
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 8, false, false, "", " kg", "disabled"
	).removeClass("has-feedback");
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-7 col-md-6')
		.append(campoSacas)
		.append(campoPeso);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-5 col-md-6')	
		.append(campoData)
		.append(campoLote);
	
	var divDados = $("<div/>")
		.addClass("form-horizontal")
		.append(divColuna1)
		.append(divColuna2);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divProdutor)
		.append(divDados);
	
	var formTela2 = telaTabelaCore(dados, 1);
	var formTela3 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2, formTela3]);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * validarFormularioTralote.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioTralote(dados, formulario) {
	
	validarFormularioCoreFormacao(dados, formulario);
	
}
/* =========================================================
 * setDadosFormularioTralote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioTralote(dados) {
	
	setDadosFormularioCore(dados);
	
	$('#desdobras' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * pegaNomeColunasTralote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasTralote(tipo) {
	
	return "Transferência de Café";
	
}
/* =========================================================
 * checkValoresTralote.js
 * http://lls.net.br/
 * ========================================================= */

function checkValoresTralote(dados, formulario) {
	
	var cadastro = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	var campo = cadastro.cadastro;
	
	if (campo.desdobras == 0 || campo.sacas == 0 || campo.peso == 0) {
		formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).hide();
	}
	else formulario.find('#botaoNovo' + dados.nomeTabelaLancamento[0]).show();
	
}
/* =========================================================
 * eventoSalvarTralote.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarTralote(dados) {
	
	eventoSalvarDesdobrasCafe(dados);
	
}
/* =========================================================
 * formataDadosTralote.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosTralote(dados) {
	
	if (dados.desdobras == 0) dados.desdobras++;
	
	eval ('formataDados' + dados.nomeTabelaLancamento[0] + '(dados.array)');
	
}
/* =========================================================
 * setDadosTabelaTralote.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaTralote(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	setDadosTabelaCafe(dados);
	
}
/* =========================================================
 * pegaDadosFormularioTralote.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioTralote(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		desdobras: $('#desdobras' + nomeTabela).val(),
		sacas: $('#sacas' + nomeTabela).val(),
		peso: formataNumeroSql($('#peso' + nomeTabela).val())		
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * nomeTabsTralote.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsTralote() {
	
	return { 
		tabTralote1: "Dados",
		tabTralote2: "Lotes"
	};
	
}
/* =========================================================
 * setEventosCamposTralote.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposTralote(dados, formulario) {
	
	setEventoDesdobrasCafeFormacao(dados, formulario);
	
	var rule = {checkLotesTralote: true};
	
	formulario.find('#nomeTabela' + dados.nomeTabelaLancamento[0])
		.rules('add', rule);
		
}
/* =========================================================
 * limpaDadosFormularioTralote.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioTralote(dados) {
	
	limpaDadosFormularioDesdobrasCafe(dados);
	
	$('#lote' + dados.nomeTabela).val('');
	
}
/* =========================================================
 * formularioTralote.js
 * http://lls.net.br/
 * ========================================================= */

function formularioTralote(dados) {
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "disabled"
	).removeClass("has-feedback");
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	).removeClass("has-feedback");
	
	var divSacas = $("<div/>").addClass('col-xs-6 col-md-6').append(campoSacas);
	var divPeso = $("<div/>").addClass('col-xs-6 col-md-6').append(campoPeso);
	
	var divCampos1 = $("<div/>")
		.addClass("form-horizontal")
		.append(divSacas)
		.append(divPeso);
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback").css("font-weight", "Bold").css("font-size", "15px");
	
	var campoDesdobras = campoNumeroHorizontal(
		"desdobras" + dados.nomeTabela, "Desdobras",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 2, false, false, "", "", "enabled"
	).css("font-weight", "Bold").css("font-size", "15px");
	
	var divLote = $("<div/>").addClass('col-xs-6 col-md-6').append(campoLote);
	var divDesdobras = $("<div/>").addClass('col-xs-6 col-md-6').append(campoDesdobras);
	
	var divCampos2 = $("<div/>")
		.addClass("form-horizontal")
		.append(divLote)
		.append(divDesdobras);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")
		.append(divCampos1)
		.append(divCampos2);
	
	dados.nomeTabelaLancamento.splice(0, 1);
	
	var arrayTela = [];
	
	arrayTela[0] = formTela1;
	
	for(var i = 0; i < dados.nomeTabelaLancamento.length; i++) {
		
		arrayTela[i+1] = telaTabelaCore(dados, 2, i);
		
	}
	
	var formulario = formularioLancamentoCore(dados, arrayTela);
	
	setFormularioCafe(dados, formulario);
	
	return formulario;
	
}
/* =========================================================
 * setDadosFormularioBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioBaixacafe(dados) {

	setDadosFormularioCore(dados);
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	eval ("setEventosCampos" + dados.nomeTabela + "(dados, formulario)");
	
	$('#valor' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * removeTotalTabelaBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaBaixacafe(dados) {
	
	dados.nomeTabelaCadastro = dados.nomeTabelaLancamento;
	
	setTipoRelatorioCafe(dados);
	
	eventoListaCadastroCore(menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem));
	
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).empty();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).remove();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).dialog( "close" );
	
}
/* =========================================================
 * pegaNomeColunasBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasBaixacafe(tipo) {
	
	var nomesColunas = { 
		visualizar: "Excluir",
		data: "Data",
		obs: "Observações",
		valor: "Valor"
	};
	
	if (tipo >= 3) nomesColunas = "Baixa de Café";
	
	return nomesColunas;
	
}
/* =========================================================
 * setEventosCamposBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposBaixacafe(dados, formulario) {
	
	var valores = {
		total: formataNumeroSql(formulario.find('#total' + dados.nomeTabela).val()),
		pago: formataNumeroSql(formulario.find('#pago' + dados.nomeTabela).val())
	}
	
	var valorRestante = valores.total - valores.pago;
	
	var input = formulario.find('#valor' + dados.nomeTabela);
	
	input.css("font-weight", "Bold").css("font-size", "15px");
	
	input.bind("propertychange change click keyup input paste", function(event) {
		
		input.valid();
		
	});

	var texto = {
		min: formataNumero(0.01, 2, false, true, "R$ ", ""),
		max: formataNumero(valorRestante, 2, false, true, "R$ ", "")
	};
	
	input.rules('add', {
		required: true,
		number: true,
		min: 0.01,
		max: formataNumeroSql(texto.max),
		messages: { 
			required: "É necessário informar o valor!",
			min: "Valor menor que " + texto.min,
			max: "Valor maior que " + texto.max
		}
	});
	
}
/* =========================================================
 * validarFormularioBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioBaixacafe(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
}
/* =========================================================
 * setDadosRodapeBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeBaixacafe(dados) {

	var paragrafo1 = paragrafo('text-center texto', 'texto');
	var paragrafo2 = paragrafo('text-right texto', 'texto');
	
	paragrafo1.append("Total de Pagamentos: " + dados.totalQtd);
	paragrafo2.append(formataNumero(dados.totalPago, 2, false, false, "R$ ", ""));
		
	var th1 = th().append(paragrafo1).attr('colspan', 3);
	var th2 = th().append(paragrafo2).attr('id', 'totalPago');
	
	var trRodape = tr('nomeRodape' + dados.nomeTabela, '')
		.append(th1).append(th2);
	
	$("#tfoottable" + dados.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * formataDadosBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosBaixacafe(dados) {
	
	if (dados.array != null) {
		
		dados.array.produtor = decodeURIComponent(dados.array.produtor);
		dados.array.fazenda = decodeURIComponent(dados.array.fazenda);
		dados.array.servico = decodeURIComponent(dados.array.servico);
		
		dados.array.data = formataData(dados.array.data);
		dados.array.total = formataNumero(dados.array.total, 2, true, true, "R$ ", "");
		dados.array.pago = formataNumero(dados.array.pago, 2, true, true, "R$ ", "");
		dados.array.valor = formataNumero(dados.array.valor, 2, true, true, "R$ ", "");
		
	}
	else {
		
		dados.observacao = decodeURIComponent(dados.observacao);
		
		dados.data = formataData(dados.data);
		dados.valor = formataNumero(dados.valor, 2, true, true, "R$ ", "");
		
		dados["titulo"] = "Baixa de Serviço: " + dados.valor;
				
	}
	
}
/* =========================================================
 * limpaDadosFormularioBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioBaixacafe(nomeTabela) {
	
	var formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	formulario.find('#id' + nomeTabela).val('');
	formulario.find('#data' + nomeTabela).val('');
	formulario.find('#produtor' + nomeTabela).val('');
	formulario.find('#fazenda' + nomeTabela).val('');
	formulario.find('#servico' + nomeTabela).val('');
	formulario.find('#sacas' + nomeTabela).val('');
	formulario.find('#total' + nomeTabela).val('');
	formulario.find('#pago' + nomeTabela).val('');
	formulario.find('#valor' + nomeTabela).val('');
	formulario.find('#observacao' + nomeTabela).val('');
	
}
/* =========================================================
 * setLinhaTabelaBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaBaixacafe(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados)');
	
	var tbody = $('#tbody' + dados.nomeTabela);
	
	var tr = setIdTabelaCadastro(dados, tbody);
	
	var arrayBotoes = {remove: ""};
	
	tr.append(tabelaBotoes(dados.id, "", arrayBotoes))
	  .append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
	  .append(tabelaCelula(dados.obs, "text-left", "texto", "tdObs"))
	  .append(tabelaCelula(dados.valor, "text-right", "texto", "tdValor"));
	
	setBotoesTabelaCafeFormacao(dados, tr);
	
	tbody.append(tr);
	
}
/* =========================================================
 * nomeTabsBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsBaixacafe() {
	
	return { 
		tabBaixacafe1: "Dados",
		tabBaixacafe2: "Observações"
	};
	
}
/* =========================================================
 * formularioBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioBaixacafe(dados) {
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela,
		"Data",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", dados.data,
		'disabled'
	).removeClass("has-feedback");
	
	var campoProdutor = campoTextoHorizontal(
		"produtor" + dados.nomeTabela, 'text', 'Produtor',
		'col-xs-9 col-md-6' , 'col-xs-3',
		'', false, 50, "disabled"
	);
		
	var campoFazenda = campoTextoHorizontal(
		"fazenda" + dados.nomeTabela, 'text', 'Fazenda',
		'col-xs-9 col-md-6' , 'col-xs-3',
		'', false, 50, "disabled"
	);
	
	var campoServico = campoTextoHorizontal(
		"servico" + dados.nomeTabela, 'text', 'Serviço',
		'col-xs-9 col-md-6' , 'col-xs-3',
		'', false, 50, "disabled"
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-9 col-md-6', 'col-xs-3',
		0, 3, false, false, "", "", "disabled"
	);
	
	var campoTotal = campoNumeroHorizontal(
		"total" + dados.nomeTabela, "Total",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 9, false, false, "R$ ", "", 'disabled'
	);
	
	var campoPago = campoNumeroHorizontal(
		"pago" + dados.nomeTabela, "Pago",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 9, false, true, "R$ ", "", 'disabled'
	);
	
	var campoValor = campoNumeroHorizontal(
		"valor" + dados.nomeTabela, "Valor",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 9, false, false, "R$ ", "", 'enabled'
	);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")
		.append(campoData)
		.append(campoProdutor)
		.append(campoFazenda)
		.append(campoServico)
		.append(campoSacas)
		.append(campoTotal)
		.append(campoPago)
		.append(campoValor);
	
	var formTela2 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2]);
	
	return formulario;
	
}
/* =========================================================
 * pegaDadosFormularioBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioBaixacafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		valor: formataNumeroSql($("#valor" + nomeTabela).val()),
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return {
		cadastro: cadastro
	};
	
}
/* =========================================================
 * eventoSalvarBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarBaixacafe(dados) {
	
	var nomeTabela = dados.nomeTabela;
	
	var baixa = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(baixa),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
				
				$("#data" + dados.nomeTabela).val(resposta.data);
				
				baixa.cadastro.data = $("#data" + dados.nomeTabela).datepicker("getDate");
				
				dados = menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados.id = resposta.id;
				
				dados["indexStatus"] = resposta.indexStatus;
				dados["data"] = baixa.cadastro.data;
				
				setDadosFormularioRelatorioCore(dados);
				
			}
			
			mostraDialog(
				mensagem,
				cor_texto,
				"table",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
				
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * removeBaixacafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeBaixacafe(dados) {
	
	removeCadastroTabelaCore(dados);
	
}
/* =========================================================
 * formularioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioFaturacafe(dados) {
	
	dados["nomeTabelaExecuta"] = dados.nomeTabela + "Executa";
	
	var nomeTabelaProcura = "FazendaProdutor";
	
	var nomeTabelas = dados.nomeTabelaExecuta + nomeTabelaProcura;
	
	var formularioRelatorio = formularioRelatorioNomeData(
		dados.nomeTabelaExecuta,
		nomeTabelaProcura,
		"Produtor",
		"",
		""
	);
	
	var formulario = formularioCadastro(dados.id, dados.nomeTabela, 3, 4, formularioRelatorio);
	
	formulario.find("#botaoFormGroup").find('div').addClass('col-md-2 col-md-offset-5');
	
	formulario.submit(function(event) {
		
		event.preventDefault();
		
		eventoSalvarFaturacafe(dados);
		
	});
	
	formularioRelatorio.find('#spanGroupClear' + nomeTabelas).hide();
	formularioRelatorio.find('#spanGroupPrint' + nomeTabelas).hide();
	
	return formulario;
	
}
/* =========================================================
 * setDadosDialogFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogFaturacafe(dados) {}
/* =========================================================
 * formularioRelatorioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioFaturacafe(dados) {
	
	return formularioRelatorioNomeDataCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		""
	);
	
}
/* =========================================================
 * pegaProcuraFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraFaturacafe(dados) {
	
	return pegaProcuraRelatorioNomeData(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * eventoSalvarFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarFaturacafe(dados) {
	
	var faturacafe = eval ("pegaDadosFormulario" + dados.nomeTabela + "(dados.nomeTabelaExecuta)");
	
	$.ajax({
		type: "POST",
		url: "executa" + dados.nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(faturacafe),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( resposta.mensagem );
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				eval ("limpaDadosFormulario" + dados.nomeTabela + "()");
				
				dados = menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados["data"] = faturacafe.dataFinal;
				
				setDadosFormularioRelatorioCore(dados);
				
			}
			else {
				
				$cor_texto = "texto_cor_vermelho";
				
			}
			
			mostraDialog(
				$mensagem,
				$cor_texto,
				"form",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
				
			);
		
		}
		
	})
	
}
/* =========================================================
 * formataDadosFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosFaturacafe(dados) {
	
	dados.data = formataData(dados.data);
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.anterior = formataNumeroSacasCafe(dados.anterior);
	dados.entradas = formataNumeroSacasCafe(dados.entradas);
	dados.saidas = formataNumeroSacasCafe(dados.saidas);
	dados.quebras = formataNumeroSacasCafe(dados.quebras);
	dados.acrescimos = formataNumeroSacasCafe(dados.acrescimos);
	dados.recebidas = formataNumeroSacasCafe(dados.recebidas);
	dados.emitidas = formataNumeroSacasCafe(dados.emitidas);
	dados.saldo = formataNumeroSacasCafe(dados.saldo);
	dados.armazenagem = formataNumero(dados.armazenagem, 2, false, true, "R$ ", "");
	dados.servicos = formataNumero(dados.servicos, 2, false, true, "R$ ", "");
	dados.total = formataNumero(dados.total, 2, false, true, "R$ ", "");

}
/* =========================================================
 * setDadosFormularioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioFaturacafe(dados) {}
/* =========================================================
 * setDadosRodapeFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeFaturacafe(rodape) {
	
	eval ("formataDados" + rodape.nomeTabela + "(rodape[0])");
	
	var paragrafo1 = paragrafo('text-center texto', 'texto').append("Total de Faturamentos: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right texto', 'texto').append(rodape[0].anterior);
	var paragrafo3 = paragrafo('text-right texto', 'texto').append(rodape[0].entradas);
	var paragrafo4 = paragrafo('text-right texto', 'texto').append(rodape[0].saidas);
	var paragrafo5 = paragrafo('text-right texto', 'texto').append(rodape[0].quebras);
	var paragrafo6 = paragrafo('text-right texto', 'texto').append(rodape[0].acrescimos);
	var paragrafo7 = paragrafo('text-right texto', 'texto').append(rodape[0].recebidas);
	var paragrafo8 = paragrafo('text-right texto', 'texto').append(rodape[0].emitidas);
	var paragrafo9 = paragrafo('text-right texto', 'texto').append(rodape[0].saldo);
	var paragrafo10 = paragrafo('text-right texto', 'texto').append(rodape[0].armazenagem);
	var paragrafo11 = paragrafo('text-right texto', 'texto').append(rodape[0].servicos);
	var paragrafo12 = paragrafo('text-right texto', 'texto').append(rodape[0].total);
	
	var th1 = th().append(paragrafo1);
	var th2 = th().append(paragrafo2);
	var th3 = th().append(paragrafo3);
	var th4 = th().append(paragrafo4);
	var th5 = th().append(paragrafo5);
	var th6 = th().append(paragrafo6);
	var th7 = th().append(paragrafo7);
	var th8 = th().append(paragrafo8);
	var th9 = th().append(paragrafo9);
	var th10 = th().append(paragrafo10);
	var th11 = th().append(paragrafo11);
	var th12 = th().append(paragrafo12);
	
	var trRodapeResumo = tr('totalRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3).append(th4)
		.append(th5).append(th6).append(th7).append(th8)
		.append(th9).append(th10).append(th11).append(th12);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) th1.attr('colspan', 3);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th1.attr('colspan', 2);
			
		}
		
	}
	
}
/* =========================================================
 * pegaNomeColunasFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasFaturacafe(tipo) {
	
	var nomesColunas = { 
		produtor: "Produtor",
		fazenda: "Fazenda",
		data: "Data",
		anterior: "Anterior",
		entradas: "Entradas",
		saidas: "Saídas",
		quebras: "Quebras",
		acrescimos: "Acréscimos",
		recebidas: "Recebidas",
		emitidas: "Emitidas",
		saldo: "Saldo",
		armazenagem: "Armazenagem",
		servicos: "Serviços",
		total: "Total"
	};
	
	switch (tipo) {
		case 1: 
			delete nomesColunas["visualizar"];
			break;
		case 3: 
			nomesColunas = "Faturamento de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaDadosFormularioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioFaturacafe(nomeTabela) {
	
	var dados = {
		nome: '',
		pagina: 0,
		linhas: 0,
		idProdutor: 0,
		idFazenda: $("#idnomeProcura" + nomeTabela + "FazendaProdutor").val(),
		dataInicial: $("#dataInicial" + nomeTabela).datepicker("getDate"),
		dataFinal: $("#dataFinal" + nomeTabela).datepicker("getDate")
	}
	
	return dados;
	
	
}
/* =========================================================
 * removeTotalTabelaFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaFaturacafe(idLinha, nomeTabela) {}
/* =========================================================
 * validarFormularioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioFaturacafe(tipoOperacao, nomeTabela, formulario) {}
/* =========================================================
 * limpaDadosFormularioFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioFaturacafe() {
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
}
/* =========================================================
 * setDadosTabelaFaturacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaFaturacafe(dados, trTabela, botaoVisualizar) {
	
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
			.append(tabelaCelula(dados.anterior, "text-right", "texto", "tdAnterior"))
			.append(tabelaCelula(dados.entradas, "text-right", "texto", "tdEntradas"))
			.append(tabelaCelula(dados.saidas, "text-right", "texto", "tdSaidas"))
			.append(tabelaCelula(dados.quebras, "text-right", "texto", "tdQuebras"))
			.append(tabelaCelula(dados.acrescimos, "text-right", "texto", "tdAcrescimos"))
			.append(tabelaCelula(dados.recebidas, "text-right", "texto", "tdRecebidas"))
			.append(tabelaCelula(dados.emitidas, "text-right", "texto", "tdEmitidas"))
			.append(tabelaCelula(dados.saldo, "text-right", "texto", "tdSaldo"))
			.append(tabelaCelula(dados.armazenagem, "text-right", "texto", "tdArmazenagem"))
			.append(tabelaCelula(dados.servicos, "text-right", "texto", "tdServicos"))
			.append(tabelaCelula(dados.total, "text-right", "texto", "tdTotal"))
	
}
/* =========================================================
 * mudaLinhaTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function mudaLinhaTabelaServcafe(dados) {
	
	var tbody = $('#tbody' + dados.nomeTabela);
	
	var tr = tbody.find('#' + dados.nomeTabela.toLowerCase() + '_' + dados.id);
								
	eval ('formataDados' + dados.nomeTabela + '(dados)');
	
	var arrayColunaBotoes = { altera: "", remove: "" };
	
	tr.find("#tdBotoes").replaceWith(tabelaBotoes(dados.id, dados.nome, arrayColunaBotoes));
	tr.find("#tdData").replaceWith(tabelaCelula(dados.data, "text-center", "texto", "tdData"));
	tr.find("#tdServico").replaceWith(tabelaCelula(dados.servico, "text-center", "texto", "tdServico"));
	tr.find("#tdSacas").replaceWith(tabelaCelula(formataNumeroSacasCafe(dados.sacas), "text-center", "texto", "tdSacas"));
	
	dados.tipoOperacao = 0;
	
	setBotoesTabelaCafeFormacao(dados, tr);
	
}
/* =========================================================
 * setTotalTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setTotalTabelaServcafe(dados, valorAnterior) {
	
	var tfootTotal = $("#tfoottable" + dados.nomeTabela)
		.find("#nomeRodape" + dados.nomeTabela).find('#total').find('p');
	
	var total = formataNumeroSql(tfootTotal.text());
	
	total = total - valorAnterior + formataNumeroSql(dados.valor);
	
	total = formataNumero(total, 2, false, false, "R$ ", "");
	
	tfootTotal.empty().text(total);
	
	if (valorAnterior == 0 || dados.valor == 0) {
		
		var tfootQtd = $("#tfoottable" + dados.nomeTabela)
			.find("#nomeRodape" + dados.nomeTabela).find('#qtd').find('p');
		
		var qtd = tfootQtd.text().split(':');
		
		if (valorAnterior == 0) qtd[1] = Number(qtd[1]) + 1;
		else qtd[1] = Number(qtd[1]) - 1;
		
		tfootQtd.empty().text(qtd[0] + ": " + qtd[1]);
		
	}
	
}
/* =========================================================
 * addTotalTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function addTotalTabelaServcafe(dados) {
	
	var rowCount = $('#tbody' + dados.nomeTabela).find('tr').length;
	
	if (rowCount == 1) {
		
		dados["qtd"] = 1;
		dados["total"] = formataNumeroSql(dados.valor);
		
		eval ('setDadosRodape' + dados.nomeTabela + '(dados)');
		
	}
	else eval ('setTotalTabela' + dados.nomeTabela + '(dados, 0)');
	
}
/* =========================================================
 * limpaDadosFormularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioServcafe(dados) {
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	formulario.find('#id' + dados.nomeTabela).val('');
	formulario.find('#sacas' + dados.nomeTabela).val('');
	formulario.find('#valor' + dados.nomeTabela).val('');
	formulario.find('#observacao' + dados.nomeTabela).val('');
	
	limpaCampoSqlProcura("Preco", "nome");
	
}
/* =========================================================
 * removeTotalTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaServcafe(dados) {
	
	var idLinha = '#' + dados.nomeTabela.toLowerCase() + '_' + dados.id;
	
	var tdValor = $('#tbody' + dados.nomeTabela).find(idLinha).find('#tdValor').find('p');
	
	var valorRemovido = formataNumeroSql(tdValor.text());
	
	dados.valor = 0.00;
	
	var rowCount = $('#tbody' + dados.nomeTabela).find('tr').length;
	
	if (rowCount == 1) $("#tfoottable" + dados.nomeTabela).find("#nomeRodape" + dados.nomeTabela).remove();
	else eval ('setTotalTabela' + dados.nomeTabela + '(dados, valorRemovido)');
	
	$(idLinha).remove();
	
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).empty();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).remove();
	$('#divDialogVisualiza' + dados.nomeTabelaLancamento).dialog( "close" );
	
}
/* =========================================================
 * setDadosRodapeServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeServcafe(dados) {
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Cobranças: " + dados.qtd);
	var paragrafo2 = paragrafo('text-right', 'texto').append(formataNumero(dados.total, 2, true, true, "R$ ", ""));
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd').attr('colspan', 4);
	var th2 = th().append(paragrafo2).attr('id', 'total');
	
	var trRodape = tr('nomeRodape' + dados.nomeTabela, '')
		.append(th1).append(th2);
	
	$("#tfoottable" + dados.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * pegaDadosFormularioServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioServcafe(dados) {
	
	var cadastro = {
		id: $("#id" + dados.nomeTabela).val(),
		data: $("#data" + dados.nomeTabela).datepicker("getDate"),
		sacas: $("#sacas" + dados.nomeTabela).val(),
		valor: formataNumeroSql($("#valor" + dados.nomeTabela).val()),
		obs: encodeURIComponent( unescape($("#observacao" + dados.nomeTabela).val()))
	}
	
	var idOscafe = {
		id: $("#id" + dados.nomeTabelaCadastro).val()
	}
	
	var idPreco = {
		id: $("#idnomeProcuraCadastro" + dados.nomeTabela + "Preco").val()
	}
	
	return {
		cadastro: cadastro,
		idOscafe: idOscafe,
		idPreco: idPreco
	};
	
}
/* =========================================================
 * pegaNomeColunasServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasServcafe(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ações",
		data: "Data",
		servico: "Serviço",
		sacas: "Sacas",
		valor: "Valor"
	};
	
	switch (tipo) {
		case 1: 
			nomesColunas.visualizar = "Excluir";
			break;
		case 3: 
			nomesColunas = "Cobrança de Café";
			break;
		case 4: 
			nomesColunas = "Cobrança de Serviço de Café";
			break;
		case 5: 
			delete nomesColunas["visualizar"];
			nomesColunas["id"] = "";
			nomesColunas["valorAltera"] = "";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * removeServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeServcafe(dados) {
	
	removeCadastroTabelaCore(dados);
	
}
/* =========================================================
 * setDadosFormularioServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioServcafe(dados, formulario) {
	
	var servico = eval ('pegaTabela'+ dados.nomeTabela + '(dados)');
	
	servico["tipoOperacao"] = dados.tipoOperacao;
	servico["nomeTabela"] = dados.nomeTabela;
	servico["nomeTabelaCadastro"] =  dados.nomeTabelaCadastro;
	
	eval ("formataDados" + dados.nomeTabela + "(servico)");
	
	servico["array"] = {};
	servico.array["titulo"] = dados.titulo;
	
	jQuery.each( servico, function( i, value ) {
		
		if (i == 'servico') {
			
			formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'Preco')
				.val(value)
				.attr('disabled', 'disabled');
				
		}
		else if (i == 'valorServico') {
			
			formulario.find('#nome' + dados.nomeTabela + 'PrecoMensagem')
				.text(formataNumero(value, 2, true, true, "R$ ", ""))
				.show();
			
		}
		else if (i == 'idServico') {
			
			formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco')
				.val(value);
			
		}
		else if (i == 'sacas') {
			
			var sacas = $('#sacas' + dados.nomeTabelaCadastro).val();
	
			formulario.find('#sacas' + dados.nomeTabela).val(sacas);
			
		}
		else formulario.find('#' + i + dados.nomeTabela).val(value);
		
	});
	
	calculaValorServicoCafe(servico);
	
	formulario.find('#valor' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * formularioServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioServcafe(dados) {
	
	var dataAtual = getJson("getData");
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", formataData(dataAtual.data),
		'disabled'
	).removeClass("has-feedback");
	
	var campoServico = campoSqlProcuraTexto(
		"Serviço",
		dados.nomeTabela,
		"Preco",
		"Digite o nome do serviço",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-9 col-md-6', 'col-xs-3',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoValor = campoNumeroHorizontal(
		"valor" + dados.nomeTabela, "Valor",
		'col-xs-9 col-md-6', 'col-xs-3',
		2, 9, false, false, "R$ ", "", "enabled"
	);
	
	var campoObs = campoTextoHorizontal(
		'observacao' + dados.nomeTabela, 'text', 'Observação',
		'col-xs-9 col-md-6', 'col-xs-3',
		'', false, 50, "enabled"
	).removeClass("has-feedback");
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(campoData)
		.append(campoServico)
		.append(campoSacas)
		.append(campoValor)
		.append(campoObs);
	
	var formulario = formularioCadastroCore(dados, formTela1);
	
	eval ("setEventosCampos" + dados.nomeTabela + "(dados, formulario)");
	
	return formulario;
	
}
/* =========================================================
 * setLinhaTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaServcafe(dados) {
	
	eval ('formataDados' + dados.nomeTabela + '(dados)');
	
	var tbody = $('#tbody' + dados.nomeTabela);
	
	var tr = setIdTabelaCadastro(dados, tbody);
	
	var arrayBotoes = {altera: "", remove: ""};
	
	if (dados.tipoOperacao == 1) arrayBotoes = {remove: ""};
	
	tr.append(tabelaBotoes(dados.id, "", arrayBotoes))
	  .append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
	  .append(tabelaCelula(dados.servico, "text-center", "texto", "tdServico"))
	  .append(tabelaCelula(formataNumeroSacasCafe(dados.sacas), "text-center", "texto", "tdSacas"))
	  .append(tabelaCelula(dados.valor, "text-right", "texto", "tdValor"));
	
	dados.tipoOperacao = 0;
	
	setBotoesTabelaCafeFormacao(dados, tr);
	
	dados.tipoOperacao = 1;
	
	tbody.append(tr);
	
}
/* =========================================================
 * pegaTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaServcafe(dados) {

	return getJsonById(
		"acha" + dados.nomeTabela + dados.nomeTabelaCadastro,
		dados.id
	);
	
}
/* =========================================================
 * setEventosCamposServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposServcafe(dados, formulario) {
	
	var sacas = $('#sacas' + dados.nomeTabelaCadastro).val();
	
	var input = formulario.find('#sacas' + dados.nomeTabela);
	
	input.val(sacas).css("font-weight", "Bold").css("font-size", "15px");
	
	input.bind("propertychange change click keyup input paste", function(event) {
		
		input.valid();
		
		calculaValorServicoCafe(dados);
		
	});
	
	addEventoCampoProcuraCafe(dados, formulario, "Preco");
	
	formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco2').val(1);
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'PrecoDivInput span').on('change', function() {
		
		calculaValorServicoCafe(dados);
		
	});
	
	input = formulario.find('#valor' + dados.nomeTabela);

	input.css("font-weight", "Bold").css("font-size", "15px");

	input.bind("propertychange change click keyup input paste", function(event) {
		
		input.valid();
		
	});

	input.rules('add', {
		required: true,
		number: true,
		min: 1,
		messages: { 
			required: "É necessário informar o valor!",
			min: "Valor menor que R$ 1,00"
		}
	});

}
/* =========================================================
 * validarFormularioServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioServcafe(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'Preco');
	
}
/* =========================================================
 * alteraTotalTabelaServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function alteraTotalTabelaServcafe(dados) {
	
	var tdValor = $('#tbody' + dados.nomeTabela)
		.find("#" + dados.nomeTabela + "_" + dados.id)
		.find('#tdValor').find('p');
	
	var valorAnterior = formataNumeroSql(tdValor.text());
	
	tdValor.empty().text(dados.valor);
	
	eval ('setTotalTabela' + dados.nomeTabela + '(dados, valorAnterior)')
	
}
/* =========================================================
 * formataDadosServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosServcafe(dados) {
	
	dados.data = formataData(dados.data);
	dados.servico = decodeURIComponent(dados.servico);
	dados.observacao = decodeURIComponent(dados.observacao);
	dados.valor = formataNumero(dados.valor, 2, true, true, "R$ ", "");
	
	dados["titulo"] = dados.servico;
	
	dados["alterar"] = 0;
	dados["remover"] = 0;
	
}
/* =========================================================
 * eventoSalvarServcafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarServcafe(dados) {
	
	var servico = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados)');
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela + dados.nomeTabelaCadastro,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(servico),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				servico.cadastro.nomeTabela = dados.nomeTabela;
				servico.cadastro.nomeTabelaCadastro = dados.nomeTabelaCadastro;
				
				servico.cadastro.id = resposta.id;
				servico.cadastro.data = $.datepicker.formatDate('yy-mm-dd', servico.cadastro.data);
				servico.cadastro.servico = $("#nomeProcuraCadastro" + dados.nomeTabela + "Preco").val();
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados)');
				
				if (dados.tipoOperacao == 0) {
					
					eval ('setLinhaTabela' + dados.nomeTabela + '(servico.cadastro)');
					eval ('addTotalTabela' + dados.nomeTabela + '(servico.cadastro)');
					
				}
				else {
					
					eval ('mudaLinhaTabela' + dados.nomeTabela + '(servico.cadastro)');
					eval ('alteraTotalTabela' + dados.nomeTabela + '(servico.cadastro)');
					
				}
				
				$("#divDialogAltera" + dados.nomeTabela).dialog( "close" );
				
			}
			
			mostraDialog(
				mensagem,
				cor_texto,
				"table",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * pegaProcuraServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraServicocafe(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * formataDadosServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosServicocafe(dados) {
	
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.servico = decodeURIComponent(dados.servico);
	dados.observacao = decodeURIComponent(dados.observacao);
	
	dados["valorPago"] = dados.pago;
	dados["valorRestante"] = dados.valor;
	
	dados.data = formataData(dados.data);
	dados.total = formataNumero(dados.total, 2, true, true, "R$ ", "");
	dados.pago = formataNumero(dados.pago, 2, true, true, "R$ ", "");
	dados.valor = formataNumero(dados.valor, 2, true, true, "R$ ", "");
	
	var fechado = "Não";
	var automatico = "Não";
	
	dados["indexStatus"] = 0;
	
	if (dados.fechado) {
		fechado = "Sim";
		dados.indexStatus = 1;
	}
	
	if (dados.automatico) automatico = "Sim";
	
	dados.automatico = automatico;
	dados.fechado = fechado;

	dados["titulo"] = dados.servico;
	
	dados["alterar"] = 0;
	dados["lancamento"] = 0;
	dados["remover"] = 0;
	
}
/* =========================================================
 * formularioRelatorioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioServicocafe(dados) {
	
	return formularioRelatorioNomeDataTipoCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		1
	);
	
}
/* =========================================================
 * setDadosDialogServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogServicocafe(dados) {
	
	eval ("formataDados" + dados.nomeTabela + "(dados.array)");
	
	dados.array.sacas = formataNumeroSacasCafe(dados.array.sacas);
	
	var textoProdutor = juntaTituloTexto('Produtor', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda', dados.array.fazenda);
	var textoServico = juntaTituloTexto('Serviço', dados.array.servico);
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoAutomatico = juntaTituloTexto('Automático', dados.array.automatico);
	var textoFechado = juntaTituloTexto('Pago', dados.array.fechado);
	
	var textoLote = juntaTituloTexto('Lote', dados.array.lote);
	var textoSacas = juntaTituloTexto('Sacas', dados.array.sacas);
	var textoTotal = juntaTituloTexto('Total', dados.array.total);
	var textoPago = juntaTituloTexto('Pago', dados.array.pago);
	var textoValor = juntaTituloTexto('Valor', dados.array.valor);
	
	var nomesColunas = {
		"coluna1": "Dados do Serviço",
		"coluna2": "Valores"
	};
	
	var colunaDadosServico = {
		"coluna1": textoProdutor,
		"coluna2": textoFazenda,
		"coluna3": textoServico,
		"coluna4": textoData,
		"coluna5": textoAutomatico,
		"coluna6": textoFechado
	};
	
	var colunaValoresServico = {
		"coluna1": textoLote,
		"coluna2": textoSacas,
		"coluna3": textoTotal,
		"coluna4": textoPago,
		"coluna5": textoValor
	};
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDadosServico, 'text-left', 'texto', 'tdDadosServico'))
		   .append(juntaColunas(colunaValoresServico, 'text-left', 'texto', 'tdValoresServico'));
	
	setDadosDialogLancamentoCore(dados, nomesColunas, trDados);
	
}
/* =========================================================
 * nomeTabsServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsServicocafe(tipo) {
	
	switch (tipo) {
		case 1: 
			return { 
				tabServicocafe1: "Dados",
				tabServicocafe2: "Observações"
			};
			
			break;
		case 2: 
			
			return { 
				tabServicocafe1: "Dados",
				tabServicocafe2: "Pagamentos"
			};

			break;
	}
	
}
/* =========================================================
 * removeTotalTabelaServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaServicocafe(idLinha, nomeTabela) {
	
	var paragrafos = {
		qtd: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#qtd").find('p'),
		total: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#total").find('p'),
		pago: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#pago").find('p'),
		valor: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#valor").find('p')
	}
	
	var valores = {
		valorTotal: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdTotal").find('p').text(),
		valorPago: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdPago").find('p').text(),
		valorRestante: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdValor").find('p').text(),
		qtd: paragrafos.qtd.text(),
		total: paragrafos.total.text(),
		pago: paragrafos.pago.text(),
		valor: paragrafos.valor.text()
	}
	
	var textoQtd = valores.qtd.split(':'); 
	
	valores.qtd = Number(textoQtd[1]) - 1;
	
	valores.valorTotal = formataNumeroSql(valores.valorTotal);
	valores.valorPago = formataNumeroSql(valores.valorPago);
	valores.valorRestante = formataNumeroSql(valores.valorRestante);
	
	valores.total = formataNumeroSql(valores.total);
	valores.pago = formataNumeroSql(valores.pago);
	valores.valor = formataNumeroSql(valores.valor);
	
	valores.total = valores.total - valores.valorTotal;
	valores.pago = valores.pago - valores.valorPago;
	valores.valor = valores.valor - valores.valorRestante;
	
	if (valores.total > 0) {
	
		paragrafos.qtd.empty();
		paragrafos.total.empty();
		paragrafos.pago.empty();
		paragrafos.valor.empty();
		
		paragrafos.qtd.text(textoQtd[0] + ": " + valores.qtd);
		paragrafos.total.text(formataNumero(valores.total, 2, false, false, "R$ ", ""));
		paragrafos.pago.text(formataNumero(valores.pago, 2, false, false, "R$ ", ""));
		paragrafos.valor.text(formataNumero(valores.valor, 2, false, false, "R$ ", ""));
		
	}
	else {
		
		$('#tfoottableLista' + nomeTabela).empty();
		
		$('#paginaLista' + nomeTabela).hide();
		
		$('#nomeProcura' + nomeTabela).find('#spanGroupPrint' + nomeTabela + 'FazendaProdutor').hide();
		
	}
		
}
/* =========================================================
 * setDadosTabelaServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaServicocafe(dados, trTabela, botaoVisualizar) {
	
	trTabela.append(tabelaCelula(botaoVisualizar, "text-center", "texto", "tdBotaoVisualizar"));
	
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
			.append(tabelaCelula(dados.servico, "text-left", "texto", "tdServico"))
			.append(tabelaCelula(dados.total, "text-right", "texto", "tdTotal"));
	
	if (dados.valorPago > 0) trTabela.append(tabelaCelula(dados.pago, "text-right", "texto_cor_verde", "tdPago"));
	else trTabela.append(tabelaCelula(dados.pago, "text-right", "texto", "tdPago"));
	if (dados.valorRestante > 0) trTabela.append(tabelaCelula(dados.valor, "text-right", "texto_cor_vermelho", "tdValor"));
	else trTabela.append(tabelaCelula(dados.valor, "text-right", "texto", "tdValor"));
	
}
/* =========================================================
 * setEventosCamposServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposServicocafe(dados, formulario) {
	
	formulario.find('#lote' + dados.nomeTabela).addClass("text-uppercase");
	
	addEventoCampoProcuraCafe(dados, formulario, "FazendaProdutor");
	
	formulario.find("#nomeProcuraCadastro" + dados.nomeTabela + "Preco")
		.rules('add', {checkIdServicocafePreco: true});
	
	formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco2').val(1);
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'PrecoDivInput span').on('change', function() {
		
		calculaValorServicoCafe(dados);
		
	});
	
	var campos = {
		sacas: "Sacas",
		valor: "Valor"
	}
	
	jQuery.each( campos, function( i, value ) {
	
		var input = formulario.find('#' + i + dados.nomeTabela);
	
		input.css("font-weight", "Bold").css("font-size", "15px");
	
		input.bind("propertychange change click keyup input paste", function(event) {
			
			input.valid();
			
			if (i == "sacas") {
				
				calculaValorServicoCafe(dados);
				
			}
			
		});
	
		var texto = {
			valor: 1,
			msg1: "a quantidade de ",
			msg2: "Quantidade de " + i
		};
		
		if (i == "valor") {
			
			texto.valor = formataNumero(texto.valor, 2, false, true, "R$ ", "");
			texto.msg1 = "o ";
			texto.msg2 = "Valor ";
			
		}
		
		input.rules('add', {
			required: true,
			number: true,
			min: 1,
			messages: { 
				required: "É necessário informar " + texto.msg1 + i + "!",
				min: texto.msg2 + " menor que " + texto.valor
			}
		});

	});

}
/* =========================================================
 * setDadosRodapeServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeServicocafe(rodape) {
	
	eval ("formataDados" + rodape.nomeTabela + "(rodape[0])");
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Cobranças: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right', 'texto texto_grande').append(rodape[0].total);
	var paragrafo3 = paragrafo('text-right', 'texto_cor_verde').append(rodape[0].pago);
	var paragrafo4 = paragrafo('text-right', 'texto_cor_vermelho').append(rodape[0].valor);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd');
	var th2 = th().append(paragrafo2).attr('id', 'total');
	var th3 = th().append(paragrafo3).attr('id', 'pago');
	var th4 = th().append(paragrafo4).attr('id', 'valor');
	
	var trRodapeResumo = tr('totalRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3).append(th4);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) th1.attr('colspan', 5);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th1.attr('colspan', 4);
			
		}
		else th1.attr('colspan', 3);
		
	}
	
}
/* =========================================================
 * pegaDadosFormularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioServicocafe(nomeTabela) {
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		lote: $("#lote" + nomeTabela).val().toUpperCase(),
		sacas: $("#sacas" + nomeTabela).val(),
		valor: formataNumeroSql($("#valor" + nomeTabela).val()),
		automatico: 0,
		pago: 0,
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	var idFazenda = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val()
	}
	
	var idPreco = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "Preco").val()
	}
	
	return {
		cadastro: cadastro,
		idFazenda: idFazenda,
		idPreco: idPreco
	};
	
}
/* =========================================================
 * validarFormularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioServicocafe(dados, formulario) {
	
	validarFormularioCore(dados, formulario);
	
	validarIdCore(dados.nomeTabela, 'FazendaProdutor');
	
	validarIdCore(dados.nomeTabela, 'Preco');
	
}
/* =========================================================
 * limpaDadosFormularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioServicocafe(nomeTabela) {
	
	var formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	formulario.find('#id' + nomeTabela).val('');
	formulario.find('#sacas' + nomeTabela).val('');
	formulario.find('#valor' + nomeTabela).val('');
	formulario.find('#lote' + nomeTabela).val('');
	formulario.find('#observacao' + nomeTabela).val('');
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
	limpaCampoSqlProcura("Preco", "nome");
	
}
/* =========================================================
 * setDadosFormularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioServicocafe(dados) {
	
	setDadosFormularioCafe(dados);

	$('#nomeProcuraCadastro' + dados.nomeTabela + 'Preco').val(dados.array.servico).attr('disabled', 'disabled');
	
	$('#nome' + dados.nomeTabela + 'PrecoMensagem').text(formataNumero(dados.array.valorServico, 2, true, true, "R$ ", "")).show();
		
	$('#idnomeProcuraCadastro' + dados.nomeTabela + 'Preco').val(dados.array.idServico);

	$('#sacas' + dados.nomeTabela).focus();

}
/* =========================================================
 * pegaNomeColunasServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasServicocafe(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		produtor: "Produtor",
		fazenda: "Fazenda",
		data: "Data",
		servico: "Serviço",
		total: "Total",
		pago: "Pago",
		valor: "Valor"
	};
	
	if (tipo == 3) nomesColunas = "Cobrança de Café";
	
	return nomesColunas;
	
}
/* =========================================================
 * eventoSalvarServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarServicocafe(dados) {
	
	var servico = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(servico),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
								
				dados = menuOpcoesCafe(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados.id = resposta.id;
				
				dados["indexStatus"] = 0;
				dados["data"] = servico.cadastro.data;
				
				setDadosFormularioRelatorioCore(dados);
				
			}
			
			mostraDialog(
				mensagem,
				cor_texto,
				"table",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * formularioServicocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioServicocafe(dados) {
	
	var dataAtual = getJson("getData");
	
	var campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var campoServico = campoSqlProcuraTexto(
		"Serviço",
		dados.nomeTabela,
		"Preco",
		"Digite o nome do serviço",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoValor = campoNumeroHorizontal(
		"valor" + dados.nomeTabela, "Valor",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		2, 9, false, false, "R$ ", "", "enabled"
	);
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		'', false, 10, "enabled"
	).removeClass("has-feedback");
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-sm-6 col-lg-8', 'col-xs-4 col-sm-6 col-lg-4',
		true, "-3", "0", formataData(dataAtual.data),
		'enabled'
	).removeClass("has-feedback");
	
	var divProdutor = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoProdutor);
		
	var divServico = $("<div/>")
		.addClass('col-xs-12 col-md-8')
		.append(campoServico);
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-7 col-md-6')
		.append(campoSacas)
		.append(campoValor);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-5 col-md-6')	
		.append(campoLote)
		.append(campoData);
	
	var divDados = $("<div/>")
		.addClass("form-horizontal")
		.append(divColuna1)
		.append(divColuna2);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divProdutor)
		.append(divServico)
		.append(divDados);
	
	var formTela2 = formularioObservacaoCore(dados.nomeTabela, "observacao", 9);
	
	var formulario = formularioLancamentoCore(dados, [formTela1, formTela2]);
	
	eval ("setEventosCampos" + dados.nomeTabela + "(dados, formulario)");
	
	return formulario;
	
}
/* =========================================================
 * formataDadosSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSintetizacafe(dados) {
	
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.data = formataData(dados.data);
	dados.armazenagem = formataNumero(dados.armazenagem, 2, false, true, "R$ ", "");
	dados.servicos = formataNumero(dados.servicos, 2, false, true, "R$ ", "");
	dados.total = formataNumero(dados.total, 2, false, true, "R$ ", "");
	
}
/* =========================================================
 * setDadosRodapeSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSintetizacafe(rodape) {
	
	eval ("formataDados" + rodape.nomeTabela + "(rodape[0])");
	
	var paragrafo1 = paragrafo('text-center texto', 'texto').append("Total de Cobranças: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right texto', 'texto').append(rodape[0].armazenagem);
	var paragrafo3 = paragrafo('text-right texto', 'texto').append(rodape[0].servicos);
	var paragrafo4 = paragrafo('text-right texto', 'texto').append(rodape[0].total);
	
	var th1 = th().append(paragrafo1);
	var th2 = th().append(paragrafo2);
	var th3 = th().append(paragrafo3);
	var th4 = th().append(paragrafo4);
	
	var trRodapeResumo = tr('totalRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3).append(th4);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) th1.attr('colspan', 3);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th1.attr('colspan', 2);
			
		}
		else trRodapeResumo.hide();
		
	}
	
}
/* =========================================================
 * pegaProcuraSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraSintetizacafe(dados) {
	
	return pegaProcuraRelatorioNomeTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * formularioRelatorioSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioSintetizacafe(dados) {
	
	return formularioRelatorioNomeTipoCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		2
	);
	
}
/* =========================================================
 * pegaNomeColunasSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSintetizacafe(tipo) {
	
	var nomesColunas = { 
		produtor: "Produtor",
		fazenda: "Fazenda",
		data: "Faturamento",
		armazenagem: "Armazenagem",
		recepcao: "Serviços",
		total: "Total"
	};
	
	if (tipo == 3) {
		
		nomesColunas = "Cobrança de Café";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosTabelaSintetizacafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSintetizacafe(dados, trTabela, botaoVisualizar) {
	
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
			.append(tabelaCelula(dados.armazenagem, "text-right", "texto", "tdArmazenagem"))
			.append(tabelaCelula(dados.servicos, "text-right", "texto", "tdServicos"))
			.append(tabelaCelula(dados.total, "text-right", "texto", "tdTotal"))
	
}
/* =========================================================
 * setDadosRodapeExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeExtratocafe(rodape) {
	
	setDadosRodapeCafe(rodape);
	
	var paragrafoTitulo = paragrafo('text-center', 'texto_grande texto_label').append("Resumo de Saldo");
	
	$('#rodapeTotal' + rodape.nomeTabela + ' p').remove();
	$('#rodapeTotal' + rodape.nomeTabela).append(paragrafoTitulo);
	
	var texto = {
		qtd: "Total de Lotes: " + rodape[0].qtdLotes,
		media: "Média: " + formataNumero(rodape[0].media, 2, false, false, "", " kg"),
		servico: "Em Serviço: " + formataNumeroSacasCafe(rodape[0].servico),
		saida: "A Sair: " + formataNumeroSacasCafe(rodape[0].saida),
		transferida: "A Transferir: " + formataNumeroSacasCafe(rodape[0].transferida),
		total: "Total: " + formataNumeroSacasCafe(rodape[0].total)
	}
	
	var paragrafo1 = paragrafo('text-center texto', 'texto').append(texto.qtd);
	var paragrafo2 = paragrafo('text-center texto', 'texto').append(texto.servico);
	var paragrafo3 = paragrafo('text-center texto', 'texto').append(texto.saida);
	var paragrafo4 = paragrafo('text-center texto', 'texto').append(texto.transferida);
	var paragrafo5 = paragrafo('text-right texto', 'texto').append(texto.total);
	var paragrafo6 = paragrafo('text-right texto', 'texto').append(texto.media);
	
	var th1 = th().append(paragrafo1);
	var th2 = th().append(paragrafo2);
	var th3 = th().append(paragrafo3);
	var th4 = th().append(paragrafo4);
	var th5 = th().append(paragrafo5);
	var th6 = th().append(paragrafo6);
	
	var trRodapeResumo = tr('resumoRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3)
		.append(th4).append(th5).append(th6);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) {
		th2.attr('colspan', 2);
		th4.attr('colspan', 2);
		th5.attr('colspan', 2);
	}
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th2.attr('colspan', 2);
			th5.attr('colspan', 2);
			
		}
		else {
			
			th5.attr('colspan', 2);
			
		}
		
	}
	
	setDadosRodapePeneiraExtratocafe(rodape);
	
}
/* =========================================================
 * formataDadosExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosExtratocafe(dados) {
	
	dados.data = formataData(dados.data);
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.peneira = decodeURIComponent(dados.peneira);
	dados.sacas = formataNumeroSacasCafe(dados.sacas);
	dados.peso = formataNumero(dados.peso, 2, false, true, "", " kg");
	
}
/* =========================================================
 * pegaNomeColunasExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasExtratocafe(tipo) {
	
	var nomesColunas = { 
		data: "Data",
		lote: "Lote",
		produtor: "Produtor",
		fazenda: "Fazenda",
		peneira: "Peneira",
		pilha: "Pilha",
		observacao: "Observação",
		sacas: "Sacas",
		peso: "Peso"
	};
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Lotes de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaProcuraExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraExtratocafe(dados) {
	
	return pegaProcuraRelatorioNomeTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * setDadosRodapePeneiraExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapePeneiraExtratocafe(rodape) {
	
	var peneira = rodape[0].peneiras;
	
	if (peneira.length > 0) {
	
		var paragrafoTitulo = paragrafo('text-center', 'texto_grande texto_label').append("Resumo por Peneiras");
		
		var thTitulo = th().append(paragrafoTitulo);
		
		var trRodapeResumo = tr('resumoPeneiraRodape' + rodape.nomeTabela, '').append(thTitulo);
		
		$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);

	}
	
	for(var i = 0; i < peneira.length; i++) {

		var paragrafo1 = paragrafo('text-left texto', 'texto').append(peneira[i].nome);
		var paragrafo2 = paragrafo('text-right texto', 'texto').append(formataNumeroSacasCafe(peneira[i].sacas));
		var paragrafo3 = paragrafo('text-right texto', 'texto').append(formataNumero(peneira[i].peso, 2, false, false, "", " kg"));
	
		var th1 = th().append(paragrafo1);
		var th2 = th().append(paragrafo2);
		var th3 = th().append(paragrafo3);
		
		var trRodapeResumo = tr('resumoPeneiraRodape' + rodape.nomeTabela, '').append(th1).append(th2).append(th3);
		
		$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
		
		var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
		
		if (produtor == 0) {
			
			thTitulo.attr('colspan', 9);
			th1.attr('colspan', 3);
			th2.attr('colspan', 2);
			th3.attr('colspan', 4);
			
		}
		else {
			
			if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
			
				thTitulo.attr('colspan', 8);
				th1.attr('colspan', 2);
				th2.attr('colspan', 2);
				th3.attr('colspan', 4);
				
			}
			else {
				
				thTitulo.attr('colspan', 7);
				th1.attr('colspan', 2);
				th2.attr('colspan', 2);
				th3.attr('colspan', 3);
				
			}
			
		}
		
	}
	
}
/* =========================================================
 * formularioRelatorioExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioExtratocafe(dados) {
	
	return formularioRelatorioNomeTipoCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		5
	);
	
}
/* =========================================================
 * setDadosTabelaExtratocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaExtratocafe(dados, trTabela, botaoVisualizar) {
	
	trTabela.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
			.append(tabelaCelula(dados.lote, "text-center", "texto", "tdLote"));
		
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.peneira, "text-left", "texto", "tdPeneira"))
			.append(tabelaCelula(dados.pilha, "text-center", "texto", "tdPilha"))
			.append(tabelaCelula(dados.observacao, "text-center", "texto", "tdObservacao"))
			.append(tabelaCelula(dados.sacas, "text-right", "texto", "tdSacas"))
			.append(tabelaCelula(dados.peso, "text-right", "texto", "tdPeso"));
	
}
/* =========================================================
 * pegaNomeColunasSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSaldocafe(tipo) {
	
	var nomesColunas = { 
		produtor: "Produtor",
		fazenda: "Fazenda",
		sacas: "Sacas",
		peso: "Peso",
		media: "Média",
		servico: "Em Serviço",
		saida: "A Sair",
		transferida: "A Transferir",
		total: "Total"
	};
	
	switch (tipo) {
		case 3: 
			nomesColunas = "Saldo de Café";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaProcuraSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraSaldocafe(dados) {
	
	return pegaProcuraRelatorioNome(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * formularioRelatorioSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioSaldocafe(dados) {
	
	return formularioRelatorioNomeCore(
		dados,
		"FazendaProdutor",
		"Produtor"
	);
	
}
/* =========================================================
 * setDadosRodapeSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSaldocafe(rodape) {
	
	eval ("formataDados" + rodape.nomeTabela + "(rodape[0])");
	
	var paragrafo1 = paragrafo('text-center texto', 'texto').append("Total de Fazendas: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right texto', 'texto').append(rodape[0].sacas);
	var paragrafo3 = paragrafo('text-right texto', 'texto').append(rodape[0].peso);
	var paragrafo4 = paragrafo('text-right texto', 'texto').append(rodape[0].media);
	var paragrafo5 = paragrafo('text-right texto', 'texto').append(rodape[0].servico);
	var paragrafo6 = paragrafo('text-right texto', 'texto').append(rodape[0].saida);
	var paragrafo7 = paragrafo('text-right texto', 'texto').append(rodape[0].transferida);
	var paragrafo8 = paragrafo('text-right texto', 'texto').append(rodape[0].total);
	
	var th1 = th().append(paragrafo1);
	var th2 = th().append(paragrafo2);
	var th3 = th().append(paragrafo3);
	var th4 = th().append(paragrafo4);
	var th5 = th().append(paragrafo5);
	var th6 = th().append(paragrafo6);
	var th7 = th().append(paragrafo7);
	var th8 = th().append(paragrafo8);
	
	var trRodapeResumo = tr('totalRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3).append(th4)
		.append(th5).append(th6).append(th7).append(th8);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) th1.attr('colspan', 2);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star")) {
		
			trRodapeResumo.hide();
			
		}
		
	}
	
}
/* =========================================================
 * setDadosTabelaSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSaldocafe(dados, trTabela, botaoVisualizar) {
	
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.sacas, "text-right", "texto", "tdSacas"))
			.append(tabelaCelula(dados.peso, "text-right", "texto", "tdPeso"))
			.append(tabelaCelula(dados.media, "text-right", "texto", "tdMedia"))
			.append(tabelaCelula(dados.servico, "text-right", "texto", "tdServico"))
			.append(tabelaCelula(dados.saida, "text-right", "texto", "tdSaida"))
			.append(tabelaCelula(dados.transferida, "text-right", "texto", "tdTransferida"))
			.append(tabelaCelula(dados.total, "text-right", "texto", "tdTotal"))
	
}
/* =========================================================
 * formataDadosSaldocafe.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSaldocafe(dados) {
	
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.sacas = formataNumeroSacasCafe(dados.sacas);
	dados.peso = formataNumero(dados.peso, 2, false, true, "", " kg");
	dados.media = formataNumero(dados.media, 2, false, true, "", " kg");
	dados.servico = formataNumeroSacasCafe(dados.servico);
	dados.saida = formataNumeroSacasCafe(dados.saida);
	dados.transferida = formataNumeroSacasCafe(dados.transferida);
	dados.total = formataNumeroSacasCafe(dados.total);
	
}
