/* =========================================================
 * menuMilho.js
 * http://lls.net.br/
 * ========================================================= */

function menuMilho(posicaoMenu) {
	
	var $nomesItensMenu = {};
	
	var $item1 = 'novoCadastro("Entmilho", "click", "' + posicaoMenu + '")';
	var $item2 = 'novoCadastro("Saimilho", "click", "' + posicaoMenu + '")';
	var $item3 = 'novoCadastro("Tramilho", "click", "' + posicaoMenu + '")';
	var $item4 = 'novoCadastro("Laudo", "click", "' + posicaoMenu + '")';
	var $item5 = 'novoCadastro("Servicomilho", "click", "' + posicaoMenu + '")';
	var $item6 = 'novoCadastro("Faturamilho", "click", "' + posicaoMenu + '")';
	
	$nomesItensMenu[0] = {
		separator: true,
		titulo: "Lançamentos",
		icone: "import",
		texto: "Entrada de Milho",
		url: $item1
	}
	
	$nomesItensMenu[1] = {
		icone: "export",
		texto: "Saída de Milho",
		url: $item2
	}
	
	$nomesItensMenu[2] = {
		icone: "transfer",
		texto: "Transferência de Milho",
		url: $item3
	}
	
	$nomesItensMenu[3] = {
		icone: "edit",
		texto: "Número do Laudo",
		url: $item4
	}
	
	$nomesItensMenu[4] = {
		separator: true,
		titulo: "Serviço",
		icone: "save",
		texto: "Entrada de Serviço de Milho",
		url: $item5
	}
	
	$nomesItensMenu[5] = {
		separator: true,
		titulo: "Faturamento",
		icone: "usd",
		texto: "Efetuar Faturamento de Milho",
		url: $item6
	}
	
	return $nomesItensMenu;
	
}
/* =========================================================
 * formataDadosUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosUmidade(umidade) {
	
	umidade.codigo = formataNumero(umidade.codigo, 2, false, false, "", " %");
	
	umidade.desconto = formataNumero(umidade.desconto, 2, false, true, " ", " %");
	
	umidade.valor = formataNumero(umidade.valor, 2, false, true, "R$", "");
	
	umidade["alterar"] = 0;
	umidade["remover"] = 1;
	
	$('#nomeProcuraBotaoAdd').hide();
	
}
/* =========================================================
 * removeTotalTabelaUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaUmidade(idLinha) {}
/* =========================================================
 * pegaDadosSqlProcuraUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraUmidade(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
		
		var $codigo = formataNumero(data[1], 2, false, false, "", " %");
		
		var $desconto = formataNumero(data[2], 2, false, true, "", " %");
		
		var $valor = formataNumero(data[3], 2, false, true, "R$ ", "");
		
		return {
			value: '"' + $codigo + '"',
			data: {
				id: data[0],
				desconto: '"' + $desconto + '"',
				valor: '"' + $valor + '"'
			}
		};
		
	});

}
/* =========================================================
 * setDadosFormularioUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioUmidade(umidade) {
	
	formataDadosUmidade(umidade);
	
	$('#divDialogAlteraUmidade').empty();
	
	$('#divDialogAlteraUmidade').remove();
	
	var formulario = formularioUmidade(umidade.id, umidade.nomeTabela);
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, umidade.nomeTabela), 'Altera' + umidade.nomeTabela);
	
	formulario.find('#idUmidade').val(umidade.id);
	formulario.find('#codigoUmidade').val(umidade.codigo);
	formulario.find('#descontoUmidade').val(umidade.desconto);
	formulario.find('#valorUmidade').val(umidade.valor);
	
}
/* =========================================================
 * formularioUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function formularioUmidade(idUmidade, nomeTabela) {
	
	var $idTela = 'div' + nomeTabela;
	
	var $formTela = $("<div/>").attr({id: $idTela});
	
	var $campoCodigo = campoNumeroHorizontal("codigo" + nomeTabela, "Codigo", 9, 2, 2, 4, false, false, "", " %");
	
	var $campoDesconto = campoNumeroHorizontal("desconto" + nomeTabela, "Desconto", 9, 2, 2, 4, false, true, " ", " %");
	
	var $campoValor = campoNumeroHorizontal("valor" + nomeTabela, "Valor", 9, 2, 2, 6, false, true, "R$ ", "");
	
	$formTela.append($campoCodigo);
	
	$formTela.append($campoDesconto);
	
	$formTela.append($campoValor);
	
	var $formulario = formularioCadastro(idUmidade, nomeTabela, 2, 4, $formTela);
	
	return $formulario;
	
}
/* =========================================================
 * setDadosTabelaUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaUmidade(umidade) {
	
	formataDadosUmidade(umidade);
	
	var $idLinha = 'umidade_' + umidade.id;
	
	var $urlBotao = 'mostraCadastro("' + umidade.id + '" , "Umidade")';
	
	var $botaoVisualizar = botao(
		'botaoVisualizar' + umidade.id, '', 'fa-eye', '0', 'btn btn-primary btn-xs', 'button', $urlBotao
	);
	
	var $tbody = $('#listaUmidadeForm #tableListaUmidade #tbodyListaUmidade');
	
	if (umidade.tipoOperacao == 0) {
		
		var $tr = tr($idLinha, '');
		
		$tr.append(tabelaCelula($botaoVisualizar, 'text-center', 'texto', 'tdBotao'));
		$tr.append(tabelaCelula(umidade.codigo, 'text-right', 'texto', 'tdCodigo'));
		$tr.append(tabelaCelula(umidade.desconto, 'text-right', 'texto', 'tdDesconto'));
		$tr.append(tabelaCelula(umidade.valor, 'text-right', 'texto', 'tdValor'));
		
		$tbody.append($tr);
		
	}
	else {
		
		var $tr = $tbody.find('#' + $idLinha);
		
		$tr.find("#tdBotao")
			.replaceWith(tabelaCelula($botaoVisualizar, 'text-center', 'texto', 'tdBotao'));
		$tr.find("#tdCodigo")
			.replaceWith(tabelaCelula(umidade.codigo, 'text-right', 'texto', 'tdCodigo'));
		$tr.find("#tdDesconto")
			.replaceWith(tabelaCelula(umidade.desconto, 'text-right', 'texto', 'tdDesconto'));
		$tr.find("#tdValor")
			.replaceWith(tabelaCelula(umidade.valor, 'text-right', 'texto', 'tdValor'));
	}
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraUmidade(id) {
	
	var dados = {
		id: $('#id' + id).val(),
		nome: formataNumeroSql($('#' + id).val())
	}
	
	return dados;
	
}
/* =========================================================
 * campoTextoProcuraUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoProcuraUmidade() {
	
	return campoNumero("nomeProcura", 2, 4, false, false, "", " %");
	
}
/* =========================================================
 * eventoSalvarUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarUmidade(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var umidade = pegaDadosFormularioUmidade(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: 'salvaUmidade',
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify({umidade: umidade}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent(escape(resposta.mensagem));
			
			var $cor_texto = '';
			
			if (resposta.status == "200") {
				
				$cor_texto = 'texto_cor_verde';
				
				limpaDadosFormularioUmidade();
				
				$('#divDialogAlteraUmidade').empty();
				
				$('#divDialogAlteraUmidade').remove();
				
				$('#divDialogAlteraUmidade').dialog( "close" );
				
				umidade["tipoOperacao"] = tipoOperacao;
				
				if (tipoOperacao == 0) {
					
					$('#nomeProcura').val(formataNumero(umidade.codigo, 2, false, true, "", " %"));
					
					eventoListaCadastro(1, nomeTabela);
					
				}
				else {
				
					setDadosTabelaUmidade(umidade);
					
				}
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
				$cor_texto = 'texto_cor_vermelho';
				
			}
			
			mostraDialog(
				$mensagem,
				$cor_texto,
				'table',
				tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * validarFormularioUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioUmidade(tipoOperacao, nomeTabela, formulario) {
	
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
            codigoUmidade: {required: true}
        },
        messages: {
			codigoUmidade: {required: "É necessário informar o codigo!"},
			valorUmidade: 'É necessário informar o valor da ' + nomeTabela.toLowerCase() + '!',
			descontoUmidade: 'É necessário informar o valor do desconto da ' + nomeTabela.toLowerCase() + '!',
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarUmidade(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
}
/* =========================================================
 * pegaDadosFormularioUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioUmidade(nomeTabela) {
	
	var dados = {
		id: $('#id' + nomeTabela).val(),
		codigo: formataNumeroSql($('#codigo' + nomeTabela).val()),
		desconto: formataNumeroSql($('#desconto' + nomeTabela).val()),
		valor: formataNumeroSql($('#valor' + nomeTabela).val())
	}
	
	return dados;
	
}
/* =========================================================
 * pegaNomeColunasUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasUmidade(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		codigo: "Codigo",
		desconto: "Desconto",
		valor: "Valor"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Umidade";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosRodapeUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeUmidade(rodape) {

	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Umidades: " + rodape[0].qtd);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd').attr('colspan', 4);
	
	var trRodape = tr('nomeRodape' + rodape.nomeTabela, '').append(th1);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * limpaDadosFormularioUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioUmidade() {
	
	$('#idUmidade').val('0');
	$('#codigoUmidade').val('');
	$('#descontoUmidade').val('');
	$('#valorUmidade').val('');
	
	$('#codigoUmidade').focus();
	
}
/* =========================================================
 * pegaProcuraUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraUmidade(pagina) {
	
	var dados = {
		"id": pagina,
		"nome": $("#nomeProcura").maskMoney("unmasked")[0]
	}
	
	return dados;
	
}
/* =========================================================
 * campoSqlProcuraUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraUmidade(suggestion, tipo) {
	
	var $codigo = suggestion.value;
	var $desconto = suggestion.data.desconto;
	var $valor = suggestion.data.valor;
	
	$codigo = $codigo.replace(/\"/g, '');
	$desconto = $desconto.replace(/\"/g, '');
	$valor = $valor.replace(/\"/g, '');
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<h5 class="' + 'list-group-item-heading"' + '>' + $codigo + '</h5>' +
			'<span class="' + 'badge"' + '><i>' + $desconto + '</i></span>' +
			'<p class="' + 'list-group-item-text"' + '><b><i>' + $valor + '</i></b></p>' +
		'</div>';
					
	}
	else {
		
		return {
			texto: 'Desconto: ' + $desconto + ' | ' + $valor,
			valor: $codigo
		};
		
	}
	
}
/* =========================================================
 * setDadosDialogUmidade.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogUmidade(umidade) {
	
	formataDadosUmidade(umidade);
	
	var $idLinha = 'trUmidadeDialog_' + umidade.id;
	
	var $trUmidade = tr($idLinha, '');
	
	$trUmidade.append(tabelaCelula(umidade.codigo, 'text-right', 'texto', 'tdCodigo'));
	
	$trUmidade.append(tabelaCelula(umidade.desconto, 'text-right', 'texto', 'tdDesconto'));
	
	$trUmidade.append(tabelaCelula(umidade.valor, 'text-right', 'texto', 'tdValor'));
	
	umidade["nome"] = umidade.codigo;
	
	setDadosDialogCadastro(umidade, null, $trUmidade);
	
}
/* =========================================================
 * formularioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioMilho(idMilho, nomeTabela) {}
/* =========================================================
 * removeTotalTabelaMilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaMilho(idLinha) {}
/* =========================================================
 * setDadosRodapeMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeMilho(rodape) {
	
	var colspan = {
		inicio: 3,
		fim: 0
	};
	
	var $trRodape = tr('nomeRodapeMilho', '');
	
	var $th1 = th();
	var $th2 = th();
	var $th3 = th();
	var $th4 = th();
	
	var $paragrafo1 = paragrafo('text-right texto', 'texto');
	var $paragrafo2 = paragrafo('text-right texto', 'texto');
	var $paragrafo3 = paragrafo('text-right texto', 'texto');
	
	$paragrafo1.append(formataNumero(rodape[0].entrada, 2, false, false, "", " kg"));
	$paragrafo2.append(formataNumero(rodape[0].saida, 2, false, false, "", " kg"));
	$paragrafo3.append(formataNumero(rodape[0].saldo, 2, false, false, "", " kg"));
	
	$th2.append($paragrafo1);
	$th3.append($paragrafo2);
	$th4.append($paragrafo3);
	
	setDadosRodapeHide("Milho", colspan, $th1);
	
	$trRodape.append($th1);
	$trRodape.append($th2);
	$trRodape.append($th3);
	$trRodape.append($th4);

	return $trRodape;
	
}
/* =========================================================
 * pegaNomeColunasMilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasMilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		produtor: "Produtor",
		fazenda: "Fazenda",
		entrada: "Entradas",
		saida: "Saídas",
		saldo: "Saldo Atual"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Saldo";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraMilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraMilho(id) {
	
	var dados = {
		id: $('#id' + id).val(),
		nome: $('#' + id).val()
	}
	
	return dados;
	
}
/* =========================================================
 * pegaDadosSqlProcuraMilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraMilho(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
			
		return {
			value: data[3],
			data: {
				id: data[0],
				fazenda: data[1],
				saldo: data[2],
				id2: data[4]
			}
		};
		
	});

}
/* =========================================================
 * formataDadosMilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosMilho(milho) {
	
	milho.produtor = decodeURIComponent(milho.produtor);
	milho.fazenda = decodeURIComponent(milho.fazenda);
	milho.entrada = formataNumero(milho.entrada, 2, false, true, "", " kg");
	milho.dataEntrada = formataData(milho.dataEntrada);
	milho.saida = formataNumero(milho.saida, 2, false, true, "", " kg");
	milho.dataSaida = formataData(milho.dataSaida);
	milho.saldo = formataNumero(milho.saldo, 2, false, true, "", " kg");
	milho.dataFaturamento = formataData(milho.dataFaturamento);

}
/* =========================================================
 * setDadosTabelaMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaMilho(milho) {
	
	formataDadosMilho(milho);
	
	var $idLinha = "milho_" + milho.id;
	
	var $urlBotao = 'mostraCadastro("' + milho.id + '" , "Milho")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar" + milho.id, "", "fa-eye", "0", "btn btn-primary btn-xs", "button", $urlBotao
	);
	
	var $tbody = $("#listaMilhoForm #tableListaMilho #tbodyListaMilho");
	
	var $tr = tr($idLinha, "");
	
	$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
	
	setDadosColunaHide("Milho", milho, $tr);
	
	$tr.append(tabelaCelula(milho.entrada, "text-right", "texto", "tdEntrada"));
	$tr.append(tabelaCelula(milho.saida, "text-right", "texto", "tdSaida"));
	$tr.append(tabelaCelula(milho.saldo, "text-right", "texto", "tdSaldo"));
	
	$tbody.append($tr);
		
}
/* =========================================================
 * campoSqlProcuraMilho.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraMilho(suggestion, tipo) {
	
	var $saldo = formataNumero(suggestion.data.saldo, 2, false, false, "", " kg")
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<span class="' + 'badge"' + '><i>Saldo: ' + $saldo + '</i></span>' +
			'<h5 class="' + 'list-group-item-heading"' + '>' + suggestion.value + '</h5>' +
			'<p class="' + 'list-group-item-text"' + '><b><i>' +
				suggestion.data.fazenda + ' ' + '</i></b></p>' +
		'</div>';
					
	}
	else {
		
		return {
			texto: 'Saldo: ' + $saldo + '\n' + suggestion.data.fazenda,
			valor: suggestion.value
		};
		
	}
	
}
/* =========================================================
 * pegaProcuraMilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraMilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNome(pagina, nomeTabela);
	
}
/* =========================================================
 * eventoSalvarMilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarMilho(tipoOperacao, nomeTabela) {}
/* =========================================================
 * removeTotalTabelaSaldoMilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaSaldoMilho(nomeTabela, entrada, saida) {
	
	var totalEntradas = $('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalEntradas").find('p').text();
	var totalSaidas = $('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaidas").find('p').text();
	var totalSaldo = $('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaldo").find('p').text();
	
	totalEntradas = formataNumeroSql(totalEntradas);
	totalSaidas = formataNumeroSql(totalSaidas);
	totalSaldo = formataNumeroSql(totalSaldo);
	
	totalEntradas = totalEntradas - entrada;
	totalSaidas = totalSaidas - saida;
	totalSaldo = totalEntradas - totalSaidas;
	
	totalEntradas = formataNumero(totalEntradas, 2, false, false, "", " kg");
	totalSaidas = formataNumero(totalSaidas, 2, false, false, "", " kg");
	totalSaldo = formataNumero(totalSaldo, 2, false, false, "", " kg");
		
	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalEntradas").find('p').empty();

	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalEntradas").find('p').text(totalEntradas);
	
	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaidas").find('p').empty();

	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaidas").find('p').text(totalSaidas);
	
	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaldo").find('p').empty();

	$('#tfoottableLista' + nomeTabela)
		.find('#saldoRodape' + nomeTabela).find("#totalSaldo").find('p').text(totalSaldo);
	
}
/* =========================================================
 * validarFormularioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioMilho(tipoOperacao, nomeTabela, formulario) {}
/* =========================================================
 * limpaDadosFormularioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioMilho() {}
/* =========================================================
 * pegaDadosFormularioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioMilho(nomeTabela) {}
/* =========================================================
 * setDadosFormularioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioMilho(milho) {}
/* =========================================================
 * setDadosDialogMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogMilho(milho) {
	
	formataDadosMilho(milho);
	
	var $textoProdutor = juntaTituloTexto('Produtor', milho.produtor);
	var $textoFazenda = juntaTituloTexto('Fazenda', milho.fazenda);
	var $textoLiquidoEntrada = juntaTituloTexto('Peso Liquido de Entrada', milho.entrada);
	var $textoDataEntrada = juntaTituloTexto('Data da Última Entrada', milho.dataEntrada);
	var $textoLiquidSaida = juntaTituloTexto('Peso Liquido de Saída', milho.saida);
	var $textoDataSaida = juntaTituloTexto('Data da Última Saída', milho.dataSaida);
	var $textoTotal = juntaTituloTexto('Total Liquido', milho.saldo);
	var $textoDataFaturamento = juntaTituloTexto('Data do Último Faturamento', milho.dataFaturamento);
	
	var $nomesColunas = {
		"coluna1": "Saldo do Produtor"
	};
	
	var $arrayDados = {
		"coluna1": $textoProdutor,
		"coluna2": $textoFazenda,
		"coluna3": $textoLiquidoEntrada,
		"coluna4": $textoDataEntrada,
		"coluna5": $textoLiquidSaida,
		"coluna6": $textoDataSaida,
		"coluna7": $textoTotal,
		"coluna8": $textoDataFaturamento,
	};
	
	var $idLinha = 'trMilhoDialog_' + milho.id;
	
	var $trDados = tr($idLinha, '');
	
	$trDados.append(juntaColunas($arrayDados, 'text-left', 'texto', 'tdDados'));
	
	setDadosDialogCadastro(milho, $nomesColunas, $trDados);
	
	$("#botaoAlterar").hide();
	$("#botaoRemover").hide();
	
}
/* =========================================================
 * formularioRelatorioMilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioMilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $formulario = formularioRelatorioNome(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		urlSearch
	);
	
	return $formulario;
	
}
/* =========================================================
 * setDadosRodapeSaldoMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSaldoMilho(nomeTabela, rodape, colspan, th1) {
	
	setDadosRodapeHide(nomeTabela, colspan, th1);
	
	var idFazenda = $('#idnomeProcura' + nomeTabela + 'FazendaProdutor').val();
	
	if (idFazenda > 0) {
		
		var $trSaldo = tr('saldoRodape' + nomeTabela, '');
			
		var $thTextoEntradas = th();
		var $thTextoSaidas = th();
		var $thTextoSaldo = th();
		
		var $thEntradas = th();
		var $thSaidas = th();
		var $thSaldo = th();
		var $thFim = th();
		
		var colunaEntradas = 0;
		var colunaSaldo = 0;
		
		if ($('#spanIconClear' + nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
			
			if ( colspan.fim > 0 ) {
				
				colunaEntradas = colspan.inicio - 1;
				colunaSaldo = colunaEntradas - 2;
				
			}
			else {
				
				colunaEntradas = 2;
				
			}
			
		}
		else {
			
			if ( colspan.fim > 0 ) {
				
				colunaEntradas = colspan.inicio - 2;
				colunaSaldo = colunaEntradas - 1;
				
			}
			
		}
		
		$thTextoEntradas.attr('colspan', colunaEntradas);
		$thTextoSaldo.attr('colspan', colunaSaldo);
		
		var $paragrafoTextoEntradas = paragrafo('text-center texto', 'texto');
		var $paragrafoTextoSaidas = paragrafo('text-center texto', 'texto');
		var $paragrafoTextoSaldo = paragrafo('text-center texto', 'texto');
		
		var $paragrafoEntradas = paragrafo('text-right texto', 'texto');
		var $paragrafoSaidas = paragrafo('text-right texto', 'texto');
		var $paragrafoSaldo = paragrafo('text-right texto', 'texto');
		
		$paragrafoTextoEntradas.append("Entradas");
		$paragrafoTextoSaidas.append("Saídas");
		$paragrafoTextoSaldo.append("Saldo Atual");
		
		$paragrafoEntradas.append(formataNumero(rodape[0].entradas, 2, false, false, "", " kg"));
		$paragrafoSaidas.append(formataNumero(rodape[0].saidas, 2, false, false, "", " kg"));
		$paragrafoSaldo.append(formataNumero(rodape[0].saldo, 2, false, false, "", " kg"));
		
		$thTextoEntradas.append($paragrafoTextoEntradas).attr('id', 'textoEntradas');
		$thTextoSaidas.append($paragrafoTextoSaidas).attr('id', 'textoSaidas');
		$thTextoSaldo.append($paragrafoTextoSaldo).attr('id', 'textoSaldo');
		
		$thEntradas.append($paragrafoEntradas).attr('id', 'totalEntradas');
		$thSaidas.append($paragrafoSaidas).attr('id', 'totalSaidas');
		$thSaldo.append($paragrafoSaldo).attr('id', 'totalSaldo');
		
		$trSaldo.append($thTextoEntradas);
		$trSaldo.append($thEntradas);
		
		$trSaldo.append($thTextoSaidas);
		$trSaldo.append($thSaidas);
		
		$trSaldo.append($thTextoSaldo);
		$trSaldo.append($thSaldo);
		
		if ( colspan.fim > 0 ) {
			
			$thFim.attr('colspan', colspan.fim);
			
			$trSaldo.append($thFim);
			
		}
		
		$('#tfoottableLista' + nomeTabela).append($trSaldo);
		
	}
		
}
/* =========================================================
 * validarFormularioLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioLaudo(tipoOperacao, nomeTabela, formulario) {
	
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
            laudoLaudo: {required: true}
        },
        messages: {
			laudoLaudo: "É necessário informar o laudo!"
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarLaudo(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
}
/* =========================================================
 * limpaDadosFormularioLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioLaudo() {
	
	$("#idLaudo").val("0");
	$("#laudoLaudo").val("");
	
	$("#laudoLaudo").focus();
	
}
/* =========================================================
 * pegaNomeColunasLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasLaudo(tipo) {
	
	return "Laudo";
	
}
/* =========================================================
 * formularioLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function formularioLaudo(idLaudo, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $formTela = $("<div/>").attr({id: $idTela}).addClass("form-horizontal");
	
	var $campoLaudo = campoNumeroHorizontal("laudo" + nomeTabela, "Laudo",
		9, 2, 0, 6, false, false, "", "");
	
	$formTela.append($campoLaudo);
	
	var $formulario = formularioCadastro(idLaudo, nomeTabela, 2, 2, $formTela, 4);
	
	var laudo = {
		nomeTabela: nomeTabela,
		formulario: $formulario
	};
	
	eventoAcharLaudo(laudo);
	
	return $formulario;
	
}
/* =========================================================
 * pegaDadosFormularioLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioLaudo(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		laudo: $("#laudo" + nomeTabela).val()
	}
	
	return dados;
	
}
/* =========================================================
 * setDadosFormularioLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioLaudo(laudo) {
	
	if ( (laudo.id == null) || (laudo.id == 0) ) {
		
		laudo.formulario.find('#laudo' + laudo.nomeTabela).attr('disabled', 'disabled');
		laudo.formulario.find('#botao' + laudo.nomeTabela).hide();
		
	}
	else {
		
		laudo.formulario.find('#idLaudo').val(laudo.id);
		
		laudo.formulario.find("#data" + laudo.nomeTabela)
			.datepicker('setDate', formataData(laudo.data));
	
		if (laudo.nomeTabela == "Saimilho") {
			
			laudo.formulario.find('#laudo' + laudo.nomeTabela).val(0);
			
		}
		else {
		
			laudo.formulario.find('#laudo' + laudo.nomeTabela)
				.val(laudo.laudo)
				.css("font-weight", "Bold")
				.css("font-size", "15px");
				
		}
		
	}
	
}
/* =========================================================
 * eventoAcharLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharLaudo(laudo) {
	
	$.ajax({
		type: "POST",
		url: 'achaLaudo',
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		success: function(result) {
			
			laudo.id = result.id;
			laudo.laudo = result.laudo;
			laudo.data = result.data;
			
			if (result.status == '200') {
	
				setDadosFormularioLaudo(laudo);
				
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
 * eventoSalvarLaudo.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarLaudo(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var laudo = pegaDadosFormularioLaudo(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: "salvaLaudo",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({laudo: laudo}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioLaudo();
				
				$("#divDialogAlteraLaudo").empty();
				
				$("#divDialogAlteraLaudo").remove();
				
				$("#divDialogAlteraLaudo").dialog( "close" );
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
				$cor_texto = "texto_cor_vermelho";
				
			}
			
			mostraDialog(
				$mensagem,
				$cor_texto,
				"form",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
				
			);
		
		}
		
	})
	
}
/* =========================================================
 * verificaBrutoEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function verificaBrutoEntmilho(campoBruto, nomeTabela, precoEntmilho) {
	
	var valorBruto = formataNumeroSql(campoBruto.find('#bruto' + nomeTabela).val());
		
	if (valorBruto > 0) {
		
		$('#impureza' + nomeTabela).removeAttr('disabled');
		$('#chocho' + nomeTabela).removeAttr('disabled');
		$('#quirela' + nomeTabela).removeAttr('disabled');
		
		$('#secagem' + nomeTabela).removeAttr('disabled');
		$('#limpeza' + nomeTabela).removeAttr('disabled');
		$('#carga' + nomeTabela).removeAttr('disabled');
		$('#recepcao' + nomeTabela).removeAttr('disabled');
		
		$('#liquido' + nomeTabela).attr('disabled', 'enabled').val('');
		
		calculaLiquidoEntmilho(nomeTabela);
		
		pegaValoresEntmilho(nomeTabela, precoEntmilho);
	
	}
	else {
		
		$('#impureza' + nomeTabela).attr('disabled', 'enabled').val('');
		$('#chocho' + nomeTabela).attr('disabled', 'enabled').val('');
		$('#quirela' + nomeTabela).attr('disabled', 'enabled').val('');
		
		$('#secagem' + nomeTabela).attr('disabled', 'enabled').val('');
		$('#limpeza' + nomeTabela).attr('disabled', 'enabled').val('');
		$('#carga' + nomeTabela).attr('disabled', 'enabled').val('');
		$('#recepcao' + nomeTabela).attr('disabled', 'enabled').val('');
		
		$('#total' + nomeTabela).val('');
		
		$('#liquido' + nomeTabela).removeAttr('disabled').val('');
		
	}
	
}
/* =========================================================
 * pegaDadosFormularioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioEntmilho(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		laudo: $("#laudo" + nomeTabela).val(),
		tiket: $("#tiket" + nomeTabela).val(),
		placa: pegaPlacaTexto($("#placa" + nomeTabela).val().toUpperCase()),
		bruto: formataNumeroSql($("#bruto" + nomeTabela).val()),
		impureza: formataNumeroSql($("#impureza" + nomeTabela).val()),
		chocho: formataNumeroSql($("#chocho" + nomeTabela).val()),
		quirela: formataNumeroSql($("#quirela" + nomeTabela).val()),
		liquido: formataNumeroSql($("#liquido" + nomeTabela).val()),
		limpeza: formataNumeroSql($("#limpeza" + nomeTabela).val()),
		secagem: formataNumeroSql($("#secagem" + nomeTabela).val()),
		carga: formataNumeroSql($("#carga" + nomeTabela).val()),
		recepcao: formataNumeroSql($("#recepcao" + nomeTabela).val()),
		total: formataNumeroSql($("#total" + nomeTabela).val()),
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val())),
		cilo: $("#cilo" + nomeTabela).val()
	}
	
	return dados;
	
}
/* =========================================================
 * verificaLiquidoEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function verificaLiquidoEntmilho(nomeTabela) {
	
	var valorLiquido = formataNumeroSql($('#liquidoEntmilho').val());
		
	if (valorLiquido > 0) {
		
		$('#numeroProcuraCadastroEntmilhoUmidade').attr('disabled', 'enabled').val('13,10 %');
		$('#idnumeroProcuraCadastroEntmilhoUmidade').val(1);
		$('#nomeEntmilhoUmidadeMensagem').text('Desconto: 0,00 % | R$ 0,00');
		
		$('#bruto' + nomeTabela).attr('disabled', 'enabled').val('0,00 kg');
		$('#brutoEntmilho-error').text('');
		
		$('#numeroProcuraCadastroEntmilhoUmidade-error').text('');
		
		$('#numeroProcuraCadastroEntmilhoUmidadeFormGroup').removeClass('has-error');
		$('#brutoEntmilhoFormGroup').removeClass('has-error');
		
	}
	else {

		$('#numeroProcuraCadastroEntmilhoUmidade').removeAttr('disabled').val('');
		$('#idnumeroProcuraCadastroEntmilhoUmidade').val(0);
		$('#nomeEntmilhoUmidadeMensagem').text('');
		
		$('#numeroProcuraCadastroEntmilhoUmidadeFormGroup').addClass('has-error');
		$('#brutoEntmilhoFormGroup').addClass('has-error');
		
		$('#bruto' + nomeTabela).removeAttr('disabled').focus();
		
	}
	
}
/* =========================================================
 * formularioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioEntmilho(idEntmilho, nomeTabela) {
	
	var $campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $divProdutor = $("<div/>").addClass('col-xs-10 col-md-8').append($campoProdutor);
	
	var $campoTiket = campoNumeroHorizontal(
		"tiket" + nomeTabela, "Ticket",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 6, false, true, "", ""
	);
	
	var $campoData = campoDataHorizontal(
		"data" + nomeTabela, "Data",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		true, "-3", "0", null,
		'enabled'
	).removeClass("has-feedback");
	
	var $divTiketData = $("<div/>").addClass("form-horizontal");
	var $divTiket = $("<div/>").addClass('col-xs-6');
	var $divData = $("<div/>").addClass('col-xs-6');
	
	$divTiket.append($campoTiket);
	$divData.append($campoData);

	$divTiketData.append($divTiket).append($divData);
	
	var $campoPlaca = campoPlacaHorizontal(
		"placa" + nomeTabela, "Placa",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', false
	);
	
	var $campoLaudo = campoNumeroHorizontal(
		"laudo" + nomeTabela, "Laudo",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 6, false, false, "", "", "disabled"
	);
	
	var $divPlacaLaudo = $("<div/>").addClass("form-horizontal");
	var $divPlaca = $("<div/>").addClass('col-xs-6');
	var $divLaudo= $("<div/>").addClass('col-xs-6');
	
	$divPlaca.append($campoPlaca);
	$divLaudo.append($campoLaudo);

	$divPlacaLaudo.append($divPlaca)
		.append($divLaudo);
	
	var $campoBruto = campoNumeroHorizontal(
		"bruto" + nomeTabela, "Bruto",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 7, false, false, "", " kg");
	
	var $campoImpureza = campoNumeroHorizontal(
		"impureza" + nomeTabela, "Impureza",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 4, false, true, "", " %", "disabled"
	);
	
	var $campoChocho = campoNumeroHorizontal(
		"chocho" + nomeTabela, "Chocho",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 4, false, true, "", " %", "disabled");
	
	var $campoQuirela = campoNumeroHorizontal(
		"quirela" + nomeTabela, "Quirela",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 4, false, true, "", " %", "disabled");
	
	var $campoUmidade = campoSqlProcuraNumero(
		nomeTabela,
		"Umidade",
		"Umidade",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 4, false, false, "", " %", "enabled");
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + nomeTabela, "Liquido",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 8, false, false, "", " kg", "disabled");	
	
	var $divDados = $("<div/>").addClass("form-horizontal");
	var $divPeso = $("<div/>").addClass('col-xs-6');
	var $divValores = $("<div/>").addClass('col-xs-6');
	
	$divPeso.append($campoBruto)
		.append($campoImpureza)
		.append($campoChocho)
		.append($campoQuirela)
		.append($campoUmidade)
		.append($campoLiquido);
	
	var $campoCilo = campoNumeroHorizontal(
		"cilo" + nomeTabela, "Silo",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 1, false, true, "", ""
	);
	
	var $campoSecagem = campoNumeroHorizontal(
		"secagem" + nomeTabela, "Secagem",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 6, false, true, "R$ ", "", "disabled"
	);
	
	var $campoLimpeza = campoNumeroHorizontal(
		"limpeza" + nomeTabela, "Limpeza",
		 'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 6, false, true, "R$ ", "", "disabled"
		);
	
	var $campoCarga = campoNumeroHorizontal(
		"carga" + nomeTabela, "Carga",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 6, false, true, "R$ ", "", "disabled");
	
	var $campoRecepcao = campoNumeroHorizontal(
		"recepcao" + nomeTabela, "Recepção",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 6, false, true, "R$ ", "", "disabled");
	
	var $campoTotal = campoNumeroHorizontal(
		"total" + nomeTabela, "Total",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 6, false, false, "R$ ", "", "disabled");
	
	$divValores.append($campoCilo)
		.append($campoSecagem)
		.append($campoLimpeza)
		.append($campoCarga)
		.append($campoRecepcao)
		.append($campoTotal);

	$divDados.append($divPeso)
		.append($divValores);
	
	var $formTela1 = $("<div/>").addClass("form-horizontal")
		.append($divProdutor)
		.append($divTiketData)
		.append($divPlacaLaudo)
		.append($divDados);

	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append($telaObservacao);
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + nomeTabela + '2').append($formTela2);
	
	var $formulario = formularioCadastro(idEntmilho, nomeTabela, 2, 3, $tabs, 4);
	
	$campoLiquido.find('#liquido' + nomeTabela).css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
		
	$campoBruto.find('#bruto' + nomeTabela).css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
		
	$campoTotal.find('#total' + nomeTabela).css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	$campoLiquido.find('#liquido' + nomeTabela).focusout(function() {
		
		verificaLiquido(nomeTabela);
		
	});
	
	$campoLiquido.find('#liquido' + nomeTabela).on('keyup', function() {
		
		verificaLiquido(nomeTabela);
		
	});
	
	$campoImpureza.find('#impureza' + nomeTabela).on('keyup', function() {
		
		calculaLiquidoEntmilho(nomeTabela);
		
	});
	
	$campoChocho.find('#chocho' + nomeTabela).on('keyup', function() {
		
		calculaLiquidoEntmilho(nomeTabela);
		
	});
	
	$campoQuirela.find('#quirela' + nomeTabela).on('keyup', function() {
		
		calculaLiquidoEntmilho(nomeTabela);
		
	});
	
	$campoUmidade.find('#numeroProcuraCadastro' + nomeTabela + 'UmidadeDivInput span').on('change', function() {
		
		var valorBruto = formataNumeroSql($('#brutoEntmilho').val());
		
		$campoBruto.find('#bruto' + nomeTabela).removeAttr('disabled');
		
		calculaLiquidoEntmilho(nomeTabela);
		
		calculaTotalEntmilho(nomeTabela);
		
	});
	
	$campoSecagem.find('#secagem' + nomeTabela).on('keyup', function() {
		
		calculaTotalEntmilho(nomeTabela);
		
	});
	
	$campoLimpeza.find('#limpeza' + nomeTabela).on('keyup', function() {
		
		calculaTotalEntmilho(nomeTabela);
		
	});
	
	$campoCarga.find('#carga' + nomeTabela).on('keyup', function() {
		
		calculaTotalEntmilho(nomeTabela);
		
	});
	
	$campoRecepcao.find('#recepcao' + nomeTabela).on('keyup', function() {
		
		calculaTotalEntmilho(nomeTabela);
		
	});
	
	var laudo = {
		nomeTabela: nomeTabela,
		formulario: $formulario
	};
	
	eventoAcharLaudo(laudo);
	
	var precoEntmilho = {
		nomeTabela: nomeTabela,
		campoBruto: $campoBruto
	}
	
	eventoAcharPrecoEntmilho(precoEntmilho);
	
	return $formulario;
	
}
/* =========================================================
 * calculaTotalEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function calculaTotalEntmilho(nomeTabela) {
	
	var valorSecagem = formataNumeroSql($('#secagem' + nomeTabela).val());
	var valorLimpeza = formataNumeroSql($('#limpeza' + nomeTabela).val());
	var valorRecepcao = formataNumeroSql($('#recepcao' + nomeTabela).val());
	var valorCarga = formataNumeroSql($('#carga' + nomeTabela).val());
	
	var valorTotal = valorLimpeza + valorRecepcao + valorCarga + valorSecagem;
	
	$('#total' + nomeTabela).val(formataNumero(valorTotal, 2, false, true, "R$ ", ""));
	
}
/* =========================================================
 * eventoAcharPrecoEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharPrecoEntmilho(precoEntmilho) {
	
	$.ajax({
		type: "POST",
		url: "listaPrecoEntmilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		success: function(resposta) {
			
			if (resposta.status == "200") {
				
				precoEntmilho.limpeza = resposta.cadastros[0][2];
				precoEntmilho.recepcao = resposta.cadastros[1][2];
				precoEntmilho.carga = resposta.cadastros[2][2];
				
				setDadosFormularioPrecoEntmilho(precoEntmilho);
								
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
 * formataDadosEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosEntmilho(entmilho) {
	
	entmilho.data = formataData(entmilho.data);
	
	entmilho.produtor = decodeURIComponent(entmilho.produtor);
	entmilho.fazenda = decodeURIComponent(entmilho.fazenda);
	entmilho.tiket = entmilho.tiket;
	entmilho.placa = pegaPlacaMascara(entmilho.placa);
	entmilho.bruto = formataNumero(entmilho.bruto, 2, false, false, "", " kg");
	entmilho.impureza = formataNumero(entmilho.impureza, 2, false, false, "", " %");
	entmilho.valorImpureza = formataNumero(entmilho.valorImpureza, 2, true, false, "", " kg");
	entmilho.umidade = formataNumero(entmilho.umidade, 2, false, false, "", " %");
	entmilho.descontoUmidade = formataNumero(entmilho.descontoUmidade, 2, false, false, "", " %");
	entmilho.valorUmidade = formataNumero(entmilho.valorUmidade, 2, false, false, "", " kg");
	entmilho.quirela = formataNumero(entmilho.quirela, 2, false, false, "", " %");
	entmilho.valorQuirela = formataNumero(entmilho.valorQuirela, 2, false, false, "", " kg");
	entmilho.chocho = formataNumero(entmilho.chocho, 2, false, false, "", " %");
	entmilho.valorChocho = formataNumero(entmilho.valorChocho, 2, false, false, "", " kg");
	entmilho.liquido = formataNumero(entmilho.liquido, 2, false, false, "", " kg");
	entmilho.limpeza = formataNumero(entmilho.limpeza, 2, false, false, "R$ ", "");
	entmilho.secagem = formataNumero(entmilho.secagem, 2, false, false, "R$ ", "");
	entmilho.carga = formataNumero(entmilho.carga, 2, false, false, "R$ ", "");
	entmilho.recepcao = formataNumero(entmilho.recepcao, 2, false, false, "R$ ", "");
	entmilho.total = formataNumero(entmilho.total, 2, false, false, "R$ ", "");
	entmilho.obs = decodeURIComponent(entmilho.obs);
	entmilho.cilo = entmilho.cilo;
	
	if (entmilho.laudo == null) entmilho.laudo = "";
	
	entmilho["nome"] = "Laudo: " + entmilho.laudo;
	
	entmilho["alterar"] = 1;
	entmilho["remover"] = 0;
	
}
/* =========================================================
 * calculaCargaEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function calculaCargaEntmilho(nomeTabela) {
	
	var valorBruto = formataNumeroSql($('#bruto' + nomeTabela).val());
	
	var textoUmidade = $('#numeroProcuraCadastro' + nomeTabela + 'UmidadeDivInput span').text();
	
	var textoUmidadeArray = textoUmidade.split('|');
	
	if ( textoUmidadeArray.length === 2 ) {
		
		var valorUmidade = textoUmidadeArray[1].replace(' R$ ', '');
		
		var valorSecagem = formataNumeroSql(valorUmidade);
		
		var totalSecagem = (valorBruto / 1000 ) * valorSecagem;
		
	} else {
	
		var totalSecagem = 0;
		
	}	
	
	$('#secagem' + nomeTabela).val(formataNumero(totalSecagem, 2, false, true, "R$ ", ""));
	
}
/* =========================================================
 * nomeTabsEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsEntmilho() {
	
	var $nomesTabs = { 
		tabEntmilho1: "Dados",
		tabEntmilho2: "Observações"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * pegaProcuraEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraEntmilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNomeData(pagina, nomeTabela);
	
}
/* =========================================================
 * setDadosTabelaEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaEntmilho(entmilho) {
	
	formataDadosEntmilho(entmilho);
	
	var $idLinha = "entmilho_" + entmilho.id;
	
	var $urlBotao = 'mostraCadastro("' + entmilho.id + '" , "Entmilho")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar" + entmilho.id, "", "fa-eye", "0", "btn btn-primary btn-xs", "button", $urlBotao
	);
	
	var $tbody = $("#listaEntmilhoForm #tableListaEntmilho #tbodyListaEntmilho");
	
	var $tr = tr($idLinha, "");
		
	$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
	$tr.append(tabelaCelula(entmilho.data, "text-center", "texto", "tdData"));
	$tr.append(tabelaCelula(entmilho.laudo, "text-center", "texto", "tdLaudo"));
	
	setDadosColunaHide("Entmilho", entmilho, $tr);
	
	$tr.append(tabelaCelula(entmilho.bruto, "text-right", "texto", "tdBruto"));
	
	var thImpureza = $('#nomeColunastableListaEntmilho').find("#thimpureza");
	var thValorImpureza = $('#nomeColunastableListaEntmilho').find("#thvalorImpureza");
	var thUmidade = $('#nomeColunastableListaEntmilho').find("#thumidade");
	var thDescontoUmidade = $('#nomeColunastableListaEntmilho').find("#thdescontoUmidade");
	var thValorUmidade = $('#nomeColunastableListaEntmilho').find("#thvalorUmidade");
	var thQuirela = $('#nomeColunastableListaEntmilho').find("#thquirela");
	var thValorQuirela = $('#nomeColunastableListaEntmilho').find("#thvalorQuirela");
	var thChocho = $('#nomeColunastableListaEntmilho').find("#thchocho");
	var thValorChocho = $('#nomeColunastableListaEntmilho').find("#thvalorChocho");
	
	var thRecepcao = $('#nomeColunastableListaEntmilho').find("#threcepcao");
	var thLimpeza = $('#nomeColunastableListaEntmilho').find("#thlimpeza");
	var thSecagem = $('#nomeColunastableListaEntmilho').find("#thsecagem");
	var thCarga = $('#nomeColunastableListaEntmilho').find("#thcarga");
	
	var idFazenda = $('#idnomeProcuraEntmilhoFazendaProdutor').val();
	
	if (idFazenda > 0) {
	
		thImpureza.show();
		thValorImpureza.show();
		thUmidade.show();
		thDescontoUmidade.show();
		thValorUmidade.show();
		thQuirela.show();
		thValorQuirela.show();
		thChocho.show();
		thValorChocho.show();
		
		thRecepcao.show();
		thLimpeza.show();
		thSecagem.show();
		thCarga.show();
	
		$tr.append(tabelaCelula(entmilho.impureza, "text-right", "texto", "tdImpureza"));
		$tr.append(tabelaCelula(entmilho.valorImpureza, "text-right", "texto", "tdValorImpureza"));
		$tr.append(tabelaCelula(entmilho.umidade, "text-right", "texto", "tdUmidade"));
		$tr.append(tabelaCelula(entmilho.descontoUmidade, "text-right", "texto", "tdDescontoUmidade"));
		$tr.append(tabelaCelula(entmilho.valorUmidade, "text-right", "texto", "tdValorUmidade"));
		$tr.append(tabelaCelula(entmilho.quirela, "text-right", "texto", "tdQuirela"));
		$tr.append(tabelaCelula(entmilho.valorQuirela, "text-right", "texto", "tdValorQuirela"));
		$tr.append(tabelaCelula(entmilho.chocho, "text-right", "texto", "tdChocho"));
		$tr.append(tabelaCelula(entmilho.valorChocho, "text-right", "texto", "tdValorChocho"));

	}
	else {
		
		thImpureza.hide();
		thValorImpureza.hide();
		thUmidade.hide();
		thDescontoUmidade.hide();
		thValorUmidade.hide();
		thQuirela.hide();
		thValorQuirela.hide();
		thChocho.hide();
		thValorChocho.hide();
		
		thRecepcao.hide();
		thLimpeza.hide();
		thSecagem.hide();
		thCarga.hide();
		
	}
	
	$tr.append(tabelaCelula(entmilho.liquido, "text-right", "texto", "tdLiquido"));
	
	if (idFazenda > 0) {
	
		$tr.append(tabelaCelula(entmilho.recepcao, "text-right", "texto", "tdRecepcao"));
		$tr.append(tabelaCelula(entmilho.limpeza, "text-right", "texto", "tdLimpeza"));
		$tr.append(tabelaCelula(entmilho.secagem, "text-right", "texto", "tdSecagem"));
		$tr.append(tabelaCelula(entmilho.carga, "text-right", "texto", "tdCarga"));

	}
		
	$tr.append(tabelaCelula(entmilho.total, "text-right", "texto", "tdTotal"));
	
	$tbody.append($tr);
	
}
/* =========================================================
 * calculaLiquidoEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoEntmilho(nomeTabela) {
	
	var valorBruto = formataNumeroSql($('#bruto' + nomeTabela).val());
	
	var valorImpureza = formataNumeroSql($('#impureza' + nomeTabela).val());
	var valorChocho = formataNumeroSql($('#chocho' + nomeTabela).val());
	var valorQuirela = formataNumeroSql($('#quirela' + nomeTabela).val());
	
	var idUmidade = $('#idnumeroProcuraCadastro' + nomeTabela + 'Umidade').val();
	
	if (idUmidade > 0) {
	
		var textoUmidade = $('#numeroProcuraCadastro' + nomeTabela + 'UmidadeDivInput span').text();
	
		var textoUmidadeArray = textoUmidade.split('|');
		
		var descontoUmidade = textoUmidadeArray[0].replace('Desconto: ', '')
												  .replace(' %', '');
		
		var valorUmidade = formataNumeroSql(descontoUmidade);
		
	}
	else {
		
		var valorUmidade = 0;
		
	}
	
	var valorDescontoImpureza = valorBruto * valorImpureza / 100;
	var valorDescontoChocho = valorBruto * valorChocho / 100;
	var valorDescontoQuirela = valorBruto * valorQuirela / 100;
	var valorDescontoUmidade = valorBruto * valorUmidade / 100;
	
	var totalDescontos = valorDescontoImpureza + valorDescontoChocho +
						 valorDescontoQuirela + valorDescontoUmidade;
	
	var valorLiquido = Math.round(valorBruto - totalDescontos);
	
	$('#liquido' + nomeTabela).val(formataNumero(valorLiquido, 2, false, false, "", " kg"));
	
	calculaCargaEntmilho(nomeTabela);
	
}
/* =========================================================
 * eventoSalvarEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarEntmilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var entmilho = pegaDadosFormularioEntmilho(nomeTabela);
	
	var fazendaProdutor = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val(),
		nome: ""
	}
	
	var umidade = {
		id: $("#idnumeroProcuraCadastro" + nomeTabela + "Umidade").val(),
		nome: ""
	}
	
	$.ajax({
		type: "POST",
		url: "salvaEntmilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({
			entmilho: entmilho,
			fazendaProdutor: fazendaProdutor,
			umidade: umidade
		}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioEntmilho();
				
				entmilho["tipoOperacao"] = tipoOperacao;
				
				entmilho["nomeTabela"] = nomeTabela;
				
				novoFormulario(entmilho.nomeTabela, "Data", pegaPosicaoItemMenu(), "click-off");
				
				setDadosFormularioRelatorio(entmilho);
				
				$('.ui-datepicker-current-day').click();
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * limpaDadosFormularioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioEntmilho() {
	
	$("#idEntmilho").val("0");
	$("#laudoEntmilho").val("");
	$("#tiketEntmilho").val("");
	$("#placaEntmilho").val("");
	$("#brutoEntmilho").val("");
	$("#impurezaEntmilho").val("");
	$("#chochoEntmilho").val("");
	$("#quirelaEntmilho").val("");
	$("#liquidoEntmilho").val("");
	$("#limpezaEntmilho").val("");
	$("#secagemEntmilho").val("");
	$("#cargaEntmilho").val("");
	$("#recepcaoEntmilho").val("");
	$("#totalEntmilho").val("");
	$("#observacaoEntmilho").val("");
	$("#ciloEntmilho").val("");
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
	limpaCampoSqlProcura("Umidade", "numero");
	
}
/* =========================================================
 * formularioRelatorioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioEntmilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $formulario = formularioRelatorioNomeDataAdd(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		urlSearch,
		posicaoItemMenu
	);
	
	return $formulario;
	
}
/* =========================================================
 * setDadosRodapeEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeEntmilho(rodape) {
	
	var colspan = {
		inicio: 5,
		fim: 16
	};
	
	var $trRodape = tr('nomeRodapeEntmilho', '');
	
	var $th1 = th();
	var $th2 = th();
	var $th3 = th();
	var $th4 = th();
	var $th5 = th();
	var $th6 = th();
	var $th7 = th();
	var $th8 = th();
	var $th9 = th();
	var $th10 = th();
	var $th11 = th();
	var $th12 = th();
	var $th13 = th();
	var $th14 = th();
	var $th15 = th();
	var $th16 = th();
	
	var $paragrafo1 = paragrafo('text-right texto', 'texto');
	var $paragrafo2 = paragrafo('text-right texto', 'texto');
	var $paragrafo3 = paragrafo('text-right texto', 'texto');
	var $paragrafo4 = paragrafo('text-right texto', 'texto');
	var $paragrafo5 = paragrafo('text-right texto', 'texto');
	var $paragrafo6 = paragrafo('text-right texto', 'texto');
	var $paragrafo7 = paragrafo('text-right texto', 'texto');
	var $paragrafo8 = paragrafo('text-right texto', 'texto');
	var $paragrafo9 = paragrafo('text-right texto', 'texto');
	var $paragrafo10 = paragrafo('text-right texto', 'texto');
	var $paragrafo11 = paragrafo('text-right texto', 'texto');
	
	$paragrafo1.append(formataNumero(rodape[0].bruto, 2, false, false, "", " kg"));
	$paragrafo2.append(formataNumero(rodape[0].impureza, 2, false, false, "", " kg"));
	$paragrafo3.append(formataNumero(rodape[0].umidade, 2, false, false, "", " kg"));
	$paragrafo4.append(formataNumero(rodape[0].quirela, 2, false, false, "", " kg"));
	$paragrafo5.append(formataNumero(rodape[0].chocho, 2, false, false, "", " kg"));
	$paragrafo6.append(formataNumero(rodape[0].liquido, 2, false, false, "", " kg"));
	$paragrafo7.append(formataNumero(rodape[0].recepcao, 2, false, false, "R$ ", ""));
	$paragrafo8.append(formataNumero(rodape[0].limpeza, 2, false, false, "R$ ", ""));
	$paragrafo9.append(formataNumero(rodape[0].secagem, 2, false, false, "R$ ", ""));
	$paragrafo10.append(formataNumero(rodape[0].carga, 2, false, false, "R$ ", ""));
	$paragrafo11.append(formataNumero(rodape[0].total, 2, false, false, "R$ ", ""));
	
	$th2.append($paragrafo1).attr('id', 'totalBruto');
	$th3.attr('colspan', 1);
	$th4.append($paragrafo2).attr('id', 'totalImpureza');
	$th5.attr('colspan', 2);
	$th6.append($paragrafo3).attr('id', 'totalUmidade');
	$th7.attr('colspan', 1);
	$th8.append($paragrafo4).attr('id', 'totalQuirela');
	$th9.attr('colspan', 1);
	$th10.append($paragrafo5).attr('id', 'totalChocho');
	$th11.append($paragrafo6).attr('id', 'totalLiquido');
	$th12.append($paragrafo7).attr('id', 'totalRecepcao');
	$th13.append($paragrafo8).attr('id', 'totalLimpeza');
	$th14.append($paragrafo9).attr('id', 'totalSecagem');
	$th15.append($paragrafo10).attr('id', 'totalCarga');
	$th16.append($paragrafo11).attr('id', 'totalTotal');
		
	$trRodape.append($th1);
	$trRodape.append($th2);
	
	var idFazenda = $('#idnomeProcuraEntmilhoFazendaProdutor').val();
	
	if (idFazenda > 0) {
	
		$trRodape.append($th3);
		$trRodape.append($th4);
		$trRodape.append($th5);
		$trRodape.append($th6);
		$trRodape.append($th7);
		$trRodape.append($th8);
		$trRodape.append($th9);
		$trRodape.append($th10);

	}
		
	$trRodape.append($th11);
	
	if (idFazenda > 0) {
	
		$trRodape.append($th12);
		$trRodape.append($th13);
		$trRodape.append($th14);
		$trRodape.append($th15);

	}
		
	$trRodape.append($th16);
	
	$("#tfoottableListaEntmilho").append($trRodape);
	
	setDadosRodapeSaldoMilho("Entmilho", rodape, colspan, $th1);
	
	return null;
	
}
/* =========================================================
 * removeTotalTabelaEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaEntmilho(idLinha) {
	
	idLinha = idLinha.replace('#', '');
	
	var bruto = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdBruto").find('p').text();
	
	var valorImpureza = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdValorImpureza").find('p').text();
	var valorUmidade = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdValorUmidade").find('p').text();
	var valorQuirela = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdValorQuirela").find('p').text();
	var valorChocho = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdValorChocho").find('p').text();
	
	var liquido = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdLiquido").find('p').text();
	var limpeza = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdLimpeza").find('p').text();
	var secagem = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdSecagem").find('p').text();
	var carga = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdCarga").find('p').text();
	var recepcao = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdRecepcao").find('p').text();
	var total = $('#tbodyListaEntmilho').find('#' + idLinha).find("#tdTotal").find('p').text();
	
	bruto = formataNumeroSql(bruto);
	
	valorImpureza = formataNumeroSql(valorImpureza);
	valorUmidade = formataNumeroSql(valorUmidade);
	valorQuirela = formataNumeroSql(valorQuirela);
	valorChocho = formataNumeroSql(valorChocho);
	
	liquido = formataNumeroSql(liquido);
	limpeza = formataNumeroSql(limpeza);
	secagem = formataNumeroSql(secagem);
	carga = formataNumeroSql(carga);
	recepcao = formataNumeroSql(recepcao);
	total = formataNumeroSql(total);
	
	var totalBruto = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalBruto").find('p').text();
	
	var totalImpureza = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalImpureza").find('p').text();
	var totalUmidade = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalUmidade").find('p').text();
	var totalQuirela = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalQuirela").find('p').text();
	var totalChocho = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalChocho").find('p').text();	
	
	var totalLiquido = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalLiquido").find('p').text();
	var totalLimpeza = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalLimpeza").find('p').text();
	var totalSecagem = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalSecagem").find('p').text();
	var totalCarga = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalCarga").find('p').text();
	var totalRecepcao = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalRecepcao").find('p').text();
	var totalTotal = $('#tfoottableListaEntmilho')
		.find('#nomeRodapeEntmilho').find("#totalTotal").find('p').text();
	
	totalBruto = formataNumeroSql(totalBruto);
	
	totalImpureza = formataNumeroSql(totalImpureza);
	totalUmidade = formataNumeroSql(totalUmidade);
	totalQuirela = formataNumeroSql(totalQuirela);
	totalChocho = formataNumeroSql(totalChocho);
	
	totalLiquido = formataNumeroSql(totalLiquido);
	totalLimpeza = formataNumeroSql(totalLimpeza);
	totalSecagem = formataNumeroSql(totalSecagem);
	totalCarga = formataNumeroSql(totalCarga);
	totalRecepcao = formataNumeroSql(totalRecepcao);
	totalTotal = formataNumeroSql(totalTotal);
	
	totalBruto = totalBruto - bruto;
	
	totalImpureza = totalImpureza - valorImpureza;
	totalUmidade = totalUmidade - valorUmidade;
	totalQuirela = totalQuirela - valorQuirela;
	totalChocho = totalChocho - valorChocho;
	
	totalLiquido = totalLiquido - liquido;
	totalLimpeza = totalLimpeza - limpeza;
	totalSecagem = totalSecagem - secagem;
	totalCarga = totalCarga - carga;
	totalRecepcao = totalRecepcao - recepcao;
	totalTotal = totalTotal - total;
	
	if (totalLiquido > 0) {
		
		var idFazenda = $('#idnomeProcuraEntmilhoFazendaProdutor').val();
		
		if (idFazenda > 0) {
			
			removeTotalTabelaSaldoMilho("Entmilho", liquido, 0);
			
		}
		
		totalBruto = formataNumero(totalBruto, 2, false, false, "", " kg");
		
		totalImpureza = formataNumero(totalImpureza, 2, false, false, "", " kg");
		totalUmidade = formataNumero(totalUmidade, 2, false, false, "", " kg");
		totalQuirela = formataNumero(totalQuirela, 2, false, false, "", " kg");
		totalChocho = formataNumero(totalChocho, 2, false, false, "", " kg");
		
		totalLiquido = formataNumero(totalLiquido, 2, false, false, "", " kg");
		totalLimpeza = formataNumero(totalLimpeza, 2, false, false, "R$ ", "");
		totalSecagem = formataNumero(totalSecagem, 2, false, false, "R$ ", "");
		totalCarga = formataNumero(totalCarga, 2, false, false, "R$ ", "");
		totalRecepcao = formataNumero(totalRecepcao, 2, false, false, "R$ ", "");
		totalTotal = formataNumero(totalTotal, 2, false, false, "R$ ", "");
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalBruto").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalBruto").find('p').text(totalBruto);
		
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalImpureza").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalImpureza").find('p').text(totalImpureza);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalUmidade").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalUmidade").find('p').text(totalUmidade);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalQuirela").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalQuirela").find('p').text(totalQuirela);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalChocho").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalChocho").find('p').text(totalChocho);
		
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalLiquido").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalLiquido").find('p').text(totalLiquido);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalLimpeza").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalLimpeza").find('p').text(totalLimpeza);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalSecagem").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalSecagem").find('p').text(totalSecagem);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalCarga").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalCarga").find('p').text(totalCarga);
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalRecepcao").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalRecepcao").find('p').text(totalRecepcao);
		
		
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalTotal").find('p').empty();
	
		$('#tfoottableListaEntmilho')
			.find('#nomeRodapeEntmilho').find("#totalTotal").find('p').text(totalTotal);
			
	}
	else {
		
		$('#tfoottableListaEntmilho').empty();
		
		$('#nomeProcuraEntmilho').find('#spanGroupPrintEntmilhoFazendaProdutor').hide();
		
	}
	
}
/* =========================================================
 * validarFormularioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioEntmilho(tipoOperacao, nomeTabela, formulario) {
	
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
			brutoEntmilho: {
				checkLiquido: true,
				checkLaudo: true,
				checkTotal: true
			},
			nomeProcuraCadastroEntmilhoFazendaProdutor: {checkIdFazendaProdutor: true},
			numeroProcuraCadastroEntmilhoUmidade: {checkIdUmidade: true}
        },
        messages: {
			laudoEntmilho: {required: "É necessário informar o laudo!"}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarEntmilho(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarId(nomeTabela);
	
	jQuery.validator.addMethod('checkLiquido',
		function (value, element) { 		
			
			var valor = formataNumeroSql($('#liquidoEntmilho').val());
			
			if (valor > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'O valor líquido não pode ser igual a zero!'
	);
	
	jQuery.validator.addMethod('checkTotal',
		function (value, element) { 		
			
			var valor = formataNumeroSql($('#totalEntmilho').val());
			
			var valorBruto = formataNumeroSql($('#brutoEntmilho').val());
			
			if (valorBruto > 0) {
			
				if (valor > 0) {
				
					return true;
					
				}
				else {
					
					return false;
					
				}
				
			}
			else {
				return true;
			}
			
		}, 'O valor total não pode ser igual a zero!'
	);
	
	jQuery.validator.addMethod('checkLaudo',
		function (value, element) { 		
			
			var laudo = $('#laudoEntmilho').val();
			
			if (laudo > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'O laudo não pode ser igual a zero!'
	);
	
}
/* =========================================================
 * setDadosFormularioPrecoEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioPrecoEntmilho(precoEntmilho) {
	
	precoEntmilho.campoBruto.find('#bruto' + precoEntmilho.nomeTabela).focusout(function() {
		
		verificaBrutoEntmilho(precoEntmilho.campoBruto, precoEntmilho.nomeTabela, precoEntmilho);
		
	});
	
	precoEntmilho.campoBruto.find('#bruto' + precoEntmilho.nomeTabela).on('keyup', function() {
		
		verificaBrutoEntmilho(precoEntmilho.campoBruto, precoEntmilho.nomeTabela, precoEntmilho);
		
	});
		
}
/* =========================================================
 * setDadosDialogEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogEntmilho(entmilho) {
	
	formataDadosEntmilho(entmilho);
	
	var $textoProdutor = juntaTituloTexto('Produtor', entmilho.produtor);
	var $textoFazenda = juntaTituloTexto('Fazenda', entmilho.fazenda);
	
	var $textoData = juntaTituloTexto('Data', entmilho.data);
	var $textoLaudo = juntaTituloTexto('Laudo', entmilho.laudo);
	var $textoTiket = juntaTituloTexto('Ticket', entmilho.tiket);
	var $textoPlaca = juntaTituloTexto('Placa', entmilho.placa);
	var $textoCilo = juntaTituloTexto('Silo', entmilho.cilo);
	
	var $textoBruto = juntaTituloTexto('Peso Bruto', entmilho.bruto);
	var $textoImpureza = juntaTituloTexto('Impureza', entmilho.impureza);
	var $textoValorImpureza = juntaTituloTexto('Impureza Descontada', entmilho.valorImpureza);
	var $textoUmidade = juntaTituloTexto('Indice Umidade', entmilho.umidade);
	var $textoDescontoUmidade = juntaTituloTexto('Umidade', entmilho.descontoUmidade);
	var $textoValorUmidade = juntaTituloTexto('Umidade Descontada', entmilho.valorUmidade);
	var $textoQuirela = juntaTituloTexto('Quirela', entmilho.quirela);
	var $textoValorQuirela = juntaTituloTexto('Quirela Descontada', entmilho.valorQuirela);
	var $textoChocho = juntaTituloTexto('Chocho', entmilho.chocho);
	var $textoValorChocho = juntaTituloTexto('Chocho Descontado', entmilho.valorChocho);
	var $textoLiquido = juntaTituloTexto('Peso Liquido', entmilho.liquido);
	
	var $textoRecepcao = juntaTituloTexto('Recepção', entmilho.recepcao);
	var $textoLimpeza = juntaTituloTexto('Limpeza', entmilho.limpeza);
	var $textoSecagem = juntaTituloTexto('Secagem', entmilho.secagem);
	var $textoCarga = juntaTituloTexto('Carga', entmilho.carga);
	var $textoTotal = juntaTituloTexto('Total', entmilho.total);
	
	var $nomesColunas = {
		"coluna1": "Dados de Entrada",
		"coluna2": "Descontos",
		"coluna3": "Valores"
	};
	
	var $arrayDados1 = {
		"coluna1": $textoProdutor,
		"coluna2": $textoFazenda,
		"coluna3": $textoData,
		"coluna4": $textoLaudo,
		"coluna5": $textoTiket,
		"coluna6": $textoPlaca,
		"coluna7": $textoCilo,
		"coluna8": $textoBruto,
		"coluna9": $textoLiquido
	};
	
	var $arrayDados2 = {
		"coluna1": $textoImpureza,
		"coluna2": $textoValorImpureza,
		"coluna3": $textoUmidade,
		"coluna4": $textoDescontoUmidade,
		"coluna5": $textoValorUmidade,
		"coluna6": $textoQuirela,
		"coluna7": $textoValorQuirela,
		"coluna8": $textoChocho,
		"coluna9": $textoValorChocho
	};
	
	var $arrayDados3 = {
		"coluna1": $textoRecepcao,
		"coluna2": $textoLimpeza,
		"coluna3": $textoSecagem,
		"coluna4": $textoCarga,
		"coluna5": $textoTotal
	};
	
	var $idLinha = 'trEntmilhoDialog_' + entmilho.id;
	
	var $trDados = tr($idLinha, '');
	
	$trDados.append(juntaColunas($arrayDados1, 'text-left', 'texto', 'tdDados1'));
	
	$trDados.append(juntaColunas($arrayDados2, 'text-right', 'texto', 'tdDados2'));
	
	$trDados.append(juntaColunas($arrayDados3, 'text-center', 'texto', 'tdDados3'));
	
	setDadosDialogCadastro(entmilho, $nomesColunas, $trDados);
	
	if (entmilho.obs != '') {
		
		var $trObs = tr('', '')
			.append(tabelaCelula(entmilho.obs, 'text-left', 'texto', 'tdObs').attr('colspan', 3));
		
		$('#divDialog' + entmilho.nomeTabela + ' #tableDialog' + entmilho.nomeTabela + ' tbody')
			.append($trObs);
		
	}
	
}
/* =========================================================
 * pegaValoresEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaValoresEntmilho(nomeTabela, precoEntmilho) {
	
	var valorBruto = formataNumeroSql($('#bruto' + nomeTabela).val());
	
	var valorLimpeza = (valorBruto / 1000 ) * precoEntmilho.limpeza;
	var valorRecepcao = (valorBruto / 1000 ) * precoEntmilho.recepcao;
	var valorCarga = (valorBruto / 1000 ) * precoEntmilho.carga;
	
	$('#limpeza' + nomeTabela).val(formataNumero(valorLimpeza, 2, false, true, "R$ ", ""));
	$('#recepcao' + nomeTabela).val(formataNumero(valorRecepcao, 2, false, true, "R$ ", ""));
	$('#carga' + nomeTabela).val(formataNumero(valorCarga, 2, false, true, "R$ ", ""));
	
	calculaTotalEntmilho(nomeTabela);
	
}
/* =========================================================
 * setDadosFormularioEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioEntmilho(entmilho) {}
/* =========================================================
 * pegaNomeColunasEntmilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasEntmilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		data: "Data",
		laudo: "Laudo",
		produtor: "Produtor",
		fazenda: "Fazenda",
		bruto: "Peso Bruto",
		impureza: "Impureza",
		valorImpureza: "Impureza Descontada",
		umidade: "Indice Umidade",
		descontoUmidade: "Umidade",
		valorUmidade: "Umidade Descontada",
		quirela: "Quirela",
		valorQuirela: "Quirela Descontada",
		chocho: "Ardido",
		valorChocho: "Ardido Descontado",
		liquido: "Peso Líquido",
		recepcao: "Recepcao",
		limpeza: "Limpeza",
		secagem: "Secagem",
		carga: "Carga",
		total: "Valor Total"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Entrada de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosDialogSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogSaimilho(saimilho) {
	
	formataDadosSaimilho(saimilho);
	
	var $textoData = juntaTituloTexto('Data', saimilho.data);
	var $textoProdutor = juntaTituloTexto('Produtor', saimilho.produtor);
	var $textoFazenda = juntaTituloTexto('Fazenda', saimilho.fazenda);
	var $textoLiquido = juntaTituloTexto('Peso Liquido', saimilho.liquido);
	var $textoLaudo = juntaTituloTexto('Nota N.E', saimilho.laudo);
	var $textoTiket = juntaTituloTexto('Ticket', saimilho.tiket);
	var $textoPlaca = juntaTituloTexto('Placa', saimilho.placa);
	var $textoCilo = juntaTituloTexto('Silo', saimilho.cilo);
	var $textoDestino = juntaTituloTexto('Destino', saimilho.destino);
	
	var $nomesColunas = {
		"coluna1": "Saída de Milho",
		"coluna2": "Dados de Saída"
	};
	
	var $arrayDados1 = {
		"coluna1": $textoData,
		"coluna2": $textoLaudo,
		"coluna3": $textoProdutor,
		"coluna4": $textoFazenda,
		"coluna5": $textoLiquido
	};
	
	var $arrayDados2 = {
		"coluna1": $textoTiket,
		"coluna2": $textoPlaca,
		"coluna3": $textoCilo,
		"coluna4": $textoDestino
	};
	
	var $idLinha = 'trSaimilhoDialog_' + saimilho.id;
	
	var $trDados = tr($idLinha, '');
	
	$trDados.append(juntaColunas($arrayDados1, 'text-left', 'texto', 'tdDados2'));
	
	$trDados.append(juntaColunas($arrayDados2, 'text-center', 'texto', 'tdDados2'));
	
	setDadosDialogCadastro(saimilho, $nomesColunas, $trDados);
	
	if (saimilho.obs != '') {
		
		var $trObs = tr('', '')
			.append(tabelaCelula(saimilho.obs, 'text-left', 'texto', 'tdObs').attr('colspan', 2));
		
		$('#divDialog' + saimilho.nomeTabela + ' #tableDialog' + saimilho.nomeTabela + ' tbody')
			.append($trObs);
		
	}
	
	$('#botaoAlterarFormGroup').removeClass('col-xs-6');
	$('#botaoRemoverFormGroup').removeClass('col-xs-6').addClass('col-xs-12');
	
	$("#botaoAlterar").hide();
	
}
/* =========================================================
 * pegaNomeColunasSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSaimilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		data: "Data",
		laudo: "Nota N.E",
		produtor: "Produtor",
		fazenda: "Fazenda",
		placa: "Placa",
		destino: "Destino",
		liquido: "Liquido"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Saída de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * limpaDadosFormularioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioSaimilho() {
	
	$("#idSaimilho").val("0");
	$("#laudoSaimilho").val("");
	$("#tiketSaimilho").val("");
	$("#placaSaimilho").val("");
	$("#liquidoSaimilho").val("");
	$("#saldoSaimilho").val("");
	$("#observacaoSaimilho").val("");
	$("#ciloSaimilho").val("");
	$("#destinoSaimilho").val("");
	
	limpaCampoSqlProcura("Milho", "nome");
	
}
/* =========================================================
 * setDadosRodapeSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSaimilho(rodape) {
	
	var colspan = {
		inicio: 7,
		fim: 0
	};
	
	var $trRodape = tr('nomeRodapeSaimilho', '');
		
	var $th1 = th();
	var $th2 = th();
	
	var $paragrafo1 = paragrafo('text-right texto', 'texto');
	
	$paragrafo1.append(formataNumero(rodape[0].liquido, 2, false, false, "", " kg"));
	
	$th2.append($paragrafo1).attr('id', 'totalLiquido');
	
	$trRodape.append($th1);
	$trRodape.append($th2);
	
	$("#tfoottableListaSaimilho").append($trRodape);
	
	setDadosRodapeSaldoMilho("Saimilho", rodape, colspan, $th1);
		
	return null;
	
}
/* =========================================================
 * formataDadosSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSaimilho(saimilho) {
	
	saimilho.data = formataData(saimilho.data);
	saimilho.laudo = saimilho.laudo;
	saimilho.produtor = decodeURIComponent(saimilho.produtor);
	saimilho.fazenda = decodeURIComponent(saimilho.fazenda);
	saimilho.tiket = saimilho.tiket;
	saimilho.placa = pegaPlacaMascara(saimilho.placa);
	saimilho.liquido = formataNumero(saimilho.liquido, 2, false, false, "", " kg");
	saimilho.obs = decodeURIComponent(saimilho.obs);
	saimilho.cilo = saimilho.cilo;
	saimilho.destino = decodeURIComponent(saimilho.destino);
	
	if (saimilho.laudo == null) saimilho.laudo = "";
	
	saimilho["nome"] = "";
	
	saimilho["alterar"] = 1;
	saimilho["remover"] = 0;
	
}
/* =========================================================
 * removeTotalTabelaSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaSaimilho(idLinha) {
	
	idLinha = idLinha.replace('#', '');
	
	var liquido = $('#tbodyListaSaimilho').find('#' + idLinha).find("#tdLiquido").find('p').text();
	
	liquido = formataNumeroSql(liquido);
	
	var totalLiquido = $('#tfoottableListaSaimilho')
		.find('#nomeRodapeSaimilho').find("#totalLiquido").find('p').text();
	
	totalLiquido = formataNumeroSql(totalLiquido);

	totalLiquido = totalLiquido - liquido;
	
	if (totalLiquido > 0) {
		
		var idFazenda = $('#idnomeProcuraSaimilhoFazendaProdutor').val();
		
		if (idFazenda > 0) {
			
			removeTotalTabelaSaldoMilho("Saimilho", 0 ,liquido);
			
		}
		
		totalLiquido = formataNumero(totalLiquido, 2, false, false, "", " kg");
		
		$('#tfoottableListaSaimilho')
			.find('#nomeRodapeSaimilho').find("#totalLiquido").find('p').empty();
	
		$('#tfoottableListaSaimilho')
			.find('#nomeRodapeSaimilho').find("#totalLiquido").find('p').text(totalLiquido);
			
	}
	else {
		
		$('#tfoottableListaSaimilho').empty();
		
		$('#nomeProcuraSaimilho').find('#spanGroupPrintSaimilhoFazendaProdutor').hide();
		
	}
	
}
/* =========================================================
 * setDadosFormularioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioSaimilho(saimilho) {}
/* =========================================================
 * pegaDadosFormularioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioSaimilho(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		laudo: $("#laudo" + nomeTabela).val(),
		tiket: $("#tiket" + nomeTabela).val(),
		placa: pegaPlacaTexto($("#placa" + nomeTabela).val().toUpperCase()),
		liquido: formataNumeroSql($("#liquido" + nomeTabela).val()),
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val())),
		cilo: $("#cilo" + nomeTabela).val(),
		destino: encodeURIComponent( unescape($("#destino" + nomeTabela).val()))
	}
	
	return dados;
	
}
/* =========================================================
 * validarFormularioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioSaimilho(tipoOperacao, nomeTabela, formulario) {
	
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
			liquidoSaimilho: {
				required: true,
				maskNumber: true,
				checkLiquidoSaimilho: true,
				checkSaldoSaimilho: true
			},
			destinoSaimilho: {required: true},
			nomeProcuraCadastroSaimilhoMilho: {checkIdMilho: true}
        },
        messages: {
			liquidoSaimilho: {required: "É necessário informar o peso liquido!"},
			destinoSaimilho: {required: "É necessário informar o destino!"}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarSaimilho(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();

	validarId(nomeTabela);
	
	jQuery.validator.addMethod('checkLiquidoSaimilho',
		function (value, element) { 		
			
			var valor = formataNumeroSql($('#liquidoSaimilho').val());
			
			if (valor > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'O valor líquido não pode ser igual a zero!'
	);
	
	jQuery.validator.addMethod('checkSaldoSaimilho',
		function (value, element) { 		
			
			var saldo = formataNumeroSql($('#saldoSaimilho').val());
			
			if (saldo >= 0) {
				
				return true;
				
			}
			else {
				
				$('#saldoSaimilho').addClass('has-error');
				
				return false;
				
			}
			
		}, 'O peso de saída não pode ser maior que o saldo!'
	);
	
}
/* =========================================================
 * nomeTabsSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsSaimilho() {
	
	var $nomesTabs = { 
		tabSaimilho1: "Dados",
		tabSaimilho2: "Observações"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * pegaProcuraSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraSaimilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNomeData(pagina, nomeTabela);
	
}
/* =========================================================
 * calculaLiquidoSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function calculaLiquidoSaimilho(nomeTabela) {
	
	var valorLiquido = formataNumeroSql($('#liquido' + nomeTabela).val());
	
	var idMilho = $('#idnomeProcuraCadastro' + nomeTabela + 'Milho').val();
	
	if (idMilho > 0) {
		
		var textoMilho = $('#nomeProcuraCadastro' + nomeTabela + 'MilhoDivInput span').text();
		
		var textoMilhoArray = textoMilho.split(' ');
		
		var saldoInicialMilho = textoMilhoArray[1];
		
		saldoInicialMilho = formataNumeroSql(saldoInicialMilho);
		
	}
	else {
		
		var saldoInicialMilho = 0;
		
	}
	
	var saldoFinalMilho = Math.round(saldoInicialMilho - valorLiquido);
	
	$('#saldo' + nomeTabela).val(formataNumero(saldoFinalMilho, 2, true, true, "", " kg"));
	
}

function verificaLiquidoSaimilho(campoLiquido, nomeTabela) {
	
	var valorLiquido = formataNumeroSql(campoLiquido.find('#liquido' + nomeTabela).val());
		
	if (valorLiquido > 0) {
		
		calculaLiquidoSaimilho(nomeTabela);
		
	}
	
}
/* =========================================================
 * eventoSalvarSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarSaimilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var saimilho = pegaDadosFormularioSaimilho(nomeTabela);
	
	var fazendaProdutor = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "Milho").val(),
		nome: ""
	}
	
	$.ajax({
		type: "POST",
		url: "salvaSaimilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({
			saimilho: saimilho,
			fazendaProdutor: fazendaProdutor
		}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioSaimilho();
				
				saimilho["tipoOperacao"] = tipoOperacao;
				
				saimilho["nomeTabela"] = nomeTabela;
				
				novoFormulario(saimilho.nomeTabela, "Data", pegaPosicaoItemMenu(), "click-off");
				
				setDadosFormularioRelatorio(saimilho);
				
				$('.ui-datepicker-current-day').click();
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * setDadosTabelaSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSaimilho(saimilho) {
	
	formataDadosSaimilho(saimilho);
	
	var $idLinha = "saimilho_" + saimilho.id;
	
	var $urlBotao = 'mostraCadastro("' + saimilho.id + '" , "Saimilho")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar"+ saimilho.id, "", "fa-eye", "0", "btn btn-primary btn-xs", "button", $urlBotao
	);
	
	var $tbody = $("#listaSaimilhoForm #tableListaSaimilho #tbodyListaSaimilho");
	
	var $tr = tr($idLinha, "");
	
	$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
	$tr.append(tabelaCelula(saimilho.data, "text-center", "texto", "tdData"));
	$tr.append(tabelaCelula(saimilho.laudo, "text-center", "texto", "tdLaudo"));
	
	setDadosColunaHide("Saimilho", saimilho, $tr);
	
	$tr.append(tabelaCelula(saimilho.placa, "text-center", "texto", "tdPlaca"));
	$tr.append(tabelaCelula(saimilho.destino, "text-left", "texto", "tdDestino"));
	$tr.append(tabelaCelula(saimilho.liquido, "text-right", "texto", "tdLiquido"));
	
	$tbody.append($tr);
	
}
/* =========================================================
 * formularioRelatorioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioSaimilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $formulario = formularioRelatorioNomeDataAdd(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		urlSearch,
		posicaoItemMenu
	);
	
	return $formulario;
	
}
/* =========================================================
 * formularioSaimilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioSaimilho(idSaimilho, nomeTabela) {
	
	var $campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		nomeTabela,
		"Milho",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $divProdutor = $("<div/>").addClass('col-xs-10 col-md-8').append($campoProdutor);
	
	var $campoLaudo = campoNumeroHorizontal(
		"laudo" + nomeTabela, "N.E",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 6, false, false, "", "", "enabled");
	
	var $campoData = campoDataHorizontal(
		"data" + nomeTabela, "Data",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4',
		true, "0", "0", null,
		'disabled'
	).removeClass("has-feedback");
	
	var $divLaudoData = $("<div/>").addClass("form-horizontal");
	var $divLaudo = $("<div/>").addClass('col-xs-6');
	var $divData = $("<div/>").addClass('col-xs-6');
	
	$divLaudo.append($campoLaudo);
	$divData.append($campoData);

	$divLaudoData.append($divLaudo).append($divData);
	
	var $campoTiket = campoNumeroHorizontal(
		"tiket" + nomeTabela, "Ticket",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 6, false, true, "", ""
	);
	
	var $campoPlaca = campoPlacaHorizontal(
		"placa" + nomeTabela, "Placa",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', false
	);
	
	var $divTiketPlaca = $("<div/>").addClass("form-horizontal");
	var $divTiket = $("<div/>").addClass('col-xs-6');
	var $divPlaca = $("<div/>").addClass('col-xs-6');
	
	$divTiket.append($campoTiket);
	$divPlaca.append($campoPlaca);

	$divTiketPlaca.append($divTiket).append($divPlaca);
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + nomeTabela, "Liquido",
		 'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 8, false, false, "", " kg", "enabled"
	);
	
	var $campoSaldo = campoNumeroHorizontal(
		"saldo" + nomeTabela, "Saldo",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 2, 8, true, true, "", " kg", "disabled"
	);
	
	var $divDados = $("<div/>").addClass("form-horizontal");
	var $divPeso = $("<div/>").addClass('col-xs-6');
	var $divDestino = $("<div/>").addClass('col-xs-6');
	
	$divPeso.append($campoLiquido);
	$divPeso.append($campoSaldo);
	
	var $campoCilo = campoNumeroHorizontal(
		"cilo" + nomeTabela, "Silo",
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', 0, 1, false, true, "", ""
	);
	
	var $campoDestino = campoTextoHorizontal(
		'destino' + nomeTabela, 'text', 'Destino',
		'col-xs-7 col-sm-6 col-lg-8', 'col-xs-5 col-sm-6 col-lg-4', '', true, 20
	);
	
	$divDestino.append($campoCilo);
	$divDestino.append($campoDestino);
	
	$divDados.append($divPeso).append($divDestino);
	
	var $campoObs = campoTextoHorizontal("obs" + nomeTabela, "text", "Obs", 9, 2, "", false, 50);
	
	var $formTela1 = $("<div/>").addClass("form-horizontal");
	
	$formTela1.append($divProdutor);
	$formTela1.append($divLaudoData);
	$formTela1.append($divTiketPlaca);
	$formTela1.append($divDados);

	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append($telaObservacao);
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + nomeTabela + '2').append($formTela2);
	
	var $formulario = formularioCadastro(idSaimilho, nomeTabela, 2, 2, $tabs, 3);
	
	$campoLiquido.find('#liquido' + nomeTabela).css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	$campoSaldo.find('#saldo' + nomeTabela).css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	$campoLiquido.find('#liquido' + nomeTabela).focusout(function() {
		
		verificaLiquidoSaimilho($campoLiquido, nomeTabela);
		
	});
	
	$campoLiquido.find('#liquido' + nomeTabela).on('keyup', function() {
		
		verificaLiquidoSaimilho($campoLiquido, nomeTabela);
		
	});
	
	$campoProdutor.find('#nomeProcuraCadastro' + nomeTabela + 'MilhoDivInput span').on('change', function() {
		
		calculaLiquidoSaimilho(nomeTabela);
		
	});
	
	var laudo = {
		nomeTabela: nomeTabela,
		formulario: $formulario
	};
	
	eventoAcharLaudo(laudo);
	
	return $formulario;
	
}
/* =========================================================
 * eventoSalvarTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarTramilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var tramilho = pegaDadosFormularioTramilho(nomeTabela, 2);
	
	$.ajax({
		type: "POST",
		url: "salvaTramilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({tramilho: tramilho}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( resposta.mensagem);
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioTramilho();
				
				tramilho["tipoOperacao"] = tipoOperacao;
				
				tramilho["nomeTabela"] = "Entmilho";
				
				novoFormulario(tramilho.nomeTabela, "Data", pegaPosicaoItemMenu(), "click-off");
				
				setDadosFormularioRelatorio(tramilho);
				
				$('.ui-datepicker-current-day').click();
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
				
			);
		
		}
		
	})
	
}
/* =========================================================
 * formularioTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioTramilho(idTramilho, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $campoData = campoDataHorizontal(
		"data" + nomeTabela, "Data Transferência",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", null,
		'disabled'
	).removeClass("has-feedback");
	
	var $campoProdutorSaida = campoSqlProcuraTexto(
		"Produtor Saída",
		nomeTabela,
		"Milho",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $campoProdutorEntrada = campoSqlProcuraTexto(
		"Produtor Entrada",
		nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + nomeTabela, "Líquido Transferido",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 8, false, false, "", " kg"
	);
	
	var $campoSaldo = campoNumeroHorizontal(
		"saldo" + nomeTabela, "Saldo",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, true, true, "", " kg", "disabled"
	);
	
	$campoSaldo.find('#saldo' + nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	$campoLiquido.find('#liquido' + nomeTabela)
		.css("font-weight", "Bold")
		.css("font-style", "italic")
		.css("font-size", "15px");
	
	var $formTela1 = $("<div/>").attr({id: $idTela}).addClass("form-horizontal");
	
	$formTela1.append($campoProdutorSaida)
		.append($campoProdutorEntrada)
		.append($campoData)
		.append($campoLiquido)
		.append($campoSaldo);
	
	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-1")
		.append($telaObservacao);
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + nomeTabela + '2').append($formTela2);
	
	var $formulario = formularioCadastro(idTramilho, nomeTabela, 2, 2, $tabs, 3);
	
	$formulario.find("#botaoFormGroup").find('div').addClass('col-md-2 col-md-offset-4');
	
	$campoLiquido.find('#liquido' + nomeTabela).focusout(function() {
		
		verificaLiquidoSaimilho($campoLiquido, nomeTabela);
		
		setObservacaoTransferenciaMilho(nomeTabela);
		
	});
	
	$campoLiquido.find('#liquido' + nomeTabela).on('keyup', function() {
		
		verificaLiquidoSaimilho($campoLiquido, nomeTabela);
		
		setObservacaoTransferenciaMilho(nomeTabela);
		
	});
	
	$campoProdutorSaida.find('#nomeProcuraCadastro' + nomeTabela + 'MilhoDivInput span').on('change', function() {
		
		calculaLiquidoSaimilho(nomeTabela);
		
	});
	
	var laudo = {
		nomeTabela: nomeTabela,
		formulario: $formulario
	};
	
	eventoAcharLaudo(laudo);
	
	return $formulario;
	
}
/* =========================================================
 * limpaDadosFormularioTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioTramilho() {
	
	$("#liquidoTramilho").val("");
	$("#saldoTramilho").val("");
	$("#observacaoTramilho").val("");
	
	limpaCampoSqlProcura("Milho", "nome");
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
}
/* =========================================================
 * pegaNomeColunasTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasTramilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		tramilho: "Transferência de Milho"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Transferência de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setObservacaoTransferenciaMilho.js
 * http://lls.net.br/
 * ========================================================= */

function setObservacaoTransferenciaMilho(nomeTabela) {

	var dados = pegaDadosFormularioTramilho(nomeTabela, 1);

	var texto = "Transferência de " + dados.liquido +
		" do produtor " + dados.produtorSaida +
		" para o produtor " + dados.produtorEntrada + ".";

	$("#observacao" + nomeTabela).val('').val(texto);
	
}
/* =========================================================
 * nomeTabsTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsTramilho() {
	
	var $nomesTabs = { 
		tabTramilho1: "Dados",
		tabTramilho2: "Histórico"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * pegaDadosFormularioTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioTramilho(nomeTabela, tipoOperacao) {
	
	if (tipoOperacao == "1") {
		
		var dados = {
			produtorSaida: $("#nomeProcuraCadastro" + nomeTabela + "Milho").val(),
			produtorEntrada: $("#nomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val(),
			liquido: $("#liquido" + nomeTabela).val()
		}
		
	}
	else {
	
		var dados = {
			data: $("#data" + nomeTabela).datepicker("getDate"),
			idFazendaEntrada: $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val(),
			idFazendaSaida: $("#idnomeProcuraCadastro" + nomeTabela + "Milho").val(),
			liquido: formataNumeroSql($("#liquido" + nomeTabela).val()),
			obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
		}
	
	}
				
	return dados;
	
}
/* =========================================================
 * validarFormularioTramilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioTramilho(tipoOperacao, nomeTabela, formulario) {
	
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
            liquidoTramilho: {
				required: true,
				maskNumber: true,
				checkLiquidoTramilho: true,
				checkSaldoTramilho: true,
				checkFazendaTramilho: true
			},
			nomeProcuraCadastroTramilhoMilho: {checkIdMilho: true},
			nomeProcuraCadastroTramilhoFazendaProdutor: {checkIdFazendaProdutor: true},
			observacaoTramilho: {required: true}
        },
        messages: {
			liquidoTramilho: {required: "É necessário informar o peso liquido!"},
			observacaoTramilho: {required: "É necessário informar o histórico!"}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarTramilho(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarId(nomeTabela);
	
	jQuery.validator.addMethod('checkLiquidoTramilho',
		function (value, element) { 		
			
			var valor = formataNumeroSql($('#liquidoTramilho').val());
			
			if (valor > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'O valor líquido não pode ser igual a zero!'
	);
	
	jQuery.validator.addMethod('checkSaldoTramilho',
		function (value, element) { 		
			
			var saldo = formataNumeroSql($('#saldoTramilho').val());
			
			if (saldo >= 0) {
				
				return true;
				
			}
			else {
				
				$('#saldoSaimilho').addClass('has-error');
				
				return false;
				
			}
			
		}, 'O peso de saída não pode ser maior que o saldo!'
	);
	
	jQuery.validator.addMethod('checkFazendaTramilho',
		function (value, element) { 		
			
			var idFazendaEntrada = $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val();
			var idFazendaSaida = $("#idnomeProcuraCadastro" + nomeTabela + "Milho").val();
			
			if (idFazendaEntrada != idFazendaSaida) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'A fazenda de saída não pode ser igual a fazenda de entrada!'
	);
	
}
/* =========================================================
 * formularioBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioBaixamilho(id, nomeTabela) {
	
	var $campoOculto = campoOculto("idServicomilho", id);
	
	var $campoProdutor = campoTextoHorizontal(
		"produtor" + nomeTabela,
		'text',
		'Produtor',
		'col-xs-9 col-md-6' , 'col-xs-3', '', false, 50);
		
	var $campoFazenda = campoTextoHorizontal(
		"fazenda" + nomeTabela,
		'text',
		'Fazenda',
		'col-xs-9 col-md-6' , 'col-xs-3', '', false, 50);
	
	var $campoServico = campoTextoHorizontal(
		"servico" + nomeTabela,
		'text',
		'Serviço',
		'col-xs-9 col-md-6' , 'col-xs-3', '', false, 50);
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + nomeTabela,
		"Líquido",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "", " kg", 'disabled'
	);
	
	var $campoTotal = campoNumeroHorizontal(
		"total" + nomeTabela,
		"Total",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "R$ ", "", 'disabled'
	);
	
	var $campoPago = campoNumeroHorizontal(
		"pago" + nomeTabela,
		"Pago",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, true, "R$ ", "", 'disabled'
	);
	
	var $campoValor = campoNumeroHorizontal(
		"valor" + nomeTabela,
		"Valor",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "R$ ", "", 'enabled'
	);
	
	var $campoData = campoDataHorizontal(
		"data" + nomeTabela,
		"Data",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", null,
		'disabled'
	).removeClass("has-feedback");
	
	$campoProdutor.find('#produtor' + nomeTabela).attr('disabled', 'disabled');
	$campoFazenda.find('#fazenda' + nomeTabela).attr('disabled', 'disabled');
	$campoServico.find('#servico' + nomeTabela).attr('disabled', 'disabled');
	
	var $formTela1 = $("<div/>").addClass("form-horizontal");
	
	$formTela1.append($campoOculto)
		.append($campoData)
		.append($campoProdutor)
		.append($campoFazenda)
		.append($campoServico)
		.append($campoLiquido)
		.append($campoTotal)
		.append($campoPago)
		.append($campoValor);
	
	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append($telaObservacao);
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + nomeTabela + '2').append($formTela2);
	
	$('#divDialogVisualizaServicomilho').empty();
	
	$('#divDialogVisualizaServicomilho').remove();
	
	$('#divDialogVisualizaServicomilho').dialog( "close" );
	
	var $formulario = formularioCadastro(0, nomeTabela, 3, 3, $tabs, 4);

	var servicoBaixamilho = {
		id: id,
		nomeTabela: nomeTabela,
		formulario: $formulario
	}

	eventoAcharServicoBaixamilho(servicoBaixamilho);

	return $formulario;
	
}
/* =========================================================
 * verificaBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function verificaBaixamilho(totalValor, totalPago) {
	
	var tipoServico = $("#tipoServicomilho").val();
	
	if (tipoServico == 0 ) {
		
		if (totalValor == 0) {
		
			$('#nomeProcuraServicomilho').find('#spanGroupPrintServicomilhoFazendaProdutor').hide();
		
		}
		else {
		
			$('#nomeProcuraServicomilho').find('#spanGroupPrintServicomilhoFazendaProdutor').show();
		
		}
	}
	
	if (tipoServico == 1 ) {
		
		if (totalPago == 0) {
		
			$('#nomeProcuraServicomilho').find('#spanGroupPrintServicomilhoFazendaProdutor').hide();
		
		}
		else {
		
			$('#nomeProcuraServicomilho').find('#spanGroupPrintServicomilhoFazendaProdutor').show();
		
		}
	}
	
}
/* =========================================================
 * setDadosFormularioBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioBaixamilho(baixamilho) {

	var idServico = $("#idServicomilho").val();
	
	var tdPago = $('#tbodyListaServicomilho').find("#servicomilho_" + idServico).find('#tdPago').find('p');
	var tdValor = $('#tbodyListaServicomilho').find("#servicomilho_" + idServico).find('#tdValor').find('p');
	
	var pago = tdPago.text();
	var valor = tdValor.text();
	
	var valorBaixa = $("#divDialogAlteraBaixamilho").find("#valorBaixamilho").val();
	
	valorBaixa = formataNumeroSql(valorBaixa);
	
	pago = formataNumeroSql(pago);
	valor = formataNumeroSql(valor);
	
	pago = pago + valorBaixa;
	valor = valor - valorBaixa;
	
	if (pago == 0) {
		
		tdPago.removeClass('texto_cor_verde').addClass('texto');
		
	}
	else {
		
		tdPago.removeClass('texto').addClass('texto_cor_verde');
		
	}
	
	if (valor == 0) {
		
		tdValor.removeClass('texto_cor_vermelho').addClass('texto');
		
	}
	
	pago = formataNumero(pago, 2, true, true, "R$ ", "");
	valor = formataNumero(valor, 2, true, true, "R$ ", "");
	
	tdPago.empty();
	tdValor.empty();
	
	tdPago.append(pago);
	tdValor.append(valor);
	
	var totalPago = $("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').text();
	var totalValor = $("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').text();
	
	totalPago = formataNumeroSql(totalPago);
	totalValor = formataNumeroSql(totalValor);
	
	totalPago = totalPago + valorBaixa;
	totalValor = totalValor - valorBaixa;
	
	verificaBaixamilho(totalValor, totalPago);
	
	totalPago = formataNumero(totalPago, 2, true, true, "R$ ", "");
	totalValor = formataNumero(totalValor, 2, true, true, "R$ ", "");
	
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').empty();
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').empty();
	
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').text(totalPago);
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').text(totalValor);
	
	limpaDadosFormularioBaixamilho();
	
	$("#divDialogAlteraBaixamilho").dialog( "close" );
	
}
/* =========================================================
 * pegaProcuraBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraBaixamilho(pagina, nomeTabela) {}
/* =========================================================
 * eventoAcharServicoBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharServicoBaixamilho(servicoBaixamilho) {
	
	$.ajax({
		type: "POST",
		url: "baixaServicomilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({"id": servicoBaixamilho.id}),
		success: function(result) {
			
			if (result.status == "200") {
				
				servicoBaixamilho.baixa = result;
				
				setDadosFormularioServicoBaixamilho(servicoBaixamilho);
								
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
 * pegaNomeColunasBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasBaixamilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Excluir",
		data: "Data",
		valor: "Valor",
		obs: "Observações"
	};
	
	if (tipo == 3) {
		
		nomesColunas = "Baixa de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * formataDadosBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosBaixamilho(baixamilho) {
	
	baixamilho.obs = decodeURIComponent(baixamilho.obs);
	
	baixamilho.data = formataData(baixamilho.data);
	baixamilho.valor = formataNumero(baixamilho.valor, 2, true, true, "R$ ", "");
	
	baixamilho["nome"] = "Data " + baixamilho.data + " " + baixamilho.valor;
	
	baixamilho["texto"] = baixamilho.nome;
	
}
/* =========================================================
 * eventoSalvarBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarBaixamilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var baixamilho = pegaDadosFormularioBaixamilho(nomeTabela);
	
	var servico = {
		id: $("#idServicomilho").val(),
		nome: ""
	}
	
	$.ajax({
		type: "POST",
		url: "salvaBaixamilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({
			baixamilho: baixamilho,
			servico: servico
		}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				baixamilho["tipoOperacao"] = tipoOperacao;
				
				baixamilho["nomeTabela"] = "Baixamilho";
				
				setDadosFormularioBaixamilho(baixamilho);
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * validarFormularioBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioBaixamilho(tipoOperacao, nomeTabela, formulario) {
	
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
			valorBaixamilho: {
				required: true,
				maskNumber: true,
				checkValor: true
			}
        },
        messages: {
			valorBaixamilho: {required: "É necessário informar o valor!"}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarBaixamilho(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	jQuery.validator.addMethod('checkValor',
		function (value, element) { 		
			
			var total = formataNumeroSql($('#totalBaixamilho').val());
			var pago = formataNumeroSql($('#pagoBaixamilho').val());
			var valor = formataNumeroSql($('#valorBaixamilho').val());
			
			var maxValor = total - pago;
			
			maxValor = maxValor.toFixed(2);
			
			if (valor > 0 && valor <= maxValor) {
				
				return true;
				
			}
			else {
				
				$('#valorBaixamilho').addClass('has-error');
				
				return false;
				
			}
				
		}, 'Valor não permitido!'
	);
	
}
/* =========================================================
 * setDadosFormularioServicoBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioServicoBaixamilho(servicoBaixamilho) {
	
	servicoBaixamilho.baixa.produtor = decodeURIComponent(servicoBaixamilho.baixa.produtor);
	servicoBaixamilho.baixa.fazenda = decodeURIComponent(servicoBaixamilho.baixa.fazenda);
	servicoBaixamilho.baixa.servico = decodeURIComponent(servicoBaixamilho.baixa.servico);
	servicoBaixamilho.baixa.obs = decodeURIComponent(servicoBaixamilho.baixa.obs);
	
	servicoBaixamilho.baixa.data = formataData(servicoBaixamilho.baixa.data);
	servicoBaixamilho.baixa.liquido = formataNumero(servicoBaixamilho.baixa.liquido, 2, true, true, "", " kg");
	servicoBaixamilho.baixa.total = formataNumero(servicoBaixamilho.baixa.total, 2, true, true, "R$ ", "");
	servicoBaixamilho.baixa.pago = formataNumero(servicoBaixamilho.baixa.pago, 2, true, true, "R$ ", "");
	servicoBaixamilho.baixa.valor = formataNumero(servicoBaixamilho.baixa.valor, 2, true, true, "R$ ", "");
	
	servicoBaixamilho.formulario.find("#data" + servicoBaixamilho.nomeTabela).datepicker('setDate', formataData(servicoBaixamilho.baixa.data));
	servicoBaixamilho.formulario.find('#produtor' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.produtor);
	servicoBaixamilho.formulario.find('#fazenda' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.fazenda);
	servicoBaixamilho.formulario.find('#servico' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.servico);
	servicoBaixamilho.formulario.find('#liquido' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.liquido);
	servicoBaixamilho.formulario.find('#total' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.total);
	servicoBaixamilho.formulario.find('#pago' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.pago);
	servicoBaixamilho.formulario.find('#valor' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.valor);
	servicoBaixamilho.formulario.find('#observacao' + servicoBaixamilho.nomeTabela).val(servicoBaixamilho.baixa.obs);
	
}
/* =========================================================
 * limpaDadosFormularioBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioBaixamilho() {
	
	$("#idBaixamilho").val("0");
	$("#idServicomilho").val("0");
	$("#produtorBaixamilho").val("");
	$("#fazendaBaixamilho").val("");
	$("#servicoBaixamilho").val("");
	$("#liquidoBaixamilho").val("");
	$("#totalBaixamilho").val("");
	$("#pagoBaixamilho").val("");
	$("#valorBaixamilho").val("");
	
}
/* =========================================================
 * removeBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeBaixamilho(idBaixamilho, nome) {
	
	removeCadastroTabela('Baixamilho', idBaixamilho, nome);
	
}
/* =========================================================
 * setDadosDialogBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogBaixamilho(lancamento) {
	
	formataDadosBaixamilho(lancamento);
	
	var $textoProdutor = juntaTituloTexto('Produtor', lancamento.produtor);
	var $textoFazenda = juntaTituloTexto('Fazenda', lancamento.fazenda);
	var $textoServico = juntaTituloTexto('Serviço', lancamento.servico);
	
	var $textoData = juntaTituloTexto('Data', lancamento.data);
	var $textoTotal = juntaTituloTexto('Total', lancamento.total);
	var $textoPago = juntaTituloTexto('Pago', lancamento.pago);
	var $textoValor = juntaTituloTexto('Valor', lancamento.valor);
	
	var $nomesColunas = {
		"coluna1": "Dados do Serviço",
		"coluna2": "Valores"
	};
	
	var $arrayDados1 = {
		"coluna1": $textoProdutor,
		"coluna2": $textoFazenda,
		"coluna3": $textoServico
	};
	
	var $arrayDados2 = {
		"coluna1": $textoData,
		"coluna2": $textoTotal,
		"coluna3": $textoPago,
		"coluna4": $textoValor
	};
	
	var $idLinha = 'trBaixamilhoDialog_' + lancamento.id;
	
	var $trDados = tr($idLinha, '');
	
	$trDados.append(juntaColunas($arrayDados1, 'text-left', 'texto', 'tdDados1'));
	
	$trDados.append(juntaColunas($arrayDados2, 'text-right', 'texto', 'tdDados2'));
	
	setDadosDialogCadastro(lancamento, $nomesColunas, $trDados);
	
}
/* =========================================================
 * setLinhaTabelaBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaBaixamilho(baixamilho, tbody, arrayColunaBotoes) {
	
	arrayColunaBotoes = { 
		"remove": "remove" + baixamilho.nomeTabela
	};
	
	formataDadosBaixamilho(baixamilho);
	
	var tr = setIdTabelaCadastro(baixamilho, tbody);
		
	if (arrayColunaBotoes != null) {
		
		tr.append(tabelaBotoes(baixamilho.id, baixamilho.texto, arrayColunaBotoes));
		
	}
	
	tr.append(tabelaCelula(baixamilho.data, 'text-center', 'texto', 'tdData'));
	tr.append(tabelaCelula(baixamilho.valor, 'text-center', 'texto', 'tdValor'));
	tr.append(tabelaCelula(baixamilho.obs, 'text-left', 'texto', 'tdObs'));
	
	tbody.append(tr);
	
}
/* =========================================================
 * pegaDadosFormularioBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioBaixamilho(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		valor: formataNumeroSql($("#valor" + nomeTabela).val()),
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return dados;
	
}
/* =========================================================
 * nomeTabsBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsBaixamilho() {
	
	var $nomesTabs = { 
		tabBaixamilho1: "Dados",
		tabBaixamilho2: "Observações"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * setDadosRodapeBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeBaixamilho(rodape) {}
/* =========================================================
 * setDadosTabelaBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaBaixamilho(baixamilho) {}
/* =========================================================
 * removeTotalTabelaBaixamilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaBaixamilho(idLinha) {
	
	idLinha = idLinha.replace('#', '');
	
	id = idLinha.replace('baixamilho_', '');
	
	var total = $('#tdDados2').find("#coluna3").text().replace('Total: ', '');
	var pago = $("#tdDados2").find("#coluna4").text().replace('Pago: ', '');
	var valor = $('#tdDados2').find("#coluna5").text().replace('Valor: ', '');
	var valorBaixa = $("#tbodyDialogBaixamilho").find('#' + idLinha).find("#tdValor").find('p').text();
	
	total = formataNumeroSql(total);
	pago = formataNumeroSql(pago);
	valor = formataNumeroSql(valor);
	valorBaixa = formataNumeroSql(valorBaixa);
	
	pago = pago - valorBaixa;
	valor = valor + valorBaixa;
	
	var valorPago = pago;
	var valorRestante = valor;
	
	if (pago == 0) {
	
		$('#divTabelaDialogBaixamilho').hide();
		
		$('#tdDados1').find("#coluna5").empty();
		$('#tdDados1').find("#coluna5").append(juntaTituloTexto('Pago', 'Não'));
		
	}
	
	pago = formataNumero(pago, 2, false, false, "R$ ", "");
	valor = formataNumero(valor, 2, false, false, "R$ ", "");
	
	$('#tdDados2').find("#coluna4").empty();
	$('#tdDados2').find("#coluna5").empty();
	
	$('#tdDados2').find("#coluna4").append(juntaTituloTexto('Pago', pago));
	$('#tdDados2').find("#coluna5").append(juntaTituloTexto('Valor', valor));
	
	var $idServico = $('#idServicomilho').val();
	
	var tdPago = $('#tbodyListaServicomilho').find("#servicomilho_" + $idServico).find('#tdPago').find('p');
	var tdValor = $('#tbodyListaServicomilho').find("#servicomilho_" + $idServico).find('#tdValor').find('p');
	
	tdValor.empty();
	tdPago.empty();
	
	if (valorPago == 0) {
		
		tdPago.removeClass('texto_cor_verde').addClass('texto');
		
	}
	else {
		
		tdPago.removeClass('texto').addClass('texto_cor_verde');
		
	}
	
	if (valorRestante == 0) {
		
		tdValor.removeClass('texto_cor_vermelho').addClass('texto');
		
	}
	else {
		
		tdValor.removeClass('texto').addClass('texto_cor_vermelho');
		
	}
	
	tdPago.append(pago);
	tdValor.append(valor);
	
	var totalPago = $("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').text();
	var totalValor = $("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').text();
	
	totalPago = formataNumeroSql(totalPago);
	totalValor = formataNumeroSql(totalValor);
	
	totalPago = totalPago - valorBaixa;
	totalValor = totalValor + valorBaixa;
	
	verificaBaixamilho(totalValor, totalPago);
	
	totalPago = formataNumero(totalPago, 2, false, false, "R$ ", "");
	totalValor = formataNumero(totalValor, 2, false, false, "R$ ", "");
	
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').empty();
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').empty();
	
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#pago').find('p').text(totalPago);
	$("#tfoottableListaServicomilho").find("#nomeRodapeServicomilho").find('#valor').find('p').text(totalValor);

	$("#divDialogVisualizaServicomilho").dialog( "close" );

}
/* =========================================================
 * pegaDadosFormularioFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioFaturamilho(nomeTabela, tipoOperacao) {
	
	var dados = {
		nome: '',
		pagina: 0,
		linhas: 0,
		idProdutor: 0,
		idFazenda: $("#idnomeProcura" + nomeTabela + "Milho").val(),
		dataInicial: $("#dataInicial" + nomeTabela).datepicker("getDate"),
		dataFinal: $("#dataFinal" + nomeTabela).datepicker("getDate")
	}
	
	return dados;
	
	
}
/* =========================================================
 * validarFormularioFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioFaturamilho(tipoOperacao, nomeTabela, formulario) {}
/* =========================================================
 * eventoSalvarFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarFaturamilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var faturamilho = pegaDadosFormularioFaturamilho(nomeTabela, 2);
	
	$.ajax({
		type: "POST",
		url: "executa" + nomeTabela,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(faturamilho),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( resposta.mensagem );
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioFaturamilho();
				
				faturamilho["nomeTabela"] = "Movimentomilho";
				
				novoFormulario(faturamilho.nomeTabela, "Data", pegaPosicaoItemMenu(), "click-off");
				
				setDadosFormularioRelatorio(faturamilho);
				
				$('#dataInicial' + faturamilho.nomeTabela).datepicker( "option", "maxDate", faturamilho.dataFinal );
				$('#dataInicial' + faturamilho.nomeTabela).datepicker("setDate", faturamilho.dataInicial);
				
				$('#dataFinal' + faturamilho.nomeTabela).datepicker( "option", "minDate", faturamilho.dataInicial );
				$('#dataFinal' + faturamilho.nomeTabela).datepicker("setDate", faturamilho.dataFinal);
				
				$('.ui-datepicker-current-day').click();
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
				$cor_texto = "texto_cor_vermelho";
				
			}
			
			mostraDialog(
				$mensagem,
				$cor_texto,
				"form",
				tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
			
		},
		error: function(jqXHR, exception) {
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
				
			);
		
		}
		
	})
	
}
/* =========================================================
 * limpaDadosFormularioFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioFaturamilho() {
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
}
/* =========================================================
 * formularioFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioFaturamilho(idFaturamilho, nomeTabela) {
	
	var nomeTabelaProcura = "Milho";
	
	var nomeTabelas = nomeTabela + nomeTabelaProcura;
	
	var $formularioRelatorio = formularioRelatorioNomeData(
		nomeTabela,
		nomeTabelaProcura,
		"Produtor",
		"",
		""
	);
	
	var $formulario = formularioCadastro(idFaturamilho, nomeTabela, 3, 4, $formularioRelatorio);
	
	$formulario.find("#botaoFormGroup").find('div').addClass('col-md-2 col-md-offset-5');
	
	$formulario.submit(function(event) {
		
		event.preventDefault();
		
		eventoSalvarFaturamilho(1, nomeTabela);
		
	});
	
	$formularioRelatorio.find('#spanGroupClear' + nomeTabelas).hide();
	$formularioRelatorio.find('#spanGroupPrint' + nomeTabelas).hide();
	
	return $formulario;
	
}
/* =========================================================
 * pegaNomeColunasFaturamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasFaturamilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		faturamilho: "Faturamento de Milho"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Faturamento de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * calculaValorServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function calculaValorServicomilho(nomeTabela) {
	
	var valorLiquido = formataNumeroSql($('#liquido' + nomeTabela).val());
	
	var idServicomilho = $('#idnomeProcuraCadastro' + nomeTabela + 'Preco').val();
	
	if (idServicomilho > 0 && valorLiquido > 0) {
		
		var textoServicomilho = $('#nomeProcuraCadastro' + nomeTabela + 'PrecoDivInput span').text();
		
		var textoServicomilhoArray = textoServicomilho.split(' ');
		
		var precoServicomilho = textoServicomilhoArray[1];
		
		precoServicomilho = formataNumeroSql(precoServicomilho);
		
	}
	else {
		
		var precoServicomilho = 0;
		
	}
	
	var valorServicomilho = precoServicomilho * (valorLiquido / 1000);
	
	$('#valor' + nomeTabela).val(formataNumero(valorServicomilho, 2, false, false, "R$ ", ""));
	
}
/* =========================================================
 * setDadosFormularioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioServicomilho(servicomilho) {
	
	formataDadosServicomilho(servicomilho);
	
	$('#divDialogAlteraServicomilho').empty();
	$('#divDialogAlteraServicomilho').remove();
	
	var formulario = formularioAlteraServicomilho(servicomilho);
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, servicomilho.nomeTabela), 'Altera' + servicomilho.nomeTabela);
	
	formulario.find('#idServicomilho').val(servicomilho.id);
	formulario.find('#dataServicomilho').val(servicomilho.data);
	formulario.find('#liquidoServicomilho').val(servicomilho.liquido).attr('disabled', 'disabled');
	formulario.find('#valorServicomilho').val(servicomilho.valor);
	formulario.find('#observacaoServicomilho').val(servicomilho.obs);
	formulario.find('#produtorServicomilho').val(servicomilho.produtor).attr('disabled', 'disabled');
	formulario.find('#servicoServicomilho').val(servicomilho.servico).attr('disabled', 'disabled');
	formulario.find('#idnomeProcuraCadastroServicomilhoFazendaProdutor').val(servicomilho.idFazenda);
	formulario.find('#idnomeProcuraCadastroServicomilhoPreco').val(servicomilho.idServico);

	formulario.find('#valorServicomilho').focus();

}
/* =========================================================
 * limpaDadosFormularioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioServicomilho() {
	
	$("#idServicomilho").val("0");
	$("#liquidoServicomilho").val("");
	$("#valorServicomilho").val("");
	
	limpaCampoSqlProcura("FazendaProdutor", "nome");
	
	limpaCampoSqlProcura("Preco", "nome");
	
}
/* =========================================================
 * formularioRelatorioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioServicomilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $formulario = formularioRelatorioNomeDataTipo(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		urlSearch,
		posicaoItemMenu,
		1
	);
	
	return $formulario;
					
}
/* =========================================================
 * formularioAlteraServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioAlteraServicomilho(servicomilho) {
	
	var idFazenda = "idnomeProcuraCadastro" + servicomilho.nomeTabela + "FazendaProdutor";
	var idServico = "idnomeProcuraCadastro" + servicomilho.nomeTabela + "Preco";
	
	var $campoFazendaOculto = campoOculto(idFazenda, servicomilho.idFazenda);
	var $campoServicoOculto = campoOculto(idServico, servicomilho.idServico);
	
	var $campoProdutor = campoTextoHorizontal(
		"produtor" + servicomilho.nomeTabela,
		'text',
		'Produtor',
		'col-xs-9 col-md-6' , 'col-xs-3', '', false, 50);
	
	var $campoServico = campoTextoHorizontal(
		"servico" + servicomilho.nomeTabela,
		'text',
		'Serviço',
		'col-xs-9 col-md-6' , 'col-xs-3', '', false, 50);
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + servicomilho.nomeTabela,
		"Líquido",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "", " kg"
	);
	
	var $campoValor = campoNumeroHorizontal(
		"valor" + servicomilho.nomeTabela,
		"Valor",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "R$ ", ""
	);
	
	var $campoData = campoDataHorizontal(
		"data" + servicomilho.nomeTabela,
		"Data",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", servicomilho.data,
		'disabled'
	).removeClass("has-feedback");
	
	var $formTela1 = $("<div/>").addClass("form-horizontal");
	
	$formTela1.append($campoFazendaOculto);
	$formTela1.append($campoServicoOculto);
	$formTela1.append($campoData);
	$formTela1.append($campoProdutor);
	$formTela1.append($campoServico);
	$formTela1.append($campoLiquido);
	$formTela1.append($campoValor);

	var $telaObservacao = telaObservacao(servicomilho.nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append($telaObservacao);
	
	var $tabs = divTabs(servicomilho.nomeTabela, eval ('nomeTabs' + servicomilho.nomeTabela + '()'));
	
	$tabs.find('#tab' + servicomilho.nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + servicomilho.nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + servicomilho.nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + servicomilho.nomeTabela + '2').append($formTela2);
	
	var $formulario = formularioCadastro(servicomilho.id, servicomilho.nomeTabela, 2, 2, $tabs, 4);
	
	return $formulario;
	
}
/* =========================================================
 * eventoSalvarServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarServicomilho(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var servicomilho = pegaDadosFormularioServicomilho(nomeTabela);
	
	var fazendaProdutor = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "FazendaProdutor").val(),
		nome: ""
	}
	
	var preco = {
		id: $("#idnomeProcuraCadastro" + nomeTabela + "Preco").val(),
		nome: ""
	}
	
	$.ajax({
		type: "POST",
		url: "salvaServicomilho",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({
			servicomilho: servicomilho,
			fazendaProdutor: fazendaProdutor,
			preco: preco
		}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioServicomilho();
								
				servicomilho["tipoOperacao"] = tipoOperacao;
				
				servicomilho["nomeTabela"] = nomeTabela;
				
				novoFormulario(servicomilho.nomeTabela, "Data", pegaPosicaoItemMenu(), "click-off");
				
				setDadosFormularioRelatorio(servicomilho);
				
				$('.ui-datepicker-current-day').click();
				
			}
			else {
				
				animacao("botao" + nomeTabela, "fa-check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "fa-check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * setDadosTabelaServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaServicomilho(servicomilho) {
	
	var pago = servicomilho.pago;
	var valor = servicomilho.valor;
	
	formataDadosServicomilho(servicomilho);
	
	var $idLinha = "servicomilho_" + servicomilho.id;
	
	var $urlBotaoVisualizar = 'mostraCadastro("' + servicomilho.id + '" , "Servicomilho")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar"+ servicomilho.id, "", "fa-eye", "0", "btn btn-primary btn-xs", "button", $urlBotaoVisualizar
	);
	
	var $tbody = $("#listaServicomilhoForm #tableListaServicomilho #tbodyListaServicomilho");
	
	if (servicomilho.tipoOperacao == 0) {
		
		var $tr = tr($idLinha, "");
		
		$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotaoVisualizar"));
		
		setDadosColunaHide("Servicomilho", servicomilho, $tr);
		
		$tr.append(tabelaCelula(servicomilho.data, "text-center", "texto", "tdData"));
		$tr.append(tabelaCelula(servicomilho.servico, "text-left", "texto", "tdServico"));
		$tr.append(tabelaCelula(servicomilho.total, "text-right", "texto", "tdTotal"));
		
		if (pago > 0) { 
		
			$tr.append(tabelaCelula(servicomilho.pago, "text-right", "texto_cor_verde", "tdPago"));
			
		}
		else {
			
			$tr.append(tabelaCelula(servicomilho.pago, "text-right", "texto", "tdPago"));
		
		}
		
		if (valor > 0) { 
		
			$tr.append(tabelaCelula(servicomilho.valor, "text-right", "texto_cor_vermelho", "tdValor"));
			
		}
		else {
			
			$tr.append(tabelaCelula(servicomilho.valor, "text-right", "texto", "tdValor"));
		
		}
		
		$tbody.append($tr);
		
	}
	
}
/* =========================================================
 * formataDadosServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosServicomilho(servicomilho) {
	
	servicomilho.produtor = decodeURIComponent(servicomilho.produtor);
	servicomilho.fazenda = decodeURIComponent(servicomilho.fazenda);
	servicomilho.obs = decodeURIComponent(servicomilho.obs);
	
	var valorPago = servicomilho.pago;
	var valorRestante = servicomilho.valor;
	
	servicomilho.data = formataData(servicomilho.data);
	servicomilho.liquido = formataNumero(servicomilho.liquido, 2, false, true, "", " kg");
	servicomilho.total = formataNumero(servicomilho.total, 2, true, true, "R$ ", "");
	servicomilho.pago = formataNumero(servicomilho.pago, 2, true, true, "R$ ", "");
	servicomilho.valor = formataNumero(servicomilho.valor, 2, true, true, "R$ ", "");
	
	var $fechado = "Não";
	
	if (servicomilho.fechado) {
		
		$fechado = "Sim";
		
	}
	
	servicomilho.fechado = $fechado;
	
	var $automatico = "Não";
	
	if (servicomilho.automatico) {
		
		$automatico = "Sim";
		
	}
	
	servicomilho.automatico = $automatico;

	servicomilho["nome"] = "Serviço: " + servicomilho.servico + " " + servicomilho.valor;
	
	servicomilho["nomeTabela2"] = "Baixamilho";
	
	servicomilho["valorPago"] = valorPago;
	servicomilho["valorRestante"] = valorRestante;

	servicomilho["alterar"] = 0;
	servicomilho["baixar"] = 0;
	servicomilho["remover"] = 0;

}
/* =========================================================
 * setDadosDialogServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogServicomilho(servicomilho) {
	
	formataDadosServicomilho(servicomilho);
	
	var $textoProdutor = juntaTituloTexto('Produtor', servicomilho.produtor);
	var $textoFazenda = juntaTituloTexto('Fazenda', servicomilho.fazenda);
	var $textoServico = juntaTituloTexto('Serviço', servicomilho.servico);
	var $textoAutomatico = juntaTituloTexto('Automático', servicomilho.automatico);
	var $textoFechado = juntaTituloTexto('Pago', servicomilho.fechado);
	
	var $textoData = juntaTituloTexto('Data', servicomilho.data);
	var $textoLiquido = juntaTituloTexto('Líquido', servicomilho.liquido);
	var $textoTotal = juntaTituloTexto('Total', servicomilho.total);
	var $textoPago = juntaTituloTexto('Pago', servicomilho.pago);
	var $textoValor = juntaTituloTexto('Valor', servicomilho.valor);
	
	var $nomesColunas = {
		"coluna1": "Dados do Serviço",
		"coluna2": "Valores"
	};
	
	var $arrayDados1 = {
		"coluna1": $textoProdutor,
		"coluna2": $textoFazenda,
		"coluna3": $textoServico,
		"coluna4": $textoAutomatico,
		"coluna5": $textoFechado
	};
	
	var $arrayDados2 = {
		"coluna1": $textoData,
		"coluna2": $textoLiquido,
		"coluna3": $textoTotal,
		"coluna4": $textoPago,
		"coluna5": $textoValor
	};
	
	var $idLinha = 'trServicomilhoDialog_' + servicomilho.id;
	
	var $trDados = tr($idLinha, '');
	
	$trDados.append(juntaColunas($arrayDados1, 'text-left', 'texto', 'tdDados1'));
	
	$trDados.append(juntaColunas($arrayDados2, 'text-right', 'texto', 'tdDados2'));
	
	setDadosDialogLancamento(servicomilho, $nomesColunas, $trDados);
	
}
/* =========================================================
 * pegaProcuraServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraServicomilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNomeDataTipo(pagina, nomeTabela);
	
}
/* =========================================================
 * formularioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioServicomilho(idServicomilho, nomeTabela) {
	
	var $campoProdutor = campoSqlProcuraTexto(
		"Produtor",
		nomeTabela,
		"FazendaProdutor",
		"Digite o nome do produtor",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $campoServico = campoSqlProcuraTexto(
		"Serviço",
		nomeTabela,
		"Preco",
		"Digite o nome do serviço",
		'col-xs-9 col-md-6', 'col-xs-3'
	);
	
	var $campoLiquido = campoNumeroHorizontal(
		"liquido" + nomeTabela, "Líquido",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "", " kg"
	);
	
	var $campoValor = campoNumeroHorizontal(
		"valor" + nomeTabela, "Valor",
		'col-xs-9 col-md-6', 'col-xs-3', 2, 9, false, false, "R$ ", ""
	);
	
	var $campoData = campoDataHorizontal(
		"data" + nomeTabela, "Data",
		'col-xs-9 col-md-6', 'col-xs-3',
		true, "0", "0", null,
		'disabled'
	).removeClass("has-feedback");
	
	var $formTela1 = $("<div/>").addClass("form-horizontal");
	
	$formTela1.append($campoProdutor)
		.append($campoServico)
		.append($campoLiquido)
		.append($campoValor)
		.append($campoData);

	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formTela2 = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append($telaObservacao);
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	$tabs.find('#tab' + nomeTabela + '1').append($formTela1);
	$tabs.find('#tab' + nomeTabela + '2').append($formTela2);
	
	var $formulario = formularioCadastro(idServicomilho, nomeTabela, 2, 2, $tabs, 4);
	
	$campoLiquido.find('#liquido' + nomeTabela).focusout(function() {
		
		calculaValorServicomilho(nomeTabela);
		
	});
	
	$campoLiquido.find('#liquido' + nomeTabela).on('keyup', function() {
		
		calculaValorServicomilho(nomeTabela);
		
	});
	
	$campoValor.find('#valor' + nomeTabela).on('focus', function() {
		
		calculaValorServicomilho(nomeTabela);
		
	});
	
	$campoServico.find('#nomeProcuraCadastro' + nomeTabela + 'PrecoDivInput span').on('change', function() {
		
		calculaValorServicomilho(nomeTabela);
		
	});
	
	var laudo = {
		nomeTabela: nomeTabela,
		formulario: $formulario
	};
	
	eventoAcharLaudo(laudo);
	
	return $formulario;
	
}
/* =========================================================
 * nomeTabsServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsServicomilho() {
	
	var $nomesTabs = { 
		tabServicomilho1: "Dados",
		tabServicomilho2: "Observações"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * validarFormularioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioServicomilho(tipoOperacao, nomeTabela, formulario) {
	
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
			valorServicomilho: {
				required: true,
				maskNumber: true,
				checkValor: true
			},
			nomeProcuraCadastroServicomilhoFazendaProdutor: {checkIdFazendaProdutor: true},
			nomeProcuraCadastroServicomilhoPreco: {checkIdPreco: true}
        },
        messages: {
			valorServicomilho: {required: "É necessário informar o valor!"}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarServicomilho(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarId(nomeTabela);
	
	jQuery.validator.addMethod('checkValor',
		function (value, element) { 		
			
			var valor = formataNumeroSql($('#valorServicomilho').val());
			
			if (valor > 0) {
				
				return true;
				
			}
			else {
				
				$('#valorServicomilho').addClass('has-error');
				
				return false;
				
			}
			
		}, 'O valor não pode ser igual a zero!'
	);
	
}
/* =========================================================
 * setDadosRodapeServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeServicomilho(rodape) {
	
	var colspan = {
		inicio: 5,
		fim: 0
	};
	
	var $trRodape = tr('nomeRodapeServicomilho', '');
	
	var $th1 = th();
	var $th2 = th();
	var $th3 = th();
	var $th4 = th();
	
	var $paragrafo1 = paragrafo('text-right', 'texto');
	var $paragrafo2 = paragrafo('text-right', 'texto_cor_verde');
	var $paragrafo3 = paragrafo('text-right', 'texto_cor_vermelho');
	
	$paragrafo1.append(formataNumero(rodape[0].total, 2, false, true, "R$ ", ""));
	$paragrafo2.append(formataNumero(rodape[0].pago, 2, false, true, "R$ ", ""));
	$paragrafo3.append(formataNumero(rodape[0].valor, 2, false, true, "R$ ", ""));
	
	$th2.append($paragrafo1).attr('id', 'total');
	$th3.append($paragrafo2).attr('id', 'pago');
	$th4.append($paragrafo3).attr('id', 'valor');
	
	setDadosRodapeHide("Servicomilho", colspan, $th1);
	
	$trRodape.append($th1);
	$trRodape.append($th2);
	$trRodape.append($th3);
	$trRodape.append($th4);
	
	return $trRodape;
	
}
/* =========================================================
 * pegaDadosFormularioServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioServicomilho(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		data: $("#data" + nomeTabela).datepicker("getDate"),
		liquido: formataNumeroSql($("#liquido" + nomeTabela).val()),
		valor: formataNumeroSql($("#valor" + nomeTabela).val()),
		automatico: 0,
		pago: 0,
		obs: encodeURIComponent( unescape($("#observacao" + nomeTabela).val()))
	}
	
	return dados;
	
}
/* =========================================================
 * removeTotalTabelaServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaServicomilho(idLinha) {
	
	idLinha = idLinha.replace('#', '');
	
	id = idLinha.replace('servicomilho_', '');
	
	var valorTotal = $('#tbodyListaServicomilho').find('#' + idLinha).find("#tdTotal").find('p').text();
	var valorPago = $('#tbodyListaServicomilho').find('#' + idLinha).find("#tdPago").find('p').text();
	var valorRestante = $('#tbodyListaServicomilho').find('#' + idLinha).find("#tdValor").find('p').text();
	
	var total = $('#tfoottableListaServicomilho').find('#nomeRodapeServicomilho').find("#total").find('p').text();
	var pago = $('#tfoottableListaServicomilho').find('#nomeRodapeServicomilho').find("#pago").find('p').text();
	var valor = $('#tfoottableListaServicomilho').find('#nomeRodapeServicomilho').find("#valor").find('p').text();
	
	valorTotal = formataNumeroSql(valorTotal);
	valorPago = formataNumeroSql(valorPago);
	valorRestante = formataNumeroSql(valorRestante);
	
	total = formataNumeroSql(total);
	pago = formataNumeroSql(pago);
	valor = formataNumeroSql(valor);
	
	total = total - valorTotal;
	pago = pago - valorPago;
	valor = valor - valorRestante;
	
	if (total > 0) {
	
		total = formataNumero(total, 2, false, false, "R$ ", "");
		pago = formataNumero(pago, 2, false, false, "R$ ", "");
		valor = formataNumero(valor, 2, false, false, "R$ ", "");
	
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#total").find('p').empty();
			
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#pago").find('p').empty();
			
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#valor").find('p').empty();
		
		
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#total").find('p').text(total);
			
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#pago").find('p').text(pago);
			
		$('#tfoottableListaServicomilho')
			.find('#nomeRodapeServicomilho').find("#valor").find('p').text(valor);

	}
	else {
		
		$('#tfoottableListaServicomilho').empty();
		
	}
		
}
/* =========================================================
 * pegaNomeColunasServicomilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasServicomilho(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		produtor: "Produtor",
		fazenda: "Fazenda",
		data: "Data",
		servico: "Serviço" ,
		total: "Total",
		pago: "Pago",
		valor: "Valor"
	};
	
	if (tipo == 3) {
		
		nomesColunas = "Serviço de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * formataDadosMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosMovimentomilho(movimentomilho) {
	
	movimentomilho.produtor = decodeURIComponent(movimentomilho.produtor);
	movimentomilho.fazenda = decodeURIComponent(movimentomilho.fazenda);
	
	movimentomilho.anterior = formataNumero(movimentomilho.anterior, 2, true, true, "", " kg");
	movimentomilho.entradas = formataNumero(movimentomilho.entradas, 2, false, true, "", " kg");
	movimentomilho.saidas = formataNumero(movimentomilho.saidas, 2, false, true, "", " kg");
	movimentomilho.saldo = formataNumero(movimentomilho.saldo, 2, true, true, "", " kg");
	
	movimentomilho.armazenagem = formataNumero(movimentomilho.armazenagem, 2, true, true, "R$ ", "");
	movimentomilho.limpeza = formataNumero(movimentomilho.limpeza, 2, true, true, "R$ ", "");
	movimentomilho.secagem = formataNumero(movimentomilho.secagem, 2, true, true, "R$ ", "");
	movimentomilho.carga = formataNumero(movimentomilho.carga, 2, true, true, "R$ ", "");
	movimentomilho.recepcao = formataNumero(movimentomilho.recepcao, 2, true, true, "R$ ", "");
	
	movimentomilho.total = formataNumero(movimentomilho.total, 2, true, true, "R$ ", "");
	
	movimentomilho.data = formataData(movimentomilho.data);
	
}
/* =========================================================
 * formularioRelatorioMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioMovimentomilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $formulario = formularioRelatorioNomeData(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		"",
		urlSearch
	);
	
	return $formulario;
	
}
/* =========================================================
 * pegaNomeColunasMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasMovimentomilho(tipo) {
	
	var nomesColunas = { 
		produtor: "Produtor",
		fazenda: "Fazenda",
		data: "Data",
		anterior: "Saldo Anterior",
		entradas: "Peso Entradas",
		saidas: "Peso Saídas",
		saldo: "Saldo Atual",
		armazenagem: "Armazenagem",
		limpeza: "Limpeza",
		secagem: "Secagem",
		carga: "Carga",
		recepcao: "Recepção",
		total: "Total"
	};
	
	if (tipo == 3) {
		
		nomesColunas = "Faturamento de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaProcuraMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraMovimentomilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNomeData(pagina, nomeTabela);
	
}
/* =========================================================
 * setDadosRodapeMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeMovimentomilho(rodape) {
	
	var colspan = {
		inicio: 3,
		fim: 0
	};
	
	var $trRodape = tr('nomeRodapeMovimentomilho', '');
	
	var $th1 = th();
	var $th2 = th();
	var $th3 = th();
	var $th4 = th();
	var $th5 = th();
	var $th6 = th();
	var $th7 = th();
	var $th8 = th();
	var $th9 = th();
	var $th10 = th();
	var $th11 = th();
	
	var $paragrafo1 = paragrafo('text-right texto', 'texto');
	var $paragrafo2 = paragrafo('text-right texto', 'texto');
	var $paragrafo3 = paragrafo('text-right texto', 'texto');
	var $paragrafo4 = paragrafo('text-right texto', 'texto');
	var $paragrafo5 = paragrafo('text-right texto', 'texto');
	var $paragrafo6 = paragrafo('text-right texto', 'texto');
	var $paragrafo7 = paragrafo('text-right texto', 'texto');
	var $paragrafo8 = paragrafo('text-right texto', 'texto');
	var $paragrafo9 = paragrafo('text-right texto', 'texto');
	var $paragrafo10 = paragrafo('text-right texto', 'texto');
	
	$paragrafo1.append(formataNumero(rodape[0].anterior, 2, false, true, "", " kg"));
	$paragrafo2.append(formataNumero(rodape[0].entradas, 2, false, true, "", " kg"));
	$paragrafo3.append(formataNumero(rodape[0].saidas, 2, false, true, "", " kg"));
	$paragrafo4.append(formataNumero(rodape[0].saldo, 2, true, true, "", " kg"));
	
	$paragrafo5.append(formataNumero(rodape[0].armazenagem, 2, true, true, "R$ ", ""));
	$paragrafo6.append(formataNumero(rodape[0].limpeza, 2, false, true, "R$ ", ""));
	$paragrafo7.append(formataNumero(rodape[0].secagem, 2, false, true, "R$ ", ""));
	$paragrafo8.append(formataNumero(rodape[0].carga, 2, false, true, "R$ ", ""));
	$paragrafo9.append(formataNumero(rodape[0].recepcao, 2, false, true, "R$ ", ""));

	$paragrafo10.append(formataNumero(rodape[0].total, 2, true, true, "R$ ", ""));
	
	$th2.append($paragrafo1);
	$th3.append($paragrafo2);
	$th4.append($paragrafo3);
	$th5.append($paragrafo4);
	$th6.append($paragrafo5);
	$th7.append($paragrafo6);
	$th8.append($paragrafo7);
	$th9.append($paragrafo8);
	$th10.append($paragrafo9);
	$th11.append($paragrafo10);
	
	setDadosRodapeHide("Movimentomilho", colspan, $th1);
	
	$trRodape.append($th1);
	$trRodape.append($th2);
	$trRodape.append($th3);
	$trRodape.append($th4);
	$trRodape.append($th5);
	$trRodape.append($th6);
	$trRodape.append($th7);
	$trRodape.append($th8);
	$trRodape.append($th9);
	$trRodape.append($th10);
	$trRodape.append($th11);
	
	return $trRodape;
	
}
/* =========================================================
 * setDadosTabelaMovimentomilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaMovimentomilho(movimentomilho) {
	
	formataDadosMovimentomilho(movimentomilho);
	
	var $idLinha = "movimentomilho_" + movimentomilho.id;
	
	var $tbody = $("#listaMovimentomilhoForm #tableListaMovimentomilho #tbodyListaMovimentomilho");
	
	var $tr = tr($idLinha, "");
	
	setDadosColunaHide("Movimentomilho", movimentomilho, $tr);
	
	$tr.append(tabelaCelula(movimentomilho.data, "text-center", "texto", "tdData"));
	$tr.append(tabelaCelula(movimentomilho.anterior, "text-right", "texto", "tdAnterior"));
	$tr.append(tabelaCelula(movimentomilho.entradas, "text-right", "texto", "tdEntradas"));
	$tr.append(tabelaCelula(movimentomilho.saidas, "text-right", "texto", "tdSaidas"));
	$tr.append(tabelaCelula(movimentomilho.saldo, "text-right", "texto", "tdSaldo"));
	
	$tr.append(tabelaCelula(movimentomilho.armazenagem, "text-right", "texto", "tdArmazenagem"));
	$tr.append(tabelaCelula(movimentomilho.limpeza, "text-right", "texto", "tdLimpeza"));
	$tr.append(tabelaCelula(movimentomilho.secagem, "text-right", "texto", "tdSecagem"));
	$tr.append(tabelaCelula(movimentomilho.carga, "text-right", "texto", "tdCarga"));
	$tr.append(tabelaCelula(movimentomilho.recepcao, "text-right", "texto", "tdRecepcao"));
	
	$tr.append(tabelaCelula(movimentomilho.total, "text-right", "texto", "tdTotal"));
	
	$tbody.append($tr);
	
}
/* =========================================================
 * formataDadosSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosSintetizamilho(sintetizamilho) {
	
	sintetizamilho.produtor = decodeURIComponent(sintetizamilho.produtor);
	sintetizamilho.fazenda = decodeURIComponent(sintetizamilho.fazenda);
	
	sintetizamilho.armazenagem = formataNumero(sintetizamilho.armazenagem, 2, true, true, "R$ ", "");
	sintetizamilho.recepcao = formataNumero(sintetizamilho.recepcao, 2, true, true, "R$ ", "");
	sintetizamilho.limpeza = formataNumero(sintetizamilho.limpeza, 2, true, true, "R$ ", "");
	sintetizamilho.secagem = formataNumero(sintetizamilho.secagem, 2, true, true, "R$ ", "");
	sintetizamilho.carga = formataNumero(sintetizamilho.carga, 2, true, true, "R$ ", "");
	
	sintetizamilho.total = formataNumero(sintetizamilho.total, 2, true, true, "R$ ", "");
	
}
/* =========================================================
 * formularioRelatorioSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioSintetizamilho(nomeTabela, posicaoItemMenu) {
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var $divProcura = formularioRelatorioNomeTipo(
		nomeTabela,
		"FazendaProdutor",
		"Produtor",
		urlSearch,
		2
	);
	
	return $divProcura;
	
}
/* =========================================================
 * setDadosRodapeSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeSintetizamilho(rodape) {
	
	var colspan = {
		inicio: 2,
		fim: 0
	};
	
	var $trRodape = tr('nomeRodapeSintetizamilho', '');
	
	var $th1 = th();
	var $th2 = th();
	var $th3 = th();
	var $th4 = th();
	var $th5 = th();
	var $th6 = th();
	var $th7 = th();
	
	var $paragrafo1 = paragrafo('text-right texto', 'texto');
	var $paragrafo2 = paragrafo('text-right texto', 'texto');
	var $paragrafo3 = paragrafo('text-right texto', 'texto');
	var $paragrafo4 = paragrafo('text-right texto', 'texto');
	var $paragrafo5 = paragrafo('text-right texto', 'texto');
	var $paragrafo6 = paragrafo('text-right texto', 'texto');
	
	$paragrafo1.append(formataNumero(rodape[0].armazenagem, 2, true, true, "R$ ", ""));
	$paragrafo2.append(formataNumero(rodape[0].recepcao, 2, false, true, "R$ ", ""));
	$paragrafo3.append(formataNumero(rodape[0].limpeza, 2, false, true, "R$ ", ""));
	$paragrafo4.append(formataNumero(rodape[0].secagem, 2, false, true, "R$ ", ""));
	$paragrafo5.append(formataNumero(rodape[0].carga, 2, false, true, "R$ ", ""));

	$paragrafo6.append(formataNumero(rodape[0].total, 2, true, true, "R$ ", ""));
	
	$th2.append($paragrafo1);
	$th3.append($paragrafo2);
	$th4.append($paragrafo3);
	$th5.append($paragrafo4);
	$th6.append($paragrafo5);
	$th7.append($paragrafo6);
	
	setDadosRodapeHide("Sintetizamilho", colspan, $th1);
	
	var idFazenda = $('#idnomeProcuraSintetizamilhoFazendaProdutor').val();
	
	if (idFazenda == 0) {
	
		$trRodape.append($th1);
		
	}
	else {
	
		if ($('#spanIconClearSintetizamilhoFazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			$trRodape.append($th1);
			
		}
	
	}
	
	$trRodape.append($th2);
	$trRodape.append($th3);
	$trRodape.append($th4);
	$trRodape.append($th5);
	$trRodape.append($th6);
	$trRodape.append($th7);
	
	return $trRodape;
	
}
/* =========================================================
 * pegaProcuraSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraSintetizamilho(pagina, nomeTabela) {
	
	return pegaProcuraRelatorioNomeTipo(pagina, nomeTabela);
	
}
/* =========================================================
 * pegaNomeColunasSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasSintetizamilho(tipo) {
	
	var nomesColunas = { 
		produtor: "Produtor",
		fazenda: "Fazenda",
		armazenagem: "Armazenagem",
		recepcao: "Recepção",
		limpeza: "Limpeza",
		secagem: "Secagem",
		carga: "Carga",
		total: "Total"
	};
	
	if (tipo == 3) {
		
		nomesColunas = "Serviço de Milho";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosTabelaSintetizamilho.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaSintetizamilho(sintetizamilho) {
	
	formataDadosSintetizamilho(sintetizamilho);
	
	var $idLinha = "sintetizamilho_" + sintetizamilho.id;
	
	var $tbody = $("#listaSintetizamilhoForm #tableListaSintetizamilho #tbodyListaSintetizamilho");
	
	var $tr = tr($idLinha, "");
	
	setDadosColunaHide("Sintetizamilho", sintetizamilho, $tr);
	
	$tr.append(tabelaCelula(sintetizamilho.armazenagem, "text-right", "texto", "tdArmazenagem"));
	$tr.append(tabelaCelula(sintetizamilho.recepcao, "text-right", "texto", "tdRecepcao"));
	$tr.append(tabelaCelula(sintetizamilho.limpeza, "text-right", "texto", "tdLimpeza"));
	$tr.append(tabelaCelula(sintetizamilho.secagem, "text-right", "texto", "tdSecagem"));
	$tr.append(tabelaCelula(sintetizamilho.carga, "text-right", "texto", "tdCarga"));
	
	$tr.append(tabelaCelula(sintetizamilho.total, "text-right", "texto", "tdTotal"));
	
	$tbody.append($tr);
	
}
