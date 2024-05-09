/* =========================================================
 * menuOpcoesBalanca.js
 * http://lls.net.br/
 * ========================================================= */

function menuOpcoesBalanca(posicaoMenu, tipo) {
	
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
			dados.tipo = "Baixa";
			dados.tituloImprimi = "Guia de Recebimento";
			dados.nomeTabela = "Peso";
			dados.nomeTabelaCadastro = [];
			dados.nomeTabelaLancamento = ["Baixapeso", "Baixapeso"];
			dados.nomeBotaoLancamento = "Finalizar";
			break;
	}
	
	return dados;
	
}
/* =========================================================
 * menuBalanca.js
 * http://lls.net.br/
 * ========================================================= */

function menuBalanca(menu, posicaoMenu) {
	
	var menuItens = [
		{
			separator: true,
			titulo: "Lançamentos",
			icone: "record",
			texto: "Pesagem da " + menu.titulo
		}
	];
	
	return criarMenu(menu, menuItens, posicaoMenu);
	
}
/* =========================================================
 * formataPesoBalanca.js
 * http://lls.net.br/
 * ========================================================= */

function formataPesoBalanca(value, textoPeso) {
    
	var string = new TextDecoder().decode(value);
			
	let status = string.charAt(0);
	let weight = string.substring(1);
	
	if (status == "D" || status == "E" || status == "F" || status == "0") {
		
		textoPeso.removeClass('texto_cor_vermelho')
			.removeClass('texto_cor_amarelo')
			.addClass('texto_cor_verde');
			
	}
	else if (status == "H" || status == "I" || status == "L" ||
			 status == "M" || status == "O" || status == "T") {
		
		textoPeso.removeClass('texto_cor_verde')
			.removeClass('texto_cor_amarelo')
			.addClass('texto_cor_vermelho');
	
	}
	else {
		
		textoPeso.removeClass('texto_cor_verde')
			.removeClass('texto_cor_vermelho')
			.addClass('texto_cor_amarelo');
		
	}
	
	weight = parseInt(weight) || 0;
	
	textoPeso.text(weight).change();
	
}
/* =========================================================
 * readPesoBalanca.js
 * http://lls.net.br/
 * ========================================================= */

async function readPesoBalanca(port, textoPeso, nomeTabela) {
	
	try {
			
		await port.open({
			baudRate: 9600,
			stopBits: 1,
			dataBits: 8,
			parity: "none",
			flowControl: "none"
		});
	
	} catch (error) {}
	
	let keepReading = true;
	let reader;

	async function readUntilClosed() {
	  while (port.readable && keepReading) {
		reader = port.readable.getReader();
		try {
		  while (true) {
			const { value, done } = await reader.read();
			if (done) {
			  break;
			}
			if (value) {
			  formataPesoBalanca(value, textoPeso);
			}
		  }
		} catch (error) {}
		  finally {
			reader.releaseLock();
		}
	  }

	  try {
		await port.close();
	  } catch (error) {}
	}

	const closedPromise = readUntilClosed();
	
	$('#botaoPararLeitura').click(async function() {
			
		keepReading = false;

		reader.cancel();
		await closedPromise;

		$('#botaoPararLeitura').hide();
		$('#botaoIniciarLeitura').show();

		textoPeso.text('.')
			.removeClass('texto_cor_verde')
			.removeClass('texto_cor_vermelho')
			.removeClass('texto_cor_amarelo')
			.addClass('texto_cor_branco');
			   
		$('div#divDialogAltera' + nomeTabela).off('dialogclose');
			   
	});
	
	$('div#divDialogAltera' + nomeTabela).on('dialogclose', async function(event) {
		
		keepReading = false;

		reader.cancel();

		await closedPromise;
				
	});
	
}
/* =========================================================
 * checkStatusBalanca.js
 * http://lls.net.br/
 * ========================================================= */

async function checkStatusBalanca(textoPeso, nomeTabela) {

	textoPeso.removeClass('texto_cor_verde')
		.removeClass('texto_cor_amarelo')
		.addClass('texto_cor_vermelho');
	
	if ("serial" in navigator) {
	
		try {
		
			const ports = await navigator.serial.getPorts();
			
			const port = ports[0];
			
			if (port == null) {
				
				textoPeso.text("Desconectada!");
				
				$('div#divDialogAltera' + nomeTabela).off('dialogclose');
				
				$('#botaoIniciarLeitura').hide();
				$('#botaoPararLeitura').hide();
				$('#botaoDesconectar').hide();
				
				$('#botaoConectar').show();
				
			}
			else {
				
				textoPeso.text("Conectada!")
					 .removeClass('texto_cor_vermelho')
					 .removeClass('texto_cor_amarelo')
					 .addClass('texto_cor_verde');
				
				$('#botaoPararLeitura').off('click');
				$('div#divDialogAltera' + nomeTabela).off('dialogclose');
				
				readPesoBalanca(port, textoPeso, nomeTabela);
				
				$('#botaoConectar').hide();
				$('#botaoIniciarLeitura').hide();
				$('#botaoDesconectar').show();
				$('#botaoPararLeitura').show();
				
			}
		} catch (error) {}
	}
	else {
		
		textoPeso.text("API Web Serial API não é suportada!");
		
		$('#botaoIniciarLeitura').hide();
		$('#botaoPararLeitura').hide();
		$('#botaoConectar').hide();
		$('#botaoDesconectar').hide();
		
	}
	
}
/* =========================================================
 * pegaNomeColunasBalanca.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasBalanca(tipo) {
	
	return "Configuração da Balança";
	
}
/* =========================================================
 * formularioBalanca.js
 * http://lls.net.br/
 * ========================================================= */

function formularioBalanca(id, nomeTabela) {
	
	var textoPeso = $("<div/>")
		.addClass('texto_enorme')
		.attr('id', 'textoPeso');
	
	checkStatusBalanca(textoPeso, nomeTabela);
	
	var textoCampo = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append(textoPeso);
	
	var iconConectar = $("<i/>").attr('id', 'iconConectar')
		.attr('aria-hidden', true)
		.addClass('fa fa-fw fa-lg fa-plug');
		
	var iconDesconectar = $("<i/>").attr('id', 'iconDesconectar')
		.attr('aria-hidden', true)
		.addClass('fa fa-fw fa-lg fa-unlink');
		
	var iconLeitura = $("<i/>").attr('id', 'iconLeitura')
		.attr('aria-hidden', true)
		.addClass('fa fa-fw fa-lg fa-balance-scale');
	
	var botaoConectar = $("<button/>")
		.addClass('col-sm-12')
		.addClass('btn btn-success')
		.attr('id', 'botaoConectar')
		.attr('type', 'submit')
		.append("Conectar ")
		.append(iconConectar)
		.click(async function() {
			
			try {
			
				const port = await navigator.serial.requestPort();
				
				checkStatusBalanca(textoPeso, nomeTabela);
				
			} catch (error) {}
			
		});
	
	var botaoDesconectar = $("<button/>")
		.addClass('col-sm-6')
		.addClass('btn btn-danger')
		.attr('id', 'botaoDesconectar')
		.attr('type', 'submit')
		.append("Desconectar ")
		.append(iconDesconectar)
		.click(async function() {
			
			try {
			
				const ports = await navigator.serial.getPorts();
	
				const port = ports[0];
				
				await port.forget();
				
				checkStatusBalanca(textoPeso, nomeTabela);
				
			} catch (error) {}
			
		});
	
	var botaoIniciarLeitura = $("<button/>")
		.addClass('col-sm-6')
		.addClass('btn btn-primary')
		.attr('id', 'botaoIniciarLeitura')
		.attr('type', 'submit')
		.append("Iniciar Leitura ")
		.append(iconLeitura)
		.click(function() {
			
			checkStatusBalanca(textoPeso, nomeTabela);
			
		});
		
	var botaoPararLeitura = $("<button/>")
		.addClass('col-sm-6')
		.addClass('btn btn-warning')
		.attr('id', 'botaoPararLeitura')
		.attr('type', 'submit')
		.append("Parar Leitura ")
		.append(iconLeitura);
	
	var campoBotoes = $("<div/>")
		.attr('id', 'campoBotoes')
		.addClass('row')
		.append(botaoConectar)
		.append(botaoIniciarLeitura)
		.append(botaoPararLeitura)
		.append(botaoDesconectar);
	
	var formulario = $("<div/>")
		.addClass("form-horizontal")
		.append(textoCampo)
		.append(campoBotoes);
		
	return formulario;
	
}
/* =========================================================
 * eventoSalvarPeso.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarPeso(dados) {
	
	var number = animacao("botao" + dados.nomeTabela, "fa-check", true);
	
	var peso = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados.nomeTabela)');
	
	$("#divDialogAltera" + dados.nomeTabela).dialog( "close" );
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(peso),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados)');
								
				dados = menuOpcoesBalanca(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados.id = resposta.id;
				
				dados["indexStatus"] = 0;
				dados["data"] = peso.cadastro.data;
				
				setDadosFormularioRelatorioCore(dados);
				
				if (peso.cadastro.tipoProduto == "CAFE" &&
					peso.cadastro.fazendaProdutor_id > 0 &&
					peso.cadastro.tipoPeso == "ENTRADA") {
					
					imprimirGuiaCafe(dados, mensagem, 1);
					
				}
				else {
					
					mostraDialog(
						mensagem,
						cor_texto,
						"table",
						tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
					);
					
				}
				
			}
			else {
			
				animacao("botao" + dados.nomeTabela, "fa-check", false, number);
				
				mostraDialog(
					mensagem,
					cor_texto,
					"table",
					tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
				);
				
			}
			
		},
		error: function(jqXHR, exception) {
			
			animacao("botao" + dados.nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * setEventosCamposCafePeso.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposCafePeso(dados, formulario) {
	
	var fazendaProdutor_id = formulario.find("#idnomeProcuraCadastro" + dados.nomeTabela + "FazendaProdutor").val();
	
	var tipoProduto = formulario.find('#produto' + dados.nomeTabela).find(":selected").val();
	
	var tipoPeso = $("input[name='tipo" + dados.nomeTabela + "']:checked").val();
	
	if(tipoProduto == "CAFE" && fazendaProdutor_id > 0 && tipoPeso == "BRUTO") {
			
		formulario.find('#lote' + dados.nomeTabela + 'FormGroup').show();
		formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').show();
		formulario.find('#nota' + dados.nomeTabela + 'FormGroup').show();
		formulario.find('#valor' + dados.nomeTabela + 'FormGroup').show();
		
		formulario.find('#sacas' + dados.nomeTabela)
			.prop('disabled', false)
			.focus()
			.valid();
		
	}
	else {
		
		if (tipoPeso == "TARA") {
			
			formulario.find('#lote' + dados.nomeTabela + 'FormGroup').hide();
			formulario.find('#nota' + dados.nomeTabela + 'FormGroup').hide();
			formulario.find('#valor' + dados.nomeTabela + 'FormGroup').hide();
			
			formulario.find('#sacas' + dados.nomeTabela).rules('remove', 'required');
			formulario.find('#sacas' + dados.nomeTabela).rules('remove', 'min');
			
			formulario.find('#sacas' + dados.nomeTabela + 'Label').text("Quantidade");
			
			formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').show();
			
			formulario.find('#sacas' + dados.nomeTabela)
			.prop('disabled', false)
			.focus()
			.valid();
			
		}
		else {
			
			formulario.find('#sacas' + dados.nomeTabela).prop('disabled', true);
			
			formulario.find('#lote' + dados.nomeTabela + 'FormGroup').hide();	
			formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').hide();
			formulario.find('#nota' + dados.nomeTabela + 'FormGroup').hide();
			formulario.find('#valor' + dados.nomeTabela + 'FormGroup').hide();
			
		}
		
	}
	
}
/* =========================================================
 * setDadosDialogPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogPeso(dados) {
	
	eval ("formataDados" + dados.nomeTabela + "(dados.array)");
	
	var textoProdutor = juntaTituloTexto('Produtor', dados.array.produtor);
	var textoFazenda = juntaTituloTexto('Fazenda', dados.array.fazenda);
	var textoProduto = juntaTituloTexto('Produto', dados.array.descricao);
	var textoData = juntaTituloTexto('Data', dados.array.data);
	var textoHora = juntaTituloTexto('Hora', dados.array.hora);
	var textoPlaca = juntaTituloTexto('Placa', dados.array.placa);
	var textoDestino = juntaTituloTexto('Destino', dados.array.destino);
	var textoMotorista = juntaTituloTexto('Motorista', dados.array.motorista);
	var textoUsuario = juntaTituloTexto('Usuário', dados.array.usuario);
	
	var textoDataFinalizado = juntaTituloTexto('Data Finalizado', dados.array.dataFinalizado);
	var textoHoraFinalizado = juntaTituloTexto('Hora Finalizado', dados.array.horaFinalizado);
	var textoTicket = juntaTituloTexto('Ticket', dados.array.ticket);
	var textoTipo = juntaTituloTexto('Tipo', dados.array.tipoPeso);
	var textoQtd = juntaTituloTexto('Quantidade', dados.array.qtd);
	var textoTara = juntaTituloTexto('Tara', dados.array.tara);
	var textoBruto = juntaTituloTexto('Bruto', dados.array.bruto);
	var textoLiquido = juntaTituloTexto('Líquido', dados.array.liquido);
	var textoFechado = juntaTituloTexto('Fechado', dados.array.fechado);
	var textoAutomatico = juntaTituloTexto('Automático', dados.array.automatico);
	
	var nomesColunas = {
		"coluna1": "Dados da Pesagem",
		"coluna2": "Valores da Pesagem"
	};
	
	var colunaDados = {
		"coluna1": textoProdutor,
		"coluna2": textoFazenda,
		"coluna3": textoProduto,
		"coluna4": textoData,
		"coluna5": textoHora,
		"coluna6": textoPlaca,
		"coluna7": textoDestino,
		"coluna8": textoMotorista,
		"coluna9": textoUsuario
	};
	
	var colunaValores = {
		"coluna1": textoDataFinalizado,
		"coluna2": textoHoraFinalizado,
		"coluna3": textoTicket,
		"coluna4": textoTipo,
		"coluna5": textoQtd,
		"coluna6": textoTara,
		"coluna7": textoBruto,
		"coluna8": textoLiquido,
		"coluna9": textoFechado,
		"coluna10": textoAutomatico
	};
	
	var idLinha = 'tr' + dados.nomeTabela + 'Dialog_' + dados.array.id;
	
	var trDados = tr(idLinha, '');
	
	trDados.append(juntaColunas(colunaDados, 'text-left', 'texto', 'tdDados'))
		   .append(juntaColunas(colunaValores, 'text-left', 'texto', 'tdValores'));
	
	if (dados.array.sacas > 0) {
		
		nomesColunas.coluna3 = "Dados do Café";
		
		var textoLote = juntaTituloTexto('Lote', dados.array.lote);
		var textoSacas = juntaTituloTexto('Sacas', formataNumeroSacasCafe(dados.array.sacas));
		var textoPeso = juntaTituloTexto('Peso', dados.array.pesoNota);
		var textoNota = juntaTituloTexto('Nota', dados.array.nota);
		var textoValor = juntaTituloTexto('Valor', dados.array.valor);
		
		var colunaCafe = {
			"coluna1": textoLote,
			"coluna2": textoSacas,
			"coluna3": textoPeso,
			"coluna4": textoNota,
			"coluna5": textoValor
		};
		
		trDados.append(juntaColunas(colunaCafe, 'text-left', 'texto', 'tdCafe'));
		
	}
	
	setDadosDialogLancamentoCore(dados, nomesColunas, trDados);
	
	if (dados.array.imprimir == 0) {
		
		var idBotaoPrint = 'botaoPrint' + dados.nomeTabela;
		
		var urlBotaoPrint = "";
		
		if ($('#botaoAlterar' + dados.nomeTabela).is(':visible')) {
			
			dados.array.titulo = dados.array.lote;
			urlBotaoPrint = 'imprimirGuiaCafe(' + JSON.stringify(dados) + ')';
			
		}
		else {
			
			dados.tituloImprimi = "Ticket de Peso";
			dados.titulo = dados.array.ticket;
			urlBotaoPrint = 'imprimirPeso(' + JSON.stringify(dados) + ')';
			
		}
		
		var botaoPrint = botaoHorizontal(
			idBotaoPrint,
			"Imprimir",
			'fa-print', 4, 0,
			'btn  btn-primary',
			'button',
			urlBotaoPrint
		).addClass('col-xs-3');
		
		botaoPrint.find('#botaoPrint' + dados.nomeTabela)
			.attr('title', "Imprimir " + dados.tituloImprimi + ': ' + dados.array.titulo);
		
		if ($('#botaoAlterar' + dados.nomeTabela).is(':visible')) {
			
			if (dados.array.sacas > 0) {
				
				$('#botaoRemover' + dados.nomeTabela + 'FormGroup')
					.removeClass('col-xs-4').addClass('col-xs-3');
				$('#botaoAlterar' + dados.nomeTabela + 'FormGroup')
					.removeClass('col-xs-4').addClass('col-xs-3');
				$('#botaoLancamento' + dados.nomeTabela + 'FormGroup')
					.removeClass('col-xs-4').addClass('col-xs-3');
				
				$("#botaoAlterar" + dados.nomeTabela + "FormGroup")
					.after(botaoPrint);
				
			}
			
		}
		else {
			
			botaoPrint.removeClass('col-xs-3').addClass('col-xs-offset-5');
			
			$('#botaoRemover' + dados.nomeTabela + 'FormGroup').remove();
			$('#botaoAlterar' + dados.nomeTabela + 'FormGroup').remove();
			$('#botaoLancamento' + dados.nomeTabela + 'FormGroup').remove();
			
			$("#divBotoes" + dados.nomeTabela).append(botaoPrint);
			
		}
		
	}
	
}
/* =========================================================
 * setValoresFormularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setValoresFormularioPeso(dados, formulario) {
	
	if (dados.array.idProdutor == 0) {
			
		formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
			.val(0);
			
		formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor2')
			.val(0);
		
		formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
			.attr('disabled', 'enabled');
			
		formulario.find('#nome' + dados.nomeTabela + 'FazendaProdutorMensagem')
			.hide();
			
	}
	else {
		
		formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
			.val(dados.array.idFazenda);
			
		formulario.find('#idnomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor2')
			.val(dados.array.idProdutor);
		
		formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
			.attr('disabled', 'disabled');
					
		formulario.find('#nome' + dados.nomeTabela + 'FazendaProdutorMensagem')
			.show();
	
	}	
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
		.val(dados.array.produtor)
		
	formulario.find('#nome' + dados.nomeTabela + 'FazendaProdutorMensagem')
		.text(dados.array.fazenda)
	
	var tara = formataNumeroSql(dados.array.tara);
	
	if (tara == 0) formulario.find('#tipo' + dados.nomeTabela + "Bruto").attr('checked', 'checked');
	else {
		
		formulario.find('#tipo' + dados.nomeTabela + "Tara").attr('checked', 'checked');
		formulario.find('#sacas' + dados.nomeTabela).val(dados.array.qtd);
		
	}
	
}
/* =========================================================
 * setDadosRodapePeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapePeso(rodape) {
	
	eval ("formataDados" + rodape.nomeTabela + "(rodape[0])");
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Pesagens: " + rodape[0].qtd);
	var paragrafo2 = paragrafo('text-right', 'texto texto_grande').append(rodape[0].tara);
	var paragrafo3 = paragrafo('text-right', 'texto texto_grande').append(rodape[0].bruto);
	var paragrafo4 = paragrafo('text-right', 'texto texto_grande').append(rodape[0].liquido);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd');
	var th2 = th().append(paragrafo2).attr('id', 'tara');
	var th3 = th().append(paragrafo3).attr('id', 'bruto');
	var th4 = th().append(paragrafo4).attr('id', 'liquido');
	
	var trRodapeResumo = tr('totalRodape' + rodape.nomeTabela, '')
		.append(th1).append(th2).append(th3).append(th4);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodapeResumo);
	
	var produtor = $('#idnomeProcura' + rodape.nomeTabela + 'FazendaProdutor').val();
	
	if (produtor == 0) th1.attr('colspan', 8);
	else {
		
		if ($('#spanIconClear' + rodape.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			th1.attr('colspan', 7);
			
		}
		else th1.attr('colspan', 6);
		
	}
	
}
/* =========================================================
 * validarFormularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioPeso(dados, formulario) {
	
	validarFormularioCore(dados, formulario);

	jQuery.validator.addMethod("checkTipo" + dados.nomeTabela,
		function(value, element) {
			
			if (!$("input[name='tipo" + dados.nomeTabela + "']:checked").val()) {
				
				formulario.find('#tipo' + dados.nomeTabela + 'TaraLabel')
					.removeClass('texto_label')
					.addClass('text-danger');
				
				formulario.find('#tipo' + dados.nomeTabela + 'BrutoLabel')
					.removeClass('texto_label')
					.addClass('text-danger');
					
				return false;
				
			}
			else {
				
				formulario.find('#tipo' + dados.nomeTabela + 'TaraLabel')
					.removeClass('text-danger')
					.addClass('texto_label');
				
				formulario.find('#tipo' + dados.nomeTabela + 'BrutoLabel')
					.removeClass('text-danger')
					.addClass('texto_label');
					
				return true;
				
			}
		
		}, "É necessário selecionar o tipo de pesagem!"
	);
	
	jQuery.validator.addMethod("checkPlaca" + dados.nomeTabela,
		function(value, element) {
		
			value = value.split("_").join("");
			value = value.replace("-", "");
			
			if (value.length == 7) return true;
			else return false;
			
		}, "É necessário informar a placa!"
	
	);
	
	jQuery.validator.addMethod("checkBalanca" + dados.nomeTabela,
		function(value, element) {
		
			var pesoBalanca = {
				peso: parseInt($('#textoPeso').text()),
				check: $('#textoPeso').hasClass("texto_cor_verde")
			}
			
			if (pesoBalanca.peso > 0 && pesoBalanca.check) {
				
				$('#peso' + dados.nomeTabela)
					.val(formataNumero(pesoBalanca.peso, 2, false, false, "", " kg"));
				
				if (dados.nomeTabela == "Baixapeso") {
					
					var liquido = formataNumeroSql($("#liquido" + dados.nomeTabela).val());
					
					if (liquido <= 0) return false;
					
				}
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, "Pesagem não permitida!"
	
	);
	
}
/* =========================================================
 * setEventosCamposPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposPeso(dados, formulario) {
	
	formulario.find('#sacas' + dados.nomeTabela).prop('disabled', true);
	
	formulario.find('#lote' + dados.nomeTabela + 'FormGroup').hide();
	formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').hide();
	formulario.find('#nota' + dados.nomeTabela + 'FormGroup').hide();
	formulario.find('#valor' + dados.nomeTabela + 'FormGroup').hide();
	
	formulario.find('#lote' + dados.nomeTabela)
		.css("font-weight", "Bold").css("font-size", "15px");
	
	formulario.find('#ticket' + dados.nomeTabela)
		.css("font-weight", "Bold").css("font-size", "15px");
	
	formulario.find('#tipo' + dados.nomeTabela + 'TaraFormCheck')
		.addClass('col-xs-5 col-xs-offset-3 col-md-6 col-md-offset-2');
	
	formulario.find('#tipo' + dados.nomeTabela + 'BrutoFormCheck')
		.addClass('col-xs-4 col-md-4');
	
	var rule = {};
	
	if (dados.nomeTabela == "Peso") rule = {checkTipoPeso: true};
	else rule = {checkTipoBaixapeso: true};
	
	formulario.find('#tipo' + dados.nomeTabela + 'Radio').rules('add', rule);
	
	if (dados.nomeTabela == "Peso") rule = {checkPlacaPeso: true};
	else rule = {checkPlacaBaixapeso: true};
	
	formulario.find('#placa' + dados.nomeTabela).rules('add', rule);
	
	if (dados.nomeTabela == "Peso") rule = {checkBalancaPeso: true};
	else rule = {checkBalancaBaixapeso: true};
	
	if (dados.tipoOperacao == 0 || dados.nomeTabela == "Baixapeso") {
	
		formulario.find('#observacao' + dados.nomeTabela).rules('add', rule);
		
	}
	
	if (dados.tipoOperacao == 0) {
		
		formulario.find('#textoPeso').change(function(){
			
			$('#peso' + dados.nomeTabela)
				.val(formataNumero(parseInt($('#textoPeso').text()), 2, false, false, "", " kg"));
			
		});
		
	}
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutorDivInput span')
		.on('change', function() {
		
			setEventosCamposCafePeso(dados, formulario);
			
	});
	
	formulario.find('#nome' + dados.nomeTabela + 'FazendaProdutorMensagem')
		.on('change', function() {
			
			setEventosCamposCafePeso(dados, formulario);
			
	});
	
	formulario.find('input[type=radio][name=tipo' + dados.nomeTabela + ']').change(function() {
		
		$(this).valid();
		
		formulario.find('#tipo' + dados.nomeTabela + 'Radio')
			.prop('checked', true)
			.click();
		
		setEventosCamposCafePeso(dados, formulario);
		
	});
		
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor')
		.rules('add', {
			required: true,
			messages: { 
				required: "É necessário informar o produtor!"
			}
		});
	
	var campos = {
		peso: "Peso",
		placa: "Placa",
		sacas: "Sacas",
		produto: "Produto",
		descricao: "Descrição"
	}
	
	jQuery.each( campos, function( i, value ) {
	
		var texto = {
			min: 5,
			vogal: "o ",
			opcao: "selecionar "
		};
	
		var input = formulario.find('#' + i + dados.nomeTabela);
	
		if (i == "produto") {
			
			input.on('change', function() {

				$(this).valid();
				
				formulario.find('#sacas' + dados.nomeTabela).prop('disabled', true);
				
				formulario.find('#lote' + dados.nomeTabela + 'FormGroup').hide();
				formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').hide();
				formulario.find('#nota' + dados.nomeTabela + 'FormGroup').hide();
				formulario.find('#valor' + dados.nomeTabela + 'FormGroup').hide();
				
				var fazendaProdutor_id = formulario.find("#idnomeProcuraCadastro" + dados.nomeTabela + "FazendaProdutor").val();
				
				var tipoPeso = $("input[name='tipo" + dados.nomeTabela + "']:checked").val();
				
				if(!$(this).find(":selected").val()) {
					
					formulario.find('#descricao' + dados.nomeTabela)
						.prop('disabled', true)
						.val('');
					
				}
				else {
					
					if($(this).find(":selected").val() == "OUTROS") {
						
						formulario.find('#descricao' + dados.nomeTabela).val('');
						
					}
					else {
						
						if($(this).find(":selected").val() == "CAFE" && fazendaProdutor_id > 0 && tipoPeso == "BRUTO") {
							
							formulario.find('#sacas' + dados.nomeTabela).prop('disabled', false);
							
							formulario.find('#lote' + dados.nomeTabela + 'FormGroup').show();
							formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').show();
							formulario.find('#nota' + dados.nomeTabela + 'FormGroup').show();
							formulario.find('#valor' + dados.nomeTabela + 'FormGroup').show();
							
						}
						
						formulario.find('#descricao' + dados.nomeTabela)
							.val($(this).find(":selected").text())
							
					}
					
					if(tipoPeso == "TARA") formulario.find('#sacas' + dados.nomeTabela + 'FormGroup').show();
					
					if($(this).find(":selected").val() == "CAFE" && fazendaProdutor_id > 0 && tipoPeso == "BRUTO") {
					
						formulario.find('#sacas' + dados.nomeTabela)
							.focus()
							.valid();
							
					}
					else {
						
						formulario.find('#descricao' + dados.nomeTabela)
							.prop('disabled', false)
							.focus()
							.valid();
								
					}
					
				}
				
			});
			
		}
		else {
	
			input.css("font-weight", "Bold").css("font-size", "15px");
		
			input.bind("propertychange change click keyup input paste", function(event) {
				
				input.valid();
				
				if (i == "peso") {
					
					formulario.find('#' + dados.nomeTabela.toLowerCase() + 'Label')
						.text(input.val());
					
				}
				
			});
			
			if (i == "peso") {
				
				texto.valor = formataNumero(texto.min, 2, false, true, "", " kg")
				
				input.rules('add', {
					number: true,
					min: texto.min,
					messages: { 
						min: "Peso menor que " + texto.valor
					}
				});
				
			}
			else if (i == "sacas") {
				
				input.rules('add', {
					number: true,
					min: 1,
					messages: { 
						min: "Valor das sacas menor que 1!"
					}
				});
				
			}
			else texto.vogal = "a ";
			
			if (i == "descricao") i = value.toLowerCase() + " do produto";
			if (i == "sacas") i = " quantidade de " + value.toLowerCase();
			
			texto.opcao = "informar ";

		}
		
		input.rules('add', {
			required: true,
			messages: { 
				required: "É necessário " + texto.opcao + texto.vogal + i + "!"
			}
		});

	});
	
}
/* =========================================================
 * imprimirPeso.js
 * http://lls.net.br/
 * ========================================================= */

function imprimirPeso(dados, mensagem) {
	
	dados.tituloImprimi = "Ticket de Peso";
	
	var msg = 'Deseja imprimir o ' + dados.tituloImprimi;
	
	if (mensagem == null) mensagem = msg + ': ' + dados.titulo;
	else {
		mensagem = mensagem.substring(0, mensagem.indexOf('!')) + "!" + '<br>' + msg + ': ' +
			mensagem.split('!').splice(-1);
	}
	
	var url = "imprimir" + dados.nomeTabela;
	
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
 * eventoAcharGuiaPeso.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharGuiaPeso(guiaPeso) {
	
	$.ajax({
		type: "POST",
		url: 'getGuiaPeso',
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		success: function(result) {
			
			if (result.status == '200') {
				
				guiaPeso.lote = result.lote;
				guiaPeso.ticket = result.ticket;
				guiaPeso.data = result.data;
	
				setDadosFormularioGuiaPeso(guiaPeso);
				
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
 * setDadosTabelaPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaPeso(dados, trTabela, botaoVisualizar) {
	
	trTabela.append(tabelaCelula(botaoVisualizar, "text-center", "texto", "tdBotaoVisualizar"))
			.append(tabelaCelula(dados.data, "text-center", "texto", "tdData"))
			.append(tabelaCelula(dados.ticket, "text-center", "texto", "tdTicket"))
			.append(tabelaCelula(dados.placa, "text-center", "texto", "tdPlaca"));
	
	setDadosColunaHideCore(dados, trTabela);
	
	trTabela.append(tabelaCelula(dados.produto, "text-center", "texto", "tdProduto"))
			.append(tabelaCelula(dados.tipoPeso, "text-center", "texto", "tdTipoPeso"))
			.append(tabelaCelula(dados.tara, "text-right", "texto", "tdTara"))
			.append(tabelaCelula(dados.bruto, "text-right", "texto", "tdBruto"))
			.append(tabelaCelula(dados.liquido, "text-right", "texto", "tdLiquido"));
	
}
/* =========================================================
 * nomeTabsPeso.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsPeso(tipo) {
	
	return { 
		tabPeso1: "Dados"
	};
	
}
/* =========================================================
 * pegaDadosFormularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioPeso(nomeTabela) {
	
	var tipo = $("input[name='tipo" + nomeTabela + "']:checked").val();
	
	var peso = {};
	
	if (tipo == "TARA") {
		
		peso.tara = formataNumeroSql($("#peso" + nomeTabela).val());
		peso.bruto = 0.00;
		peso.liquido = 0.00;
		peso.tipo = "SAIDA";
		
	}
	else {
		
		peso.tara = 0.00;
		peso.bruto = formataNumeroSql($("#peso" + nomeTabela).val());
		peso.liquido = 0.00;
		peso.tipo = "ENTRADA";
		
	}
	
	peso.fazendaProdutorId = $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val();
	peso.tipoProduto = pegaValorCaixaCombinacao($('#produto' + nomeTabela).val());
	
	var cadastro = {
		id: $("#id" + nomeTabela).val(),
		fazendaProdutor_id: peso.fazendaProdutorId,
		automatico: 1,
		tara: peso.tara,
		bruto: peso.bruto,
		liquido: peso.liquido,
		tipoPeso: peso.tipo,
		data: $("#data" + nomeTabela).datepicker("getDate"),
		ticket: $("#ticket" + nomeTabela).val(),
		placa: pegaPlacaTexto($("#placa" + nomeTabela).val().toUpperCase()),
		tipoProduto: peso.tipoProduto,
		produto: encodeURIComponent( unescape($("#descricao" + nomeTabela).val())),
		produtor: encodeURIComponent( unescape($("#nomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val().substr(0,30))),
		destino: encodeURIComponent( unescape($("#destino" + nomeTabela).val())),
		motorista: encodeURIComponent( unescape($("#motorista" + nomeTabela).val())),
		observacao: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	if (peso.tipoProduto == "CAFE" &&
		peso.fazendaProdutorId > 0 &&
		peso.tipo == "ENTRADA") {
		
		var pesocafe = {
			sacas: $("#sacas" + nomeTabela).val(),
			nota: $("#nota" + nomeTabela).val(),
			valor: formataNumeroSql($("#valor" + nomeTabela).val())
		}

		cadastro.qtd = 0;

		return {
			cadastro: cadastro,
			pesocafe: pesocafe
		};
		
	}
	else {
	
		if (peso.tipo == "SAIDA") cadastro.qtd = $("#sacas" + nomeTabela).val();
		else cadastro.qtd = 0;
		
		return {
			cadastro: cadastro
		};
		
	}
	
}
/* =========================================================
 * formularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function formularioPeso(dados) {
	
	var textoPeso = $("<div/>")
		.addClass('texto_enorme')
		.attr('id', 'textoPeso');
	
	if (dados.tipoOperacao == 0 || dados.nomeTabela == "Baixapeso") {
	
		checkStatusBalanca(textoPeso, dados.nomeTabela);
		
	}
	
	var campoData = campoDataHorizontal(
		"data" + dados.nomeTabela, "Data",
		'col-xs-8 col-md-6', 'col-xs-4 col-md-6',
		true, "0", "0", null,
		'disabled'
	).removeClass("has-feedback");
	
	var campoTicket = campoNumeroHorizontal(
		"ticket" + dados.nomeTabela, "Ticket",
		'col-xs-8 col-md-7', 'col-xs-4 col-md-5',
		0, 11, false, true, "", "", "disabled"
	).removeClass("has-feedback");
	
	var campoPeso = campoNumeroHorizontal(
		"peso" + dados.nomeTabela, "Peso",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	var campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		dados.nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4'
	);
	
	var campoPlaca = campoPlacaHorizontal(
		"placa" + dados.nomeTabela, "Placa",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		false
	);
	
	var campoDestino = campoTextoHorizontal(
		'destino' + dados.nomeTabela, 'text', 'Destino',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', false, 50, "enabled"
	).removeClass("has-feedback");
	
	var campoMotorista = campoTextoHorizontal(
		'motorista' + dados.nomeTabela, 'text', 'Motorista',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', false, 50, "enabled"
	).removeClass("has-feedback");
	
	var caixaCombinacaoProdutos = caixaCombinacaoHorizontal(
		'produto' + dados.nomeTabela,
		'Produto',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		false,
		{
			"": "Selecione",
			"CAFE": "Café",
			"MILHO": "Milho",
			"OUTROS": "Outros"
		}
	);
	
	var campoDescricao = campoTextoHorizontal(
		'descricao' + dados.nomeTabela, 'text', 'Descrição',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', false, 50, "disabled"
	).removeClass("has-feedback");
	
	var campoObservacao = campoTextoHorizontal(
		'observacao' + dados.nomeTabela, 'text', 'Observação',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', false, 50, "enabled"
	).removeClass("has-feedback");
	
	var caixaRadioTipos = caixaRadioHorizontal(
		'tipo' + dados.nomeTabela,
		{
			"TARA": "Tara",
			"BRUTO": "Bruto"
		}
	);
	
	var campoLote = campoTextoHorizontal(
		'lote' + dados.nomeTabela, 'text', 'Lote',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', true, 8, "disabled"
	).removeClass("has-feedback");
	
	var campoSacas = campoNumeroHorizontal(
		"sacas" + dados.nomeTabela, "Sacas",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		0, 3, false, false, "", "", "enabled"
	);
	
	var campoNota = campoTextoHorizontal(
		'nota' + dados.nomeTabela, 'text', 'Número Nota',
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		'', false, 10, "enabled"
	).removeClass("has-feedback");
	
	var campoValor = campoNumeroHorizontal(
		"valor" + dados.nomeTabela, "Valor Nota",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 9, false, true, "R$ ", "", "enabled"
	).removeClass("has-feedback");
	
	var divData = $("<div/>")
		.attr('id', 'dataDiv' + dados.nomeTabela)
		.addClass('col-xs-7 col-md-8')
		.append(campoData);
	
	var divTicket = $("<div/>")
		.attr('id', 'ticketDiv' + dados.nomeTabela)
		.addClass('col-xs-5 col-md-4')
		.append(campoTicket);
	
	var divColuna1 = $("<div/>")
		.addClass('col-xs-12 col-md-6')
		.append(divData)
		.append(divTicket)
		.append(campoPeso)
		.append(campoProdutor)
		.append(campoPlaca)
		.append(campoDestino)
		.append(campoMotorista)
		.append(caixaCombinacaoProdutos)
		.append(campoDescricao)
		.append(campoObservacao);
	
	var divLabel = $("<div/>")
		.addClass("form-group")
		.append(textoPeso);
	
	var divColuna2 = $("<div/>")
		.addClass('col-xs-12 col-md-6')
		.append(divLabel)
		.append(caixaRadioTipos)
		.append(campoLote)
		.append(campoSacas)
		.append(campoNota)
		.append(campoValor);
	
	var formTela1 = $("<div/>")
		.addClass("form-horizontal")	
		.append(divColuna1)
		.append(divColuna2);
	
	var formulario = formularioLancamentoCore(dados, formTela1);
	
	formulario.find('#botaoFormGroup div')
		.removeClass('col-sm-offset-3')
		.addClass('col-sm-offset-4');
	
	eval ("setEventosCampos" + dados.nomeTabela + "(dados, formulario)");
	
	var guiaPeso = {
		nomeTabela: dados.nomeTabela,
		formulario: formulario
	};
	
	if (dados.id == 0) {
	
		eventoAcharGuiaPeso(guiaPeso);
		
	}
	
	return formulario;
	
}
/* =========================================================
 * pegaProcuraPeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraPeso(dados) {
	
	return pegaProcuraRelatorioNomeDataTipo(dados.pagina, dados.nomeTabela);
	
}
/* =========================================================
 * setDadosFormularioGuiaPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioGuiaPeso(guiaPeso) {
	
	guiaPeso.formulario.find('#lote' + guiaPeso.nomeTabela).val(guiaPeso.lote);
	
	guiaPeso.formulario.find('#ticket' + guiaPeso.nomeTabela).val(guiaPeso.ticket);
	
	guiaPeso.formulario.find("#data" + guiaPeso.nomeTabela)
		.datepicker('setDate', formataData(guiaPeso.data));
		
}
/* =========================================================
 * setDadosFormularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioPeso(dados) {
	
	eval ("formataDados" + dados.nomeTabela + "(dados.array)");
	
	var formulario = eval ("formulario" + dados.nomeTabela + "(dados)");
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, eval('pegaNomeColunas' + dados.nomeTabela + '(3)')),
		'Altera' + dados.nomeTabela
	);
	
	jQuery.each( dados.array, function( i, value ) {
		
		formulario.find('#' + i + dados.nomeTabela).val(value);
		
	});
	
	eval ('setValoresFormulario' + dados.nomeTabela + '(dados, formulario)');
	
	eval ('setEventosCamposCafe' + dados.nomeTabela + '(dados, formulario)');
	
	formulario.find('#'+ dados.nomeTabela.toLowerCase() + 'Label')
		.text(dados.array.peso);
	
	formulario.find("#spanGroupSearch" + dados.nomeTabela + "FazendaProdutor")
		.unbind();
	
	formulario.find('#tipo' + dados.nomeTabela + 'RadioFormGroup').hide();
	
	formulario.find('#peso' + dados.nomeTabela).attr('disabled', 'disabled');
	formulario.find('#produto' + dados.nomeTabela).attr('disabled', 'disabled');
	formulario.find('#descricao' + dados.nomeTabela).prop('disabled', false);
	
	formulario.find('#observacao' + dados.nomeTabela).focus();

}
/* =========================================================
 * formataDadosPeso.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosPeso(dados) {
	
	dados.produtor = decodeURIComponent(dados.produtor);
	dados.fazenda = decodeURIComponent(dados.fazenda);
	dados.destino = decodeURIComponent(dados.destino);
	dados.motorista = decodeURIComponent(dados.motorista);
	dados.produto = decodeURIComponent(dados.produto);
	dados.descricao = decodeURIComponent(dados.descricao);
	dados.observacao = decodeURIComponent(dados.observacao);
	
	var fechado = "Não";
	var automatico = "Não";
	
	dados["indexStatus"] = 0;
	
	if (dados.fechado) {
		
		fechado = "Sim";
		
		dados.indexStatus = 1;
		
		dados["valorRestante"] = 0;
		
	}
	else {
		
		if (dados.bruto == 0) {
			dados["peso"] = dados.tara;
			dados["valorRestante"] = dados.tara;
		}
		else {
			dados["peso"] = dados.bruto;
			dados["valorRestante"] = dados.bruto;
		}
		
	}
	
	if (dados.automatico) automatico = "Sim";
	
	if (dados.tipoPeso == "Saida") dados.tipoPeso = "Saída";
	
	dados["valorPago"] = dados.liquido;
	
	dados.automatico = automatico;
	dados.fechado = fechado;
	
	dados.data = formataData(dados.data);
	dados.dataFinalizado = formataData(dados.dataFinalizado);
	dados.placa = pegaPlacaMascara(dados.placa);
	
	dados.peso = formataNumero(dados.peso, 2, false, true, "", " kg");
	dados.tara = formataNumero(dados.tara, 2, false, true, "", " kg");
	dados.bruto = formataNumero(dados.bruto, 2, false, true, "", " kg");
	dados.liquido = formataNumero(dados.liquido, 2, false, true, "", " kg");
	
	dados.pesoNota = formataNumero(dados.pesoNota, 2, false, true, "", " kg");
	dados.valor = formataNumero(dados.valor, 2, false, true, "R$ ", "");
	
	dados["titulo"] = "Ticket: " + dados.ticket;
	
	dados["alterar"] = 0;
	dados["lancamento"] = 0;
	dados["imprimir"] = 0;
	dados["remover"] = 0;
	
}
/* =========================================================
 * formularioRelatorioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioPeso(dados) {
	
	return formularioRelatorioNomeDataTipoCore(
		dados,
		"FazendaProdutor",
		"Produtor",
		3
	);
	
}
/* =========================================================
 * limpaDadosFormularioPeso.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioPeso(dados) {
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	formulario.find('#id' + dados.nomeTabela).val(0);
	formulario.find('#ticket' + dados.nomeTabela).val(0);
	formulario.find('#peso' + dados.nomeTabela).val('');
	formulario.find('#placa' + dados.nomeTabela).val('');
	formulario.find('#motorista' + dados.nomeTabela).val('');
	formulario.find('#produto' + dados.nomeTabela).val('');
	formulario.find('#descricao' + dados.nomeTabela).val('');
	formulario.find('#observacao' + dados.nomeTabela).val('');
	
	formulario.find('#' + dados.nomeTabela.toLowerCase() + 'Label').text("0,00 kg");
	
	formulario.find("input[name='tipo" + dados.nomeTabela + "']").prop('checked', false);
	
	dados.campoProcura = "FazendaProdutor";
	
	limpaCampoSqlProcuraCore(dados, "nome");
	
}
/* =========================================================
 * pegaNomeColunasPeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasPeso(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		data: "Data",
		ticket: "Ticket",
		placa: "Placa",
		produtor: "Produtor",
		fazenda: "Fazenda",
		produto: "Produto",
		tipo: "Tipo",
		tara: "Tara",
		bruto: "Bruto",
		liquido: "Líquido"
	};
	
	if (tipo == 3) nomesColunas = "Pesagem da Balança";
	
	return nomesColunas;
	
}
/* =========================================================
 * removeTotalTabelaPeso.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaPeso(idLinha, nomeTabela) {
	
	var paragrafos = {
		qtd: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#qtd").find('p'),
		tara: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#tara").find('p'),
		bruto: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#bruto").find('p'),
		liquido: $('#tfoottableLista' + nomeTabela).find('#totalRodape' + nomeTabela).find("#liquido").find('p')
	}
	
	var valores = {
		valorTara: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdTara").find('p').text(),
		valorBruto: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdBruto").find('p').text(),
		valorLiquido: $('#tbodyLista' + nomeTabela).find(idLinha).find("#tdLiquido").find('p').text(),
		qtd: paragrafos.qtd.text(),
		tara: paragrafos.tara.text(),
		bruto: paragrafos.bruto.text(),
		liquido: paragrafos.liquido.text()
	}
	
	var textoQtd = valores.qtd.split(':'); 
	
	valores.qtd = Number(textoQtd[1]) - 1;
	
	valores.valorTara = formataNumeroSql(valores.valorTara);
	valores.valorBruto = formataNumeroSql(valores.valorBruto);
	valores.valorLiquido = formataNumeroSql(valores.valorLiquido);
	
	valores.tara = formataNumeroSql(valores.tara);
	valores.bruto = formataNumeroSql(valores.bruto);
	valores.liquido = formataNumeroSql(valores.liquido);
	
	valores.tara = valores.tara - valores.valorTara;
	valores.bruto = valores.bruto - valores.valorBruto;
	valores.liquido = valores.liquido - valores.valorLiquido;
	
	if (valores.tara + valores.bruto + valores.liquido > 0) {
	
		paragrafos.qtd.empty();
		paragrafos.tara.empty();
		paragrafos.bruto.empty();
		paragrafos.liquido.empty();
		
		paragrafos.qtd.text(textoQtd[0] + ": " + valores.qtd);
		paragrafos.tara.text(formataNumero(valores.tara, 2, false, false, "", " kg"));
		paragrafos.bruto.text(formataNumero(valores.bruto, 2, false, false, "", " kg"));
		paragrafos.liquido.text(formataNumero(valores.liquido, 2, false, false, "", " kg"));
		
	}
	else {
		
		$('#tfoottableLista' + nomeTabela).empty();
		
		$('#paginaLista' + nomeTabela).hide();
		
		$('#nomeProcura' + nomeTabela).find('#spanGroupPrint' + nomeTabela + 'FazendaProdutor').hide();
		
	}
		
}
/* =========================================================
 * eventoSalvarBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarBaixapeso(dados) {
	
	var number = animacao("botao" + dados.nomeTabela, "fa-check", true);
	
	var peso = eval ('pegaDadosFormulario' + dados.nomeTabela + '(dados)');
	
	$("#divDialogAltera" + dados.nomeTabela).dialog( "close" );
	
	$.ajax({
		type: "POST",
		url: "salva" + dados.nomeTabelaCadastro,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(peso),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var cor_texto = "texto_cor_vermelho";
			
			if (resposta.status == "200") {
				
				cor_texto = "texto_cor_verde";
				
				eval ('limpaDadosFormulario' + dados.nomeTabela + '(dados)');
				
				dados = menuOpcoesBalanca(dados.posicaoItemMenu, dados.posicaoItem);
				
				dados.id = resposta.id;
				
				dados["indexStatus"] = resposta.indexStatus;
				dados["data"] = resposta.data;
				
				setDadosFormularioRelatorioCore(dados);
				
				dados.titulo = peso.cadastro.ticket;
				
				imprimirPeso(dados, mensagem);
				
			}
			else {
			
				animacao("botao" + dados.nomeTabela, "fa-check", false, number);
				
				mostraDialog(
					mensagem,
					cor_texto,
					"table",
					tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
				);
				
			}
					
		},
		error: function(jqXHR, exception) {
			
			animacao("botao" + dados.nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * pegaDadosFormularioBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioBaixapeso(dados) {
	
	var cadastro = eval ('pegaDadosFormulario' + dados.nomeTabelaCadastro + '(dados.nomeTabela)');
	
	var peso = eval ('pegaValores' + dados.nomeTabela + '(dados)');
	
	cadastro.cadastro.dataFinalizado = $("#dataFinalizado" + dados.nomeTabela).datepicker("getDate");
	cadastro.cadastro.tara = peso.tara;
	cadastro.cadastro.bruto = peso.bruto;
	cadastro.cadastro.liquido = peso.liquido;
	
	return cadastro;
	
}
/* =========================================================
 * calculaLiquidoBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoBaixapeso(dados) {
	
	var peso = eval ('pegaValores' + dados.nomeTabela + '(dados)');
		
	$('#liquido' + dados.nomeTabela)
		.val(formataNumero(peso.liquido, 2, true, false, "", " kg"));
	
}
/* =========================================================
 * formularioBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function formularioBaixapeso(dados) {
	
	return eval ('formulario' + dados.nomeTabelaCadastro + '(dados)');
	
}
/* =========================================================
 * formataDadosBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosBaixapeso(dados) {
	
	eval ('formataDados' + dados.nomeTabelaCadastro + '(dados.array)');
	
}
/* =========================================================
 * pegaValoresBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaValoresBaixapeso(dados) {
	
	var tipoPeso = $("input[name='tipo" + dados.nomeTabela + "']:checked").val();
	
	var peso = {};
	
	if (tipoPeso == "TARA") {
		
		peso.tara = formataNumeroSql($("#peso2" + dados.nomeTabela).val());
		peso.bruto = parseInt($('#textoPeso').text());
		
		$('#peso' + dados.nomeTabela)
			.val(formataNumero(peso.bruto, 2, false, false, "", " kg"));
		
	}
	else {
		
		peso.tara = parseInt($('#textoPeso').text());
		peso.bruto = formataNumeroSql($("#peso2" + dados.nomeTabela).val());
		
		$('#peso' + dados.nomeTabela)
			.val(formataNumero(peso.tara, 2, false, false, "", " kg"));
		
	}
	
	peso.liquido = peso.bruto - peso.tara;
	
	return peso;
	
}
/* =========================================================
 * pegaNomeColunasBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasBaixapeso(tipo) {
	
	nomesColunas = "Finalização de Pesagem da Balança";
	
	return nomesColunas;
	
}
/* =========================================================
 * nomeTabsBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsBaixapeso() {
	
	return { 
		tabBaixapeso1: "Dados"
	};
	
}
/* =========================================================
 * validarFormularioBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioBaixapeso(dados, formulario) {
	
	eval ('validarFormulario' + dados.nomeTabelaCadastro + '(dados, formulario)');
	
}
/* =========================================================
 * setDadosFormularioBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioBaixapeso(dados) {
	
	setDadosFormularioCore(dados);
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	eval ('setValoresFormulario' + dados.nomeTabelaCadastro + '(dados, formulario)');
	
	var tipoPeso = $("input[name='tipo" + dados.nomeTabela + "']:checked").val();
	
	tipoPeso = tipoPeso.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		return letter.toUpperCase();
	});
	
	var dataAtual = getJson("getData");
	
	var campoDataFinalizado = campoDataHorizontal(
		"dataFinalizado" + dados.nomeTabela, "Data",
		'col-xs-8 col-md-6', 'col-xs-4 col-md-6',
		true, "0", "0", formataData(dataAtual.data),
		'disabled'
	).removeClass("has-feedback");
	
	var divDataFinalizado = $("<div/>")
		.attr('id', 'dataFinalizadoDiv' + dados.nomeTabela)
		.addClass('col-xs-7 col-md-8')
		.append(campoDataFinalizado);
	
	$('#dataDiv' + dados.nomeTabela).hide();
	$('#ticketDiv' + dados.nomeTabela).before(divDataFinalizado);
	
	var campoPeso2 = campoNumeroHorizontal(
		"peso2" + dados.nomeTabela, tipoPeso,
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	var campoLiquido = campoNumeroHorizontal(
		"liquido" + dados.nomeTabela, "Líquido",
		'col-xs-9 col-sm-6 col-lg-8', 'col-xs-3 col-sm-6 col-lg-4',
		2, 7, false, false, "", " kg", "disabled"
	);
	
	if (tipoPeso == "Tara") {
		
		$('#peso' + dados.nomeTabela).val(dados.array.bruto);
		$('#peso' + dados.nomeTabela + 'Label').text("Bruto");
		$('#peso' + dados.nomeTabela + 'FormGroup').before(campoPeso2);
		$('#peso' + dados.nomeTabela + 'FormGroup').after(campoLiquido);
		$('#peso2' + dados.nomeTabela).val(dados.array.tara);
		
		var min = formataNumeroSql(dados.array.tara) + 5;
		
		$('#peso' + dados.nomeTabela).rules('remove', "min");
		$('#peso' + dados.nomeTabela)	
			.rules('add', {
				min: min,
				messages: { 
					min: "Valor bruto menor que " +
						formataNumero(min, 2, false, true, "", " kg")
				}
		});
		
	}
	else {
		
		$('#peso' + dados.nomeTabela).val(dados.array.tara);
		$('#peso' + dados.nomeTabela + 'Label').text("Tara");
		$('#peso' + dados.nomeTabela + 'FormGroup').after(campoPeso2);
		$('#peso2' + dados.nomeTabela + 'FormGroup').after(campoLiquido);
		$('#peso2' + dados.nomeTabela).val(dados.array.bruto);
		
		var max = formataNumeroSql(dados.array.bruto) - 5;
		
		$('#peso' + dados.nomeTabela)	
			.rules('add', {
				max: max,
				messages: { 
					max: "Valor da tara maior que " +
						formataNumero(max, 2, false, true, "", " kg")
				}
		});
		
	}
	
	eval ('setEventosCamposCafe' + dados.nomeTabelaCadastro + '(dados, formulario)');
	
	$("#spanGroupSearch" + dados.nomeTabela + "FazendaProdutor")
		.unbind();
	
	$('#tipo' + dados.nomeTabela + 'RadioFormGroup').hide();
	
	$('#peso' + dados.nomeTabela).attr('disabled', 'enabled');
	$('#produto' + dados.nomeTabela + 'FormGroup').hide();
	$('#produto' + dados.nomeTabela).attr('disabled', 'disabled');
	$('#descricao' + dados.nomeTabela).prop('disabled', false);
	
	$('#peso' + dados.nomeTabela).prop('disabled', true);
	
	$('#observacao' + dados.nomeTabela).focus();
	
}
/* =========================================================
 * limpaDadosFormularioBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioBaixapeso(dados) {
	
	eval ('limpaDadosFormulario' + dados.nomeTabelaCadastro + '(dados)');
	
	var formulario = $('#' + dados.nomeTabela.toLowerCase() + 'Form');
	
	formulario.find('#peso2' + dados.nomeTabela).val('');
	formulario.find('#liquido' + dados.nomeTabela).val('');
	
}
/* =========================================================
 * setEventosCamposBaixapeso.js
 * http://lls.net.br/
 * ========================================================= */

function setEventosCamposBaixapeso(dados, formulario) {
	
	eval ('setEventosCampos' + dados.nomeTabelaCadastro + '(dados, formulario)');
	
	formulario.find('#tipo' + dados.nomeTabela + 'Radio')
		.rules('remove', "checkTipo" + dados.nomeTabela);
	
	var input = formulario.find('#peso' + dados.nomeTabela);
	
	input.bind("propertychange change click keyup input paste", function(event) {
				
		calculaLiquidoBaixapeso(dados);
		
	});
	
	formulario.find('#textoPeso').change(function(){
		
		calculaLiquidoBaixapeso(dados);
		
	});
	
}
