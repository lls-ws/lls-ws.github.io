/* =========================================================
 * mostrarMenu.js
 * http://lls.net.br/
 * ========================================================= */

function mostrarMenu() {
	
	for(var i=1; i<6; i++){
		
		$("#itemMenu" + i).show();
			
	}
	
}

function esconderMenu(posicaoMenu) {
	
	for(var i=1; i<posicaoMenu; i++){
		
		$("#itemMenu" + i).hide();
			
	}
	
}
/* =========================================================
 * criarTelaMenu.js
 * http://lls.net.br/
 * ========================================================= */

function criarTelaMenu(nomesItensMenu, opcoesMenu, menu) {
	
	opcoesMenu.posicaoMenu++;
	
	var opcaoMenuItens = opcaoMenu(
		menu.titulo, menu.icone, menu.posicao,
		opcoesMenu.posicaoMenu,
		eval ('menu' + menu.projeto + '(menu, opcoesMenu.posicaoMenu)')
	);
	
	nomesItensMenu.append(opcaoMenuItens);
	
	return opcoesMenu;
	
}
/* =========================================================
 * marcarMenu.js
 * http://lls.net.br/
 * ========================================================= */

function marcarMenu(posicaoItemMenu) {
	
	for(var i=1; i<=getTotalItensMenu(); i++){
		
		if (posicaoItemMenu != i) {
		
			$("#itemMenu" + i).removeClass("active");
			
		}
		else {
			
			$("#itemMenu" + i).addClass("active");
			
			break;
			
		}
		
	}
	
}

function pegaPosicaoItemMenu() {
	
	var posicaoItemMenu = 0;
	
	for(var i=1; i<=getTotalItensMenu(); i++){
		
		if ($("#itemMenu" + i).hasClass("active")) {
		
			posicaoItemMenu = i;
			
			break;
			
		}
		
	}
	
	return posicaoItemMenu;
	
}

function getTotalItensMenu() {
	
	var idMenuUsuario = $('#menuUsuario').children('li').attr("id");
	
	var totalItensMenu = idMenuUsuario.replace('itemMenu', '');
	
	return totalItensMenu;
	
}
/* =========================================================
 * telaMenu.js
 * http://lls.net.br/
 * ========================================================= */

function telaMenu() {
	
	var opcoesMenu = {
		posicaoMenu: 1,
		qtdItensMenu: 0
	};
	
	var $menu = $("<div/>").attr({id: "menu", role: 'navigation'});
	
	$menu.addClass('navbar navbar-inverse');
	
	var $menuContainer = $("<div/>").addClass('container-fluid');
	
	var $menuHeader = $("<div/>").addClass('navbar-header');
	
	var $imagemMenu = imagemMenu('imagem-menu');
	
	var $botaoMenu = botaoMenu();
	
	var $menuCollapse = $("<div/>").addClass('navbar-collapse collapse');
	
	var $menuCadastros = opcaoMenu('Cadastros ', 'folder-open', 'left', opcoesMenu.posicaoMenu, menuCadastros(opcoesMenu.posicaoMenu));
	
	$menuCollapse.append($menuCadastros);
	
	opcoesMenu = telaMenuOpcoes($menuCollapse, opcoesMenu);
	
	opcoesMenu.posicaoMenu++;
	
	var $menuRelatorio = opcaoMenu('Relatórios ', 'blackboard', 'left', opcoesMenu.posicaoMenu, menuRelatorio(opcoesMenu.posicaoMenu));
	
	opcoesMenu.posicaoMenu++;
	
	var $menuUsuario = opcaoMenu('', 'user', 'right', opcoesMenu.posicaoMenu, menuUsuario(opcoesMenu.posicaoMenu));
	
	$menuCollapse.append($menuRelatorio);
	$menuCollapse.append($menuUsuario);
	
	$menuHeader.append($botaoMenu);
	$menuHeader.append($imagemMenu);
	$menuContainer.append($menuHeader);
	$menuContainer.append($menuCollapse);
	$menu.append($menuContainer);
	
	eventoMenuUsuario(opcoesMenu.posicaoMenu);
	
	return $menu;
	
}
/* =========================================================
 * formularioMenu.js
 * http://lls.net.br/
 * ========================================================= */

function formularioMenu() {
	
	var $divCenter = $('<div/>').addClass('container_menu container_center');
	
	var $formulario = formularioHorizontal('menu', 'form-menu form_center');
	
	var $paragrafo = paragrafo('text-center', '');
	
	var $imagem = imagem('//lls-ws.github.io/imagens/logo.png', 'imagem-painel', 100, 100);
	
	$paragrafo.append($imagem);
	
	$formulario.append($paragrafo);
	
	$divCenter.append($formulario);
	
	mudaPainel($divCenter, '0');
	
}
/* =========================================================
 * opcaoMenu.js
 * http://lls.net.br/
 * ========================================================= */

function opcaoMenu(nomeMenu, icone, localizacao, posicaoMenu, nomesItens) {
	
	nomeMenu = nomeMenu + " ";
	
	var opcaoMenu = itemMenu(nomeMenu, 'marcarMenu()', icone, localizacao, posicaoMenu);
	
	var bMenu = b('caret');
	
	var ulMenu = ul('dropdown-menu inverse-dropdown', 'menu');
	
	opcaoMenu.find( '#itemMenu' + posicaoMenu ).addClass('dropdown');
	opcaoMenu.find( '#itemMenu' + posicaoMenu ).append(ulMenu);
	
	opcaoMenu.find( '#linkMenu' + posicaoMenu ).append(bMenu);
	opcaoMenu.find( '#linkMenu' + posicaoMenu ).addClass('dropdown-toggle');
	opcaoMenu.find( '#linkMenu' + posicaoMenu ).attr('data-toggle', 'dropdown');
	opcaoMenu.find( '#linkMenu' + posicaoMenu ).attr('role', 'button');
	opcaoMenu.find( '#linkMenu' + posicaoMenu ).prop('aria-expanded', false);
	
	jQuery.each( nomesItens, function( index, nomeItem ) {
			
		var iconeMenu = 'glyphicon glyphicon-' + nomeItem.icone;
		
		var spanMenu = span(iconeMenu);
		
		var aMenu = a(nomeItem.url, 'javascript:void(0);')
			.append(spanMenu)
			.append(' ')
			.append(nomeItem.texto);
		
		var liMenu = li().append(aMenu);
		
		if (nomeItem.separator) {
			
			var headerMenu = li("", "dropdown-header");
			
			headerMenu.append(nomeItem.titulo);
			
			ulMenu.append(headerMenu);
			
		}
		
		ulMenu.append(liMenu);
		
	});
	
	return opcaoMenu;
	
}
/* =========================================================
 * eventoMenuUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function eventoMenuUsuario(posicaoMenu) {
	
	$.ajax({
		type: "POST",
		url: "pegaUsuario",
		dataType: "json",
		success: function(resposta) {
			
			var $b = b('caret');
			
			var $span = span('glyphicon glyphicon-user');
			
			$('#linkMenu' + posicaoMenu).empty();
			
			$('#linkMenu' + posicaoMenu).append($span);
			
			$('#linkMenu' + posicaoMenu).append(' ');
			
			$('#linkMenu' + posicaoMenu).append(resposta.usuario + ' ');
			
			$('#linkMenu' + posicaoMenu).append($b);
			
			if (resposta.status == '201') {
			
				esconderMenu(posicaoMenu);
				
				alert('Sua senha expirou, clique OK para alterá-la!');
				
				novoCadastro("Usuario", "click-off", posicaoMenu);
				
			}
			else {
				
				mostrarMenu();
				
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
 * imagemMenu.js
 * http://lls.net.br/
 * ========================================================= */

function imagemMenu(classe) {
	
	var $imagemMenu = a('', 'javascript:void(0);', 'navbar-brand');
	
	var $imagem = imagem('//lls-ws.github.io/imagens/logo.png', classe, 25, 20);
	
	var $nomeProjeto = nomeProjeto();
	
	var $font = $('<font/>').addClass('texto_label');
	
	$font.append($nomeProjeto);
	
	$imagemMenu.append($imagem);
	$imagemMenu.append($font);
	
	return $imagemMenu;
	
}
/* =========================================================
 * menuRelatorio.js
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorio(posicaoMenu) {
	
	var opcoesMenu = {
		posicaoMenu: posicaoMenu,
		qtdItensMenu: -1
	};
	
	var nomesItensMenu = {};
	
	menuRelatorioOpcoes(nomesItensMenu, opcoesMenu);
	
	return nomesItensMenu;
	
}
/* =========================================================
 * menuCadastros.js
 * http://lls.net.br/
 * ========================================================= */

function menuCadastros(posicaoMenu) {
	
	var opcoesMenu = {
		posicaoMenu: posicaoMenu,
		qtdItensMenu: 0
	};
	
	var $nomesItensMenu = {};
	
	var $item1 = 'novoCadastro("Empresa", "click", "' + posicaoMenu + '")';
	var $item2 = 'novoFormulario("Produtor", "Nome", "' + posicaoMenu + '", "click")';
	var $item3 = 'novoFormulario("Preco", "Nome", "' + posicaoMenu + '", "click")';
	
	$nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "home",
		texto: "Cadastro de Empresa",
		url: $item1
	}
	
	opcoesMenu.qtdItensMenu++;
	
	$nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "user",
		texto: "Cadastro de Produtores",
		url: $item2
	}
	
	opcoesMenu.qtdItensMenu++;
	
	$nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "usd",
		texto: "Tabela de Preços",
		url: $item3
	}
	
	menuCadastrosOpcoes($nomesItensMenu, opcoesMenu);
	
	return $nomesItensMenu;
	
}
/* =========================================================
 * menu.js
 * http://lls.net.br/
 * ========================================================= */

function menu(tipo) {
	
	if (tipo == '1') loginInicio();
	
	$('.scroll-pane').jScrollPane();
	
	$('.container').empty();
	
	$('.container').append(telaMenu());
	
	painel('');
	
	formularioMenu();
	
	//var dados = menuOpcoesCafe(3, 1); // Entcafe
	//var dados = menuOpcoesCafe(3, 2);	// Oscafe
	//var dados = menuOpcoesCafe(3, 3);	// Saicafe
	//var dados = menuOpcoesCafe(3, 4);	// Tracafe
	//var dados = menuOpcoesCafe(3, 5);	// Faturacafe
	//var dados = menuOpcoesCafe(3, 6);	// Servicocafe
	//var dados = menuOpcoesCafe(3, 7);	// Extratocafe
	//var dados = menuOpcoesCafe(3, 8);	// Saldocafe
	
	//var dados = menuOpcoesBalanca(4, 1); // Peso
	
	//dados.click = "click-off";
	//dados.textoLabel = "no-find";
	//novoFormularioCore(dados);
	
	//dados.click = "click";
	//novoCadastroCore(dados);
	
	window.history.replaceState('', '', "/");
	
}
/* =========================================================
 * itemMenu.js
 * http://lls.net.br/
 * ========================================================= */

function itemMenu(nome, url, icone, localizacao, numero) {
	
	var $listaId = 'itemMenu' + numero;
	var $linkId = 'linkMenu' + numero;
	var $icone = 'glyphicon glyphicon-' + icone;
	var $classeMenu = 'nav navbar-nav navbar-' + localizacao;
	
	var id = "";
	
	if ( localizacao == "right" ) {
		
		id = "menuUsuario";
		
	}
	
	var $itemMenu = ul($classeMenu).attr('id', id);
	
	var $li = li($listaId);
	
	var $a = a(url, 'javascript:void(0);', '', $linkId);
	
	var $span = span($icone);
	
	$a.append($span);
	$a.append(' ');
	$a.append(nome);
	
	$li.append($a);
	
	$itemMenu.append($li);
	
	return $itemMenu;
	
}
/* =========================================================
 * criarMenu.js
 * http://lls.net.br/
 * ========================================================= */

function criarMenu(menu, menuItens, posicaoMenu, nomesItensMenu, opcoesMenu) {
	
	menu.nomeMenu = 'Cadastro';
	menu.posicaoItem = 0;
	menu.qtdItensMenu = 0;
	
	if (opcoesMenu != null) {
		
		if (opcoesMenu.qtdItensMenu < 0) opcoesMenu.qtdItensMenu = 0;
		
		menu.nomeMenu = 'Formulario';
		menu.qtdItensMenu = opcoesMenu.qtdItensMenu;
		
	}
	else nomesItensMenu = {};
	
	jQuery.each( menuItens, function( i, value ) {
		
		menu.posicaoItem++;
		menu.qtdItensMenu++;
		
		var dados = eval ('menuOpcoes' + menu.projeto + '(posicaoMenu, menu.posicaoItem)');
		
		var item = 'novo' + menu.nomeMenu + 'Core(' + JSON.stringify(dados) + ')';
		
		nomesItensMenu[menu.qtdItensMenu] = {
			separator: menuItens[i].separator,
			titulo: menuItens[i].titulo,
			icone: menuItens[i].icone,
			texto: menuItens[i].texto,
			url: item
		}
	
	});
	
	if (opcoesMenu != null) {
		opcoesMenu.qtdItensMenu = menu.qtdItensMenu;
		return opcoesMenu;
	}
	else return nomesItensMenu;
	
}
/* =========================================================
 * logout.js
 * http://lls.net.br/
 * ========================================================= */

function logout() {
	
	$.ajax({
		type: "POST",
		url: "logout",
		success: function(resposta) {
			
			login('0');
			
		},
		error: function(resposta) {
			
			alert(resposta);
			
		}
	  
	})
	
}
/* =========================================================
 * menuUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function menuUsuario(posicaoMenu) {
	
	var $nomesItensMenu = {};
	
	var $item1 = 'novoCadastro("Usuario", "click", "' + posicaoMenu + '")';
	var $item2 = 'logout()';
	
	$nomesItensMenu[0] = {
		icone: "lock",
		texto: "Alterar Senha",
		url: $item1
	}
	
	$nomesItensMenu[1] = {
		icone: "log-out",
		texto: "Desconectar",
		url: $item2
	}
	
	return $nomesItensMenu;
	
}
/* =========================================================
 * botaoMenu.js
 * http://lls.net.br/
 * ========================================================= */

function botaoMenu() {
	
	var $botaoMenu = $("<button/>").addClass('navbar-toggle');
	
	$botaoMenu.attr('type', 'button');
	$botaoMenu.attr('data-toggle', 'collapse');
	$botaoMenu.attr('data-target', '.navbar-collapse');
	
	var $spanBotao1 = span('sr-only').text("toggle navigation");
	var $spanBotao2 = span('icon-bar');
	var $spanBotao3 = span('icon-bar');
	var $spanBotao4 = span('icon-bar');
	
	$botaoMenu.append($spanBotao1);
	$botaoMenu.append($spanBotao2);
	$botaoMenu.append($spanBotao3);
	$botaoMenu.append($spanBotao4);
	
	return $botaoMenu;
	
}
/* =========================================================
 * tabelaRelatorioCore.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaRelatorioCore(dados) {
	
	var formularioTabelaRelatorio = formularioTabela(dados.nomeTabela);
	
	dados.pagina = 0;
	
	var paginacaoTabela = paginacaoCore(dados, 0);
	
	dados.pagina = 1;
	
	var formularioRelatorio = eval('formularioRelatorio' + dados.nomeTabela + '(dados)');
	
	var titulo = $("<div/>").addClass('titulo_tabela')
		.text(tituloPainelCadastro(2, eval('pegaNomeColunas' + dados.nomeTabela + '(3)')));

	var tituloTabela = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append(titulo);
	
	var divProcura1 = $('<div/>')
		.addClass('col-md-12')
		.append(formularioRelatorio);
		
	var divProcura2 = $('<div/>')
		.addClass('col-md-12')
		.append(tituloTabela);
		
	var divProcura3 = $('<div/>')
		.addClass('col-md-12')
		.append(formularioTabelaRelatorio);
		
	var divProcura4 = $('<div/>')
		.addClass('col-md-12')
		.append(paginacaoTabela);
	
	var divProcura = $('<div/>')
		.addClass('row')
		.append(divProcura1)
		.append(divProcura2)
		.append(divProcura3)
		.append(divProcura4);
		
	var formulario = formularioHorizontal('lista' + dados.nomeTabela, 'formulario_cor')
		.append(divProcura);
	
	mudaPainel(formulario, dados.posicaoItemMenu);
	
	formulario.find('#nomeProcura' + dados.nomeTabela + 'FazendaProdutor').focus();
	
}
/* =========================================================
 * alteraCadastroTabelaCore.js
 * http://lls.net.br/
 * ========================================================= */

function alteraCadastroTabelaCore(dados) {
	
	dados["array"] = {};
	dados.array["titulo"] = dados.lote;
	
	var formulario = eval('formulario' + dados.nomeTabela + '(dados)');
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, dados.nomeTabela),
		'Altera' + dados.nomeTabela
	);
	
	eval('setDadosFormulario' + dados.nomeTabela + '(dados, formulario)');
	
}
/* =========================================================
 * formularioObservacaoCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioObservacaoCore(nomeTabela, id, tamanho) {
	
	var areaTexto = campoAreaTexto(id + nomeTabela, '', tamanho, 255);
	
	return $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-2")
		.append(areaTexto);
	
}
/* =========================================================
 * getJsonCore.js
 * http://lls.net.br/
 * ========================================================= */

function getJsonCore(url, dados) {
	
	var result= "";
	
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(dados),
		async: false,
		success: function(resposta) {
			
			result = resposta;
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
	return result;
	
}
/* =========================================================
 * setDadosTabelaLancamentoCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaLancamentoCore(dados) {
	
	if(typeof dados.array.lancamentos === 'undefined') return;
	
	if (dados.array.lancamentos.length > 0) {
		
		var tabelaDialog = $("#divTabelaDialog" + dados.nomeTabela).clone();
		
		$("#divDialog" + dados.nomeTabela + " div:first").remove();
		
		var nomeTabs = eval('nomeTabs' + dados.nomeTabela + '(2)');
		
		var tabs = divTabs(dados.nomeTabela, nomeTabs);
		
		$('#divDialog' + dados.nomeTabela + " div:first").before(tabs);
		
		jQuery.each( nomeTabs, function( i, value ) {
			
			tabs.find('#linha_' +  i).hide();
			
		});
		
		var tabNumero = 1;
		
		$('#tab' + dados.nomeTabela + tabNumero)
			.append(tabelaDialog)
			.removeClass('in active');
		
		$('#linha_tab' + dados.nomeTabela + tabNumero)
			.removeClass('active')
			.show();
		
		for(var j = 0; j < dados.array.lancamentos.length; j++) {
		
			var tbodyTabela = tbody('tbody' + dados.nomeTabelaLancamento[j]);
			
			var tabelaFormulario = tabela(
				'table' + dados.nomeTabelaLancamento[j],
				eval('pegaNomeColunas' + dados.nomeTabelaLancamento[j] + '(1)')
			).append(tbodyTabela);
			
			var divTabela = $('<div/>')
				.attr('id', 'divTabela' + dados.nomeTabelaLancamento[j])
				.addClass('form-table table-responsive')
				.append(tabelaFormulario);
			
			tabNumero++;
			
			tabs.find('#tab' + dados.nomeTabela + tabNumero).append(divTabela);
			
			var lancamentosTabela = dados.array.lancamentos[j];
			
			var count = 0;
			
			for(var i = 0; i < lancamentosTabela.length; i++) {
				
				lancamentosTabela[i]["idCadastro"] = dados.id;
				lancamentosTabela[i]["posicaoItem"] = dados.posicaoItem;
				lancamentosTabela[i]["posicaoItemMenu"] = dados.posicaoItemMenu;
				lancamentosTabela[i]["tipoOperacao"] = dados.tipoOperacao;
				lancamentosTabela[i]["nomeTabela"] = dados.nomeTabelaLancamento[j];
				
				if (dados.tipoOperacao == 0) {
					lancamentosTabela[i]["nomeTabelaCadastro"] = dados.nomeTabela;
					lancamentosTabela[i]["nomeTabelaLancamento"] = dados.nomeTabelaCadastro;
				}
				else {
					lancamentosTabela[i]["nomeTabelaCadastro"] = dados.nomeTabelaCadastro;
					lancamentosTabela[i]["nomeTabelaLancamento"] = dados.nomeTabela;
				}
				
				eval ('setLinhaTabela' + dados.nomeTabelaLancamento[j] + '(lancamentosTabela[i])');
				
				count++;
				
			}
			
			if (count > 0) {
				
				dados.array.rodape[j]["nomeTabela"] = dados.nomeTabelaLancamento[j];
			
				eval ("setDadosRodape" + dados.nomeTabelaLancamento[j] + '(dados.array.rodape[j])');
				
				tabs.find('#linha_tab' + dados.nomeTabela + tabNumero).show();
			
			}
			else tabNumero--;
			
		}
		
		$('#tab' + dados.nomeTabela + tabNumero).addClass('in active');
		$('#linha_tab' + dados.nomeTabela + tabNumero).addClass('active');
		
		$('#botao').focus();
		
	}
	
}
/* =========================================================
 * eventoAcharCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharCadastroCore(dados) {
	
	$.ajax({
		type: "POST",
		url: "acha" + dados.nomeTabela,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify({id: dados.id}),
		success: function(resposta) {
			
			if (resposta.status == "200") {
			
				dados.array = resposta;
				
				if (dados.tipoOperacao == "0") eval('setDadosDialog' + dados.nomeTabela + '(dados)');
				else eval('setDadosFormulario' + dados.nomeTabela + '(dados)');
				
			}
			else {
				
				mostraDialog(
					resposta.mensagem,
					'texto_cor_vermelho',
					'table',
					tituloPainelCadastro(2, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
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
 * validarIdCore.js
 * http://lls.net.br/
 * ========================================================= */

function validarIdCore(nomeTabela, campo) {
	
	var msg = campo.toLowerCase();
	
	if (msg == "fazendaprodutor") msg = "produtor";
	
	var lastChar = msg.substr(msg.length - 1);
	
	if (lastChar != 'a') lastChar = "o ";
	
	msg = lastChar + ' ' + msg + '!';
	
	jQuery.validator.addMethod('checkId' + nomeTabela + campo,
		function (value, element) { 		
			
			var id = $('#idnomeProcuraCadastro' + nomeTabela + campo).val();
			
			if (id > 0) return true;
			else return false;
			
		}, 'É necessário selecionar ' + msg
	);
	
}
/* =========================================================
 * campoSqlProcuraCore.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraCore(dados, input, id) {
	
	var nomeTabelas = dados.nomeTabela + dados.campoProcura;
	
	var $campoHorizontal = campoHorizontal(id, dados.textoLabel, dados.tamanhoLabel);
	
	var $idNomeTabela = campoOculto('id' + id, 0).attr("disabled", "enabled");
	
	var $idNomeTabela2 = campoOculto('id' + id + '2', 0).attr("disabled", "enabled");
	
	var $divGroup = $('<div />')
		.addClass('input-group')
		.addClass('autocomplete-suggestions')
		.attr('id', nomeTabelas + 'DivGroup');
	
	var $spanGroupSearch = span('input-group-addon')
		.attr('id', 'spanGroupSearch' + nomeTabelas)
		.attr('title', "Limpar");
	
	var $spanIconSearch = span('glyphicon-erase glyphicon');
	
	var $divInput = divInput(id, dados.tamanhoCampo);
	
	var $span = $('<span/>').attr('id', 'nome' + nomeTabelas + 'Mensagem')
							.hide()
							.addClass("limpa")
							.css("font-weight", "Bold")
							.css("font-style", "italic")
							.css("font-size", "15px");
	
	$campoHorizontal.removeClass("has-feedback");
	
	$divGroup.append(input);
	$divGroup.append($idNomeTabela);
	$divGroup.append($idNomeTabela2);
	$divGroup.append($spanGroupSearch);
	
	$divInput.append($divGroup);
	$divInput.append($span);
	
	$campoHorizontal.append($divInput);
	
	$spanGroupSearch.append($spanIconSearch);
	
	$spanGroupSearch.click(function(){
		
		$idNomeTabela.val(0);
		$idNomeTabela2.val(0);
		
		$span.text('').hide().trigger('change');
		
		input.removeAttr('disabled').val("").focus();
		
    });
	
	$span.on('change', function() {
		
		$('.autocomplete-suggestion').empty();
		
	});
	
	input.devbridgeAutocomplete({
		autoFocus: true,
		autoSelectFirst: true,
		minChars: dados.minChars,
		preserveInput: true,
		deferRequestBy: 3,
		lookup: function (query, done) {
			
			var dadosProcura = eval ('pegaDadosCampoSqlProcura' + dados.campoProcura + '(dados, id)');
			
			$.ajax({
				type: "POST",
				url: 'listaProcura' + dados.campoProcura,
				dataType: "json",
				contentType: 'application/json',
				mimeType: 'application/json',
				data: JSON.stringify(dadosProcura),
				success: function(resposta) {
					
					var result = {
						suggestions: eval ('pegaDadosSqlProcura' + dados.campoProcura + '(resposta)')
					};
					
					done(result);
					
				},
				error: function(jqXHR, exception) {
			
					mostraAjaxErro(
						exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
						jqXHR.status
						
					);
					
				}
			})
			
		},
		onSelect: function (suggestion) {
			
			var $suggestion = {
				data: eval ('campoSqlProcura' + dados.campoProcura + '(suggestion, 2)')
			};
			
			$('.autocomplete-suggestion').empty();
			
			$campoHorizontal.find('.help-block').empty();
			
			$campoHorizontal.removeClass('has-error has-feedback');
			
			$idNomeTabela.val(suggestion.data.id);
			
			$idNomeTabela2.val(suggestion.data.id2);
			
			input.val($suggestion.data.valor);
			
			$span.text($suggestion.data.texto).show().trigger('change');
			
			input.attr("disabled", "enabled");
			
		},
		formatResult: function (suggestion, currentValue) {
			
			return eval ('campoSqlProcura' + dados.campoProcura + '(suggestion, 1)');
			
		}
	});
	
	return $campoHorizontal;
	
}
/* =========================================================
 * formularioRelatorioNomeDataCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeDataCore(dados, nomeTabelaProcura, nomeProcura, urlAdd, urlSearch) {
	
	if (urlSearch == null) urlSearch = 'eventoListaCadastroCore(' + JSON.stringify(dados) + ')';
	
	var divProcuraNome = formularioRelatorioNomeCore(
		dados,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch
	);
	
	var divProcuraData = formularioRelatorioData(dados.nomeTabela, urlAdd, urlSearch);
	
	var divProcura = $('<div/>')
		.attr('id', 'divProcura' + dados.nomeTabela)
		.addClass('row');
		
	var divProcura1 = $('<div/>').attr('id', 'nomeProcura' + dados.nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraNome);
		
	var divProcura2 = $('<div/>').attr('id', 'dataProcura' + dados.nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraData);
	
	divProcura.append(divProcura1).append(divProcura2);
	
	return divProcura;
	
}
/* =========================================================
 * removeCadastroTabelaCore.js
 * http://lls.net.br/
 * ========================================================= */

function removeCadastroTabelaCore(dados) {
	
	dados["textoMensagem"] = 'Deseja realmente excluir?<br>' + dados.titulo;
	dados["corTexto"] = 'texto_cor_vermelho';
	dados["opcao"] = "Remover";
	
	mostraDialogOpcaoCore(dados);
	
}
/* =========================================================
 * setBotoesDialogLancamentoCore.js
 * http://lls.net.br/
 * ========================================================= */

function setBotoesDialogLancamentoCore(dados) {
	
	$("#botaoRemover" + dados.nomeTabela).hide();
	$("#botaoAlterar" + dados.nomeTabela).hide();
	$("#botaoLancamento" + dados.nomeTabela).hide();
	
	var qtdTipo = $('#tipo' + dados.nomeTabela).find("option").length;
	
	if (dados.array.indexStatus < qtdTipo - 2) {
		
		if (dados.array.remover == 0 && dados.array.indexStatus == 0) {
			
			if (dados.tipo == "Baixa") {
				if (dados.array.valorPago == 0) $("#botaoRemover" + dados.nomeTabela).show();
			}
			else {
			  if (dados.array.sacasDesdobras == 0) $("#botaoRemover" + dados.nomeTabela).show();
			 }
			 
		 }
		
		if (dados.array.alterar == 0) {
		
			if (dados.tipo == "GR") {
				if (dados.array.sacasDesdobras == 0) $("#botaoAlterar" + dados.nomeTabela).show();
			}
			else {
				if (dados.array.indexStatus < 2) {
					
					if (dados.tipo == "Baixa") {
						
						if (dados.array.valorPago == 0) $("#botaoAlterar" + dados.nomeTabela).show();
						
					}
					else {
						
						if (dados.array.lancamentos[1] == null) {
							$("#botaoAlterar" + dados.nomeTabela).show();
						}
						else {
							if (dados.array.lancamentos[1].length == 0) {
								$("#botaoAlterar" + dados.nomeTabela).show();
							}
						}
						
					}
					
				}
			}
			
		}
		
		if (dados.array.lancamento == 0) {
			
			if (dados.tipo == "GR") $("#botaoLancamento" + dados.nomeTabela).show();
			else {
				if (dados.tipo == "GE") {
					if (dados.array.indexStatus == 1 && dados.array.sacasRestantes == 0) {
						$("#botaoLancamento" + dados.nomeTabela).show();
					}
				}
				else {
					if (dados.tipo == "Baixa") {
						
						if (dados.array.valorRestante > 0) {
							$("#botaoLancamento" + dados.nomeTabela).show();
						}
						
					}
					else {
					
						if (dados.array.indexStatus == 1 && dados.array.sacasRestantes > 0) {
							$("#botaoLancamento" + dados.nomeTabela).show();
						}
						
					}
					
				}
				
			}
			
		}
		
	}
	else {
		
		if (dados.tipo == "OS") {
			
			var data = new Date( dados.array.data.replace( /(\d{2})[-/](\d{2})[-/](\d{4})/, "$3/$2/$1") )
			
			var dias = Math.floor(( new Date() - data ) / 86400000);
			
			if (dias <= 3 ) {
			
				var spanIcone = span('glyphicon glyphicon-usd');
				
				$("#botaoLancamento" + dados.nomeTabela)
					.text('')
					.append(spanIcone)
					.append(' Cobrar')
					.show();
					
			}
				
		}
		
	}
	
}
/* =========================================================
 * setDadosColunaHideCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosColunaHideCore(dados, trTabela) {
	
	var idFazenda = $('#idnomeProcura' + dados.nomeTabela + 'FazendaProdutor').val();
		
	if (idFazenda == 0) {
	
		trTabela.append(tabelaCelula(dados.produtor, "text-left", "texto", "tdProdutor"))
				.append(tabelaCelula(dados.fazenda, "text-left", "texto", "tdFazenda"));
		
	}
	else {
		
		if ($('#spanIconClear' + dados.nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			trTabela.append(tabelaCelula(dados.fazenda, "text-left", "texto", "tdFazenda"));
			
		}
		
	}
	
}
/* =========================================================
 * telaTabelaNovoItemCore.js
 * http://lls.net.br/
 * ========================================================= */

function telaTabelaNovoItemCore(dados) {
	
	$('#divDialogAltera' + dados.nomeTabela).empty();
	$('#divDialogAltera' + dados.nomeTabela).remove();
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	titulo = titulo.split(' ');
	titulo = titulo[0];
	
	mostraDialogAlterar(eval ('formulario' + dados.nomeTabela + '(dados)'),
		tituloPainelCadastro(0, titulo),
		'Altera' + dados.nomeTabela
	);
	
}
/* =========================================================
 * eventoListaCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function eventoListaCadastroCore(dados) {
	
	var dadosRelatorio = eval('pegaProcura' + dados.nomeTabela + '(dados)');
	
	$.ajax({
		type: "POST",
		url: "lista" + dados.nomeTabela,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(dadosRelatorio),
		success: function(resposta) {
			
			if (resposta.status == "200") {
			
				var qtdPaginas = resposta.paginas;
			
				var cadastrosArray = resposta.cadastros;
				
				var formulario = $('#lista' + dados.nomeTabela + 'Form');
				
				var tbodyCadastro = formulario.find('#tableLista' + dados.nomeTabela +
					' #tbodyLista' + dados.nomeTabela
				);
				
				tbodyCadastro.empty();
				
				for(var i = 0; i < cadastrosArray.length; i++) {
					
					dados.tipoOperacao = 0;
					dados["array"] = cadastrosArray[i];
					
					setDadosTabelaCadastroCore(dados);
					
				}
				
				dados.id = 0;
				
				$("#lista" + dados.nomeTabela + "Form #tableLista" + dados.nomeTabela)
					.find('tfoot').empty();
				
				if (cadastrosArray.length > 0) {
					
					formulario.find('#spanGroupPrint' + dados.nomeTabela + 'FazendaProdutor').show();
					
					resposta.rodape["nomeTabela"] = dados.nomeTabela;
					
					var trRodape = eval('setDadosRodape' + dados.nomeTabela + '(resposta.rodape)');
					
				}
				else {
					
					formulario.find('#spanGroupPrint' + dados.nomeTabela + 'FazendaProdutor').hide();
					
					var trRodape = "";
				
				}
				
				$("#lista" + dados.nomeTabela + "Form #tableLista" + dados.nomeTabela)
					.find('tfoot').append(trRodape);
				
				paginacaoCore(dados, qtdPaginas);
				
			}
			else {
				
				mostraDialog(
					resposta.mensagem,
					'texto_cor_vermelho',
					'table',
					tituloPainelCadastro(2, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
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
 * removeCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function removeCadastroCore(dados) {
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	var textoMensagem = 'Deseja realmente excluir?<br>' +
		titulo + ': ' + dados.array.titulo;
	
	mostraDialogOpcao(
		textoMensagem,
		'texto_cor_vermelho',
		this,
		tituloPainelCadastro(3, titulo),
		dados.id,
		dados.nomeTabela,
		"Remover"
	);
	
}
/* =========================================================
 * telaTabelaCore.js
 * http://lls.net.br/
 * ========================================================= */

function telaTabelaCore(dados, tipo, index) {
	
	if (index == null) index = 0;
	
	var arrayTabela = [];
	
	if (tipo == 1) arrayTabela = dados.nomeTabelaCadastro[index];
	else arrayTabela = dados.nomeTabelaLancamento[index];
	
	var dadosTabela = {
		id: 0,
		posicaoItem: dados.posicaoItem,
		posicaoItemMenu: dados.posicaoItemMenu,
		tipoOperacao: 0,
		nomeTabela: arrayTabela,
		nomeTabelaCadastro: dados.nomeTabela,
		nomeTabelaLancamento: dados.nomeTabelaCadastro
	}
	
	var idTabela = 'table' + dadosTabela.nomeTabela;
	
	var titulo = eval('pegaNomeColunas' + dadosTabela.nomeTabela + '(3)');
	
	var botaoTabela = botao('botaoNovo' + dadosTabela.nomeTabela,
		'', 'fa-plus', '0',
		'btn btn-xs btn-primary',
		'button',
		'telaTabelaNovoItemCore(' + JSON.stringify(dadosTabela) + ')'
	).attr('title', 'Adicionar ' + titulo + '!');
	
	var nomeColunas = eval('pegaNomeColunas' + dadosTabela.nomeTabela + '(2)');
	
	var tabelaCadastro = tabela(
		idTabela,
		nomeColunas
	);
	
	var tituloColunas = eval('pegaNomeColunas' + dadosTabela.nomeTabela + '(4)');
	
	var paragrafo2 = paragrafo('text-center texto_grande', 'texto_label')
		.append(tituloColunas);
	
	var thTitulo = th().append(paragrafo2);
	
	var paragrafo1 = paragrafo('text-center texto_grande', 'texto_label')
		.append(botaoTabela);
	
	var thBotao = th().append(paragrafo1);
	
	var trAdd = tr('addColunas' + idTabela, '')
		.append(thBotao)
		.append(thTitulo);
	
	thTitulo.attr('colspan',
		tabelaCadastro.find('#nomeColunas' + idTabela + ' th').length - 1);
	
	tabelaCadastro.find('#theadtable' + dadosTabela.nomeTabela + ' tr:last')
		.before(trAdd);
	
	var tbodyTabela = tbody('tbody' + dadosTabela.nomeTabela);
	
	var nomeTabelaCadastro = campoOculto('nomeTabela' + dadosTabela.nomeTabela, 0);
	
	tabelaCadastro.append(tbodyTabela);
	
	var telaTabela = $("<div/>")
		.attr({id: 'div' + dadosTabela.nomeTabela})
		.addClass('form-table table-responsive');
	
	telaTabela.append(tabelaCadastro).append(nomeTabelaCadastro);
		
	return telaTabela;
	
}
/* =========================================================
 * limpaCampoSqlProcuraCore.js
 * http://lls.net.br/
 * ========================================================= */

function limpaCampoSqlProcuraCore(dados, tipo) {
	
	$('#' + tipo + 'ProcuraCadastro' + dados.nomeTabela + dados.campoProcura)
		.attr('disabled', false).val('');
			
	$('#' + tipo + dados.nomeTabela + dados.campoProcura + 'Mensagem')
		.text('').hide();
		
		
	$('#id'+ tipo + 'ProcuraCadastro' + dados.nomeTabela + dados.campoProcura + '2')
		.val(0);
		
	$('#id'+ tipo + 'ProcuraCadastro' + dados.nomeTabela + dados.campoProcura)
		.val(0);
	
}
/* =========================================================
 * novoCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function novoCadastroCore(dados) {
	
	marcarMenu(dados.posicaoItemMenu);
	
	if (dados.click == 'click') {
		
		if($('.navbar-toggle').css('display') !='none'){
		
			$(".navbar-toggle").trigger("click");
	
		}
	
	}
	
	dados.id = 0;
	
	var formulario = eval('formulario' + dados.nomeTabela + '(dados)');
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(0, eval('pegaNomeColunas' + dados.nomeTabela + '(3)')),
		'Altera' + dados.nomeTabela
	);
	
	formulario.find('#nomeProcuraCadastro' + dados.nomeTabela + 'FazendaProdutor').focus();

}
/* =========================================================
 * formularioRelatorioNomeDataTipoCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeDataTipoCore(dados, nomeTabelaProcura, nomeProcura, tipo, urlSearch) {
	
	if (urlSearch == null) urlSearch = 'eventoListaCadastroCore(' + JSON.stringify(dados) + ')';
	
	var formularioTipo = formularioRelatorioTipo(dados.nomeTabela, urlSearch, tipo);
	
	var divProcuraTipo = $('<div/>')
		.attr('id', 'tipoProcura' + dados.nomeTabela)
		.addClass('col-md-6')
		.append(formularioTipo);
	
	var divProcura = formularioRelatorioNomeDataAddCore(
		dados,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch
	);
	
	divProcura.find('#nomeProcura' + dados.nomeTabela)
		.removeClass('col-md-6')
		.addClass('col-md-12');
	
	divProcura.append(divProcuraTipo);
	
	return divProcura;
	
}
/* =========================================================
 * novoFormularioCore.js
 * http://lls.net.br/
 * ========================================================= */

function novoFormularioCore(dados) {
	
	if (dados.click == 'click') {
		
		if($('.navbar-toggle').css('display') !='none'){
		
			$(".navbar-toggle").trigger("click");
	
		}
	
	}
	
	tabelaRelatorioCore(dados);
	
	if (dados.textoLabel != 'Data') eventoListaCadastroCore(dados);

}
/* =========================================================
 * paginacaoCore.js
 * http://lls.net.br/
 * ========================================================= */

function paginacaoCore(dados, qtdPaginas) {
	
	var idPaginacao = 'paginaLista' + dados.nomeTabela;
	
	if (dados.pagina > 0) {
		
		var paginacao = $('#' + idPaginacao).unbind('page');
		
		if (qtdPaginas > 0) {
			
			paginacao.bootpag({
				total: Number(qtdPaginas),
				page: dados.pagina,
				maxVisible: 5,
				leaps: true,
				firstLastUse: true,
				first: '←',
				last: '→',
				wrapClass: 'pagination',
				activeClass: 'active',
				disabledClass: 'disabled',
				nextClass: 'next',
				prevClass: 'prev',
				lastClass: 'last',
				firstClass: 'first'
			}).on("page", function(event, num){
				
				dados.pagina = num;
				
				eventoListaCadastroCore(dados);
				
			}).show();
			
		}
		else paginacao.hide();
		
	}
	else {
		
		var paginacao = $('<div />')
			.attr('id', idPaginacao)
			.addClass('text-center texto')
			.unbind('page');
		
		return paginacao;
		
	}
	
}
/* =========================================================
 * setDadosDialogLancamentoCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogLancamentoCore(dados, nomesColunas, trDados) {
	
	setDadosDialogCadastroCore(dados, nomesColunas, trDados);
	
	var tableDialog = $('#divDialog' + dados.nomeTabela + ' #tableDialog' + dados.nomeTabela);
	
	if (dados.array.observacao != '' && dados.array.observacao != null) {
		
		var trObs = tr('trObservacao' + dados.nomeTabela, '')
			.append(tabelaCelula(dados.array.observacao, 'text-left', 'texto', 'tdObs')
				.attr('colspan', 3));
		
		tableDialog.find('tbody').append(trObs);
		
	}
	
	var idDialog = campoOculto('id' + dados.nomeTabela, dados.id);
	
	$('#divBotoes' + dados.nomeTabela).before(idDialog);
	
	var nomeTabela = dados.nomeTabelaLancamento[0];
	
	dados.nomeTabelaLancamento.splice(0, 1);
	
	var dadosLancamento = {
		id: dados.id,
		tipoOperacao: 1,
		posicaoItem: dados.posicaoItem,
		posicaoItemMenu: dados.posicaoItemMenu,
		nomeTabela: nomeTabela,
		nomeTabelaCadastro: dados.nomeTabela,
		nomeTabelaLancamento: dados.nomeTabelaLancamento
	}
	
	var urlBotaoLancamento = 'eventoAcharCadastroCore(' + JSON.stringify(dadosLancamento) + ')';
	
	var idBotaoLancamento = 'botaoLancamento' + dados.nomeTabela;
	
	var botaoLancamento = botaoHorizontal(
		idBotaoLancamento,
		dados.nomeBotaoLancamento,
		'fa-check', 4, 4,
		'btn btn-success',
		'button',
		urlBotaoLancamento
	).addClass('col-xs-5');
	
	$('#botaoAlterar' + dados.nomeTabela + 'FormGroup')
		.removeClass('col-xs-9').addClass('col-xs-4')
		.after(botaoLancamento);
	$('#botaoRemover' + dados.nomeTabela + 'FormGroup')
		.removeClass('col-xs-3').addClass('col-xs-3');
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	botaoLancamento.find('#botaoLancamento' + dados.nomeTabela)
		.attr('title', dados.nomeBotaoLancamento + " " + titulo + ': ' + dados.array.titulo);
	
	setBotoesDialogLancamentoCore(dados);
	
	dados.tipoOperacao = 1;
	dados.nomeTabelaCadastro = nomeTabela;
	
	setDadosTabelaLancamentoCore(dados);
	
}
/* =========================================================
 * campoSqlProcuraTextoRelatorioCore.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraTextoRelatorioCore(dados, textoLabel, nomeTabelaProcura, placeholder, tamanhoLabel) {
	
	var nomeTabelas = dados.nomeTabela + nomeTabelaProcura;
	
	var id = 'nomeProcura' + nomeTabelas;
	
	var idIconClear = 'spanIconClear' + nomeTabelas;
	var idGroupClear = 'spanGroupClear' + nomeTabelas;
	
	var idIconPrint = 'spanIconPrint' + nomeTabelas;
	var idGroupPrint = 'spanGroupPrint' + nomeTabelas;
	
	var inputSql = input(id, "text", "form-control", placeholder, false, 50)
		.css("font-weight","Bold")
		.css("font-size","15px");
	
	var spanGroupClear = span('input-group-addon')
		.attr('id', idGroupClear)
		.attr('title', "Todas as Fazendas");
	
	var spanIconClear = span('glyphicon-star glyphicon').attr('id', idIconClear);
	
	spanGroupClear.append(spanIconClear);
	
	var spanGroupPrint = span('input-group-addon')
		.attr('id', idGroupPrint)
		.attr('title', "Imprimir")
		.hide();
	
	var spanIconPrint = span('glyphicon-print glyphicon').attr('id', idIconPrint);
	
	spanGroupPrint.append(spanIconPrint);
	
	var campoSql = campoSqlProcura(
		"Nome",
		dados.nomeTabela,
		nomeTabelaProcura,
		"col-xs-10 col-md-10",
		tamanhoLabel,
		inputSql,
		id,
		3
	)
	
	spanGroupClear.click(function(){
		
		var campoMensagem = campoSql.find('#nome' + nomeTabelas + 'Mensagem');
		
		if (campoSql.find('.limpa').is(":visible")) {
		
			campoSql.find('.limpa').hide().trigger('change');
			
			spanIconClear.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
			
			spanGroupClear.attr('title', "1 Fazenda");
			
		}
		else {
			
			if (campoSql.find('#idnomeProcura' + nomeTabelas).val() > 0) {
			
				campoSql.find('.limpa').show().trigger('change');
				
			}
			
			spanIconClear.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
			
			spanGroupClear.attr('title', "Todas as Fazendas");
			
		}
		
    });
	
	spanGroupPrint.click(function(){
		
		dados.pagina = 0;
		
		var relatorio = eval('pegaProcura' + dados.nomeTabela + '(dados)');
		
		var url = "relatorio" + dados.nomeTabela;
		
		eval("eventoImprimir('" + url + "', relatorio)");
		
	});
	
	campoSql.find('#' + idGroupClear).click(function(){
		
		spanIconClear.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
		
    });
	
	campoSql.find('#' + nomeTabelas + 'DivGroup').append(spanGroupClear);
	campoSql.find('#' + nomeTabelas + 'DivGroup').append(spanGroupPrint);
	
	return campoSql;
	
}
/* =========================================================
 * setDadosFormularioRelatorioCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioRelatorioCore(dados) {
	
	dados.click = "click-off";
	dados.textoLabel = "Data";
	
	delete dados["array"];
	
	var tipo = $('#tipo' + dados.nomeTabela).val();
	var qtdTipo = $('#tipo' + dados.nomeTabela).find("option").length;
	
	novoFormularioCore(dados);
	
	if (tipo != null) {
		if (tipo < qtdTipo - 1) {
			if (dados.indexStatus != null) $('#tipo' + dados.nomeTabela).val(dados.indexStatus);
		}
		else $('#tipo' + dados.nomeTabela).val(tipo);
	}
	
	$('#dataInicial' + dados.nomeTabela).datepicker( "option", "maxDate", dados.data );
	$('#dataInicial' + dados.nomeTabela).datepicker("setDate", dados.data);
	
	$('#dataFinal' + dados.nomeTabela).datepicker( "option", "minDate", dados.data );
	$('#dataFinal' + dados.nomeTabela).datepicker("setDate", dados.data);
	
	$('#idnomeProcura' + dados.nomeTabela + 'FazendaProdutor').val(0);
	$('#idnomeProcura' + dados.nomeTabela + 'FazendaProdutor2').val(0);
	
	$('#nomeProcura' + dados.nomeTabela + 'FazendaProdutor').removeAttr('disabled').val("");
	
	$('#spanIconClear' + dados.nomeTabela + 'FazendaProdutor')
		.removeClass('glyphicon-plus').addClass('glyphicon-minus');
	
	$('#nomeProcura' + dados.nomeTabela + 'FazendaProdutorDivInput')
		.find('.limpa').text('').hide();
	
	$("#divDialogAltera" + dados.nomeTabela).find(".limpa").text("").hide();
	$("#divDialogAltera" + dados.nomeTabela).empty().remove().dialog( "close" );
	
	delete dados["data"];
	
	$('.ui-datepicker-current-day').click();
	
}
/* =========================================================
 * setDadosDialogImprimirCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogImprimirCore(dados, nomesColunas, trDados) {
	
	setDadosDialogLancamentoCore(dados, nomesColunas, trDados);
	
	if (dados.array.imprimir == 0) {
		
		var idBotaoPrint = 'botaoPrint' + dados.nomeTabela;
		
		var urlBotaoPrint = 'imprimirGuiaCafe(' + JSON.stringify(dados) + ')';
		
		var botaoPrint = botaoHorizontal(
			idBotaoPrint,
			"Imprimir",
			'fa-print', 4, 0,
			'btn  btn-primary',
			'button',
			urlBotaoPrint
		).addClass('col-xs-3');
		
		var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
		
		botaoPrint.find('#botaoPrint' + dados.nomeTabela)
			.attr('title', "Imprimir " + titulo + ': ' + dados.array.titulo);
		
		if (dados.tipo == "GR" ) {
			
			if ($('#botaoAlterar' + dados.nomeTabela).is(':visible')) {
				
				$('#botaoRemover' + dados.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
				$('#botaoAlterar' + dados.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
				$('#botaoLancamento' + dados.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
				
				$("#botaoAlterar" + dados.nomeTabela + "FormGroup").after(botaoPrint);
				
			}
			else {
				
				if (!$('#botaoLancamento' + dados.nomeTabela).is(':visible')) {
				
					$('#botaoRemover' + dados.nomeTabela + 'FormGroup').remove();
					$('#botaoPrint' + dados.nomeTabela + 'FormGroup').removeClass('col-xs-3').addClass('col-xs-4');
					$("#botaoAlterar" + dados.nomeTabela + "FormGroup").after(botaoPrint);
					
				}
				
			}
			
		}
		else {
			
			if (dados.array.indexStatus == 2) {
				
				$('#botaoRemover' + dados.nomeTabela + 'FormGroup').remove();
				$('#botaoPrint' + dados.nomeTabela + 'FormGroup').removeClass('col-xs-3').addClass('col-xs-4');
				$("#botaoAlterar" + dados.nomeTabela + "FormGroup").after(botaoPrint);
				
			}
			
		}
		
	}
	
}
/* =========================================================
 * campoSqlProcuraTextoCore.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraTextoCore(dados) {
	
	var id = 'nomeProcuraCadastro' + dados.nomeTabela + dados.campoProcura;
	
	if (dados.maxlength == null) dados.maxlength = 50;
	
	var inputProcura = input(
		id, "text",
		"form-control",
		dados.placeholder,
		false,
		dados.maxlength
	).css("font-weight","Bold").css("font-size","15px");
	
	if (dados.minChars == null) dados.minChars = 3;
	
	return campoSqlProcuraCore(dados, inputProcura, id);
	
}
/* =========================================================
 * setDadosTabelaCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaCadastroCore(dados) {
	
	var arrayDados = dados.array;
	
	delete dados["array"];
	
	dados.id = arrayDados.id;
	
	eval ("formataDados" + dados.nomeTabela + "(arrayDados)");
	
	var idLinha = dados.nomeTabela.toLowerCase() + "_" + arrayDados.id;
	
	var urlBotao = 'eventoAcharCadastroCore(' + JSON.stringify(dados) + ')';
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	var botaoVisualizar = botao(
		"botaoVisualizar", "", "fa-eye", "0", "btn btn-primary btn-xs", "button", urlBotao
	).attr('title', "Mostrar " + titulo + ': ' + arrayDados.titulo);
	
	var trTabela = tr(idLinha, "");
	
	$("#lista" + dados.nomeTabela + "Form #tableLista" + dados.nomeTabela +
		" #tbodyLista" + dados.nomeTabela + "").append(trTabela);
	
	arrayDados["nomeTabela"] = dados.nomeTabela;
	
	eval ("setDadosTabela" + dados.nomeTabela + "(arrayDados, trTabela, botaoVisualizar)");
	
}
/* =========================================================
 * setDadosFormularioCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioCore(dados) {
	
	eval ("formataDados" + dados.nomeTabela + "(dados)");
	
	var formulario = eval ("formulario" + dados.nomeTabela + "(dados)");
	
	mostraDialogAlterar(formulario,
						tituloPainelCadastro(0,
							eval('pegaNomeColunas' + dados.nomeTabela + '(4)')),
						'Altera' + dados.nomeTabela);
	
	jQuery.each( dados.array, function( i, value ) {
		
		formulario.find('#' + i + dados.nomeTabela).val(value);
		
	});
	
	$('#divDialogVisualiza' + dados.nomeTabelaCadastro).empty();
	$('#divDialogVisualiza' + dados.nomeTabelaCadastro).remove();
	$('#divDialogVisualiza' + dados.nomeTabelaCadastro).dialog( "close" );
	
	dados.tipoOperacao = 0;
	
	setDadosTabelaLancamentoCore(dados);
	
}
/* =========================================================
 * eventoRemoverCore.js
 * http://lls.net.br/
 * ========================================================= */

function eventoRemoverCore(dados) {
	
	$.ajax({
		type: "POST",
		url: dados.url,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(dados),
		success: function(resposta) {
			
			var cor_texto = 'texto_cor_vermelho';
			
			if (resposta.status == "200") {
			
				cor_texto = 'texto_cor_verde';
				
				dados["indexStatus"] = resposta.indexStatus;
				
				eval ('removeTotalTabela' + dados.nomeTabela + '(dados)');
				
			}
			
			mostraDialog(
				resposta.mensagem,
				cor_texto,
				'thead',
				tituloPainelCadastro(3, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
			);
			
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
 * mostraDialogOpcaoCore.js
 * http://lls.net.br/
 * ========================================================= */

function mostraDialogOpcaoCore(dados) {
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	var divDialogOpcao = divDialog(dados.textoMensagem, dados.corTexto);
	
	divDialogOpcao.dialog({
		title: tituloPainelCadastro(3, titulo),
		autoOpen: false,
		position: { my: 'center', at: 'center', of: $("#painel"), within: $('table') },
		width: 350,
		modal: true,
		buttons: [
			{
				id: "botaoSim",
				text: 'Sim',
				tabIndex: -1,
				click: function() {
					
					dados.id = divDialogOpcao.data('id');
					
					divDialogOpcao.dialog( "close" );
					
					if (dados.opcao == "Remover") eventoRemoverCore(dados);
					else eventoImprimir(dados.url, {id: dados.id});
					
				}
			},
			{
				id: "botaoNao",
				text: 'Não',
				click: function() {
					
					$( this ).dialog( "close" );
					
				}
			}
		],
		close: function (ev, ui) {
            $(this).dialog('destroy').remove();
        }
	});
	
	divDialogOpcao.data('id', dados.id).dialog("open");
	
	$("body").scrollTop('0');
}
/* =========================================================
 * setDadosDialogCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogCadastroCore(dados, nomesColunasCadastro, trDados) {
	
	var tbodyCadastro = tbody('tbodyDialog' + dados.nomeTabela).append(trDados);
	
	var tabelaCadastro = tabela(
		'tableDialog' + dados.nomeTabela,
		nomesColunasCadastro
	).append(tbodyCadastro);
	
	var divTabela = $('<div />')
		.attr('id', 'divTabelaDialog' + dados.nomeTabela)
		.addClass('form-table table-responsive')
		.append(tabelaCadastro);
	
	dados.tipoOperacao = 1;
	
	var urlBotaoAlterar = 'eventoAcharCadastroCore(' + JSON.stringify(dados) + ')';
	var urlBotaoRemover = 'removeCadastroCore(' + JSON.stringify(dados) + ')';
	
	var idBotaoAlterar = 'botaoAlterar' + dados.nomeTabela;
	var idBotaoRemover = 'botaoRemover' + dados.nomeTabela;
	
	var botaoAlterar = botaoHorizontal(
		idBotaoAlterar,
		'Alterar', 'fa-edit', 4, 0,
		'btn btn-warning',
		'button',
		urlBotaoAlterar
	).addClass('col-xs-9');
	
	var botaoRemover = botaoHorizontal(
		idBotaoRemover,
		'Excluir', 'fa-trash-alt', 4, 8,
		'btn btn-danger',
		'button',
		urlBotaoRemover
	).addClass('col-xs-3');
	
	var divBotoes = $('<div/>')
		.attr('id', 'divBotoes' + dados.nomeTabela)
		.addClass('row')
		.append(botaoAlterar)
		.append(botaoRemover);
	
	var divDados = $("<div/>")
		.attr('id', 'divDialog' + dados.nomeTabela)
		.append(divTabela)
		.append(divBotoes);
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	botaoRemover.find('#botaoRemover' + dados.nomeTabela)
		.attr('title', 'Excluir ' + titulo + ': ' + dados.array.titulo);
	botaoAlterar.find('#botaoAlterar' + dados.nomeTabela)
		.attr('title', 'Alterar ' + titulo + ': ' + dados.array.titulo);
	
	if (dados.array.remover == 0) {
		botaoRemover.find('#botaoRemover' + dados.nomeTabela).show();
	}
	else {
		botaoRemover.find('#botaoRemover' + dados.nomeTabela).hide();
	}
	
	if (dados.array.alterar == 0) {
		botaoAlterar.find('#botaoAlterar' + dados.nomeTabela).show();
	}
	else {
		botaoAlterar.find('#botaoAlterar' + dados.nomeTabela).hide();
	}
	
	mostraDialogAlterar(
		divDados,
		tituloPainelCadastro(4, titulo),
		'Visualiza' + dados.nomeTabela);
	
}
/* =========================================================
 * formularioCadastroCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioCadastroCore(dados, tabs) {
	
	dados["tipoTextoBotao"] = 2;
	dados["tamanhoBotao"] = 4;
	dados["tamanhoOffSet"] = 3;
	dados["tipoOperacao"] = 0;
		
	if (dados.id > 0) dados.tipoOperacao = 1;
	
	var campoId = campoOculto('id' + dados.nomeTabela, dados.id);
	
	var titulo = eval('pegaNomeColunas' + dados.nomeTabela + '(3)');
	
	var botao = botaoHorizontal(
		'botao' + dados.nomeTabela,
		textoBotao(dados.tipoTextoBotao),
		'fa-check',
		dados.tamanhoBotao,
		dados.tamanhoOffSet,
		'btn btn-block btn-success',
		'submit',
		''
	);
	
	botao.find('#botao').attr('title', 'Salvar ' + titulo);
	
	if (dados.id > 0) botao.find('#botao').attr('title', 'Salvar ' + titulo + ': ' + dados.array.titulo);
	
	botao.find('div').addClass('col-xs-5 col-xs-offset-4');
	
	var formulario = formularioHorizontal(dados.nomeTabela.toLowerCase(), 'form-horizontal')
		.append(tabs)
		.append(botao)
		.append(campoId);
	
	eval('validarFormulario' + dados.nomeTabela + '(dados, formulario)');
	
	return formulario;
	
}
/* =========================================================
 * validarFormularioCore.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioCore(dados, formulario) {
	
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
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eval("eventoSalvar" + dados.nomeTabela + "(dados)");
        }
    });
	
	validarFormulario();
	
}
/* =========================================================
 * formularioRelatorioNomeDataAddCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeDataAddCore(dados, nomeTabelaProcura, nomeProcura, urlSearch) {
	
	if (urlSearch == null) urlSearch = 'eventoListaCadastroCore(' + JSON.stringify(dados) + ')';
	
	dados.click = "click-off";
	
	var urlAdd = 'novoCadastroCore(' + JSON.stringify(dados) + ')';
	
	dados.click = "click";
	
	return formularioRelatorioNomeDataCore(
		dados,
		nomeTabelaProcura,
		nomeProcura,
		urlAdd,
		urlSearch
	);
		
}
/* =========================================================
 * formularioRelatorioNomeTipoCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeTipoCore(dados, nomeTabelaProcura, nomeProcura, tipo, urlSearch) {
	
	if (urlSearch == null) urlSearch = 'eventoListaCadastroCore(' + JSON.stringify(dados) + ')';
	
	var formularioTipo = formularioRelatorioTipo(dados.nomeTabela, urlSearch, tipo);
	
	var divProcuraTipo = $('<div/>')
		.attr('id', 'tipoProcura' + dados.nomeTabela)
		.append(formularioTipo);
	
	var divProcuraNome = formularioRelatorioNomeCore(
		dados,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch
	);
	
	var divProcura = $('<div/>')
		.attr('id', 'divProcura' + dados.nomeTabela)
		.addClass('row');
		
	var divProcura1 = $('<div/>').attr('id', 'nomeProcura' + dados.nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraNome);
		
	var divProcura2 = $('<div/>').attr('id', 'dataProcura' + dados.nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraTipo);
	
	divProcura.append(divProcura1).append(divProcura2);
	
	return divProcura;
	
}
/* =========================================================
 * formularioRelatorioNomeCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeCore(dados, nomeTabelaProcura, nomeProcura, urlSearch) {
	
	if (urlSearch == null) urlSearch = 'eventoListaCadastroCore(' + JSON.stringify(dados) + ')';
	
	var placeholder = "Digite o nome do " + nomeProcura.toLowerCase();
	
	var campoNomeProcura = campoSqlProcuraTextoRelatorioCore(
		dados,
		nomeProcura,
		nomeTabelaProcura,
		placeholder,
		2
	);
	
	var divProcuraNome = $('<div/>')
		.attr('id', 'inputGroup' + dados.nomeTabela)
		.addClass('input-group form-control formulario_cor')
		.append(campoNomeProcura);
	
	formularioRelatorioNomeHide(dados.nomeTabela, nomeTabelaProcura, urlSearch, divProcuraNome);
	
	return divProcuraNome;
	
}
/* =========================================================
 * formularioLancamentoCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioLancamentoCore(dados, arrayFormularios) {
	
	var dataInicial = $('#dataInicial' + dados.nomeTabela).datepicker("getDate")
	
	if (!$.isEmptyObject(dataInicial) && dados.tipoOperacao == 0) {
		
		dados.click = "click-off";
		
		novoFormularioCore(dados);
		
	}
	
	var tabs = divTabs(dados.nomeTabela, eval('nomeTabs' + dados.nomeTabela + '(1)'));
	
	if (arrayFormularios.length > 0) {
		
		for (var i = 1; i <= arrayFormularios.length; i++) {
			tabs.find('#tab' + dados.nomeTabela + i).append(arrayFormularios[i-1]);
		}
		
	}
	
	tabs.find('#tab' + dados.nomeTabela + '1').addClass('in active');
	tabs.find('#linha_tab' + dados.nomeTabela + '1').addClass('active');
	
	var formulario = formularioCadastroCore(dados, tabs);
	
	return formulario;
	
}
/* ================ telaMenuOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function telaMenuOpcoes(nomesItensMenu, opcoesMenu) {
	opcoesMenu = telaMenuBalanca(nomesItensMenu, opcoesMenu);
	opcoesMenu = telaMenuCafe(nomesItensMenu, opcoesMenu);
	opcoesMenu = telaMenuMilho(nomesItensMenu, opcoesMenu);
	return opcoesMenu;
}

/* ================ telaMenuMilho.js =======================
 * http://lls.net.br/
 * ========================================================= */

function telaMenuMilho(nomesItensMenu, opcoesMenu) {
	
	var menu = {
		projeto: "Milho",
		titulo: "Milho",
		icone: "leaf",
		posicao: "left"
	}
	
	return criarTelaMenu(nomesItensMenu, opcoesMenu, menu);
		
}

/* ================ telaMenuCafe.js =======================
 * http://lls.net.br/
 * ========================================================= */

function telaMenuCafe(nomesItensMenu, opcoesMenu) {
	
	var menu = {
		projeto: "Cafe",
		titulo: "Café",
		icone: "grain",
		posicao: "left"
	}
	
	return criarTelaMenu(nomesItensMenu, opcoesMenu, menu);
	
}

/* ================ telaMenuBalanca.js =======================
 * http://lls.net.br/
 * ========================================================= */

function telaMenuBalanca(nomesItensMenu, opcoesMenu) {
	
	var menu = {
		projeto: "Balanca",
		titulo: "Balança",
		icone: "scale",
		posicao: "left"
	}
	
	return criarTelaMenu(nomesItensMenu, opcoesMenu, menu);
	
}
/* ================ menuCadastrosOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function menuCadastrosOpcoes(nomesItensMenu, opcoesMenu) {
	opcoesMenu = menuCadastrosBalanca(nomesItensMenu, opcoesMenu);
	opcoesMenu = menuCadastrosCafe(nomesItensMenu, opcoesMenu);
	opcoesMenu = menuCadastrosMilho(nomesItensMenu, opcoesMenu);
	return opcoesMenu;
}

/* ================ menuCadastrosMilho.js ==================
 * http://lls.net.br/
 * ========================================================= */
 
function menuCadastrosMilho(nomesItensMenu, opcoesMenu) {
	
	var $item1 = 'novoFormulario("Umidade", "Codigo", "' + opcoesMenu.posicaoMenu + '", "click")';
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		separator: true,
		titulo: "Milho",
		icone: "dashboard",
		texto: "Tabela de Umidades de Milho",
		url: $item1
	}

	return opcoesMenu;
	
}

/* ================ menuCadastrosCafe.js ==================
 * http://lls.net.br/
 * ========================================================= */
 
function menuCadastrosCafe(nomesItensMenu, opcoesMenu) {
	
	var $item1 = 'novoFormulario("Peneira", "Nome", "' + opcoesMenu.posicaoMenu + '", "click")';
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		separator: true,
		titulo: "Café",
		icone: "filter",
		texto: "Cadastro de Peneiras de Café",
		url: $item1
	}
	
	return opcoesMenu;
	
}

/* ================ menuCadastrosBalanca.js ==================
 * http://lls.net.br/
 * ========================================================= */
 
function menuCadastrosBalanca(nomesItensMenu, opcoesMenu) {
	
	var $item1 = 'novoCadastro("Balanca", "click", "' + opcoesMenu.posicaoMenu + '")';
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		separator: true,
		titulo: "Balanca",
		icone: "scale",
		texto: "Conectar Balança",
		url: $item1
	}

	return opcoesMenu;
	
}
/* ================ menuRelatorioOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorioOpcoes(nomesItensMenu, opcoesMenu) {
	opcoesMenu = menuRelatorioBalanca(nomesItensMenu, opcoesMenu);
	opcoesMenu = menuRelatorioCafe(nomesItensMenu, opcoesMenu);
	opcoesMenu = menuRelatorioMilho(nomesItensMenu, opcoesMenu);
	return opcoesMenu;
}

/* ================ menuRelatorioMilho.js ==================
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorioMilho(nomesItensMenu, opcoesMenu) {
	
	var $item1 = 'novoFormulario("Entmilho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	var $item2 = 'novoFormulario("Saimilho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	var $item3 = 'novoFormulario("Milho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	var $item5 = 'novoFormulario("Movimentomilho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	var $item6 = 'novoFormulario("Servicomilho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	var $item7 = 'novoFormulario("Sintetizamilho", "find", "' + opcoesMenu.posicaoMenu + '", "click")';
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		separator: true,
		titulo: "Milho",
		icone: "align-left",
		texto: "Relação de Entradas de Milho",
		url: $item1
	}
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "align-right",
		texto: "Relação de Saídas de Milho",
		url: $item2
	}
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "stats",
		texto: "Saldo Geral de Milho",
		url: $item3
	}
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "sort-by-attributes",
		texto: "Relação de Faturamentos de Milho",
		url: $item5
	}
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "sort-by-attributes-alt",
		texto: "Relação de Serviços de Milho",
		url: $item6
	}
	
	opcoesMenu.qtdItensMenu++;
	
	nomesItensMenu[opcoesMenu.qtdItensMenu] = {
		icone: "indent-left",
		texto: "Relação Sintetizada de Serviços de Milho",
		url: $item7
	}
	
	return opcoesMenu;
	
}

/* ================ menuRelatorioCafe.js ==================
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorioCafe(nomesItensMenu, opcoesMenu) {
	
	var menu = {
		projeto: "Cafe",
		titulo: "Café"
	}
	
	var menuItens = [
		{
			separator: true,
			titulo: "Café",
			icone: "align-left",
			texto: "Relação de Entradas de " + menu.titulo
		},
		{
			icone: "align-center",
			texto: "Relação de Serviços de " + menu.titulo
		},
		{
			icone: "align-right",
			texto: "Relação de Saídas de " + menu.titulo
		},
		{
			icone: "align-justify",
			texto: "Relação de Transferências de " + menu.titulo
		},
		{
			icone: "sort-by-attributes-alt",
			texto: "Relação de Cobranças de " + menu.titulo
		},
		{
			icone: "sort-by-attributes",
			texto: "Relação de Faturamentos de " + menu.titulo
		},
		
		{
			icone: "list",
			texto: "Extrato do Produtor de " + menu.titulo
		},
		{
			icone: "stats",
			texto: "Saldo Geral de " + menu.titulo
		},
		{
			icone: "indent-left",
			texto: "Relação Sintetizada de Cobranças de " + menu.titulo
		}
	];
	
	return criarMenu(menu, menuItens, opcoesMenu.posicaoMenu, nomesItensMenu, opcoesMenu);
	
}

/* ================ menuRelatorioBalanca.js ==================
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorioBalanca(nomesItensMenu, opcoesMenu) {
	
	var menu = {
		projeto: "Balanca",
		titulo: "Balança"
	}
	
	var menuItens = [
		{
			separator: true,
			titulo: menu.titulo,
			icone: "list",
			texto: "Relação de Pesagens da " + menu.titulo
		}
	];
	
	return criarMenu(menu, menuItens, opcoesMenu.posicaoMenu, nomesItensMenu, opcoesMenu);
	
}
/* =========================================================
 * eventoSalvarUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarUsuario(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var senhas = pegaDadosFormularioUsuario(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: "alteraSenha",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(senhas),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioUsuario();
				
				$("#divDialogAlteraUsuario").empty();
				
				$("#divDialogAlteraUsuario").remove();
				
				$("#divDialogAlteraUsuario").dialog( "close" );
				
				mostrarMenu();
				
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
 * limpaDadosFormularioUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioUsuario() {
	
	$("#idUsuario").val("0");
	$('#senhaAtualUsuario').val('');
	$('#senhaNovaUsuario').val('');
	$('#senhaConfirmaUsuario').val('');
	
	$("#senhaAtualUsuario").focus();
	
}
/* =========================================================
 * validarFormularioUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioUsuario(tipoOperacao, nomeTabela, formulario) {
	
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
			senhaNovaUsuario: {checkSenhaMin: true,
							   checkSenhaFraca: true,
							   checkSenhaForte: true,
							   checkSenhaAtual: true},
			senhaConfirmaUsuario: {checkSenhaConfirma: true}
        },
        messages: {
			senhaAtualUsuario: {required: 'É necessário informar a senha atual!'},
			senhaNovaUsuario: {required: 'É necessário informar a nova senha!'},
			senhaConfirmaUsuario: {required: 'É necessário confirmar a nova senha!'}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
			eventoSalvarUsuario(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarFormularioSenha();
	
	jQuery.validator.addMethod("checkSenhaAtual", function(value, element) {
		
		var $validacao = false;

		var $senhaAtual = $('#senhaAtualUsuario').val();
		
		if (value == $senhaAtual) {
			$validacao = false;
		} else {
			$validacao = true;
		}
		
		return $validacao;
		
		}, "Senha nova igual a senha atual!"
	);
	
	jQuery.validator.addMethod("checkSenhaConfirma", function(value, element) {
		
		var $validacao = false;

		var $senhaNova = $('#senhaNovaUsuario').val();
		
		if (value == $senhaNova) {
			$validacao = true;
		} else {
			$validacao = false;
		}
		
		return $validacao;
		
		}, "Confirmação de senha incorreta!"
	);
	
}
/* =========================================================
 * pegaNomeColunasUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasUsuario(tipo) {
	
	nomesColunas = "Alteração de Senha";
		
	return nomesColunas;
	
}
/* =========================================================
 * pegaDadosFormularioUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioUsuario(nomeTabela) {
	
	var dados = {
		senhaAtual: $('#senhaAtual' + nomeTabela).val(),
		senhaNova: $('#senhaNova' + nomeTabela).val(),
		senhaConfirma: $('#senhaConfirma' + nomeTabela).val()
	}
	
	return dados;
	
}
/* =========================================================
 * formularioUsuario.js
 * http://lls.net.br/
 * ========================================================= */

function formularioUsuario(idUsuario, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $formTela = $("<div/>").attr({id: $idTela}).addClass("form-horizontal");
	
	var $campoSenhaAtual = campoTextoHorizontal(
		'senhaAtual' + nomeTabela, 'password', 'Senha Atual', 9 , 2, 'Digite a senha atual', true, 10
	);
	
	var $campoSenhaNova = campoTextoHorizontal(
		'senhaNova' + nomeTabela, 'password', 'Nova Senha', 9 , 2, 'Digite a nova senha', true, 10
	);
	
	var $campoSenhaConfirma = campoTextoHorizontal(
		'senhaConfirma' + nomeTabela, 'password', 'Confirma Senha', 9 , 2, 'Confirme a nova senha', true, 10
	);
	
	$formTela.append($campoSenhaAtual);
	$formTela.append($campoSenhaNova);
	$formTela.append($campoSenhaConfirma);
	
	var $formulario = formularioCadastro(1, nomeTabela, 2, 4, $formTela);
	
	return $formulario;
	
}
/* =========================================================
 * pegaNomeColunasEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasEmpresa(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		nome: "Nome",
		endereco: "Endereço",
		bairro: "Bairro",
		cidade: "Cidade",
		estado: "Estado",
		cep: "Cep",
		cpfcnpj: "CPF|CNPJ",
		ie: "Insc. Est.",
		email: "Email",
		site: "Site",
		telefone: "Telefone"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Empresa";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * eventoAcharEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharEmpresa(formulario) {
	
	$.ajax({
		type: "POST",
		url: 'achaEmpresa',
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		success: function(result) {
			
			if (result.status == '200') {
	
				setDadosFormularioEmpresa(result, formulario);

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
 * limpaDadosFormularioEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioEmpresa() {
	
	$("#idEmpresa").val("0");
	$('#nomeEmpresa').val('');
	$('#enderecoEmpresa').val('');
	$('#bairroEmpresa').val('');
	$('#cidadeEmpresa').val('');
	$('#estadoEmpresa').val('');
	$('#cepEmpresa').val('');
	$('#cpfcnpjEmpresa').val('');
	$('#ieEmpresa').val('');
	$('#emailEmpresa').val('');
	$('#siteEmpresa').val('');
	$('#telefoneEmpresa').val('');
	
	$("#nomeEmpresa").focus();
	
}
/* =========================================================
 * formataDadosEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosEmpresa(empresa) {
	
	empresa.nome = decodeURIComponent(empresa.nome);
	empresa.endereco = decodeURIComponent(empresa.endereco);
	empresa.bairro = decodeURIComponent(empresa.bairro);
	empresa.cidade = decodeURIComponent(empresa.cidade);
	
	empresa.cpfcnpj = pegaCpfCnpjMascara(empresa.cpfcnpj);
	
	empresa.cep = pegaCepMascara(empresa.cep);
	
	empresa.telefone = pegaTelefoneMascara(empresa.telefone);
	
}
/* =========================================================
 * eventoSalvarEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarEmpresa(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var empresa = pegaDadosFormularioEmpresa(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: "salvaEmpresa",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({empresa: empresa}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioEmpresa();
				
				$("#divDialogAlteraEmpresa").empty();
				
				$("#divDialogAlteraEmpresa").remove();
				
				$("#divDialogAlteraEmpresa").dialog( "close" );
				
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
 * setDadosFormularioEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioEmpresa(empresa, formulario) {
	
	formataDadosEmpresa(empresa);
				
	formulario.find('#idEmpresa').val(empresa.id);
	formulario.find('#nomeEmpresa').val(empresa.nome);
	formulario.find('#enderecoEmpresa').val(empresa.endereco);
	formulario.find('#bairroEmpresa').val(empresa.bairro);
	formulario.find('#cidadeEmpresa').val(empresa.cidade);
	formulario.find('#estadoEmpresa').val(empresa.estado);
	formulario.find('#cepEmpresa').val(empresa.cep);
	formulario.find('#cpfcnpjEmpresa').val(empresa.cpfcnpj);
	formulario.find('#ieEmpresa').val(empresa.ie);
	formulario.find('#emailEmpresa').val(empresa.email);
	formulario.find('#siteEmpresa').val(empresa.site);
	formulario.find('#telefoneEmpresa').val(empresa.telefone);
	
	if (empresa.cpfcnpj.length == 18) {
		
		formulario.find('#cpfcnpjEmpresa' + 'RadioCnpj').attr('checked', 'true');
		formulario.find('#cpfcnpjEmpresa').mask("99.999.999/9999-99");
		formulario.find('#cpfcnpjEmpresa').attr('placeholder', '__.___.___/____-__');
		formulario.find('#cpfcnpjEmpresa' + 'Label').text('CNPJ');
		
	}
	
	formulario.find('#dataMilhoEmpresa').datepicker('setDate', empresa.dataMilho);
	formulario.find('#dataCafeEmpresa').datepicker('setDate', empresa.dataCafe);
	
	$('#ui-datepicker-div').find('.ui-datepicker-month').attr('name', 'datepicker-month');
	$('#ui-datepicker-div').find('.ui-datepicker-year').attr('name', 'datepicker-year');
	
}
/* =========================================================
 * formularioEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function formularioEmpresa(idEmpresa, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $telaEndereco = telaEndereco(nomeTabela);
	
	var $campoCpfCnpj = campoCpfCnpjHorizontal(
		'cpfcnpj' + nomeTabela, 'CPF',
		'col-xs-9 col-md-7', 'col-xs-2', false
	);
	
	var $campoIE = campoTextoHorizontal(
		'ie' + nomeTabela, 'text', 'I.E.', 9, 2, '', false, 20
	);
	
	var $campoEmail = campoTextoHorizontal(
		'email' + nomeTabela, 'email', 'Email', 9 , 2, '', false, 50
	);
	
	var $campoSite = campoTextoHorizontal(
		'site' + nomeTabela, 'text', 'Site', 9 , 2, '', false, 50
	);
	
	var $campoTelefone = campoTelefoneHorizontal(
		'telefone' + nomeTabela, 'Telefone', 9, 2, true
	);
	
	var $campoDataMilho = campoDataHorizontal(
		"dataMilho" + nomeTabela, "Fat. Milho",
		'col-xs-9 col-md-7', 'col-xs-2',
		true, null, null, null,
		'disabled'
	).removeClass("has-feedback");
	
	var $campoDataCafe = campoDataHorizontal(
		"dataCafe" + nomeTabela, "Fat. Café",
		'col-xs-9 col-md-7', 'col-xs-2',
		true, null, null, null,
		'disabled'
	).removeClass("has-feedback");
	
	$telaEndereco.append($campoCpfCnpj);
	
	$telaEndereco.append($campoIE);
	
	var $telaContato = $("<div/>")
		.addClass("form-horizontal")
		.append($campoEmail)
		.append($campoSite)
		.append($campoTelefone)
		.append($campoDataMilho)
		.append($campoDataCafe);
	
	var $nomesTabs = { 
		tab1: "Dados",
		tab2: "Contatos"
	};
	
	var $tabs = divTabs(nomeTabela, $nomesTabs);
	
	$tabs.find('#tab1').addClass('in active');
	
	$tabs.find('#linha_tab1').addClass('active');
	
	$tabs.find('#tab1').append($telaEndereco);
	
	$tabs.find('#tab2').append($telaContato);
	
	var $formulario = formularioCadastro(idEmpresa, nomeTabela, 2, 4, $tabs);
	
	eventoAcharEmpresa($formulario);
	
	$('#ui-datepicker-div').find('.ui-datepicker-month').attr('name', 'datepicker-month');
	$('#ui-datepicker-div').find('.ui-datepicker-year').attr('name', 'datepicker-year');
	
	return $formulario;
	
}
/* =========================================================
 * pegaDadosFormularioEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioEmpresa(nomeTabela) {
	
	var dados = {
		id: $('#id' + nomeTabela).val(),
		nome: encodeURIComponent( unescape($('#nome' + nomeTabela).val())),
		endereco: encodeURIComponent( unescape($('#endereco' + nomeTabela).val())),
		bairro: encodeURIComponent( unescape($('#bairro' + nomeTabela).val())),
		cidade: encodeURIComponent( unescape($('#cidade' + nomeTabela).val())),
		estado: pegaValorCaixaCombinacao($('#estado' + nomeTabela).val()),
		cep: pegaCepNumeros($('#cep' + nomeTabela).val()),
		cpfcnpj: pegaCpfCnpjNumeros($('#cpfcnpj' + nomeTabela).val()),
		ie: $('#ie' + nomeTabela).val(),
		email: $('#email' + nomeTabela).val(),
		site: $('#site' + nomeTabela).val(),
		telefone: pegaTelefoneNumeros($('#telefone' + nomeTabela).val()),
		dataMilho: $("#dataMilho" + nomeTabela).datepicker("getDate"),
		dataCafe: $("#dataCafe" + nomeTabela).datepicker("getDate")
	}
	
	return dados;
	
}
/* =========================================================
 * validarFormularioEmpresa.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioEmpresa(tipoOperacao, nomeTabela, formulario) {
	
	formulario.validate({
        ignore: ".ignore",
        highlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).addClass('glyphicon-remove');
			jQuery(element).closest('.form-group').addClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpj' + nomeTabela) {
					
				jQuery(element).parent().parent().addClass('has-error has-feedback');
				
			}
			
		},
		unhighlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).removeClass('glyphicon-remove');
			jQuery(element).closest('.form-group').removeClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpj' + nomeTabela) {
					
				jQuery(element).parent().parent().removeClass('has-error has-feedback');
					
			}
			
		},
        validClass:'success',
        errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.form-group').length) {
				error.insertAfter(element.parent());
			} else {
				if (element.attr('id') == 'cpfcnpj' + nomeTabela) {
					
					error.insertAfter(element.parent());
					
				}
				else {
				
					error.insertAfter(element);
				}
			}
		},
		rules: {
            nomeEmpresa: {required: true,
						   noSpace: true},
			siteEmpresa: {checkurl: true},
			cpfcnpjEmpresa: {validacpfcnpj: true}
        },
        messages: {
			nomeEmpresa: 'É necessário informar o nome da ' + nomeTabela.toLowerCase() + '!',
			numeroEmpresa: 'É necessário informar o número do telefone!',
			siteEmpresa: 'Site informado de forma errada!',
			emailEmpresa: 'Email informado de forma errada!',
			cpfcnpjEmpresa: 'É necessário preencher esse campo!'
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarEmpresa(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarCpfCnpj();
	
}
/* =========================================================
 * formataDadosPreco.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosPreco(preco) {
	
	preco.nome = decodeURIComponent(preco.nome);
	
	preco.valor = formataNumero(preco.valor, 2, false, false, "R$ ", "");
	
	preco["alterar"] = 0;
	preco["remover"] = 1;
	
	$('#nomeProcuraBotaoAdd').hide();
	
}
/* =========================================================
 * setDadosFormularioPreco.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioPreco(preco) {
	
	formataDadosPreco(preco);
	
	$("#divDialogAlteraPreco").empty();
	
	$("#divDialogAlteraPreco").remove();
	
	var formulario = formularioPreco(preco.id, preco.nomeTabela);
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(1, eval('pegaNomeColunas' + preco.nomeTabela + '(3)')), "Altera" + preco.nomeTabela);
	
	formulario.find("#idPreco").val(preco.id);
	formulario.find("#valorPreco").val(preco.valor);
	formulario.find("#nomePreco").val(preco.nome);
	
}
/* =========================================================
 * formularioPreco.js
 * http://lls.net.br/
 * ========================================================= */

function formularioPreco(idPreco, nomeTabela) {
	
	var $idTela = "div" + nomeTabela;
	
	var $formTela = $("<div/>").attr({id: $idTela});
	
	var $campoNome = campoTextoHorizontal("nome" + nomeTabela, "text", "Nome", 9, 2, "", false, 50);
	
	var $campoValor = campoNumeroHorizontal("valor" + nomeTabela, "Valor", 9, 2, 2, 4, false, false, "R$ ", "");
	
	$formTela.append($campoNome);
	
	$formTela.append($campoValor);
	
	var $formulario = formularioCadastro(idPreco, nomeTabela, 2, 4, $formTela);
	
	return $formulario;
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraPreco.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraPreco(id) {
	
	var tipo = $('#id' + id + '2').val();
	
	if (tipo == '') tipo = 0;
	
	var dados = {
		id: tipo,
		nome: $('#' + id).val()
	}
	
	return dados;
	
}
/* =========================================================
 * pegaNomeColunasPreco.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasPreco(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		nome: "Nome",
		valor: "Valor"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Preço";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosTabelaPreco.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaPreco(preco) {
	
	formataDadosPreco(preco);
	
	var $idLinha = "preco_" + preco.id;
	
	var $urlBotao = 'mostraCadastro("' + preco.id + '" , "Preco")';
	
	var $botaoVisualizar = botao(
		"botaoVisualizar" + preco.id, "", "fa-eye", "0", "btn btn-primary btn-xs", "button", $urlBotao
	);
	
	var $tbody = $("#listaPrecoForm #tableListaPreco #tbodyListaPreco");
	
	if (preco.tipoOperacao == 0) {
		
		var $tr = tr($idLinha, "");
		
		$tr.append(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
		$tr.append(tabelaCelula(preco.nome, "text-left", "texto", "tdNome"));
		$tr.append(tabelaCelula(preco.valor, "text-right", "texto", "tdValor"));
		
		$tbody.append($tr);
		
	}
	else {
		
		var $tr = $tbody.find("#" + $idLinha);
		
		$tr.find("#tdBotao").replaceWith(tabelaCelula($botaoVisualizar, "text-center", "texto", "tdBotao"));
		$tr.find("#tdNome").replaceWith(tabelaCelula(preco.nome, "text-left", "texto", "tdNome"));
		$tr.find("#tdValor").replaceWith(tabelaCelula(preco.valor, "text-right", "texto", "tdValor"));
	
	}
	
}
/* =========================================================
 * pegaDadosFormularioPreco.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioPreco(nomeTabela) {
	
	var dados = {
		id: $("#id" + nomeTabela).val(),
		nome: encodeURIComponent( unescape($("#nome" + nomeTabela).val())),
		valor: formataNumeroSql($("#valor" + nomeTabela).val())
	}
	
	return dados;
	
}
/* =========================================================
 * pegaProcuraPreco.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraPreco(pagina) {
	
	var dados = {
		"id": pagina,
		"nome": $("#nomeProcura").val()
	}
	
	return dados;
	
}
/* =========================================================
 * removeTotalTabelaPreco.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaPreco(idLinha) {}
/* =========================================================
 * setDadosDialogPreco.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogPreco(preco) {
	
	formataDadosPreco(preco);
	
	var $idLinha = "trPrecoDialog_" + preco.id;
	
	var $trPreco = tr($idLinha, "");
	
	$trPreco.append(tabelaCelula(preco.nome, "text-left", "texto", "tdNome"));	
	$trPreco.append(tabelaCelula(preco.valor, "text-right", "texto", "tdValor"));
	
	setDadosDialogCadastro(preco, null, $trPreco);
	
}
/* =========================================================
 * limpaDadosFormularioPreco.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioPreco() {
	
	$("#idPreco").val("0");
	$("#valorPreco").val("");
	$("#nomePreco").val("");
	
	$("#nomePreco").focus();
	
}
/* =========================================================
 * validarFormularioPreco.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioPreco(tipoOperacao, nomeTabela, formulario) {
	
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
            valorPreco: {required: true},
			nomePreco: {required: true, noSpace: true}
        },
        messages: {
			valorPreco: "É necessário informar o valor!",
			nomePreco: "É necessário informar o nome!"
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarPreco(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
}
/* =========================================================
 * eventoSalvarPreco.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarPreco(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "check", true);
	
	var preco = pegaDadosFormularioPreco(nomeTabela);
	
	$.ajax({
		type: "POST",
		url: "salvaPreco",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify({preco: preco}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = "";
			
			if (resposta.status == "200") {
				
				$cor_texto = "texto_cor_verde";
				
				limpaDadosFormularioPreco();
				
				$("#divDialogAlteraPreco").empty();
				
				$("#divDialogAlteraPreco").remove();
				
				$("#divDialogAlteraPreco").dialog( "close" );
				
				preco["tipoOperacao"] = tipoOperacao;
				
				if (tipoOperacao == 0) {
					
					$("#nomeProcura").val(decodeURIComponent(preco.nome));
					
					eventoListaCadastro(1, nomeTabela);
					
				}
				else {
					
					setDadosTabelaPreco(preco);
					
				}
				
			}
			else {
				
				animacao("botao" + nomeTabela, "check", false, number);
				
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
			
			animacao("botao" + nomeTabela, "check", false, number);
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}
/* =========================================================
 * campoSqlProcuraPreco.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraPreco(suggestion, tipo) {
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<h5 class="' + 'list-group-item-heading"' + '>' + suggestion.value + '</h5>' +
			'<p class="' + 'list-group-item-text"' + '><b><i>' +
				suggestion.data.valor + ' ' + '</i></b></p>' +
		'</div>';
					
	}
	else {
		
		return {
			texto: suggestion.data.valor,
			valor: suggestion.value
		};
		
	}
	
}
/* =========================================================
 * campoTextoProcuraPreco.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoProcuraPreco() {
	
	return input("nomeProcura", "text", "form-control", "", false, 50);
	
}
/* =========================================================
 * setDadosRodapePreco.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapePreco(rodape) {
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Preços: " + rodape[0].qtd);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd').attr('colspan', 3);
	
	var trRodape = tr('nomeRodape' + rodape.nomeTabela, '').append(th1);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * pegaDadosSqlProcuraPreco.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraPreco(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
		
		var $valor = formataNumero(data.valor, 2, false, false, "R$ ", "");
		
		return {
			value: data.nome,
			data: {
				id: data.id,
				valor: $valor
			}
		};
		
	});

}
/* =========================================================
 * nomeTabsProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function nomeTabsProdutor() {
	
	var $nomesTabs = { 
		tabProdutor1: "Dados",
		tabProdutor2: "Fazendas",
		tabProdutor3: "Telefones",
		tabProdutor4: "Observações"
	};
	
	return $nomesTabs;
	
}
/* =========================================================
 * limpaDadosFormularioProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioProdutor() {
	
	$('#idProdutor').val('0');
	$('#nomeProdutor').val('');
	$('#enderecoProdutor').val('');
	$('#bairroProdutor').val('');
	$('#cidadeProdutor').val('');
	$('#estadoProdutor').val('');
	$('#cepProdutor').val('');
	$('#emailProdutor').val('');
	$('#siteProdutor').val('');
	$('#cpfcnpjProdutor').val('');
	$('#observacaoProdutor').val('');
	
	$('#nomeProdutor').focus();
	
}
/* =========================================================
 * pegaNomeColunasProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasProdutor(tipo) {
	
	var nomesColunas = { 
		visualizar: "Ver",
		nome: "Nome",
		cpfcnpj: "CPF|CNPJ",
		endereco: "Endereço",
		bairro: "Bairro",
		cidade: "Cidade",
		estado: "Estado",
		cep: "Cep"
	};
	
	if (tipo == 1) {
		
		delete nomesColunas["visualizar"];
		
	}
	
	if (tipo == 3) {
		
		nomesColunas = "Produtor";
		
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * setDadosDialogProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogProdutor(produtor) {
	
	formataDadosProdutor(produtor);
	
	var $textoNome = juntaTituloTexto('Nome', produtor.nome);
	var $textoEndereco = juntaTituloTexto('Endereço', produtor.endereco);
	var $textoBairro = juntaTituloTexto('Bairro', produtor.bairro);
	var $textoCidade = juntaTituloTexto('Cidade', produtor.cidade);
	var $textoCep = juntaTituloTexto('Cep', produtor.cep);
	var $textoEmail = juntaTituloTexto('Email', produtor.email);
	var $textoSite = juntaTituloTexto('Site', produtor.site);
	
	if (produtor.cpfcnpj.length == 14) {
		
		var $textoCpfCnpj = juntaTituloTexto('CPF', produtor.cpfcnpj);
		
	}
	else if (produtor.cpfcnpj.length == 18) {
		
		var $textoCpfCnpj = juntaTituloTexto('CNPJ', produtor.cpfcnpj);
		
	}
	else {
		
		var $textoCpfCnpj = '';
		
	}
	
	var $arrayLinhaCidade = {
		"linha1": $textoCidade,
		"linha2": produtor.estado
	};
	
	var $arrayProdutor = {
		"coluna1": $textoNome,
		"coluna2": $textoEndereco,
		"coluna3": $textoBairro,
		"coluna4": juntaTexto($arrayLinhaCidade),
		"coluna5": $textoCep,
		"coluna6": $textoEmail,
		"coluna7": $textoSite,
		"coluna8": $textoCpfCnpj,
	};
	
	var $nomesColunasProdutor = {
		"coluna1": "Endereço",
		"coluna2": "Observações"
	};
	
	var $idLinha = 'trProdutorDialog_' + produtor.id;
	
	var $trProdutor = tr($idLinha, '');
	
	$trProdutor.append(juntaColunas($arrayProdutor, 'text-left', 'texto', 'tdProdutor'));
	
	$trProdutor.append(tabelaCelula(produtor.observacao, 'text-left', 'texto', 'tdObservacao'));
	
	produtor["nomeTabela"] = 'Produtor';
	
	setDadosDialogCadastro(produtor, $nomesColunasProdutor, $trProdutor);
	
	var telefonesArray = produtor.telefones;
	
	if (telefonesArray != null) {
		
		var $tabelaTelefone = pegaTabelaCadastro(telefonesArray, 'Telefone');
		
		$('#divDialog' + produtor.nomeTabela + ' #tableDialog' + produtor.nomeTabela).after($tabelaTelefone);
		
	}
	
	var fazendasArray = produtor.fazendas;
	
	if (fazendasArray != null) {
		
		var $tabelaFazenda = pegaTabelaCadastro(fazendasArray, 'Fazenda');
		
		$('#divDialog' + produtor.nomeTabela + ' #tableDialog' + produtor.nomeTabela).after($tabelaFazenda);
		
	}
	
}
/* =========================================================
 * pegaDadosFormularioProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioProdutor(nomeTabela) {
	
	var dados = {
		id: $('#id' + nomeTabela).val(),
		nome: encodeURIComponent( unescape($('#nome' + nomeTabela).val())),
		endereco: encodeURIComponent( unescape($('#endereco' + nomeTabela).val())),
		bairro: encodeURIComponent( unescape($('#bairro' + nomeTabela).val())),
		cidade: encodeURIComponent( unescape($('#cidade' + nomeTabela).val())),
		estado: pegaValorCaixaCombinacao($('#estado' + nomeTabela).val()),
		cep: pegaCepNumeros($('#cep' + nomeTabela).val()),
		email: $('#email' + nomeTabela).val(),
		site: $('#site' + nomeTabela).val(),
		cpfcnpj: pegaCpfCnpjNumeros($('#cpfcnpj' + nomeTabela).val()),
		observacao: encodeURIComponent( unescape($('#observacao' + nomeTabela).val()))
	}
	
	return dados;
	
}
/* =========================================================
 * setDadosFormularioProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioProdutor(produtor) {
	
	formataDadosProdutor(produtor);
	
	$('#divDialogAlteraProdutor').empty();
	
	$('#divDialogAlteraProdutor').remove();
	
	var formulario = formularioProdutor(produtor.id, produtor.nomeTabela);
	
	mostraDialogAlterar(formulario, tituloPainelCadastro(1, produtor.nomeTabela), 'Altera' + produtor.nomeTabela);
	
	formulario.find('#idProdutor').val(produtor.id);
	formulario.find('#nomeProdutor').val(produtor.nome);
	formulario.find('#enderecoProdutor').val(produtor.endereco);
	formulario.find('#bairroProdutor').val(produtor.bairro);
	formulario.find('#cidadeProdutor').val(produtor.cidade);
	formulario.find('#estadoProdutor').val(produtor.estado);
	formulario.find('#cepProdutor').val(produtor.cep);
	formulario.find('#emailProdutor').val(produtor.email);
	formulario.find('#siteProdutor').val(produtor.site);
	formulario.find('#cpfcnpjProdutor').val(produtor.cpfcnpj);
	formulario.find('#observacaoProdutor').val(produtor.observacao);
	
	if (produtor.cpfcnpj.length == 18) {
		
		formulario.find('#cpfcnpjProdutorRadioCnpj').attr('checked', 'true');
		formulario.find('#cpfcnpjProdutor').mask("99.999.999/9999-99");
		formulario.find('#cpfcnpjProdutor').attr('placeholder', '__.___.___/____-__');
		formulario.find('#cpfcnpjProdutorLabel').text('CNPJ');
		
	}
	
	setDadosTabelaCadastro(produtor.fazendas, 'Fazenda');
	
	setDadosTabelaCadastro(produtor.telefones, 'Telefone');
	
}
/* =========================================================
 * setDadosTabelaProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaProdutor(produtor) {
	
	formataDadosProdutor(produtor);
	
	var $idLinha = 'produtor_' + produtor.id;
	
	var $urlBotao = 'mostraCadastro("' + produtor.id + '" , "Produtor")';
	
	var $botaoVisualizar = botao('botaoVisualizar' + produtor.id, '', 'fa-eye', '0', 'btn btn-primary btn-xs', 'button', $urlBotao);
	
	var $tbody = $('#listaProdutorForm #tableListaProdutor #tbodyListaProdutor');
	
	if (produtor.tipoOperacao == 0) {
		
		var $tr = tr($idLinha, '');
		
		$tr.append(tabelaCelula($botaoVisualizar, 'text-center', 'texto', 'tdBotao'));
		$tr.append(tabelaCelula(produtor.nome, 'text-left', 'texto', 'tdNome'));
		$tr.append(tabelaCelula(produtor.cpfcnpj, 'text-center', 'texto', 'tdCpfCnpj'));
		$tr.append(tabelaCelula(produtor.endereco, 'text-left', 'texto', 'tdEndereco'));
		$tr.append(tabelaCelula(produtor.bairro, 'text-left', 'texto', 'tdBairro'));
		$tr.append(tabelaCelula(produtor.cidade, 'text-center', 'texto', 'tdCidade'));
		$tr.append(tabelaCelula(produtor.estado, 'text-center', 'texto', 'tdEstado'));
		$tr.append(tabelaCelula(produtor.cep, 'text-center', 'texto', 'tdCep'));
		
		$tbody.append($tr);
		
	}
	else {
		
		var $tr = $tbody.find('#' + $idLinha);
		
		$tr.find("#tdBotao")
			.replaceWith(tabelaCelula($botaoVisualizar, 'text-center', 'texto', 'tdBotao'));
		$tr.find("#tdNome")
			.replaceWith(tabelaCelula(produtor.nome, 'text-left', 'texto', 'tdNome'));
		$tr.find("#tdCpfCnpj")
			.replaceWith(tabelaCelula(produtor.cpfcnpj, 'text-center', 'texto', 'tdCpfCnpj'));
		$tr.find("#tdEndereco")
			.replaceWith(tabelaCelula(produtor.endereco, 'text-left', 'texto', 'tdEndereco'));
		$tr.find("#tdBairro")
			.replaceWith(tabelaCelula(produtor.bairro, 'text-left', 'texto', 'tdBairro'));
		$tr.find("#tdCidade")
			.replaceWith(tabelaCelula(produtor.cidade, 'text-center', 'texto', 'tdCidade'));
		$tr.find("#tdEstado")
			.replaceWith(tabelaCelula(produtor.estado, 'text-center', 'texto', 'tdEstado'));
		$tr.find("#tdCep")
			.replaceWith(tabelaCelula(produtor.cep, 'text-center', 'texto', 'tdCep'));
		
	}
	
}
/* =========================================================
 * setDadosRodapeProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeProdutor(rodape) {
	
	var paragrafo1 = paragrafo('text-center', 'texto').append("Total de Produtores: " + rodape[0].qtd);
	
	var th1 = th().append(paragrafo1).attr('id', 'qtd').attr('colspan', 8);
	
	var trRodape = tr('nomeRodape' + rodape.nomeTabela, '').append(th1);
	
	$("#tfoottableLista" + rodape.nomeTabela).append(trRodape);
	
}
/* =========================================================
 * removeTotalTabelaProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaProdutor(idLinha) {}
/* =========================================================
 * pegaProcuraProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraProdutor(pagina) {
	
	var dados = {
		"id": pagina,
		"nome": $("#nomeProcura").val()
	}
	
	return dados;
	
}
/* =========================================================
 * formataDadosProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosProdutor(produtor) {
	
	produtor.nome = decodeURIComponent(produtor.nome);
	produtor.endereco = decodeURIComponent(produtor.endereco);
	produtor.bairro = decodeURIComponent(produtor.bairro);
	produtor.cidade = decodeURIComponent(produtor.cidade);
	produtor.observacao = decodeURIComponent(produtor.observacao);
	
	produtor.cpfcnpj = pegaCpfCnpjMascara(produtor.cpfcnpj);
	
	produtor.cep = pegaCepMascara(produtor.cep);
	
	produtor["alterar"] = 0;
	produtor["remover"] = 1;
	
	$('#nomeProcuraBotaoAdd').attr('title', 'Adicionar novo produtor!');
	
}
/* =========================================================
 * campoTextoProcuraProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoProcuraProdutor() {
	
	return input("nomeProcura", "text", "form-control", "", false, 50);
	
}
/* =========================================================
 * validarFormularioProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioProdutor(tipoOperacao, nomeTabela, formulario) {
	
	formulario.validate({
        ignore: ".ignore",
        highlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).addClass('glyphicon-remove');
			jQuery(element).closest('.form-group').addClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpj' + nomeTabela) {
					
				jQuery(element).parent().parent().addClass('has-error has-feedback');
				
			}
			
		},
		unhighlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).removeClass('glyphicon-remove');
			jQuery(element).closest('.form-group').removeClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpj' + nomeTabela) {
					
				jQuery(element).parent().parent().removeClass('has-error has-feedback');
					
			}
			
		},
        validClass:'success',
        errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.form-group').length) {
				error.insertAfter(element.parent());
			} else {
				if (element.attr('id') == 'cpfcnpj' + nomeTabela) {
					
					error.insertAfter(element.parent());
					
				}
				else {
				
					error.insertAfter(element);
				}
			}
		},
		rules: {
            nomeProdutor: {required: true,
						   noSpace: true},
			siteProdutor: {checkurl: true},
			cpfcnpjProdutor: {validacpfcnpj: true},
			nomeTabelaFazenda: {checkrowfazenda: true}
        },
        messages: {
			nomeProdutor: 'É necessário informar o nome do ' + nomeTabela.toLowerCase() + '!',
			emailProdutor: 'Email informado de forma errada!',
			siteProdutor: 'Site informado de forma errada!',
			cpfcnpjProdutor: 'É necessário preencher esse campo!'
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
            eventoSalvarProdutor(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarCpfCnpj();
	
	jQuery.validator.addMethod("checkrowfazenda", function(value, element) {
		
		var $rowCount = jQuery($('#tbodyFazenda')).find('tr').length;
		
		if ($rowCount > 0) {
			
			return true;
			
		}
		else {
			
			mostraDialog(
				'É necessário adicionar uma fazenda!',
				'texto_cor_vermelho',
				'table',
				tituloPainelCadastro(0, nomeTabela)
			);
			
			return false;
			
		}
		
		}, ""
	);
	
}
/* =========================================================
 * telaEnderecoProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function telaEnderecoProdutor(nomeTabela) {
	
	var $telaEndereco = telaEndereco(nomeTabela);
	
	var $campoEmail = campoTextoHorizontal('emailProdutor', 'email', 'Email', 9 , 2, '', false, 50);
	
	var $campoSite = campoTextoHorizontal('siteProdutor', 'text', 'Site', 9 , 2, '', false, 50);
	
	var $campoCpfCnpj = campoCpfCnpjHorizontal(
		'cpfcnpjProdutor', 'CPF',
		'col-xs-9 col-md-7', 'col-xs-2', false
	);
	
	$telaEndereco.append($campoCpfCnpj);
	
	$telaEndereco.append($campoEmail);
	
	$telaEndereco.append($campoSite);
	
	return $telaEndereco;
	
}
/* =========================================================
 * formularioProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function formularioProdutor(idProdutor, nomeTabela) {
	
	var $tabs = divTabs(nomeTabela, eval ('nomeTabs' + nomeTabela + '()'));
	
	$tabs.find('#tab' + nomeTabela + '1').addClass('in active');
	
	$tabs.find('#linha_tab' + nomeTabela + '1').addClass('active');
	
	var $telaEndereco = telaEnderecoProdutor(nomeTabela);
	
	var $telaFazenda = telaTabela('Fazenda', nomeTabela);
	
	var $telaTelefone = telaTabela('Telefone', nomeTabela);
	
	var $telaObservacao = telaObservacao(nomeTabela);
	
	var $formObs = $("<div/>")
		.addClass("form-horizontal col-xs-12 col-md-8 col-md-offset-1")
		.append($telaObservacao);
	
	$tabs.find('#tab' + nomeTabela + '1').append($telaEndereco);
	
	$tabs.find('#tab' + nomeTabela + '2').append($telaFazenda);
	
	$tabs.find('#tab' + nomeTabela + '3').append($telaTelefone);
	
	$tabs.find('#tab' + nomeTabela + '4').append($formObs);
	
	var $formulario = formularioCadastro(idProdutor, nomeTabela, 2, 4, $tabs);
	
	return $formulario;
	
}
/* =========================================================
 * eventoSalvarProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarProdutor(tipoOperacao, nomeTabela) {
	
	var number = animacao("botao" + nomeTabela, "fa-check", true);
	
	var produtor = pegaDadosFormularioProdutor(nomeTabela);
	
	var fazendasArray = pegaDadosTabelaCadastro('Fazenda');
	
	var telefonesArray = pegaDadosTabelaCadastro('Telefone');
	
	$.ajax({
		type: "POST",
		url: 'salvaProdutor',
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify({produtor: produtor, telefones: telefonesArray, fazendas: fazendasArray}),
		success: function(resposta) {
			
			var $mensagem = decodeURIComponent( unescape(resposta.mensagem));
			
			var $cor_texto = '';
			
			if (resposta.status == "200") {
				
				$("body").find('#ui-datepicker-div').remove();
				
				$cor_texto = 'texto_cor_verde';
				
				limpaDadosFormularioProdutor();
				
				$('#divDialogAlteraProdutor').empty();
				
				$('#divDialogAlteraProdutor').remove();
				
				$('#divDialogAlteraProdutor').dialog( "close" );
				
				produtor["tipoOperacao"] = tipoOperacao;
				
				if (tipoOperacao == 0) {
					
					$('#nomeProcura').val(decodeURIComponent(produtor.nome));
					
					eventoListaCadastro(1, nomeTabela);
					
				}
				else {
					
					setDadosTabelaProdutor(produtor);
					
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
 * setLinhaTabelaFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaFazenda(fazenda, tbody, arrayColunaBotoes) {
	
	formataDadosFazenda(fazenda);
	
	var tr = setIdTabelaCadastro(fazenda, tbody);
		
	if (arrayColunaBotoes != null) {
		
		tr.append(tabelaBotoes(fazenda.id, fazenda.nome, arrayColunaBotoes));
		
	}
	
	tr.append(tabelaCelula(fazenda.nome, 'text-left', 'texto', 'tdNome'));
	tr.append(tabelaCelula(fazenda.ie, 'text-center', 'texto', 'tdIe'));
	tr.append(tabelaCelula(fazenda.cpfcnpj, 'text-center', 'texto', 'tdCpfCnpj'));
	tr.append(tabelaCelula(fazenda.endereco, 'text-left', 'texto', 'tdEndereco'));
	tr.append(tabelaCelula(fazenda.bairro, 'text-left', 'texto', 'tdBairro'));
	tr.append(tabelaCelula(fazenda.cidade, 'text-left', 'texto', 'tdCidade'));
	tr.append(tabelaCelula(fazenda.estado, 'text-center', 'texto', 'tdEstado'));
	tr.append(tabelaCelula(fazenda.cep, 'text-center', 'texto', 'tdCep'));
	
	tbody.append(tr);
	
}
/* =========================================================
 * setDadosFormularioFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioFazenda(idFazenda, nomeTabela, tr, formulario) {
	
	var fazenda = pegaTabelaFazenda(tr, idFazenda);
	
	formataDadosFazenda(fazenda);
	
	formulario.find('#id' + nomeTabela).val(fazenda.id);
	formulario.find('#nome' + nomeTabela).val(fazenda.nome);
	formulario.find('#endereco' + nomeTabela).val(fazenda.endereco);
	formulario.find('#bairro' + nomeTabela).val(fazenda.bairro);
	formulario.find('#cidade' + nomeTabela).val(fazenda.cidade);
	formulario.find('#estado' + nomeTabela).val(fazenda.estado);
	formulario.find('#cep' + nomeTabela).val(fazenda.cep);
	formulario.find('#ie' + nomeTabela).val(fazenda.ie);
	formulario.find('#cpfcnpj' + nomeTabela).val(fazenda.cpfcnpj);
	
}
/* =========================================================
 * formularioFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function formularioFazenda(tipoOperacao, nomeTabela) {
	
	var $telaEndereco = telaEnderecoFazenda(nomeTabela);
	
	var $formulario = formularioCadastro(tipoOperacao, nomeTabela, tipoOperacao, 4, $telaEndereco);
	
	return $formulario;
	
}
/* =========================================================
 * pegaDadosSqlProcuraFazendaProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosSqlProcuraFazendaProdutor(resposta) {
	
	return $.map(resposta.cadastros, function(data) {
			
		return {
			value: data[3],
			data: {
				id: data[0],
				fazenda: data[1],
				ie: data[2],
				id2: data[4]
			}
		};
		
	});

}
/* =========================================================
 * limpaDadosFormularioFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioFazenda(nomeTabela) {
	
	var $formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	$formulario.find('#id' + nomeTabela).val(0);
	$formulario.find('#nome' + nomeTabela).val('');
	$formulario.find('#endereco' + nomeTabela).val('');
	$formulario.find('#bairro' + nomeTabela).val('');
	$formulario.find('#cidade' + nomeTabela).val('');
	$formulario.find('#estado' + nomeTabela).val('');
	$formulario.find('#cep' + nomeTabela).val('');
	$formulario.find('#ie' + nomeTabela).val('');
	$formulario.find('#cpfcnpj' + nomeTabela).val('');
	
}
/* =========================================================
 * pegaDadosFormularioFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioFazenda(nomeTabela) {
	
	var $formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	var fazenda = { 
		id: $formulario.find('#id' + nomeTabela).val(),
		nome: encodeURIComponent( unescape($formulario.find('#nome' + nomeTabela).val())),
		endereco: encodeURIComponent( unescape($formulario.find('#endereco' + nomeTabela).val())),
		bairro: encodeURIComponent( unescape($formulario.find('#bairro' + nomeTabela).val())),
		cidade: encodeURIComponent( unescape($formulario.find('#cidade' + nomeTabela).val())),
		estado: pegaValorCaixaCombinacao($formulario.find('#estado' + nomeTabela).val()),
		cep: pegaCepNumeros($formulario.find('#cep' + nomeTabela).val()),
		ie: $formulario.find('#ie' + nomeTabela).val(),
		cpfcnpj: $formulario.find('#cpfcnpj' + nomeTabela).val()
	};
	
	return fazenda;
	
}
/* =========================================================
 * removeTotalTabelaFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaFazenda(idLinha) {}
/* =========================================================
 * alteraFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function alteraFazenda(idFazenda) {
	
	alteraCadastroTabela(idFazenda, 'Fazenda');
	
}
/* =========================================================
 * formataDadosFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosFazenda(fazenda) {
	
	fazenda.nome = decodeURIComponent(fazenda.nome);
	fazenda.endereco = decodeURIComponent(fazenda.endereco);
	fazenda.bairro = decodeURIComponent(fazenda.bairro);
	fazenda.cidade = decodeURIComponent(fazenda.cidade);
	
	fazenda.estado = pegaValorCaixaCombinacao(fazenda.estado);
	
	fazenda.cep = pegaCepMascara(fazenda.cep);
	
}
/* =========================================================
 * campoSqlProcuraFazendaProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraFazendaProdutor(suggestion, tipo) {
	
	if (tipo == 1) {
		
		return '<div class="' + 'list-group-item"'+ '>'+
			'<h5 class="' + 'list-group-item-heading"' + '>' + suggestion.value + '</h5>' +
			'<p class="' + 'list-group-item-text"' + '><b><i>' +
				suggestion.data.fazenda + ' ' + '</i></b></p>' +
		'</div>';
					
	}
	else {
		
		return {
			texto: suggestion.data.fazenda,
			valor: suggestion.value
		};
		
	}
	
}
/* =========================================================
 * pegaNomeColunasFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasFazenda(tipo) {
	
	var nomesColunas = { 
		acao: "Ações",
		nome: "Nome",
		ie: "Insc. Est.",
		cpfcnpj: "Insc. Mun.",
		endereco: "Endereço",
		bairro: "Bairro",
		cidade: "Cidade",
		estado: "Estado",
		cep: "Cep"
	};
	
	switch (tipo) {
		case 1: 
			delete nomesColunas["acao"];
			break;
		case 3: 
			nomesColunas = "Fazenda";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaTabelaFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaFazenda(tr, idFazenda) {
	
	var fazenda = { 
		id: idFazenda,
		nome: encodeURIComponent( unescape( tr.find("#tdNome").find('p').text())),
		endereco: encodeURIComponent( unescape( tr.find("#tdEndereco").find('p').text())),
		bairro: encodeURIComponent( unescape( tr.find("#tdBairro").find('p').text())),
		cidade: encodeURIComponent( unescape( tr.find("#tdCidade").find('p').text())),
		estado: pegaValorCaixaCombinacao(tr.find("#tdEstado").find('p').text()),
		cep: pegaCepNumeros(tr.find("#tdCep").find('p').text()),
		ie: tr.find("#tdIe").find('p').text(),
		cpfcnpj: tr.find("#tdCpfCnpj").find('p').text()
	}
	
	return fazenda;
	
}
/* =========================================================
 * telaEnderecoFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function telaEnderecoFazenda(nomeTabela) {
	
	var $telaEndereco = telaEndereco(nomeTabela);
	
	var $campoIE = campoTextoHorizontal(
		'ieFazenda', 'text', 'I.E.', 9, 2, '', false, 20);
	
	var $campoIM = campoTextoHorizontal(
		'cpfcnpjFazenda', 'text', 'I.M.', 9, 2, '', false, 20);
	
	$telaEndereco.append($campoIE);
	
	$telaEndereco.append($campoIM);
	
	return $telaEndereco;
	
}
/* =========================================================
 * mudaLinhaTabelaFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function mudaLinhaTabelaFazenda(fazenda, tr, arrayColunaBotoes) {
	
	formataDadosFazenda(fazenda);
	
	tr.find("#tdNome").replaceWith(tabelaCelula(fazenda.nome, 'text-left', 'texto', 'tdNome'));
	tr.find("#tdEndereco").replaceWith(tabelaCelula(fazenda.endereco, 'text-left', 'texto', 'tdEndereco'));
	tr.find("#tdBairro").replaceWith(tabelaCelula(fazenda.bairro, 'text-left', 'texto', 'tdBairro'));
	tr.find("#tdCidade").replaceWith(tabelaCelula(fazenda.cidade, 'text-left', 'texto', 'tdCidade'));
	tr.find("#tdEstado").replaceWith(tabelaCelula(fazenda.estado, 'text-center', 'texto', 'tdEstado'));
	tr.find("#tdCep").replaceWith(tabelaCelula(fazenda.cep, 'text-center', 'texto', 'tdCep'));
	tr.find("#tdIe").replaceWith(tabelaCelula(fazenda.ie, 'text-center', 'texto', 'tdIe'));
	tr.find("#tdCpfCnpj").replaceWith(tabelaCelula(fazenda.cpfcnpj, 'text-center', 'texto', 'tdCpfCnpj'));
	tr.find("#tdBotoes").replaceWith(tabelaBotoes(fazenda.id, fazenda.nome, arrayColunaBotoes));
	
}
/* =========================================================
 * validarFormularioFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioFazenda(tipoOperacao, nomeTabela, formulario) {
	
	formulario.validate({
        ignore: ".ignore",
        highlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).addClass('glyphicon-remove');
			
			jQuery(element).closest('.form-group').addClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpjFazenda') {
					
				jQuery(element).parent().parent().addClass('has-error has-feedback');
				
			}
			
		},
		unhighlight: function(element) {
			
			var id_attr = "#" + jQuery(element).attr("id") + "1";
			
			$(id_attr).removeClass('glyphicon-remove');
			
			jQuery(element).closest('.form-group').removeClass('has-error has-feedback');
			
			if (jQuery(element).attr('id') == 'cpfcnpjFazenda') {
					
				jQuery(element).parent().parent().removeClass('has-error has-feedback');
					
			}
			
		},
        validClass:'success',
        errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			if(element.parent('.form-group').length) {
				error.insertAfter(element.parent());
			} else {
				
				if (element.attr('id') == 'cpfcnpjFazenda') {
					
					error.insertAfter(element.parent());
					
				}
				else {
				
					error.insertAfter(element);
				}
			}
		},
		rules: {
            nomeFazenda: {required: true,
						  noSpace: true},
			siteFazenda: {checkurl: true},
			ieFazenda: {required: true},
			cpfcnpjFazenda: {validacpfcnpj: true}
        },
        messages: {
			nomeFazenda: 'É necessário informar o nome da ' + nomeTabela.toLowerCase() + '!',
			siteFazenda: 'Site informado de forma errada!',
			ieFazenda: 'É necessário preencher esse campo!',
			cpfcnpjFazenda: 'É necessário preencher esse campo!'
		},
		submitHandler: function(form) {
            eventoInserirTabela(tipoOperacao, nomeTabela);
        }
    });
	
	validarFormulario();
	
	validarCpfCnpj();
	
}
/* =========================================================
 * removeFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function removeFazenda(idFazenda, nome) {
	
	removeCadastroTabela('Fazenda', idFazenda, nome);
	
}
/* =========================================================
 * pegaFazenda.js
 * http://lls.net.br/
 * ========================================================= */

function pegaFazenda() {
	
	var fazenda = {
		id: null,
		nome: '',
		endereco: null,
		bairro: null,
		cidade: null,
		estado: null,
		cep: null,
		ie: null,
		cpfcnpj: null
	}
		
	return fazenda;
	
}
/* =========================================================
 * pegaDadosCampoSqlProcuraFazendaProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosCampoSqlProcuraFazendaProdutor(id) {
	
	var dados = {
		id: $('#id' + id).val(),
		nome: $('#' + id).val()
	}
	
	return dados;
	
}
/* =========================================================
 * validarFormularioTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioTelefone(tipoOperacao, nomeTabela, formulario) {
	
	jQuery.validator.addMethod("telefone", function(numero, element) {
		
		numero = numero.split("_").join("");
		numero = numero.replace("(", "");
		numero = numero.replace(")", "");
		numero = numero.replace(" ", "");
		numero = numero.replace("-", "");
		
		return this.optional(element) || numero.match(/^\d{10}$|^\d{11}$/);
	}, "Por favor digite um número válido!");
	
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
            numero: {required: true, telefone: true}
        },
        messages: {
			numero: 'Necessário informar o número!'
		},
		submitHandler: function(form) {
            eventoInserirTabela(tipoOperacao, nomeTabela);
        }
    });
	
}
/* =========================================================
 * pegaTabelaTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaTelefone(tr, idTelefone) {
	
	var operadora = tr.find("#tdOperadora").find('a').text().toUpperCase();
	
	var tipo = tr.find("#tdTipo").find('p').text();
	
	tipo = tipo.substr(tipo.indexOf(' ')+1).toUpperCase();
	
	var telefone = {
		id: idTelefone,
		numero: pegaTelefoneNumeros(tr.find("#tdNumero").find('p').text()),
		responsavel: encodeURIComponent( unescape( tr.find("#tdResponsavel").find('p').text())),
		tipo: pegaValorCaixaCombinacao(tipo),
		operadora: pegaValorCaixaCombinacao(operadora)
	}
	
	return telefone;
	
}
/* =========================================================
 * pegaDadosFormularioTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosFormularioTelefone(nomeTabela) {
	
	var $formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	var telefone = { 
		id: $formulario.find('#id' + nomeTabela).val(),
		numero: pegaTelefoneNumeros($formulario.find('#numero' + nomeTabela).val()),
		responsavel: encodeURIComponent( unescape( $formulario.find('#responsavel' + nomeTabela).val())),
		tipo: pegaValorCaixaCombinacao($formulario.find('#tipo' + nomeTabela).val()),
		operadora: pegaValorCaixaCombinacao($formulario.find('#operadora' + nomeTabela).val())
	
	};
		
	return telefone;
	
}
/* =========================================================
 * removeTotalTabelaTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function removeTotalTabelaTelefone(idLinha) {}
/* =========================================================
 * nomesOperadoras.js
 * http://lls.net.br/
 * ========================================================= */

function nomesOperadoras() {
	
	var $nomesOperadoras = { 
		"": "Selecione",
		"CLARO": "Claro",
		"CTBC": "Ctbc",
		"NEXTEL": "Nextel",
		"OI": "Oi",
		"TIM": "Tim",
		"VIVO": "Vivo"
	};
	
	return $nomesOperadoras;
}
/* =========================================================
 * limpaDadosFormularioTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function limpaDadosFormularioTelefone(nomeTabela) {
	
	var $formulario = $('#' + nomeTabela.toLowerCase() + 'Form');
	
	$formulario.find('#id' + nomeTabela).val(0);
	$formulario.find('#numero' + nomeTabela).val('');
	$formulario.find('#responsavel' + nomeTabela).val('');
	$formulario.find('#tipo' + nomeTabela).val('');
	$formulario.find('#operadora' + nomeTabela).val('');
	
	$formulario.find('#operadorasImagem').attr('src', '');
	
	$formulario.find('#operadoras').hide();
	
	$formulario.find('#operadorasFormGroup2').hide();
	
}
/* =========================================================
 * setDadosFormularioTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioTelefone(idTelefone, nomeTabela, tr, formulario) {
	
	var telefone = pegaTabelaTelefone(tr, idTelefone);
	
	formataDadosTelefone(telefone);
	
	formulario.find('#id' + nomeTabela).val(telefone.id);
	formulario.find('#numero' + nomeTabela).val(telefone.numero);
	formulario.find('#responsavel' + nomeTabela).val(telefone.responsavel);
	formulario.find('#tipo' + nomeTabela).val(pegaValorCaixaCombinacao(telefone.tipo));
	
	if (telefone.tipo == 'CELULAR') {
		
		formulario.find('#operadora' + nomeTabela + 'FormGroup').show();
		
		formulario.find('#operadora' + nomeTabela).val(pegaValorCaixaCombinacao(telefone.operadora));
		
		if (telefone.operadora == null) {
		
			formulario.find('#operadora' + nomeTabela + 'FormGroup2').hide();
			formulario.find('#operadora' + nomeTabela + 'Imagem').attr('src', '');
			
		}
		else {
			
			var imagem = tr.find("#tdOperadora").find('img').attr('src');
			
			formulario.find('#operadora' + nomeTabela + 'FormGroup2').show();
			formulario.find('#operadora' + nomeTabela + 'Imagem').attr('src', imagem);
			
		}
		
	}
	
	formulario.find('#numero' + nomeTabela).focus();
	
}
/* =========================================================
 * caixaCombinacaoOperadoras.js
 * http://lls.net.br/
 * ========================================================= */

function caixaCombinacaoOperadoras(id, textoLabel, tamanhoCampo, tamanhoLabel, required, nomesOpcoes) {
	
	var $caixaCombinacao = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $idImagem = id + 'Imagem';
	
	var $select = $('<select />')
		.attr({id: id, name: id, required: required})
		.addClass('form-control');
	
	jQuery.each( nomesOpcoes, function( value, nomeOpcao ) {
	
		var $option = $('<option />').val(value).text(nomeOpcao);
	
		$select.append($option);
	
	});
	
	var $divGroup = $('<div />').addClass('input-group');
	
	var $idSpanGroup = id + 'FormGroup2';
	
	var $spanGroup = span('input-group-addon').attr('id', $idSpanGroup);
		
	var $idImagem = id + 'Imagem';
	
	var $imagem = imagem('', '', 20, 20);
	
	$imagem.attr('id', $idImagem);
	
	$spanGroup.hide();
	
	$spanGroup.append($imagem);
	
	$select.change(function(){
        
        var $urlImagem = 'imagens/operadoras/' + $select.val().toLowerCase() + '.png';
        
        if($select.val() == '') {
            
            $imagem.attr('src', '');
            
            $spanGroup.hide();
            
        }
        else {
            
            $imagem.attr('src', $urlImagem);
            
            $spanGroup.show();
            
        }
    });
	
	$divGroup.append($select);
	$divGroup.append($spanGroup);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($divGroup);
	
	$caixaCombinacao.append($divInput);
	
	return $caixaCombinacao;
	
}
/* =========================================================
 * pegaNomesTiposTelefones.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomesTiposTelefones() {
	
	var $nomesTipos = { 
		"": "Selecione",
		"FIXO": "Telefone Fixo",
		"CELULAR": "Telefone Celular"
	};
	
	return $nomesTipos;
}
/* =========================================================
 * formataDadosProdutor.js
 * http://lls.net.br/
 * ========================================================= */

function formataDadosTelefone(telefone) {
	
	telefone.responsavel = decodeURIComponent(telefone.responsavel);
	
	telefone.numero = pegaTelefoneMascara(telefone.numero);
	
}
/* =========================================================
 * mudaLinhaTabelaTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function mudaLinhaTabelaTelefone(telefone, tr, arrayColunaBotoes) {
	
	formataDadosTelefone(telefone);
	
	telefone = setOperadoraImagem(telefone);
	
	tr.find("#tdNumero").replaceWith(tabelaCelula(telefone.numero, 'text-center', 'texto', 'tdNumero'));
	tr.find("#tdResponsavel").replaceWith(tabelaCelula(telefone.responsavel, 'text-left', 'texto', 'tdResponsavel'));
	tr.find("#tdTipo").replaceWith(tabelaCelula(telefone.tipo, 'text-center', 'texto', 'tdTipo'));
	tr.find("#tdOperadora").replaceWith(telefone.tdOperadora);
	tr.find("#tdBotoes").replaceWith(tabelaBotoes(telefone.id, telefone.numero, arrayColunaBotoes));
	
}
/* =========================================================
 * setOperadoraImagem.js
 * http://lls.net.br/
 * ========================================================= */

function setOperadoraImagem(telefone) {
	
	var $tdOperadora = td('alinhamento_vertical_meio').attr('id', 'tdOperadora');
	
	if (telefone.tipo == 'CELULAR') {
			
		if (telefone.operadora == 'Selecione' || telefone.operadora == null || telefone.operadora == '') {
			
			$tdOperadora.append(paragrafo());
			
		}
		else {
			
			var $urlImagem = 'imagens/operadoras/' + telefone.operadora.toLowerCase() + '.png';
			
			var $imagemTabela = imagem($urlImagem, '', 22, 22);
			
			var operadora = telefone.operadora.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			});
			
			$tdOperadora.append(campoImagemHorizontal('id_telefone', operadora, 9, 2, $imagemTabela));
			
		}
		
	}
	else {
	
		$tdOperadora.append(paragrafo());
	
	}
	
	telefone["tdOperadora"] = $tdOperadora;
	
	return telefone;
	
}
/* =========================================================
 * setLinhaTabelaTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function setLinhaTabelaTelefone(telefone, tbody, arrayColunaBotoes) {
	
	formataDadosTelefone(telefone);
	
	telefone["texto"] = telefone.numero;
	
	var tr = setIdTabelaCadastro(telefone, tbody);
	
	telefone = setOperadoraImagem(telefone);
	
	if (arrayColunaBotoes != null) {
		
		tr.append(tabelaBotoes(telefone.id, telefone.texto, arrayColunaBotoes));
		
	}
	
	tr.append(tabelaCelula(telefone.numero, 'text-center', 'texto', 'tdNumero'));
	tr.append(tabelaCelula(telefone.responsavel, 'text-left', 'texto', 'tdResponsavel'));
	tr.append(tabelaCelula(telefone.tipo, 'text-center', 'texto', 'tdTipo'));
	tr.append(telefone.tdOperadora);
	
	tbody.append(tr);
	
}
/* =========================================================
 * removeTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function removeTelefone(idTelefone, numero) {
	
	removeCadastroTabela('Telefone', idTelefone, pegaTelefoneMascara(numero));
		
}
/* =========================================================
 * formularioTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function formularioTelefone(tipoOperacao, nomeTabela) {
	
	var $idTela = 'divCampos' + nomeTabela;
	
	var $telaTelefone = $('<div />').attr({id: $idTela}).addClass('form-horizontal');
	
	var $campoTelefone = campoTelefoneHorizontal(
		'numero' + nomeTabela, 'Número', 9, 2, true
	);
	
	var $campoResponsavel = campoTextoHorizontal(
		'responsavel' + nomeTabela,
		'text',
		'Contato', 9, 2,
		'', false, 50
	);
	
	var $caixaCombinacaoTipos = caixaCombinacaoHorizontal(
		'tipo' + nomeTabela,
		'Tipo', 9, 2, false,
		pegaNomesTiposTelefones()
	);
	
	var $caixaCombinacaoOperadoras = caixaCombinacaoOperadoras(
		'operadora' + nomeTabela,
		'Operador', 9, 2, false,
		nomesOperadoras()
	);
	
	$caixaCombinacaoOperadoras.hide();
	
	var $seletorTipos = $caixaCombinacaoTipos.find('#tipo' + nomeTabela);
	
    $seletorTipos.change(function(){
        
        if($seletorTipos.val() == 'CELULAR') {
            
            $caixaCombinacaoOperadoras.show();
            
        }
        else {
            
            $caixaCombinacaoOperadoras.hide();
            
        }
    });
	
	$telaTelefone.append($campoTelefone);
	
	$telaTelefone.append($campoResponsavel);
	
	$telaTelefone.append($caixaCombinacaoTipos);
	
	$telaTelefone.append($caixaCombinacaoOperadoras);
	
	var $formulario = formularioCadastro(
		tipoOperacao,
		nomeTabela,
		tipoOperacao, 3,
		$telaTelefone
	);
	
	return $formulario;
	
}
/* =========================================================
 * pegaNomeColunasTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function pegaNomeColunasTelefone(tipo) {
	
	var nomesColunas = { 
		acao: "Ações",
		numero: "Número",
		responsavel: "Contato",
		tipo: "Tipo",
		operadora: "Operadora"
	};
	
	switch (tipo) {
		case 1: 
			delete nomesColunas["acao"];
			break;
		case 3: 
			nomesColunas = "Telefone";
			break;
	}
	
	return nomesColunas;
	
}
/* =========================================================
 * pegaTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTelefone() {
	
	var telefone = {
		id: null,
		numero: '',
		responsavel: null,
		tipo: null,
		operadora: null
	};
		
	return telefone;
	
}
/* =========================================================
 * alteraTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function alteraTelefone(idTelefone) {
	
	alteraCadastroTabela(idTelefone, 'Telefone');
	
}
/* =========================================================
 * campoCepHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoCepHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, required) {
						      
	var $campoCepHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $campoCep = campoCep(id, required);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($campoCep);
	
	$campoCepHorizontal.append($divInput);
	
	return $campoCepHorizontal;
	
}
/* =========================================================
 * pegaCepNumeros.js
 * http://lls.net.br/
 * ========================================================= */

function pegaCepNumeros(valorComMascara) {
						      
	return valorComMascara.replace(/\./g,'').replace(/-/g,'');
	
}
/* =========================================================
 * pegaCepMascara.js
 * http://lls.net.br/
 * ========================================================= */

function pegaCepMascara(numeros) {
	
	var campoMascara = $("<input>").val(numeros).mask("99.999-999");
	
	return campoMascara.val();
	
}
/* =========================================================
 * campoCep.js
 * http://lls.net.br/
 * ========================================================= */

function campoCep(id, required) {
	
	var $inputCep = input(id, 'text', 'form-control', '__.___-___', required, 10);
	
	$inputCep.mask("99.999-999");
	
	return $inputCep;
	
}
/* =========================================================
 * tituloPainelCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function tituloPainelCadastro(id, titulo) {
	
	var $textoTitulo = '';
		
	switch (id) {
		case 0:
			
			var arrayTitulo = titulo.split(' ');
			
			if (arrayTitulo[1] == null) {
			
				$textoTitulo = 'Cadastro de ' + titulo;
				
			}
			else {
				
				$textoTitulo = titulo;
				
			}
			
			break;
			
		case 1:
			$textoTitulo = 'Alteração de ' + titulo;
			break;
		case 2:
			
			var arrayTitulo = titulo.split(' ');
			
			if (arrayTitulo[1] == null) {
			
				if (titulo.substr(titulo.length -1) == 'r') titulo += 'e';
					
				if (titulo.substr(titulo.length -1) != 's') titulo += 's';
						
			}
			else {
				
				if (arrayTitulo[0].substr(arrayTitulo[0].length -1) == 'm') {
					arrayTitulo[0] = arrayTitulo[0].substr(0, arrayTitulo[0].length -1) + "n";
				}
				
				if (arrayTitulo[0].substr(arrayTitulo[0].length -1) != 's') arrayTitulo[0] += 's';
				
				titulo = '';
				
				jQuery.each( arrayTitulo, function( key, text ) {
					
					titulo += text + ' ';
					
				});
				
			}
			
			$textoTitulo = 'Relação de ' + titulo;
			
			break;
			
		case 3:
			$textoTitulo = 'Exclusão de ' + titulo;
			break;
		case 4:
			$textoTitulo = 'Visualização de ' + titulo;
			break;
	}
	
	return $textoTitulo;
	
}
/* =========================================================
 * tituloPainel.js
 * http://lls.net.br/
 * ========================================================= */

function tituloPainel(titulo, corLabel, idTitulo) {
	
	var $idTitulo = 'legend' + idTitulo;
	
	var $legend = $("<legend/>").attr('id', $idTitulo);
	
	var $texto = paragrafo('text-center texto_grande texto_label', corLabel);
	
	$texto.text(titulo);
	
	$legend.append($texto);
	
	return $legend;
	
}
/* =========================================================
 * campoCpfCnpjHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoCpfCnpjHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, required) {
						      
	var $campoHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $inputGroup = $('<div />').addClass('input-group');
	
	var $idSpan = id + "1";
	
	var $span = span('glyphicon form-control-feedback').attr('id', $idSpan);
	
	var $inputGroupAddon = span('input-group-addon').attr('id', id + 'Radio');
	
	var $inputRadioCpf = input('radio', 'radio', '', '', false, 1).css( 'cursor', 'pointer');
	
	var $inputRadioCnpj = input('radio', 'radio', '', '', false, 1).css( 'cursor', 'pointer');
	
	var $inputCpfCnpj = input(id, 'text', 'form-control', '', required, 20);
	
	var $labelCpf = label(id + 'RadioCpf', ' CPF ', '');
	
	var $labelCnpj = label(id + 'RadioCnpj', ' CNPJ ', '');
	
	var $separador = span('label');
	
	$inputRadioCpf.attr('id', id + 'RadioCpf');
	
	$inputRadioCnpj.attr('id', id + 'RadioCnpj');
	
	$inputRadioCpf.attr('checked', 'true');
	
	$inputCpfCnpj.mask("999.999.999-99");
		
	$inputCpfCnpj.attr('placeholder', '___.___.___-__');
	
	$inputRadioCpf.click(function(){
		
		$inputCpfCnpj.mask("999.999.999-99");
		
		$inputCpfCnpj.attr('placeholder', '___.___.___-__');
		
		$inputCpfCnpj.focus();
		
		$campoHorizontal.find('#' + id + 'Label').text('CPF');
		
    });
    
    $inputRadioCnpj.click(function(){
		
		$inputCpfCnpj.mask("99.999.999/9999-99");
		
		$inputCpfCnpj.attr('placeholder', '__.___.___/____-__');
		
		$inputCpfCnpj.focus();
		
		$campoHorizontal.find('#' + id + 'Label').text('CNPJ');
		
    });
	
	$separador.append('|');
	
	$inputGroupAddon.append($inputRadioCpf);
	
	$inputGroupAddon.append($labelCpf);
	
	$inputGroupAddon.append($separador);
	
	$inputGroupAddon.append($inputRadioCnpj);
	
	$inputGroupAddon.append($labelCnpj);
	
	$inputGroup.append($inputGroupAddon);
	
	$inputGroup.append($inputCpfCnpj);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($inputGroup);
	
	$divInput.append($span);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * pegaCpfCnpjMascara.js
 * http://lls.net.br/
 * ========================================================= */

function pegaCpfCnpjMascara(numeros) {
	
	if (numeros.length == 11) {
	
		var $campoMascara = $("<input>").val(numeros).mask("999.999.999-99");
		
	}
	else {
		
		var $campoMascara = $("<input>").val(numeros).mask("99.999.999/9999-99");
		
	}
	
	return $campoMascara.val();
	
}
/* =========================================================
 * pegaCpfCnpjNumeros.js
 * http://lls.net.br/
 * ========================================================= */

function pegaCpfCnpjNumeros(valorComMascara) {
						      
	var $numeros = valorComMascara.replace(/\./g,'').replace(/-/g,'').replace(/\//g,'');
	
	return $numeros;
	
}
/* =========================================================
 * validarCpfCnpj.js
 * http://lls.net.br/
 * ========================================================= */

function validarCpfCnpj() {
	
	jQuery.validator.addMethod("validacpfcnpj", function(value, element) {
		
		var $validacao = 'false';
		
		if (element.value.length == 14 || element.value.length == 0) {
		
			var $cpf = element.value.replace('.', '');
			$cpf = $cpf.replace('.', '');
			$cpf = $cpf.replace('-', '');
			$cpf = $cpf.replace('_', '');
			
			$validacao = validarCpf($cpf);
				
		}
		else if (element.value.length == 18) {
			
			var $cnpj = element.value.replace('.', '');
			$cnpj = $cnpj.replace('.', '');
			$cnpj = $cnpj.replace('/', '');
			$cnpj = $cnpj.replace('-', '');
			
			$validacao = validarCnpj($cnpj);
			
		}
		
		return $validacao;
		
		}, "Valor incorreto!"
	);
	
}
/* =========================================================
 * validarCnpj.js
 * http://lls.net.br/
 * ========================================================= */

function validarCnpj(input_cnpj){

	if(input_cnpj){
	var input=input_cnpj.toString();
	var pesos_A=[5,4,3,2,9,8,7,6,5,4,3,2];
	var pesos_B=[6,5,4,3,2,9,8,7,6,5,4,3,2];
	var sum=0;
	var x1=0;
	var x2=0;
	for(var i=0;i<12;i++){
	 sum=sum+input[i]*pesos_A[i];
	}
	//calcula digito 1
	var mod=sum%11;
	if(mod>=2){
	 x1=11-mod;
	}
	//calcula digito 2
	sum=0;
	for(var i=0;i<13;i++){
	 sum=sum+input[i]*pesos_B[i];
	}
	var mod=sum%11;
	if(mod>=2){
	 x2=11-mod;
	}

	//test digitos
	if(x1==input[12] && x2==input[13]){
	 return true;
	}else{
	 return false;
	}
	}else{
	return false;
	}
};
/* =========================================================
 * campoCpfHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoCpfHorizontal(id, textoLabel, tamanhoLabel, required) {
						      
	var $campoCpfHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $input = input(id, 'text', 'form-control', '___.___.___-__', required, '14');
	
	$input.mask("999.999.999-99");
	
	$input.focusout(function (event) {  
		
		var target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
		
		var $cpf = target.value.replace('.', '');
		$cpf = $cpf.replace('.', '');
		$cpf = $cpf.replace('-', '');
		
		var element = $(target);
		
		var resposta = validarCpf($cpf);
		
		if(!validarCpf($cpf)) {  
			
			element.val('');
			
		}
		
	});
	
	var $divInput = divInput(id, '3');
	
	$divInput.append($input);
	
	$campoCpfHorizontal.append($divInput);
	
	return $campoCpfHorizontal;
	
}
/* =========================================================
 * validarCpf.js
 * http://lls.net.br/
 * ========================================================= */

function validarCpf(input_cpf){
 
	if(input_cpf){
	var input=input_cpf.toString();

	var numeros=[];
	var pesos_A=[10,9,8,7,6,5,4,3,2];
	var pesos_B=[11,10,9,8,7,6,5,4,3,2];
	var sum=0;
	var x1=0;
	var x2=0;

	for(var i=0;i<9 && i<input.length;i++){
	 var digito=input[i]
	 sum=sum+digito*pesos_A[i];
	}

	//calcula digito 1
	var mod=sum%11;
	if(mod>=2){
	 x1=11-mod;
	}

	//calcula digito 2
	sum=0;
	for(var i=0;i<10 && i<input.length;i++){
	 sum=sum+input[i]*pesos_B[i];
	}

	var mod=sum%11;
	if(mod>=2){
	 x2=11-mod;
	}

	if(x1==input[9] && x2==input[10]){
	 return true;
	}else{
	 return false;
	}
	}else{
	 return false;
	}
};
/* =========================================================
 * botaoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function botaoHorizontal(id, label, icone, tamanhoBotao, tamanhoOffSet, tipoBotao, type, onClick) {
	
	var idFormGroup = id + 'FormGroup';
	var tamanhoOffSet = 'col-sm-offset-' + tamanhoOffSet;
	var tamanhoBotao = 'col-sm-' + tamanhoBotao;
	
	var button = botao(id, label, icone, tamanhoBotao, tipoBotao, type, onClick);
	
	var divButton = $("<div/>")
		.addClass(tamanhoBotao)
		.addClass(tamanhoOffSet)
		.append(button);
	
	var divFormGroup = $("<div/>")
		.attr({id: idFormGroup})
		.addClass('form-group')
		.append(divButton);
	
	return divFormGroup;
	
}
/* =========================================================
 * nomeCamposEndereco.js
 * http://lls.net.br/
 * ========================================================= */

function nomeCamposEndereco(nomeTabela) {
	
	var nomesCampos = { 
		"Nome": "nome" + nomeTabela,
		"Endereço": "endereco" + nomeTabela,
		"Bairro": "bairro" + nomeTabela,
		"Cidade": "cidade" + nomeTabela,
		"Estado": "estado" + nomeTabela,
		"CEP": "cep" + nomeTabela
	};
	
	return nomesCampos;
	
}
/* =========================================================
 * telaEndereco.js
 * http://lls.net.br/
 * ========================================================= */

function telaEndereco(nomeTabela) {
	
	var $idTela = 'divEndereco' + nomeTabela;
	
	var $divTela = $("<div/>").attr({id: $idTela}).addClass('form-horizontal');
	
	var $nomesCampos = nomeCamposEndereco(nomeTabela);
	
	var $tamanhoCampo = 9;
		
	var $tamanhoLabel = 2;
	
	var $placeholder = '';
	
	var $required = '';
	
	var $textoPlaceholder = 'Digite ';
	
	var $vogaltextoPlaceholder = '';
	
	jQuery.each( $nomesCampos, function(textoLabel, idCampo) {
		
		$required = false;
		
		$vogaltextoPlaceholder = 'o ';
		
		if (idCampo == "estado" + nomeTabela) {
			
			var $campo = caixaCombinacaoHorizontal(
				idCampo, textoLabel,
				'col-xs-9 col-md-7', 'col-xs-2', false, nomesEstados());
			
		}
		else if (idCampo == "cep" + nomeTabela) {
			
			var $campo = campoCepHorizontal(
				idCampo, textoLabel,
				'col-xs-9 col-md-7', 'col-xs-2', false
			);
			
		}
		else {
			
			if (idCampo == "nome" + nomeTabela) {
			
				$required = true;
				
			}
			else {
			
				if (idCampo == "cidade" + nomeTabela) {
					
					$vogaltextoPlaceholder = 'a ';
					
				}
				
			}
			
			$placeholder = $textoPlaceholder + $vogaltextoPlaceholder + textoLabel.toLowerCase();
			
			$placeholder = '';
			
			var $campo = campoTextoHorizontal(idCampo,
											  'text',
											  textoLabel,
											  $tamanhoCampo,
											  $tamanhoLabel,
											  $placeholder,
											  $required,
											  50);
			
		}
				
		$divTela.append($campo);
		
	});
	
	return $divTela;
	
}
/* =========================================================
 * td.js
 * http://lls.net.br/
 * ========================================================= */

function td(classes) {
	
	var $td = $('<td />').addClass(classes);
	
	return $td;
	
}
/* =========================================================
 * tbody.js
 * http://lls.net.br/
 * ========================================================= */

function tbody(idTbody, classes) {
	
	var $tbody = $('<tbody />');
	
	$tbody.attr('id', idTbody);
	
	$tbody.addClass(classes);
	
	return $tbody;
	
}
/* =========================================================
 * paginacao.js
 * http://lls.net.br/
 * ========================================================= */

function paginacao(idPaginacao, url, qtdPaginas, pagina, nomeTabela) {
	
	if (pagina > 0) {
		
		var $paginacao = $('#' + idPaginacao);
		
		$paginacao.unbind('page');
		
		if (qtdPaginas > 0) {
			
			$paginacao.bootpag({
				total: Number(qtdPaginas),
				page: pagina,
				maxVisible: 5,
				leaps: true,
				firstLastUse: true,
				first: '←',
				last: '→',
				wrapClass: 'pagination',
				activeClass: 'active',
				disabledClass: 'disabled',
				nextClass: 'next',
				prevClass: 'prev',
				lastClass: 'last',
				firstClass: 'first'
			}).on("page", function(event, num){
				
				eval(url + '("' + num + '", "' + nomeTabela + '")');
				
			});
			
			$paginacao.show();
			
		}
		else {
			
			$paginacao.hide();
			
		}
		
	}
	else {
		
		var $paginacao = $('<div />').attr('id', idPaginacao).addClass('text-center texto');
		
		$paginacao.unbind('page');
		
		return $paginacao;
		
	}
	
}
/* =========================================================
 * juntaColunas.js
 * http://lls.net.br/
 * ========================================================= */

function juntaColunas(array, posicaoTexto, corTexto, id) {
	
	var tdColuna = td('alinhamento_vertical_meio').attr('id', id);
	
	jQuery.each( array, function( i, coluna ) {
		
		tdColuna.append(paragrafo(posicaoTexto, corTexto)
			.attr('id', i)
			.append(coluna));
		
	});
	
	return tdColuna;
	
}
/* =========================================================
 * th.js
 * http://lls.net.br/
 * ========================================================= */

function th(classes) {
	
	var $th = $('<th />').addClass(classes);
	
	return $th;
	
}
/* =========================================================
 * tr.js
 * http://lls.net.br/
 * ========================================================= */

function tr(id, classes) {
	
	var $tr = $('<tr />').attr('id', id);
	
	$tr.addClass(classes);
	
	return $tr;
	
}
/* =========================================================
 * tabelaBotoes.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaBotoes(id, nome, arrayUrls) {
	
	var size = Object.keys(arrayUrls).length;
	
	var row = $('<div/>').addClass('row');
	
	var count = 0;
	
	jQuery.each( arrayUrls, function( i, urlBotao ) {
		
		var colClasse = 'col-xs-12';
		
		count++;
		
		if (i == 'altera') {
			
			if (urlBotao) urlBotao += '("' + id + '")';
			
			var botaoTabela = botao('botaoAlterar_' + id, '', 'fa-edit', '0',
				'btn btn-xs btn-warning', 'button', urlBotao
			);
			
			botaoTabela.attr('title', "Alterar");
			
		}
		else {
			
			if (urlBotao) urlBotao += "('" + id + "', '" + nome + "')";
			
			var botaoTabela = botao('botaoRemover_' + id, '', 'fa-trash-alt', '0',
				'btn btn-xs btn-danger', 'button', urlBotao
			);
			
			botaoTabela.attr('title', "Excluir");
			
		}
		
		if (size > 1) colClasse = 'col-xs-12 col-sm-6';
		
		var divBotao = $('<div/>')
			.addClass(colClasse)
			.addClass('text-center')
			.append(botaoTabela);
		
		row.append(divBotao);
		
	});
	
	var tdBotoes = td('alinhamento_vertical_meio')
		.attr('id', 'tdBotoes')
		.append(row);
	
	return tdBotoes;
	
}
/* =========================================================
 * juntaTituloTexto.js
 * http://lls.net.br/
 * ========================================================= */

function juntaTituloTexto(titulo, texto) {
	
	var $textoTitulo = '';
	
	if (texto != '' && texto != null) {
					
		$textoTitulo = titulo + ': <b>' + texto + '</b>';
		
	}

	return $textoTitulo;
	
}
/* =========================================================
 * juntaTexto.js
 * http://lls.net.br/
 * ========================================================= */

function juntaTexto(textoArray) {
	
	var $texto = '';
	
	jQuery.each( textoArray, function( i, texto ) {
		
		if (texto != '' && texto != null) {
			
			if ($texto != '') {
				
				$texto += ' - ' + texto;
				
			} else {
				
				$texto += texto;
				
			}
			
		}
		
	});
	
	return $texto;
	
}
/* =========================================================
 * textoBotao.js
 * http://lls.net.br/
 * ========================================================= */

function textoBotao(id) {
	
	if (id == 0) {
		
		return 'Adicionar';
		
	}
	else if (id == 1) {
		
		return 'Alterar';
		
	}
	else if (id == 2) {
	
		return 'Salvar';
	
	}
	else {
		
		return 'Confirmar';
		
	}
	
}
/* =========================================================
 * tabela.js
 * http://lls.net.br/
 * ========================================================= */

function tabela(idTabela, nomesColunas) {
	
	var $tabela = table('table table-hover table-striped table-bordered table-curved table-condensed');
	
	$tabela.attr('id', idTabela);
	
	var $thead = thead('thead').attr('id', 'thead' + idTabela);
	
	var $trColunas = tr('nomeColunas' + idTabela, '');
	
	var tamanhoTitulo = 0;
	
	jQuery.each( nomesColunas, function( i, tituloColuna ) {
		
		tamanhoTitulo++;
		
		var $paragrafo = paragrafo('text-center texto_grande', 'texto_label');
	
		$paragrafo.append(tituloColuna);
		
		var $th = th().attr('id', 'th' + i).append($paragrafo);
		
		$trColunas.append($th);
		
	});
	
	$thead.append($trColunas);
	
	var $tfoot = $('<tfoot/>').attr('id', 'tfoot' + idTabela);
	
	$tabela.append($thead).append($tfoot);
	
	return $tabela;
	
}
/* =========================================================
 * tabelaCelula.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaCelula(texto, posicaoTexto, corTexto, id) {
	
	if (texto != null) {
	
		if (texto.constructor === String) {
			texto = texto.replace(/\n/g, "<br />");
		}
	
	}
		
	var paragrafoTexto = paragrafo(posicaoTexto, corTexto).append(texto);
	
	return tdTexto = td('alinhamento_vertical_meio')
		.attr('id', id)
		.append(paragrafoTexto);
		
}
/* =========================================================
 * table.js
 * http://lls.net.br/
 * ========================================================= */

function table(classes) {
	
	var $table = $('<table />').addClass(classes);
	
	return $table;
	
}
/* =========================================================
 * tabelaCelulaCheck.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaCelulaCheck(texto, checked, id) {
			
	var $td = td('alinhamento_vertical_meio').attr('id', id);

	var $div = $('<div/>').addClass('checkbox');

	var $label = $("<label>").attr('id', id + 'label').addClass('texto_label');

	var $input = $('<input>').attr({
		id: id + 'input',
		type: 'checkbox'
	});
	
	var $texto = $('<b>').attr('id', id + 'texto').append(texto);
	
	if (checked) {
	
		$input.attr('checked', 'checked');
		
		$texto.addClass('text-success');
	
	}
	else {
		
		$texto.addClass('text-danger');
		
	}
	
	$label.append($input);
	
	$label.append($texto);
	
	$div.append($label);
	
	$td.append($div);
	
	return $td;
	
}
/* =========================================================
 * thead.js
 * http://lls.net.br/
 * ========================================================= */

function thead(classes) {
	
	var $thead = $('<thead />').addClass(classes);
	
	return $thead;
	
}
/* =========================================================
 * campoDataProcura.js
 * http://lls.net.br/
 * ========================================================= */

function campoDataProcura(textoLabel, nomeTabela, urlSearch, urlAdd, tamanhoLabel) {
	
	var id = 'dataProcura' + nomeTabela;
	var idDataInicial = 'dataInicial' + nomeTabela;
	var idDataFinal = 'dataFinal' + nomeTabela;
	
	var dataAtual =  new Date();
	
	var $campoHorizontal = campoHorizontal('dataInicial' + nomeTabela, textoLabel, tamanhoLabel);
	
	var $divGroup = $('<div />').addClass('input-group');
	
	var $spanGroupAdd = span('input-group-addon')
		.attr('id', id + 'BotaoAdd')
		.attr('title', "Adicionar novo registro");
		
	var $spanIconAdd = span('glyphicon-plus glyphicon');
	
	var $inputDataInicial = input(idDataInicial, 'text', 'form-control', 'Selecione a data', false, '10');
	var $inputDataFinal = input(idDataFinal, 'text', 'form-control', 'Selecione a data', false, '10');
	
	var $spanGroupDateInicial = span('input-group-addon ui-datepicker-trigger')
		.attr('title', "Selecionar a Data Inicial");
	
	var $spanIconDateInicial = span('glyphicon-calendar glyphicon');
	
	var $spanGroupDateFinal = span('input-group-addon ui-datepicker-trigger')
		.attr('title', "Selecionar a Data Final");
	
	var $spanIconDateFinal = span('glyphicon-calendar glyphicon');
	
	$campoHorizontal.removeClass("has-feedback");
	
	$inputDataInicial.attr("disabled","disabled")
		.css("font-weight","Bold")
		.css("font-size","15px");
	
	$inputDataFinal.attr("disabled","disabled")
		.css("font-weight","Bold")
		.css("font-size","15px");
	
	$spanGroupDateInicial.append($spanIconDateInicial);
	$spanGroupDateFinal.append($spanIconDateFinal);
	
	$spanGroupDateInicial.click(function(){
		
		$inputDataInicial.datepicker("show");
		
    });
	
	$spanGroupDateFinal.click(function(){
		
		$inputDataFinal.datepicker("show");
		
    });
	
	$spanGroupDateInicial.append($spanIconDateInicial);
	$spanGroupDateFinal.append($spanIconDateFinal);
	
	$spanGroupDateInicial.click(function(){
		
		$inputDataInicial.datepicker("show");
		
    });
	
	$spanGroupDateFinal.click(function(){
		
		$inputDataFinal.datepicker("show");
		
    });
	
	$spanGroupAdd.append($spanIconAdd);
	
	$spanGroupAdd.click(function(){
		
		eval(urlAdd);
		
    });
	
	$inputDataInicial.datepicker({
		modal: true,
		constrainInput: true,
		changeMonth: false,
        changeYear: false,
        showAnim: "slideDown",
        yearRange: "c-10:c+10",
        numberOfMonths: 1,
		dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        onSelect: function() {
            
            $inputDataFinal.datepicker( "option", "minDate", $inputDataInicial.datepicker("getDate") );
            
            eval(urlSearch);
            
        }
	}).datepicker('setDate', dataAtual);
	
	$inputDataFinal.datepicker({
		modal: true,
		constrainInput: true,
		minDate: dataAtual,
		changeMonth: false,
        changeYear: false,
        showAnim: "slideDown",
        yearRange: "c-10:c+10",
        numberOfMonths: 1,
		dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        onSelect: function() {
            
            $inputDataInicial.datepicker( "option", "maxDate", $inputDataFinal.datepicker("getDate") );
            
            eval(urlSearch);
            
        }
	}).datepicker('setDate', dataAtual);
	
	$divGroup.append($inputDataInicial);
	$divGroup.append($spanGroupDateInicial);
	$divGroup.append($inputDataFinal);
	$divGroup.append($spanGroupDateFinal);
	
	if (urlAdd != "") {
		
		$divGroup.append($spanGroupAdd);
		
	}
	
	if (urlSearch == "") {
		
		$inputDataInicial.css({
			"position": "relative",
			"z-index": 999999
		});
		
		$inputDataFinal.css({
			"position": "relative",
			"z-index": 999999
		});
		
	}
	
	var $divInput = divInput(id, 'col-xs-10 col-md-10');
	
	$divInput.append($divGroup);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * campoTipoProcura.js
 * http://lls.net.br/
 * ========================================================= */

function campoTipoProcura(nomeTabela, urlSearch, tipo) {
	
	var campoTipo = caixaCombinacaoHorizontal(
		'tipo' + nomeTabela,
		'Tipo',
		'col-xs-10 col-md-10', 'col-xs-2', false,
		nomesTipos(tipo)
	);
	
	campoTipo.on('change', function() {
		
		eval(urlSearch);
		
	});
	
	return campoTipo;
	
}
/* =========================================================
 * campoTextoProcura.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoProcura(textoLabel, nomeTabela, urlSearch, urlAdd, tamanhoLabel) {
	
	var id = 'nomeProcura';
	
	var $campoHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $input = eval ('campoTextoProcura' + nomeTabela + '()');
	
	var $divGroup = $('<div />').addClass('input-group');
	
	var $spanGroupSearch = span('input-group-addon').attr('id', id + 'BotaoSearch');
	
	var $spanGroupAdd = span('input-group-addon').attr('id', id + 'BotaoAdd');
	
	var $spanIconSearch = span('glyphicon-search glyphicon');
	
	var $spanIconAdd = span('glyphicon-plus glyphicon');
	
	$spanGroupSearch.append($spanIconSearch);
	
	$spanGroupSearch.click(function(){
		
		eval(urlSearch);
		
		$input.focus();
		
    });
	
	$spanGroupAdd.append($spanIconAdd);
	
	$spanGroupAdd.click(function(){
		
		eval(urlAdd);
		
		$input.focus();
		
    });
	
	$divGroup.append($input);
	$divGroup.append($spanGroupSearch);
	$divGroup.append($spanGroupAdd);
	
	var $divInput = divInput(id, '5');
	
	$divInput.append($divGroup);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * campoSqlProcura.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcura(textoLabel, nomeTabela, nomeTabelaProcura, tamanhoCampo, tamanhoLabel, input, id, minChars) {
	
	var nomeTabelas = nomeTabela + nomeTabelaProcura;
	
	var $campoHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $idNomeTabela = campoOculto('id' + id, 0).attr("disabled", "enabled");
	
	var $idNomeTabela2 = campoOculto('id' + id + '2', 0).attr("disabled", "enabled");
	
	var $divGroup = $('<div />')
		.addClass('input-group')
		.addClass('autocomplete-suggestions')
		.attr('id', nomeTabelas + 'DivGroup');
	
	var $spanGroupSearch = span('input-group-addon')
		.attr('id', 'spanGroupSearch' + nomeTabelas)
		.attr('title', "Limpar");
	
	var $spanIconSearch = span('glyphicon-erase glyphicon');
	
	var $divInput = divInput(id, tamanhoCampo);
	
	var $span = $('<span/>').attr('id', 'nome' + nomeTabelas + 'Mensagem')
							.hide()
							.addClass("limpa")
							.css("font-weight", "Bold")
							.css("font-style", "italic")
							.css("font-size", "15px");
	
	$campoHorizontal.removeClass("has-feedback");
	
	$divGroup.append(input);
	$divGroup.append($idNomeTabela);
	$divGroup.append($idNomeTabela2);
	$divGroup.append($spanGroupSearch);
	
	$divInput.append($divGroup);
	$divInput.append($span);
	
	$campoHorizontal.append($divInput);
	
	$spanGroupSearch.append($spanIconSearch);
	
	$spanGroupSearch.click(function(){
		
		$idNomeTabela.val(0);
		$idNomeTabela2.val(0);
		
		$span.text('').hide().trigger('change');
		
		input.removeAttr('disabled').val("").focus();
		
    });
	
	$span.on('change', function() {
		
		$('.autocomplete-suggestion').empty();
		
	});
	
	input.devbridgeAutocomplete({
		autoFocus: true,
		autoSelectFirst: true,
		minChars: minChars,
		preserveInput: true,
		deferRequestBy: 3,
		lookup: function (query, done) {
			
			var dados = eval ('pegaDadosCampoSqlProcura' + nomeTabelaProcura + '("' + id + '")');
			
			$.ajax({
				type: "POST",
				url: 'listaProcura' + nomeTabelaProcura,
				dataType: "json",
				contentType: 'application/json',
				mimeType: 'application/json',
				data: JSON.stringify(dados),
				success: function(resposta) {
					
					var result = {
						suggestions: eval ('pegaDadosSqlProcura' + nomeTabelaProcura + '(resposta)')
					};
					
					done(result);
					
				},
				error: function(jqXHR, exception) {
			
					mostraAjaxErro(
						exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
						jqXHR.status
						
					);
					
				}
			})
			
		},
		onSelect: function (suggestion) {
			
			var $suggestion = {
				data: eval ('campoSqlProcura' + nomeTabelaProcura + '(suggestion, 2)')
			};
			
			$('.autocomplete-suggestion').empty();
			
			$campoHorizontal.find('.help-block').empty();
			
			$campoHorizontal.removeClass('has-error has-feedback');
			
			$idNomeTabela.val(suggestion.data.id);
			
			$idNomeTabela2.val(suggestion.data.id2);
			
			input.val($suggestion.data.valor);
			
			$span.text($suggestion.data.texto).show().trigger('change');
			
			input.attr("disabled", "enabled");
			
		},
		formatResult: function (suggestion, currentValue) {
			
			return eval ('campoSqlProcura' + nomeTabelaProcura + '(suggestion, 1)');
			
		}
	});
	
	input.keydown(function(event){
		if(event.keyCode == 13) {
		  if(input.val().length==0) {
			  event.preventDefault();
			  return false;
		  }
		}
	});
	
	return $campoHorizontal;
	
}
/* =========================================================
 * campoSqlProcuraTexto.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraTexto(
		textoLabel,
		nomeTabela,
		nomeTabelaProcura,
		placeholder,
		tamanhoCampo,
		tamanhoLabel,
		minChars,
		maxlength) {
	
	var id = 'nomeProcuraCadastro' + nomeTabela + nomeTabelaProcura;
	
	if (maxlength == null) maxlength = 50;
	
	var $input = input(id, "text", "form-control", placeholder, false, maxlength)
					.css("font-weight","Bold")
					.css("font-size","15px");
	
	if (minChars == null) minChars = 3;
	
	return campoSqlProcura(
		textoLabel,
		nomeTabela,
		nomeTabelaProcura,
		tamanhoCampo,
		tamanhoLabel,
		$input,
		id,
		minChars
	);
	
}
/* =========================================================
 * limpaCampoSqlProcura.js
 * http://lls.net.br/
 * ========================================================= */

function limpaCampoSqlProcura(nomeTabela, tipo) {
	
	$("#id" + tipo + "SqlProcura" + nomeTabela).val("0");
	$("#" + tipo + "SqlProcura" + nomeTabela).removeAttr('disabled').val("");
	
}
/* =========================================================
 * campoSqlProcuraNumero.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraNumero(
		nomeTabela,
		nomeTabelaProcura,
		textoLabel,
		tamanhoCampo,
		tamanhoLabel,
		scale,
		precision,
		allowNegative,
		allowZero,
		prefix,
		suffix,
		enabled) {
	
	var id = 'numeroProcuraCadastro' + nomeTabela + nomeTabelaProcura;
	
	if (scale > 0) {
		
		var $input = campoNumero(id, scale, precision, allowNegative, allowZero, prefix, suffix);
		
	}
	else {
		
		var $input = campoNumeroInteiro(id);
		
	}
	
	if (enabled == "disabled") {
		
		$input.attr("disabled", "enabled");
		
	}
	
	$input.css("font-weight","Bold").css("font-size","15px");
	
	return campoSqlProcura(textoLabel, nomeTabela, nomeTabelaProcura, tamanhoCampo, tamanhoLabel, $input, id, 7);
	
}
/* =========================================================
 * campoSqlProcuraTextoRelatorio.js
 * http://lls.net.br/
 * ========================================================= */

function campoSqlProcuraTextoRelatorio(textoLabel, nomeTabela, nomeTabelaProcura, placeholder, tamanhoLabel) {
	
	var nomeTabelas = nomeTabela + nomeTabelaProcura;
	
	var id = 'nomeProcura' + nomeTabelas;
	
	var idIconClear = 'spanIconClear' + nomeTabelas;
	var idGroupClear = 'spanGroupClear' + nomeTabelas;
	
	var idIconPrint = 'spanIconPrint' + nomeTabelas;
	var idGroupPrint = 'spanGroupPrint' + nomeTabelas;
	
	var $input = input(id, "text", "form-control", placeholder, false, 50)
					.css("font-weight","Bold")
					.css("font-size","15px");
	
	var $spanGroupClear = span('input-group-addon')
		.attr('id', idGroupClear)
		.attr('title', "Todas as Fazendas");
	
	var $spanIconClear = span('glyphicon-star glyphicon').attr('id', idIconClear);
	
	$spanGroupClear.append($spanIconClear);
	
	var $spanGroupPrint = span('input-group-addon')
		.attr('id', idGroupPrint)
		.attr('title', "Imprimir")
		.hide();
	
	var $spanIconPrint = span('glyphicon-print glyphicon').attr('id', idIconPrint);
	
	$spanGroupPrint.append($spanIconPrint);
	
	var $campoSqlProcura = campoSqlProcura(
		"Nome",
		nomeTabela,
		nomeTabelaProcura,
		"col-xs-10 col-md-10",
		tamanhoLabel,
		$input,
		id,
		3
	)
	
	$spanGroupClear.click(function(){
		
		var $campoMensagem = $campoSqlProcura.find('#nome' + nomeTabelas + 'Mensagem');
		
		if ($campoSqlProcura.find('.limpa').is(":visible")) {
		
			$campoSqlProcura.find('.limpa').hide().trigger('change');
			
			$spanIconClear.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
			
			$spanGroupClear.attr('title', "1 Fazenda");
			
		}
		else {
			
			if ($campoSqlProcura.find('#idnomeProcura' + nomeTabelas).val() > 0) {
			
				$campoSqlProcura.find('.limpa').show().trigger('change');
				
			}
			
			$spanIconClear.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
			
			$spanGroupClear.attr('title', "Todas as Fazendas");
			
		}
		
    });
	
	$spanGroupPrint.click(function(){
		
		var dados = eval('pegaProcura' + nomeTabela + '("' + 0 + '", "' + nomeTabela + '")');
		
		var url = "relatorio" + nomeTabela;
		
		eval("eventoImprimir('" + url + "', dados)");
		
	});
	
	$campoSqlProcura.find('#' + idGroupClear).click(function(){
		
		$spanIconClear.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
		
    });
	
	$campoSqlProcura.find('#' + nomeTabelas + 'DivGroup').append($spanGroupClear);
	$campoSqlProcura.find('#' + nomeTabelas + 'DivGroup').append($spanGroupPrint);
	
	return $campoSqlProcura;
	
}
/* =========================================================
 * formularioRelatorioNomeData.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeData(nomeTabela, nomeTabelaProcura, nomeProcura, urlAdd, urlSearch) {
	
	var divProcuraNome = formularioRelatorioNome(
		nomeTabela,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch
	);
	
	var divProcuraData = formularioRelatorioData(nomeTabela, urlAdd, urlSearch);
	
	var divProcura = $('<div/>')
		.attr('id', 'divProcura' + nomeTabela)
		.addClass('row');
		
	var divProcura1 = $('<div/>').attr('id', 'nomeProcura' + nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraNome);
		
	var divProcura2 = $('<div/>').attr('id', 'dataProcura' + nomeTabela)
		.addClass('col-md-6')
		.append(divProcuraData);
	
	divProcura.append(divProcura1).append(divProcura2);
	
	return divProcura;
	
}
/* =========================================================
 * formularioTabela.js
 * http://lls.net.br/
 * ========================================================= */

function formularioTabela(nomeTabela) {
	
	var tbodyTabela = tbody('tbodyLista' + nomeTabela);
	
	var tabelaFormulario = tabela(
		'tableLista' + nomeTabela,
		eval('pegaNomeColunas' + nomeTabela + '(2)')
	).append(tbodyTabela);
	
	var formulario = formularioHorizontal(
		'formularioTabela' + nomeTabela,
		'form-table table-responsive'
	).append(tabelaFormulario);
	
	return formulario;
	
}
/* =========================================================
 * validarFormularioSenha.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioSenha() {
	
	jQuery.validator.addMethod("checkSenhaMin", function(value, element) {
		
		var $validacao = false;
		
		var enoughRegex = new RegExp("(?=.{6,}).*", "g");
		
		if (false == enoughRegex.test(value)) {
			$validacao = false;
		} else {
			$validacao = true;
		}
		
		return $validacao;
		
		}, "Senha menor que 6 caracteres!"
	);
	
	jQuery.validator.addMethod("checkCodigoSegurancaMin", function(value, element) {
		
		var $validacao = false;
		
		var enoughRegex = new RegExp("(?=.{6,}).*", "g");
		
		if (false == enoughRegex.test(value)) {
			$validacao = false;
		} else {
			$validacao = true;
		}
		
		return $validacao;
		
		}, "Código de Segurança menor que 6 caracteres!"
	);
	
	jQuery.validator.addMethod("checkSenhaFraca", function(value, element) {
		
		var $validacao = false;
		
		var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		
		if (mediumRegex.test(value)) {
			$validacao = true;
		} else {
			$validacao = false;
		}
		
		return $validacao;
		
		}, "Senha muito fraca! Use letras maiúsculas, minúsculas, símbolos e números!"
	);
	
	jQuery.validator.addMethod("checkSenhaForte", function(value, element) {
		
		var $validacao = false;
		
		var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
		
		if (strongRegex.test(value)) {
			$validacao = true;
		} else {
			$validacao = false;
		}
		
		return $validacao;
		
		}, "Senha média! Use letras maiúsculas, minúsculas, símbolos e números!"
	);
	
	jQuery.validator.addMethod("checkSenhaConfirma", function(value, element) {
		
		var $validacao = false;

		var $senhaNova = $('#senhaNova').val();
		
		if (value == $senhaNova) {
			$validacao = true;
		} else {
			$validacao = false;
		}
		
		return $validacao;
		
		}, "Confirmação de senha incorreta!"
	);
	
}
/* =========================================================
 * formularioRelatorioNomeHide.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeHide(nomeTabela, nomeTabelaProcura, urlSearch, formulario) {
	
	formulario.find('.limpa').on('change', function() {
		
		var produtor = formulario.find('#idnomeProcura' + nomeTabela + nomeTabelaProcura).val();
		
		var thProdutor = $('#nomeColunastableLista' + nomeTabela).find("#thprodutor");
		var thFazenda = $('#nomeColunastableLista' + nomeTabela).find("#thfazenda");
		
		if (produtor == 0) {
			
			$('#spanIconClear' + nomeTabela + nomeTabelaProcura)
				.removeClass('glyphicon-star-empty')
				.addClass('glyphicon-star');
				
			$('#spanGroupClear' + nomeTabela + nomeTabelaProcura)
				.attr('title', "Todas as Fazendas");
			
			thProdutor.show();
			thFazenda.show();
			
		}
		else {
			
			var display = $('#nome' + nomeTabela + nomeTabelaProcura + 'Mensagem').css("display");
			
			if (display != "none") {
			
				thFazenda.hide();
				
			}
			else {
				
				thFazenda.show();
				
			}
			
			thProdutor.hide();
			
		}
		
		eval(urlSearch);
		
	});
	
}
/* =========================================================
 * formularioProcura.js
 * http://lls.net.br/
 * ========================================================= */

function formularioProcura(nomeTabela, textoLabel) {
	
	var $formulario = formularioHorizontal('formularioProcura' + nomeTabela, '');
	
	var $divProcura = $('<div/>').addClass('input-group form-control formulario_cor');
	
	var urlSearch = 'eventoListaCadastro(1, "' + nomeTabela + '")';
	
	var urlAdd = 'novoCadastro("' + nomeTabela + '", "click-off", "1")';
	
	var $campoTextoProcura = campoTextoProcura(
		textoLabel,
		nomeTabela,
		urlSearch,
		urlAdd,
		2
	);

	$divProcura.append($campoTextoProcura);
	
	$formulario.submit(function(e){
		
		e.preventDefault();
		
		eval(urlSearch);
		 
	});
	
	$formulario.append($divProcura);
	
	return $formulario;
	
}
/* =========================================================
 * formularioCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function formularioCadastro(idCadastro, nomeTabela, tipoTextoBotao, tamanhoBotao,
							objeto, tamanhoOffSet, nomeTabelaCadastro) {
	
	var $tipoOperacao = 0;
	
	if (idCadastro > 0) {
		
		$tipoOperacao = 1;
		
	}
	
	if (tamanhoOffSet == null) tamanhoOffSet = 4;
	
	var $campoOculto = campoOculto('id' + nomeTabela, idCadastro);
	
	var $botao = botaoHorizontal(
		'botao' + nomeTabela,
		textoBotao(tipoTextoBotao),
		'fa-check',
		tamanhoBotao,
		tamanhoOffSet,
		'btn btn-block btn-success',
		'submit',
		''
	);
	
	$botao.find('div').addClass('col-xs-5 col-xs-offset-4 btn btn-block btn-success');
	
	var $formulario = formularioHorizontal(nomeTabela.toLowerCase(), 'form-horizontal')
		.append(objeto)
		.append($botao)
		.append($campoOculto);
		
	eval('validarFormulario' + nomeTabela + '("' + $tipoOperacao + '", "' +
		nomeTabela + '", $formulario, "' + nomeTabelaCadastro + '")'
	);
	
	return $formulario;
	
}
/* =========================================================
 * formularioRelatorioNome.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNome(nomeTabela, nomeTabelaProcura, nomeProcura, urlSearch) {
	
	var $placeholder = "Digite o nome do " + nomeProcura.toLowerCase();
	
	var $campoNomeProcura = campoSqlProcuraTextoRelatorio(
		nomeProcura,
		nomeTabela,
		nomeTabelaProcura,
		$placeholder,
		2
	);
	
	var $divProcuraNome = $('<div/>')
		.attr('id', 'inputGroup' + nomeTabela)
		.addClass('input-group form-control formulario_cor')
		.append($campoNomeProcura);
	
	formularioRelatorioNomeHide(nomeTabela, nomeTabelaProcura, urlSearch, $divProcuraNome);
	
	return $divProcuraNome;
	
}
/* =========================================================
 * formularioRelatorioNomeTipo.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeTipo(nomeTabela, nomeTabelaProcura, nomeProcura, urlSearch, tipo) {
	
	var $formularioRelatorioNome = formularioRelatorioNome(
		nomeTabela,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch
	);
	
	var $formularioRelatorioTipo = formularioRelatorioTipo(nomeTabela, urlSearch, tipo);
	
	var $divProcuraNome = $('<div/>')
		.attr('id', 'nomeProcura' + nomeTabela)
		.addClass('col-md-6')
		.append($formularioRelatorioNome);
	
	var $divProcuraTipo = $('<div/>')
		.attr('id', 'tipoProcura' + nomeTabela)
		.addClass('col-md-6')
		.append($formularioRelatorioTipo);
	
	var $divProcura = $('<div/>')
		.attr('id', 'divProcura' + nomeTabela)
		.addClass('row')
		.append($divProcuraNome)
		.append($divProcuraTipo);
	
	return $divProcura;
	
}
/* =========================================================
 * formularioRelatorioData.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioData(nomeTabela, urlAdd, urlSearch) {
	
	var $campoDataProcura = campoDataProcura(
		"Data",
		nomeTabela,
		urlSearch,
		urlAdd,
		2
	);
		
	var $divProcuraData = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append($campoDataProcura);
	
	return $divProcuraData;
	
}
/* =========================================================
 * formularioRelatorioNomeDataTipo.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeDataTipo(nomeTabela, nomeTabelaProcura, nomeProcura, urlSearch,
										 posicaoItemMenu, tipo, nomeTabelaLancamento) {
	
	var formularioTipo = formularioRelatorioTipo(nomeTabela, urlSearch, tipo);
	
	var divProcuraTipo = $('<div/>')
		.attr('id', 'tipoProcura' + nomeTabela)
		.addClass('col-md-6')
		.append(formularioTipo);
	
	var divProcura = formularioRelatorioNomeDataAdd(
		nomeTabela,
		nomeTabelaProcura,
		nomeProcura,
		urlSearch,
		posicaoItemMenu,
		nomeTabelaLancamento
	);
	
	divProcura.find('#nomeProcura' + nomeTabela)
		.removeClass('col-md-6')
		.addClass('col-md-12');
	
	divProcura.append(divProcuraTipo);
	
	return divProcura;
	
}
/* =========================================================
 * formularioRelatorioTipo.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioTipo(nomeTabela, urlSearch, tipo) {
	
	var campoTipo = campoTipoProcura(nomeTabela, urlSearch, tipo);
	
	var divProcuraTipo = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append(campoTipo);
	
	return divProcuraTipo;
	
}
/* =========================================================
 * validarId.js
 * http://lls.net.br/
 * ========================================================= */

function validarId(nomeTabela) {
	
	jQuery.validator.addMethod('checkIdMilho',
		function (value, element) { 		
			
			var id = $('#idnomeProcuraCadastro' + nomeTabela + 'Milho').val();
			
			if (id > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'É necessário selecionar o produtor!'
	);
	
	jQuery.validator.addMethod('checkIdFazendaProdutor',
		function (value, element) { 		
			
			var id = $('#idnomeProcuraCadastro' + nomeTabela + 'FazendaProdutor').val();
			
			if (id > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'É necessário selecionar o produtor!'
	);
	
	jQuery.validator.addMethod('checkIdUmidade',
		function (value, element) { 		
			
			var id = $('#idnumeroProcuraCadastro' + nomeTabela + 'Umidade').val();
			
			if (id > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'É necessário selecionar a umidade!'
	);
	
	jQuery.validator.addMethod('checkIdPreco',
		function (value, element) { 		
			
			var id = $('#idnumeroProcuraCadastro' + nomeTabela + 'Preco').val();
			
			if (id > 0) {
				
				return true;
				
			}
			else {
				
				return false;
				
			}
			
		}, 'É necessário selecionar o serviço!'
	);
	
}
/* =========================================================
 * setDadosFormularioRelatorio.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosFormularioRelatorio(dados) {
	
	$('#dataInicial' + dados.nomeTabela).datepicker( "option", "maxDate", dados.data );
	$('#dataInicial' + dados.nomeTabela).datepicker("setDate", dados.data);
	
	$('#dataFinal' + dados.nomeTabela).datepicker( "option", "minDate", dados.data );
	$('#dataFinal' + dados.nomeTabela).datepicker("setDate", dados.data);
	
	$('#idnomeProcura' + dados.nomeTabela + 'FazendaProdutor').val(0);
	$('#idnomeProcura' + dados.nomeTabela + 'FazendaProdutor2').val(0);
	
	$('#nomeProcura' + dados.nomeTabela + 'FazendaProdutor').removeAttr('disabled').val("");
	
	$('#spanIconClear' + dados.nomeTabela + 'FazendaProdutor')
		.removeClass('glyphicon-plus').addClass('glyphicon-minus');
	
	$('#nomeProcura' + dados.nomeTabela + 'FazendaProdutorDivInput')
		.find('.limpa').text('').hide();
	
	$("#divDialogAltera" + dados.nomeTabela).find(".limpa").text("").hide();

	$("#divDialogAltera" + dados.nomeTabela).empty().remove().dialog( "close" );

}
/* =========================================================
 * validarFormulario.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormulario() {
	
	jQuery.validator.addMethod("noSpace", function(value) { 
		return value[0] !== " " && value != ""; 
		}, "No space please and don't leave it empty"
	);
	
	jQuery.validator.addMethod("checkurl", function(value) {
		return /^(www\.)[A-Za-z0-9_-]+\.+[A-Za-z0-9.\/%&=\?_:;-]+$/.test(value) || value === "";
		}, "Please enter a valid URL."
	);

	jQuery.validator.addMethod('positiveNumber', function (value) { 
		return Number(value) > 0;
		}, 'Informe um número maior que zero!'
	);
	
	jQuery.validator.addMethod('maskNumber', function (value) { 
		return Number(formataNumeroSql(value)) > 0;
		}, 'Informe um número maior que zero!'
	);
	
	jQuery.validator.methods.number = function (value, element) {
		if (!$.isNumeric(value)) value = formataNumeroSql(value);
		return this.optional(element) || /\d{1,3}(\.\d{3})*(\.\d\d)?|\.\d\d/.test(value);
	}
	
	jQuery.validator.methods.max = function (value, element, param) {
		if (!$.isNumeric(value)) value = formataNumeroSql(value);
		return this.optional(element) || Number(value) <= param;
	}

	jQuery.validator.methods.min = function (value, element, param) {
		if (!$.isNumeric(value)) value = formataNumeroSql(value);
		return this.optional(element) || Number(value) >= param;
	}
	
}
/* =========================================================
 * formularioRelatorioNomeDataAdd.js
 * http://lls.net.br/
 * ========================================================= */

function formularioRelatorioNomeDataAdd(nomeTabela, nomeTabelaProcura, nomeProcura, urlSearch,
										posicaoItemMenu, nomeTabelaLancamento) {
	
	var urlAdd = 'novoCadastro("' + nomeTabela + '", "click-off", "' +
		posicaoItemMenu + '", "0", "' + nomeTabelaLancamento + '")';
	
	return formularioRelatorioNomeData(
		nomeTabela,
		nomeTabelaProcura,
		nomeProcura,
		urlAdd,
		urlSearch
	);
		
}
/* =========================================================
 * nomesTipos.js
 * http://lls.net.br/
 * ========================================================= */

function nomesTipos(tipo) {
	
	switch (tipo) {
		
		case 1: 
			
			var nomesTipos = { 
				"0": "Abertos",
				"1": "Pagos",
				"2": "Todos"
			};
			
			break;
		
		case 2:
			
			var nomesTipos = { 
				"0": "Faturados",
				"1": "A Faturar",
				"2": "Todos"
			};
			
			break;
			
		case 3: 
			
			var nomesTipos = { 
				"0": "Abertas",
				"1": "Fechadas",
				"2": "Todas"
			};
			
			break;
		
		case 4: 
			
			var nomesTipos = { 
				"0": "Abertas",
				"1": "Despejadas",
				"2": "Fechadas",
				"3": "Todas"
			};
			
			break;
			
		case 5: 
			
			var nomesTipos = { 
				"0": "Abertos",
				"1": "Fechados",
				"2": "Todos"
			};
			
			break;
			
	}
	
	return nomesTipos;

}
/* =========================================================
 * campoDataHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoDataHorizontal(id, textoLabel, tamanhoCampo,
							 tamanhoLabel, required, minDate,
							 maxDate, dataAtual, enabled) {
						      
	var $campoHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $input = input(id, 'text', 'form-control', 'Selecione a data', required, '10');
	
	var $divGroup = $('<div />').addClass('input-group');
	
	var $spanGroup = span('input-group-addon ui-datepicker-trigger');
	
	var $spanIcon = span('glyphicon-calendar glyphicon');
	
	$spanGroup.append($spanIcon);
	
	$input.attr("disabled","disabled")
		.css("font-weight","Bold")
		.css("font-size","15px");
	
	$spanGroup.click(function(){
		
		$input.datepicker("show");
		
    });
	
	if (enabled == "disabled") {
		
		$spanGroup.unbind("click");
		
	}
	
	$input.datepicker({
		modal: true,
		constrainInput: true,
		minDate: minDate,
		maxDate: maxDate,
		changeMonth: false,
		changeYear: false,
		showAnim: "slideDown",
        yearRange: "c-10:c+0",
        numberOfMonths: 1,
		dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        
        beforeShow: function(input, obj) {
			
			$(input).css({
				"position": "relative",
				"z-index": 999999
			});
			
		}
        
	}).datepicker('setDate', dataAtual);
	
	$divGroup.append($input);
	$divGroup.append($spanGroup);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($divGroup);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * pegaValorCaixaCombinacao.js
 * http://lls.net.br/
 * ========================================================= */

function pegaValorCaixaCombinacao(valor) {
					
	if (valor == "") return null;
	else return valor;
	
}
/* =========================================================
 * campoAreaTexto.js
 * http://lls.net.br/
 * ========================================================= */

function campoAreaTexto(id, placeholder, linhas, maxlength) {
	
	var $campoAreaTexto = campoHorizontal(id, '', 2);
	
	var $textarea = $('<textarea/>').attr({id: id, name: id, type: 'text', placeholder : placeholder, maxlength: maxlength});
	
	var $idSpan = id + "1";
	
	var $span = span('glyphicon form-control-feedback').attr('id', $idSpan);
	
	var $divInput = divInput(id, '');
	
	$textarea.attr('rows', linhas);
	
	$textarea.addClass('form-control');
	$textarea.addClass('input-xlarge');
	
	$divInput.append($textarea);
	$divInput.append($span);
	
	$campoAreaTexto.append($divInput);
	
	return $campoAreaTexto;
	
}
/* =========================================================
 * formataNumero.js
 * http://lls.net.br/
 * ========================================================= */

function formataNumero(numero, scale, allowNegative, allowZero, prefix, suffix) {
	
	var $input = input('formataNumero', 'text', 'form-control', '', false, null);
	
	$input.maskMoney({
		prefix: prefix,
		allowNegative: allowNegative,
		allowZero: allowZero,
		thousands: '.',
		decimal: ',',
		affixesStay: true,
		precision: scale
	});
	
	return $input.maskMoney('mask', numero).val() + suffix;
	
}
/* =========================================================
 * caixaRadioHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function caixaRadioHorizontal(id, nomes) {
	
	var caixaRadio = $("<div/>")
		.attr('id', id + 'RadioFormGroup')
		.addClass('form-group has-feedback');
	
	jQuery.each( nomes, function( i, value ) {
	
		var caixaVerificacao = caixaVerificacaoHorizontal(
			id + value,
			value,
			'radio'
		).removeClass('help-block col-sm-6 col-sm-offset-4 col-md-3 col-md-offset-4 col-xs-6 col-xs-offset-4')
		.addClass('form-check-inline');
	
		caixaVerificacao.find('#' + id + value)
			.attr('name', id)
			.val(i);
		
		caixaRadio.append(caixaVerificacao);
		
	});
	
	var campoRadio = caixaVerificacaoHorizontal(
		id + 'Radio',
		'',
		'radio'
	).removeClass('help-block col-sm-6 col-sm-offset-4 col-md-3 col-md-offset-4 col-xs-6 col-xs-offset-4');
	
	campoRadio.find('#' + id + 'Radio').hide();
	
	caixaRadio.append(campoRadio);
	
	return caixaRadio;
	
}
/* =========================================================
 * campoNumeroHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoNumeroHorizontal(
		id,
		textoLabel,
		tamanhoCampo,
		tamanhoLabel,
		scale,
		precision,
		allowNegative,
		allowZero,
		prefix,
		suffix,
		enabled) {
	
	var $campoNumero = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	if (scale > 0) {
		
		var $input = campoNumero(id, scale, precision, allowNegative, allowZero, prefix, suffix);
		
	}
	else {
		
		var $input = campoNumeroInteiro(id, precision);
		
	}
	
	if (enabled == "disabled") {
		
		$input.attr("disabled", enabled);
		
	}
	
	var $divInput = divInput(id, tamanhoCampo);
	
	var $idSpan = id + "1";
	
	var $span = span('glyphicon form-control-feedback').attr('id', $idSpan);
	
	$divInput.append($input);
	
	$divInput.append($span);
	
	$campoNumero.append($divInput);
	
	return $campoNumero;
	
}
/* =========================================================
 * nomesEstados.js
 * http://lls.net.br/
 * ========================================================= */

function nomesEstados() {
	
	var $nomesEstados = { 
		"": "Selecione",
		"AC": "Acre (AC)",
		"AL": "Alagoas (AL)",
		"AP": "Amapá (AP)",
		"AM": "Amazonas (AM)",
		"BA": "Bahia (BA)",
		"CE": "Ceará (CE)",
		"DF": "Distrito Federal (DF)",
		"ES": "Espírito Santo (ES)",
		"GO": "Goiás (GO)",
		"MA": "Maranhão (MA)",
		"MT": "Mato Grosso (MT)",
		"MS": "Mato Grosso do Sul (MS)",
		"MG": "Minas Gerais (MG)",
		"PA": "Pará (PA)",
		"PB": "Paraíba (PB)",
		"PR": "Paraná (PR)",
		"PE": "Pernambuco (PE)",
		"PI": "Piauí (PI)",
		"RJ": "Rio de Janeiro (RJ)",
		"RN": "Rio Grande do Norte (RN)",
		"RS": "Rio Grande do Sul (RS)",
		"RO": "Rondônia (RO)",
		"RR": "Roraima (RR)",
		"SP": "São Paulo (SP)",
		"SC": "Santa Catarina (SC)",
		"SE": "Sergipe (SE)",
		"TO": "Tocantins (TO)"
	};
		
	return $nomesEstados;

}
/* =========================================================
 * campoImagemHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoImagemHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, imagem) {
	
	var $campoHorizontal = campoHorizontal(id, '', tamanhoLabel);
	
	var $divGroup = $('<div />').addClass('input-group');
	
	var texto = $('<span/>').text('	').append($('<a/>').text(textoLabel).addClass('texto'));
	
	$divGroup.append(imagem);
	
	$divGroup.append(texto);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($divGroup);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * caixaCombinacaoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function caixaCombinacaoHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, required, nomesOpcoes) {
	
	var $caixaCombinacao = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $select = $('<select />').attr({id: id, name: id});
	
	$select.addClass('form-control');
	
	jQuery.each( nomesOpcoes, function( value, nomeOpcao ) {
	
		var $option = $('<option />').val(value).text(nomeOpcao);
	
		$select.append($option);
	
	});
	
	var $divSelect = divInput(id, tamanhoCampo);
	
	$divSelect.append($select);
	
	$caixaCombinacao.append($divSelect);
	
	return $caixaCombinacao;
	
}
/* =========================================================
 * campoNumero.js
 * http://lls.net.br/
 * ========================================================= */

function campoNumero(id, scale, precision, allowNegative, allowZero, prefix, suffix) {
	
	var placeholder = prefix + "0,00" + suffix;
	
	var totalPontos = 0;
		
	if (precision < 6) {
		
		totalPontos = 1;
		
	}
	else if (precision < 9) {
	
		totalPontos = 2;
	
	}
	else if (precision < 12) {
	
		totalPontos = 3;
	
	}
	else if (precision < 15) {
		
		totalPontos = 4;
		
	}
	else {
	
		totalPontos = 5;
	
	}

	var maxlength = Number(precision) + Number(totalPontos) + Number(prefix.length) + Number(suffix.length);
	
	var $input = input(id, 'text', 'form-control', placeholder, false, maxlength);
	
	$input.maskMoney({
		suffix: suffix,
		prefix: prefix,
		allowNegative: allowNegative,
		allowZero: allowZero,
		thousands: '.',
		decimal: ',',
		affixesStay: true,
		precision: scale
	});
	
	return $input;
	
}
/* =========================================================
 * caixaVerificacaoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function caixaVerificacaoHorizontal(id, textoLabel, type) {
	
	if (type == null) type = 'checkbox';
	
	var inputCheckBox = input(
		id,
		type,
		'form-check-input col-xs-2 col-md-2 col-lg-2', '', false, ''
	);
	
	var labelCheckBox = label(id, textoLabel, 'form-check-label texto_label texto_grande');
	
	var caixaVerificacao = $("<div/>")
		.attr({id: id + "FormCheck"})
		.addClass('form-check help-block')
		.addClass('col-sm-6 col-sm-offset-4 col-md-3 col-md-offset-4 col-xs-6 col-xs-offset-4')
		.append(inputCheckBox)
		.append(labelCheckBox);
	
	return caixaVerificacao;
	
}
/* =========================================================
 * telaObservacao.js
 * http://lls.net.br/
 * ========================================================= */

function telaObservacao(nomeTabela, id) {
	
	if (id == null) id = "observacao";
	
	return campoAreaTexto(
		id + nomeTabela,
		'',
		10, 255);
	
}
/* =========================================================
 * formataData.js
 * http://lls.net.br/
 * ========================================================= */

function formataData(data) {
	
	if (data != null && data != '') {
	
		var parts = data.split("-");
	
		var dataFormatada = parts[2] + "/" + parts[1] + "/" + parts[0];
		
	}
	else {
		
		var dataFormatada = "";
		
	}
	
	return dataFormatada;
	
}
/* =========================================================
 * campoNumeroInteiro.js
 * http://lls.net.br/
 * ========================================================= */

function campoNumeroInteiro(id, maxlength) {
	
	if (maxlength == null) maxlength = 10;
	
	var $input = input(id, 'text', 'form-control', '0', false, maxlength);
	
	var mask = '';
	
	for(var i=0; i< maxlength; i++) {
		mask += '9';
	}
	
	$input.inputmask({
	  alias: 'numeric', 
	  allowMinus: false,
	  rightAlign: false,
	  digits: 0,
	  max: mask
	});
	
	return $input;
	
}
/* =========================================================
 * campoAreaTextoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoAreaTextoHorizontal(id, label, tamanhoCampo, tamanhoLabel, linhas, maxlength, placeholder) {
	
	var $campoHorizontal = campoHorizontal(id, label, tamanhoCampo, tamanhoLabel);
	
	var $textarea = campoAreaTexto(id, placeholder, linhas, maxlength);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($textarea);
	
	$campoHorizontal.append($divInput);
	
	return $campoHorizontal;
	
}
/* =========================================================
 * formataNumeroSql.js
 * http://lls.net.br/
 * ========================================================= */

function formataNumeroSql(numero) {
	
	var valor = input('formataNumero', 'text', 'form-control', '', false, null)
		.val(numero)
		.maskMoney('unmasked')[0];
	
	return valor;
	
}
/* =========================================================
 * pegaProcuraRelatorioNomeDataTipo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraRelatorioNomeDataTipo(pagina, nomeTabela) {
	
	var dadosRelatorio = pegaProcuraRelatorioNomeData(pagina, nomeTabela);
	
	dadosRelatorio["tipo"] = $("#tipo" + nomeTabela).val();
	
	return dadosRelatorio;
	
}
/* =========================================================
 * tabelaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaCadastro(posicaoItemMenu, nomeTabela, textoLabel) {
	
	var formulario = formularioHorizontal('lista' + nomeTabela, 'formulario_cor');
	
	var $formularioProcura = formularioProcura(nomeTabela, textoLabel);
	
	var $formularioTabela = formularioTabela(nomeTabela);
	
	var $paginacao = paginacao(
		'paginaLista' + nomeTabela,
		'eventoLista' + nomeTabela,
		0, 0, nomeTabela
	);
	
	var titulo = $("<div/>").addClass('titulo_tabela')
		.text(tituloPainelCadastro(2, eval('pegaNomeColunas' + nomeTabela + '(3)')));
	
	var tituloTabela = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append(titulo);
	
	formulario.append($formularioProcura)
		.append(tituloTabela)
		.append($formularioTabela)
		.append($paginacao);
	
	mudaPainel(formulario, posicaoItemMenu);
	
	$('#nomeProcura').focus();
	
}
/* =========================================================
 * eventoAcharCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function eventoAcharCadastro(idCadastro, tipoOperacao, nomeTabela) {
	
	var dados = {	
		"url": "acha" + nomeTabela,
		"nomeTabela": nomeTabela,
		"id": idCadastro,
		"nome": $('#nomeProcura').val()
	}
	
	$.ajax({
		type: "POST",
		url: dados.url,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(dados),
		success: function(resposta) {
			
			if (resposta.status == "200") {
			
				resposta["nomeTabela"] = nomeTabela;
				
				if (tipoOperacao == "0") {
				
					eval('setDadosDialog' + dados.nomeTabela + '(' + JSON.stringify(resposta) + ')');
					
				}
				else {
				
					eval('setDadosFormulario' + dados.nomeTabela + '(' + JSON.stringify(resposta) + ')');
					
				}
				
				
				
			}
			else {
				
				mostraDialog(
					resposta.mensagem,
					'texto_cor_vermelho',
					'table',
					tituloPainelCadastro(2, eval('pegaNomeColunas' + dados.nomeTabela + '(3)'))
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
 * alteraCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function alteraCadastro(id, nomeTabela) {
	
	eventoAcharCadastro(id, 1, nomeTabela);
	
}
/* =========================================================
 * divTabs.js
 * http://lls.net.br/
 * ========================================================= */

function divTabs(id, nomesTabs) {
	
	var $idTabs = 'tab' + id;
	
	var $divTabs = $("<div/>").attr({id: $idTabs});
	
	var $ul = ul(
		'nav nav-tabs nav-condensed',
		'tablist'
	).attr('id', 'tabs');
	
	$ul.tabCollapse({
		tabsClass: 'hidden-sm',
		accordionClass: 'visible-sm'
	});
	
	var $divTabContent = $("<div/>").addClass('tab-content');
	
	$divTabs.append($ul);
	
	$divTabs.append($divTabContent);
	
	jQuery.each( nomesTabs, function( idTab, tituloTab ) {
			
		var $idLinha = 'linha_' + idTab;
		
		var $li = li($idLinha, '');
		
		var $hrefTab = '#' + idTab;
		
		var $a = a('', $hrefTab, 'texto_grande texto_cor_cinza', '', 'tab', '', '');
		
		$a.text(tituloTab);
		
		$li.append($a);
		
		$ul.append($li);
		
		var $divTab = $("<div/>").attr({id: idTab});
		
		$divTab.addClass('tab-pane fade');
		
		$divTabContent.append($divTab);
		
	});
	
	return $divTabs;
}
/* =========================================================
 * eventoImprimir.js
 * http://lls.net.br/
 * ========================================================= */

function eventoImprimir(urlImprimir, dados) {
	
	$.ajax({
		url: urlImprimir,
		type: "POST",
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(dados),
		success: function (response, status, xh) {
			
			var fileModel = response;
			var blob = base64toBlob(fileModel.content, fileModel.mimeType);
			var url = window.URL.createObjectURL(blob);
			var win = window.open(url, '_blank');
			
			if(win){
				win.focus();
			}else{
				alert('Favor permitir janelas popups para esse site');
			}
    
		},
		cache: false,
		processData: false,
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
}

function base64toBlob(base64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(base64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type : contentType
  });
  return blob;
}
/* =========================================================
 * mostraDialogOpcao.js
 * http://lls.net.br/
 * ========================================================= */

function mostraDialogOpcao(textoMensagem, corTexto, classe, titulo, id, nomeTabela, tipo, url) {
	
	var $divDialog = divDialog(textoMensagem, corTexto);
	
	$divDialog.dialog({
		title: titulo,
		autoOpen: false,
		position: { my: 'center', at: 'center', of: $("#painel"), within: $(classe) },
		width: 350,
		modal: true,
		buttons: [
			{
				id: "botaoSim",
				text: 'Sim',
				tabIndex: -1,
				click: function() {
					
					var $id = $divDialog.data('id');
					
					$divDialog.dialog( "close" );
					
					if (tipo == "Remover") eventoRemover(titulo, $id, nomeTabela, url);
					else eventoImprimir(url, {id: $id});
					
				}
			},
			{
				id: "botaoNao",
				text: 'Não',
				click: function() {
					
					$( this ).dialog( "close" );
					
				}
			}
		],
		close: function (ev, ui) {
            $(this).dialog('destroy').remove();
        }
	});
	
	$divDialog
		.data('id', id)
		.dialog("open");
	
	$("body").scrollTop('0');
}
/* =========================================================
 * pegaProcuraRelatorioNomeTipo.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraRelatorioNomeTipo(pagina, nomeTabela) {
	
	var dados = pegaProcuraRelatorioNome(pagina, nomeTabela);
	
	dados["tipo"] = $("#tipo" + nomeTabela).val();
	
	return dados;
	
}
/* =========================================================
 * eventoRemover.js
 * http://lls.net.br/
 * ========================================================= */

function eventoRemover(titulo, id, nomeTabela, url) {
	
	if (url == null) url = 'remove' + nomeTabela;
	
	var $idLinhaRemover = '#div' + nomeTabela + ' #table' + nomeTabela + ' #tbody' + nomeTabela;
	
	var idLinhaTabela = '#' + nomeTabela.toLowerCase() + '_' + id;

	var dados = {
		id: id,
		nome: ''
	}

	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(dados),
		success: function(resposta) {
			
			var $cor_texto = 'texto_cor_vermelho';
			
			if (resposta.status == "200") {
			
				$cor_texto = 'texto_cor_verde';
				
				$('#divDialogVisualiza' + nomeTabela).empty();
				$('#divDialogVisualiza' + nomeTabela).remove();
				$('#divDialogVisualiza' + nomeTabela).dialog( "close" );
				
				eval ('removeTotalTabela' + nomeTabela + '("' + idLinhaTabela +
					'", "' + nomeTabela + '")');
				
				$(idLinhaTabela).remove();
				
				if ($idLinhaRemover != '' || $idLinhaRemover != null) {
					
					$($idLinhaRemover + ' ' + idLinhaTabela).remove();
					
				}
				
			}
			
			mostraDialog(
				resposta.mensagem,
				$cor_texto,
				'thead',
				tituloPainelCadastro(3, eval('pegaNomeColunas' + nomeTabela + '(3)'))
			);
			
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
 * setBotoesDialogLancamento.js
 * http://lls.net.br/
 * ========================================================= */

function setBotoesDialogLancamento(lancamento) {
	
	if (lancamento.valorPago == 0) {
		
		if (lancamento.remover == 0) {
		
			$("#botaoRemover" + lancamento.nomeTabela).show();
		
		}
		else {
		
			$("#botaoRemover" + lancamento.nomeTabela).hide();
			
		}
		
		if (lancamento.baixar == 0) {
		
			$("#botaoBaixar" + lancamento.nomeTabela).show();
		}
		else {
			
			$("#botaoBaixar" + lancamento.nomeTabela).hide();
			
		}
		
		if (lancamento.alterar == 0) {
			
			$("#botaoAlterar" + lancamento.nomeTabela).show();
		}
		else {
			
			$("#botaoAlterar" + lancamento.nomeTabela).hide();
			
		}
		
	}
	else {
		
		$("#botaoRemover" + lancamento.nomeTabela).hide();
		$("#botaoAlterar" + lancamento.nomeTabela).hide();
		
		if (lancamento.valorRestante > 0) {
			
			if (lancamento.baixar == 0) {
			
				$("#botaoBaixar" + lancamento.nomeTabela).show();
			
			}
			else {
				
				$("#botaoBaixar" + lancamento.nomeTabela).hide();
				
			}
			
		}
		else {
			
			$("#botaoBaixar" + lancamento.nomeTabela).hide();
			
		}
		
	}
		
}
/* =========================================================
 * mostraCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function mostraCadastro(id, nomeTabela) {
	
	eventoAcharCadastro(id, 0, nomeTabela);
	
}
/* =========================================================
 * setDadosRodapeHide.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosRodapeHide(nomeTabela, colspan, th1) {
	
	var idFazenda = $('#idnomeProcura' + nomeTabela + 'FazendaProdutor').val();
	
	var colunas = colspan.inicio;
	
	if (idFazenda > 0) {
		
		if ($('#spanIconClear' + nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
			
			colunas = colunas - 1;
			
		}
		else {
			
			colunas = colunas - 2;
			
		}
		
	}
	
	th1.attr('colspan', colunas);
	
}
/* =========================================================
 * getJsonById.js
 * http://lls.net.br/
 * ========================================================= */

function getJsonById(url, id) {
	
	var result= "";
	
	var dados = {
		"id": id
	}
	
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(dados),
		async: false,
		success: function(resposta) {
			
			result = resposta;
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
	return result;
	
}
/* =========================================================
 * tabelaRelatorio.js
 * http://lls.net.br/
 * ========================================================= */

function tabelaRelatorio(posicaoItemMenu, nomeTabela, textoLabel) {
	
	var formularioTabelaRelatorio = formularioTabela(nomeTabela);
	
	var paginacaoTabela = paginacao(
		'paginaLista' + nomeTabela,
		'eventoLista' + nomeTabela,
		0, 0, nomeTabela
	);
	
	var formularioRelatorio = eval ("formularioRelatorio" + nomeTabela +
		"('" + nomeTabela + "', '" + posicaoItemMenu + "')"
	);
	
	var titulo = $("<div/>").addClass('titulo_tabela')
		.text(tituloPainelCadastro(2, eval('pegaNomeColunas' + nomeTabela + '(3)')));
	
	var tituloTabela = $('<div/>')
		.addClass('input-group form-control formulario_cor')
		.append(titulo);
	
	var divProcura1 = $('<div/>')
		.addClass('col-md-12')
		.append(formularioRelatorio);
		
	var divProcura2 = $('<div/>')
		.addClass('col-md-12')
		.append(tituloTabela);
		
	var divProcura3 = $('<div/>')
		.addClass('col-md-12')
		.append(formularioTabelaRelatorio);
		
	var divProcura4 = $('<div/>')
		.addClass('col-md-12')
		.append(paginacaoTabela);
	
	var divProcura = $('<div/>')
		.addClass('row')
		.append(divProcura1)
		.append(divProcura2)
		.append(divProcura3)
		.append(divProcura4);
		
	var formulario = formularioHorizontal('lista' + nomeTabela, 'formulario_cor')
		.append(divProcura);
	
	mudaPainel(formulario, posicaoItemMenu);
	
	formulario.find('#nomeProcura' + nomeTabela + 'FazendaProdutor').focus();
	formulario.find('#nomeProcura').focus();
	
}
/* =========================================================
 * setDadosColunaHide.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosColunaHide(nomeTabela, dados, tr) {
	
	var idFazenda = $('#idnomeProcura' + nomeTabela + 'FazendaProdutor').val();
		
	if (idFazenda == 0) {
	
		tr.append(tabelaCelula(dados.produtor, "text-left", "texto", "tdProdutor"));
		tr.append(tabelaCelula(dados.fazenda, "text-left", "texto", "tdFazenda"));
		
	}
	else {
		
		if ($('#spanIconClear' + nomeTabela + 'FazendaProdutor').hasClass("glyphicon-star-empty")) {
		
			tr.append(tabelaCelula(dados.fazenda, "text-left", "texto", "tdFazenda"));
			
		}
		
	}
	
}
/* =========================================================
 * eventoListaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function eventoListaCadastro(pagina, nomeTabela) {
	
	var dados = eval('pegaProcura' + nomeTabela + '("' + pagina + '", "' + nomeTabela + '")');
	
	$.ajax({
		type: "POST",
		url: "lista" + nomeTabela,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify(dados),
		success: function(resposta) {
			
			if (resposta.status == "200") {
			
				var qtdPaginas = resposta.paginas;
				
				var cadastrosArray = resposta.cadastros;
				
				var formulario = $('#lista' + nomeTabela + 'Form');
				
				var tbodyCadastro = formulario.find('#tableLista' + nomeTabela + ' #tbodyLista' + nomeTabela);
				
				tbodyCadastro.empty();
				
				for(var i = 0; i < cadastrosArray.length; i++) {
					
					cadastrosArray[i]["tipoOperacao"] = 0;
					cadastrosArray[i]["nomeTabela"] = nomeTabela;
					
					eval('setDadosTabela' + nomeTabela + '(cadastrosArray[i])');
					
				}
				
				$("#lista" + nomeTabela + "Form #tableLista" + nomeTabela)
					.find('tfoot').empty();
				
				if (cadastrosArray.length > 0) {
					
					formulario.find('#spanGroupPrint' + nomeTabela + 'FazendaProdutor').show();
					
					resposta.rodape["nomeTabela"] = nomeTabela;
					
					var $trRodape = eval('setDadosRodape' + nomeTabela + '(resposta.rodape)');
					
				}
				else {
				
					formulario.find('#spanGroupPrint' + nomeTabela + 'FazendaProdutor').hide();
					
					var $trRodape = "";
				
				}
				
				$("#lista" + nomeTabela + "Form #tableLista" + nomeTabela)
					.find('tfoot').append($trRodape);
				
				paginacao(
					'paginaLista' + nomeTabela,
					'eventoListaCadastro',
					qtdPaginas,
					pagina,
					nomeTabela
				);
				
			}
			else {
				
				mostraDialog(
					resposta.mensagem,
					'texto_cor_vermelho',
					'table',
					tituloPainelCadastro(2, eval('pegaNomeColunas' + nomeTabela + '(3)'))
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
 * setDadosDialogImprimir.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogImprimir(lancamento, nomesColunasLancamento, trLancamento, nomeBotao,
								urlBotaoBaixar, urlBotaoPrint, colspan) {
	
	setDadosDialogLancamento(lancamento, nomesColunasLancamento, trLancamento, nomeBotao,
							 urlBotaoBaixar, colspan);
	
	$('#botaoRemover' + lancamento.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
	$('#botaoAlterar' + lancamento.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
	$('#botaoBaixar' + lancamento.nomeTabela + 'FormGroup').removeClass('col-xs-4').addClass('col-xs-3');
	
	var idBotaoPrint = 'botaoPrint' + lancamento.nomeTabela;
	
	var botaoPrint = botaoHorizontal(
		idBotaoPrint,
		"Imprimir",
		'print', 4, 0,
		'btn  btn-primary',
		'button',
		urlBotaoPrint
	).addClass('col-xs-3');
	
	$("#divBotoes #botaoAlterar" + lancamento.nomeTabela + "FormGroup").after(botaoPrint);
	
	botaoPrint.find('#botaoPrint' + lancamento.nomeTabela)
		.attr('title', "Imprimir " + lancamento.titulo);
	
	$('#botaoBaixar' + lancamento.nomeTabela).attr('title', nomeBotao + " " + lancamento.titulo);
	
	if (lancamento.imprimir == 0) {
		if ($('#botaoBaixarOscafe').is(':visible')) {
			botaoPrint.find('#botaoPrint' + lancamento.nomeTabela).show();
		}
	}
	else {
		botaoPrint.find('#botaoPrint' + lancamento.nomeTabela).hide();
	}
	
}
/* =========================================================
 * setDadosDialogLancamento.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogLancamento(lancamento, nomesColunasLancamento, trLancamento,
								  nomeBotao, urlBotaoBaixar, colspan) {
	
	setDadosDialogCadastro(lancamento, nomesColunasLancamento, trLancamento);
	
	var tableDialog = $('#divDialog' + lancamento.nomeTabela + ' #tableDialog' + lancamento.nomeTabela);
	
	if (lancamento.observacao != '' && lancamento.observacao != null) {
		lancamento["obs"] = lancamento.observacao;
	}
	
	if (lancamento.obs != '' && lancamento.obs != null) {
		
		if (colspan == null) colspan = 2;
		
		var trObs = tr('', '')
			.append(tabelaCelula(lancamento.obs, 'text-left', 'texto', 'tdObs')
			.attr('colspan', colspan));
		
		tableDialog.find('tbody').append(trObs);
		
	}
	
	var idDialog = campoOculto('id' + lancamento.nomeTabela, lancamento.id);
	
	tableDialog.after(idDialog);
	
	var baixasArray = lancamento.baixas;
	
	if (baixasArray != null && baixasArray.length > 0) {
		
		var tabelaBaixa = pegaTabelaCadastro(baixasArray, lancamento.nomeTabela2);
		
		$('#divTabelaDialog' + lancamento.nomeTabela).after(tabelaBaixa);
		
		var rodapeArray = lancamento.rodape;
	
		if (rodapeArray != null) {
			
			eval ('setDadosRodape' + lancamento.nomeTabela2 +
				'(rodapeArray, "' + lancamento.nomeTabela2 + '")'
			);
			
		}
		
	}
	
	$('#botaoRemover' + lancamento.nomeTabela + 'FormGroup').removeClass('col-xs-6').addClass('col-xs-4');
	$('#botaoAlterar' + lancamento.nomeTabela + 'FormGroup').removeClass('col-xs-6').addClass('col-xs-4');
	
	if (nomeBotao == null) {
		
		nomeBotao = "Baixar";
		
	}
	
	if (urlBotaoBaixar == null) {
		
		urlBotaoBaixar = 'novoCadastro("' + lancamento.nomeTabela2 + '", "noClick", "' + pegaPosicaoItemMenu() + '", "' + lancamento.id + '")';
		
	}
	else {
		
		urlBotaoBaixar = 'alteraCadastro("' + lancamento.id + '", "' + lancamento.nomeTabela2 + '")';
		
	}
	
	var idBotaoBaixar = 'botaoBaixar' + lancamento.nomeTabela;
	
	var botaoBaixar = botaoHorizontal(
		idBotaoBaixar,
		nomeBotao,
		'fa-check', 4, 4,
		'btn btn-success',
		'button',
		urlBotaoBaixar
	).addClass('col-xs-4');
	
	$("#divBotoes #botaoAlterar" + lancamento.nomeTabela + "FormGroup").after(botaoBaixar);
	
	if (lancamento.baixar == 0) {
		botaoBaixar.find('#botaoBaixar' + lancamento.nomeTabela).show();
	}
	else {
		botaoBaixar.find('#botaoBaixar' + lancamento.nomeTabela).hide();
	}
	
	setBotoesDialogLancamento(lancamento);
	
}
/* =========================================================
 * mostraDialogAlterar.js
 * http://lls.net.br/
 * ========================================================= */

function mostraDialogAlterar(formulario, titulo, idDialog) {
	
	idDialog = 'divDialog' + idDialog;
	
	$('#' + idDialog.replace("Altera", "Visualiza")).empty();
	$('#' + idDialog.replace("Altera", "Visualiza")).remove();
	$('#' + idDialog.replace("Altera", "Visualiza")).dialog( "close" );
	
	var divDialog = $("<div/>")
		.attr('id', idDialog)
		.append(formulario)
		.dialog({
			title: titulo,
			autoOpen: false,
			position: 'center',
			width: "100%",
			height: "auto",
			modal: true,
			close: function (ev, ui) {
				$(this).dialog('destroy').remove();
			}
		}).dialog('open');
	
	$("body").scrollTop('0');

}
/* =========================================================
 * pegaProcuraRelatorioNomeData.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraRelatorioNomeData(pagina, nomeTabela) {
	
	var dadosRelatorio = pegaProcuraRelatorioNome(pagina, nomeTabela);
	
	dadosRelatorio["dataInicial"] = $("#dataInicial" + nomeTabela).datepicker("getDate");
	dadosRelatorio["dataFinal"] = $("#dataFinal" + nomeTabela).datepicker("getDate");
	
	return dadosRelatorio;
	
}
/* =========================================================
 * setDadosDialogCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function setDadosDialogCadastro(cadastro, nomesColunasCadastro, trCadastro) {
	
	if (nomesColunasCadastro == null) {
		
		nomesColunasCadastro = eval ('pegaNomeColunas' + cadastro.nomeTabela + '(1)');
		
	}
	
	var tbodyCadastro = tbody('tbodyDialog' + cadastro.nomeTabela).append(trCadastro);
	
	var tabelaCadastro = tabela(
		'tableDialog' + cadastro.nomeTabela,
		nomesColunasCadastro
	).append(tbodyCadastro);
	
	var divTabela = $('<div />')
		.attr('id', 'divTabelaDialog' + cadastro.nomeTabela)
		.addClass('form-table table-responsive')
		.append(tabelaCadastro);
	
	var $urlBotaoAlterar = 'alteraCadastro("' + cadastro.id + '", "' + cadastro.nomeTabela + '")';
	var $urlBotaoRemover = "removeCadastro('" + cadastro.id + "', '" + cadastro.nome +
		"' , '" + cadastro.nomeTabela + "')";
	
	var idBotaoAlterar = 'botaoAlterar' + cadastro.nomeTabela;
	var idBotaoRemover = 'botaoRemover' + cadastro.nomeTabela;
	
	var botaoAlterar = botaoHorizontal(
		idBotaoAlterar,
		'Alterar',
		'fa-edit', 4, 0,
		'btn btn-warning',
		'button',
		$urlBotaoAlterar
	).addClass('col-xs-6');
	
	var botaoRemover = botaoHorizontal(
		idBotaoRemover,
		'Excluir',
		'fa-trash-alt', 4, 8,
		'btn btn-danger',
		'button',
		$urlBotaoRemover
	).addClass('col-xs-6');
	
	var divBotoes = $('<div/>')
		.attr('id', 'divBotoes')
		.addClass('row')
		.append(botaoAlterar)
		.append(botaoRemover);
	
	var divDados = $("<div/>")
		.attr('id', 'divDialog' + cadastro.nomeTabela)
		.append(divTabela)
		.append(divBotoes);
	
	if (cadastro.remover == 0) {
		botaoRemover.find('#botaoRemover' + cadastro.nomeTabela).show();
	}
	else {
		botaoRemover.find('#botaoRemover' + cadastro.nomeTabela).hide();
	}
	
	if (cadastro.alterar == 0) {
		botaoAlterar.find('#botaoAlterar' + cadastro.nomeTabela).show();
	}
	else {
		botaoAlterar.find('#botaoAlterar' + cadastro.nomeTabela).hide();
	}
	
	mostraDialogAlterar(
		divDados,
		tituloPainelCadastro(4, eval('pegaNomeColunas' + cadastro.nomeTabela + '(3)')),
		'Visualiza' + cadastro.nomeTabela);
	
}
/* =========================================================
 * getJson.js
 * http://lls.net.br/
 * ========================================================= */

function getJson(url) {
	
	var result= "";
	
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		async: false,
		success: function(resposta) {
			
			result = resposta;
			
		},
		error: function(jqXHR, exception) {
			
			mostraAjaxErro(
				exception + ": " + jqXHR.status + " - " + jqXHR.responseText,
				jqXHR.status
			);
		
		}
		
	})
	
	return result;
	
}
/* =========================================================
 * removeCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function removeCadastro(id, nome, nomeTabela) {
	
	var titulo = eval('pegaNomeColunas' + nomeTabela + '(3)');
	
	var $textoMensagem = 'Deseja realmente excluir?' + '<br>' + nome;
	
	mostraDialogOpcao(
		$textoMensagem,
		'texto_cor_vermelho',
		this,
		tituloPainelCadastro(3, titulo),
		id,
		nomeTabela,
		"Remover"
	);
	
}
/* =========================================================
 * campoOculto.js
 * http://lls.net.br/
 * ========================================================= */

function campoOculto(id, value) {
	
	var campo = input(id, 'hidden');
	
	campo.val(value);
	
	return campo;
	
}
/* =========================================================
 * pegaProcuraRelatorioNome.js
 * http://lls.net.br/
 * ========================================================= */

function pegaProcuraRelatorioNome(pagina, nomeTabela) {
	
	var idProdutor = 0;
	
	if (!$('#nomeProcura' + nomeTabela + 'FazendaProdutorFormGroup').find('.limpa').is(":visible")) {
		
		idProdutor = $('#idnomeProcura' + nomeTabela + 'FazendaProdutor2').val();
		
	}
	
	var dadosRelatorio = {
		pagina: pagina,
		linhas: 8,
		idProdutor: idProdutor,
		idFazenda: $('#idnomeProcura' + nomeTabela + 'FazendaProdutor').val(),
	}
	
	return dadosRelatorio;
	
}
/* =========================================================
 * addLinhaTabelaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function addLinhaTabelaCadastro(cadastro) {
	
	var $nomeTabelaCadastro = $('#nomeTabela' + cadastro.nomeTabela).val();
	
	var $arrayColunaBotoes = pegaColunaBotoesTabela(cadastro.nomeTabela);
	
	var $tbody = $('#div' + cadastro.nomeTabela + ' #table' + cadastro.nomeTabela +
		' #tbody' + cadastro.nomeTabela);
	
	if (cadastro.tipoOperacao == 0) {
		
		var idCadastro = $('#id' + $nomeTabelaCadastro).val();
		
		if (idCadastro > 0 && cadastro.id == 0) {
			
			cadastro["idCadastro"] = idCadastro;
			
			eventoSalvarCadastroTabela(cadastro , $tbody, $arrayColunaBotoes);
			
		}
		else {
			
			eval ('setLinhaTabela' + cadastro.nomeTabela + '(cadastro, $tbody, $arrayColunaBotoes)');
			
		}
		
	}
	else {
		
		var $tr = $tbody.find('#' + cadastro.nomeTabela.toLowerCase() + '_' + cadastro.id);
		
		eval ('mudaLinhaTabela' + cadastro.nomeTabela + '(cadastro, $tr, $arrayColunaBotoes)');
		
	}
	
}
/* =========================================================
 * setDadosTabelaCadastro.is
 * http://lls.net.br/
 * ========================================================= */

function setDadosTabelaCadastro(cadastrosTabela, nomeTabela, nomeTabelaCadastro) {
	
	if (cadastrosTabela != null) {
	
		for(var i = 0; i < cadastrosTabela.length; i++) {
			
			cadastrosTabela[i]["tipoOperacao"] = 0;
			
			cadastrosTabela[i]["nomeTabela"] = nomeTabela;
			
			if (nomeTabelaCadastro != null) {
				
				cadastrosTabela[i]["nomeTabelaCadastro"] = nomeTabelaCadastro;
				
			}
			
			addLinhaTabelaCadastro(cadastrosTabela[i]);
			
		}
		
	}
	
}
/* =========================================================
 * alteraCadastroTabela.js
 * http://lls.net.br/
 * ========================================================= */

function alteraCadastroTabela(idCadastro, nomeTabela, nomeTabelaCadastro) {
	
	var $formulario = eval('formulario' + nomeTabela + '(1, "' +
		nomeTabela + '", "' + nomeTabelaCadastro + '")'
	);
	
	mostraDialogAlterar($formulario, tituloPainelCadastro(1, nomeTabela), 'Altera' + nomeTabela);
	
	var $tr = $('#div' + nomeTabela + ' #table' + nomeTabela +
		' #tbody' + nomeTabela + ' #' + nomeTabela.toLowerCase() + '_' + idCadastro
	);
	
	eval('setDadosFormulario' + nomeTabela + '("' + idCadastro +
		'", "' + nomeTabela + '" , $tr, $formulario, "' + nomeTabelaCadastro + '")'
	);
	
}
/* =========================================================
 * pegaTabelaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTabelaCadastro(cadastros, nomeTabela) {
	
	var $tabela = tabela(
		'tableDialog' + nomeTabela,
		eval ('pegaNomeColunas' + nomeTabela + '(1)')
	);
	
	var $tbody = tbody('tbodyDialog' + nomeTabela);
	
	$tabela.append($tbody);
	
	for(var j = 0; j < cadastros.length; j++) {
		
		cadastros[j]["nomeTabela"] = nomeTabela;
		
		eval ('setLinhaTabela' + nomeTabela + '(cadastros[j], $tbody, null)');
		
	}
	
	var $divTabela = $('<div />')
		.attr('id', 'divTabelaDialog' + nomeTabela)
		.addClass('form-table table-responsive')
		.append($tabela);
	
	return $divTabela;
	
}
/* =========================================================
 * pegaColunaBotoesTabela.js
 * http://lls.net.br/
 * ========================================================= */

function pegaColunaBotoesTabela(nomeTabela) {
	
	return { 
		"altera": "altera" + nomeTabela,
		"remove": "remove" + nomeTabela
	};
		
}
/* =========================================================
 * telaTabela.js
 * http://lls.net.br/
 * ========================================================= */

function telaTabela(nomeTabela, nomeTabelaCadastro) {
	
	var idTabela = 'table' + nomeTabela;
	
	var botaoTabela = botao('botaoNovo' + nomeTabela,
		'', 'fa-plus', '0',
		'btn btn-xs btn-primary',
		'button',
		'telaTabelaNovoItem("' + nomeTabela + '", "' + nomeTabelaCadastro + '")'
	).attr('title', 'Adicionar novo registro');
	
	var nomeColunas = eval('pegaNomeColunas' + nomeTabela + '(2)');
	
	var tabelaCadastro = tabela(
		idTabela,
		nomeColunas,
		nomeTabela
	);
	
	var paragrafo2 = paragrafo('text-center texto_grande', 'texto_label')
		.append(tituloPainelCadastro(2, nomeTabela));
	
	var thTitulo = th().append(paragrafo2);
	
	var paragrafo1 = paragrafo('text-center texto_grande', 'texto_label')
		.append(botaoTabela);
	
	var thBotao = th().append(paragrafo1);
	
	var trAdd = tr('addColunas' + idTabela, '')
		.append(thBotao)
		.append(thTitulo);
	
	thTitulo.attr('colspan', tabelaCadastro.find('#nomeColunas' + idTabela + ' th').length - 1);
	
	tabelaCadastro.find('#theadtable' + nomeTabela + ' tr:last').before(trAdd);
	
	var tbodyTabela = tbody('tbody' + nomeTabela);
	
	var nomeTabelaCadastro = campoOculto('nomeTabela' + nomeTabela, nomeTabelaCadastro);
	
	tabelaCadastro.append(tbodyTabela);
	
	var divTela = $("<div/>")
		.attr({id: 'div' + nomeTabela})
		.addClass('form-table table-responsive')
		.append(tabelaCadastro)
		.append(nomeTabelaCadastro);
	
	return divTela;
	
}
/* =========================================================
 * telaTabelaNovoItem.js
 * http://lls.net.br/
 * ========================================================= */

function telaTabelaNovoItem(nomeTabela, nomeTabelaCadastro) {
	
	$('#divDialogAltera' + nomeTabela).empty();
	
	$('#divDialogAltera' + nomeTabela).remove();
	
	mostraDialogAlterar(eval (
		'formulario' + nomeTabela + '(0, "' + nomeTabela + '", "' + nomeTabelaCadastro + '")'),
		tituloPainelCadastro(0, nomeTabela),
		'Altera' + nomeTabela
	);
	
}
/* =========================================================
 * removeCadastroTabela.js
 * http://lls.net.br/
 * ========================================================= */

function removeCadastroTabela(nomeTabela, idLinhaTabela, texto, url) {
	
	var $arrayIdsLinhaTabela = idLinhaTabela.split('_');
	
	var $idLinhaTabela = $arrayIdsLinhaTabela[0];
	
	if ($idLinhaTabela == 0) {
		
		var $textoMensagem = 'Deseja realmente excluir?<br>' + nomeTabela + ': ' + texto;
		
		mostraDialogRemoverLinha($textoMensagem,
						'texto_cor_vermelho',
						'table',
						tituloPainelCadastro(3, nomeTabela),
						idLinhaTabela,
						nomeTabela);
		
	}
	else {
		
		var textoMensagem = 'Deseja realmente excluir?<br>' + texto;
		
		var titulo = eval('pegaNomeColunas' + nomeTabela + '(3)');
		
		mostraDialogOpcao(
			textoMensagem,
			'texto_cor_vermelho',
			'table',
			tituloPainelCadastro(3, titulo),
			idLinhaTabela,
			nomeTabela,
			"Remover",
			url
		);
		
	}
	
}
/* =========================================================
 * eventoSalvarCadastroTabela.js
 * http://lls.net.br/
 * ========================================================= */

function eventoSalvarCadastroTabela(cadastro, tbody, arrayColunaBotoes) {
	
	var $nomeTabelaCadastro = $('#nomeTabela' + cadastro.nomeTabela).val();
	
	var $url = "adiciona" + cadastro.nomeTabela + $nomeTabelaCadastro;
	
	var idCadastro = cadastro.idCadastro;
	
	var nomeTabela = cadastro.nomeTabela;
	
	var tipoOperacao = cadastro.tipoOperacao;
	
	var idCadastro = $('#id' + $nomeTabelaCadastro).val();
	
	cadastro[$nomeTabelaCadastro.toLowerCase()] = null;
	
	delete cadastro["nomeTabela"];
	
	delete cadastro["tipoOperacao"];
	
	delete cadastro["idCadastro"];
	
	$.ajax({
		type: "POST",
		url: $url,
		dataType: "json",
		contentType: 'application/json',
		mimeType: 'application/json',
		data: JSON.stringify({cadastro: cadastro, id: {id: idCadastro}}),
		success: function(resposta) {
			
			if (resposta.status == "200") {
				
				cadastro["nomeTabela"] = nomeTabela;
				
				cadastro["id"] = resposta.id;
				
				arrayColunaBotoes = pegaColunaBotoesTabela(cadastro.nomeTabela, cadastro.id);
	
				eval ('setLinhaTabela' + nomeTabela + '(cadastro , tbody, arrayColunaBotoes)');
				
			}
			else {
				
				mostraDialog(
					resposta.mensagem,
					'texto_cor_vermelho',
					'table',
					tituloPainelCadastro(tipoOperacao, nomeTabela)
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
 * setIdTabelaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function setIdTabelaCadastro(cadastro, tbody) {
	
	if (cadastro.id == 0) {
		
		var rowCount = tbody.find('tr').length;
		
		cadastro.id = cadastro.id + '_' + rowCount;
		
	}
	
	var idLinha = cadastro.nomeTabela.toLowerCase() + '_' + cadastro.id;
	
	var trCadastro = tr(idLinha, '');
	
	return trCadastro;
	
}
/* =========================================================
 * mostraDialogRemoverLinha.js
 * http://lls.net.br/
 * ========================================================= */

function mostraDialogRemoverLinha(textoMensagem, corTexto, classe, titulo, id, urlRemover) {
	
	$('#divDialog').empty();
	
	$('#divDialog').remove();
	
	var $divDialog = divDialog(textoMensagem, corTexto);
	
	$divDialog.dialog({
		title: titulo,
		autoOpen: false,
		position: { my: 'center', at: 'center', of: $("#painel"), within: $(classe) },
		width: 350,
		modal: true,
		buttons: [
			{
				id: "botaoSim",
				text: 'Sim',
				tabIndex: -1,
				click: function() {
					
					var $id = $divDialog.data('id');
					
					$divDialog.dialog( "close" );
					
					var $idLinhaTabela = '#' + urlRemover.toLowerCase() + '_' + $id;
					
					$($idLinhaTabela).remove();
					
					mostraDialog('Remoção efetuada com sucesso!', 'texto_cor_verde', classe, titulo);
					
				}
			},
			{
				id: "botaoNao",
				text: 'Não',
				click: function() {
					
					$( this ).dialog( "close" );
					
				}
			}
		],
		close: function (ev, ui) {
            $(this).dialog('destroy').remove();
        }
	});
	
	$divDialog
		.data('id', id)
		.dialog("open");
	
	$("body").scrollTop('0');
}
/* =========================================================
 * eventoInserirTabela.js
 * http://lls.net.br/
 * ========================================================= */

function eventoInserirTabela(tipoOperacao, nomeTabela) {
	
	var cadastro = eval ('pegaDadosFormulario' + nomeTabela + '("' + nomeTabela + '")');
	
	cadastro["nomeTabela"] = nomeTabela;
	
	cadastro["tipoOperacao"] = tipoOperacao;
	
	eval ('limpaDadosFormulario' + cadastro.nomeTabela + '("' + cadastro.nomeTabela + '")');
	
	$('#divDialogAltera' + cadastro.nomeTabela).empty();
	
	$('#divDialogAltera' + cadastro.nomeTabela).remove();
	
	$('#divDialogAltera' + cadastro.nomeTabela).dialog( "close" );

	addLinhaTabelaCadastro(cadastro);
	
}
/* =========================================================
 * pegaDadosTabelaCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function pegaDadosTabelaCadastro(nomeTabela) {
	
	var $tr = $('#div' + nomeTabela + ' #table' + nomeTabela + ' #tbody' + nomeTabela).find('tr');
	
	var $numeroLinhas = $tr.length;
	
	var cadastros = [];
	
	var nomeTabelaCadastro = $('#nomeTabela' + nomeTabela).val();
	
	if ($numeroLinhas == 0) {
		
		var cadastro = eval ('pega' + nomeTabela + '()');
		
		cadastro[nomeTabelaCadastro.toLowerCase()] = null;
		
		cadastros.push(cadastro);
		
	}
	else {
		
		$tr.each(function(){
			
			var $arrayIdsCadastro = $(this).attr('id').split('_');
			
			var cadastro = eval ('pegaTabela' + nomeTabela + '($(this), "' + $arrayIdsCadastro[1] + '")');
			
			cadastro[nomeTabelaCadastro.toLowerCase()] = null;
			
			cadastros.push(cadastro);
			
		});
		
	}
	
	return cadastros;
	
}
/* =========================================================
 * campoPlaca.js
 * http://lls.net.br/
 * ========================================================= */

function campoPlaca(id, required) {
	
	var placa = input(id, 'text', 'form-control text-uppercase', '___-____', required, 8);
	
	placa.mask("aaa-9*99");
	
	return placa;
	
}
/* =========================================================
 * pegaPlacaTexto.js
 * http://lls.net.br/
 * ========================================================= */

function pegaPlacaTexto(valorComMascara) {
						      
	return valorComMascara.replace(/-/g,'');
	
}
/* =========================================================
 * pegaPlacaMascara.js
 * http://lls.net.br/
 * ========================================================= */

function pegaPlacaMascara(numeros) {
	
	var campoMascara = $("<input>").val(numeros).mask("aaa-9*99");
	
	return campoMascara.val();
	
}
/* =========================================================
 * campoPlacaHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoPlacaHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, required) {
	
	var $campoPlacaHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $campoPlaca = campoPlaca(id, required);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	$divInput.append($campoPlaca);
	
	$campoPlacaHorizontal.append($divInput);
	
	return $campoPlacaHorizontal;
	
}
