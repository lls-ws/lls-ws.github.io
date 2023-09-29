/* =========================================================
 * senha.js
 * http://lls.net.br/
 * ========================================================= */

function senha(tipo) {
	
	var dados = criaLink(tipo);
	
	dados["titulo"] = 'Recuperação de Senha';
	
	if (dados.tipo == '1') {
		
		dados["urlBotao"] = 'eventoFormularioCadastroSenha';
		dados["formulario"] = 'CadastroSenha';
		
		dados.iconeBotao = 'check';
		dados.textoBotao = 'Salvar';
		
	}
	else {
		
		dados["urlBotao"] = 'eventoFormularioSenha';
		dados["formulario"] = 'Senha';
		
	}
	
	core(dados);
	
}
/* =========================================================
 * eventoFormularioCadastroSenha.js
 * http://lls.net.br/
 * ========================================================= */

function eventoFormularioCadastroSenha(dados) {
	
	var number = animacao(dados.idBotao, dados.iconeBotao, true);
	
	var senhas = {
		email: $('#email').val(),
		codigoSeguranca: $('#codigoSeguranca').val(),
		senhaNova: $('#senhaNova').val(),
		senhaConfirma: $('#senhaConfirma').val()
	}
	
	$.ajax({
		type: "POST",
		url: "ativaUsuario",
		dataType: "json",
		contentType: "application/json",
		mimeType: "application/json",
		data: JSON.stringify(senhas),
		success: function(resposta) {
			
			var mensagem = decodeURIComponent(unescape(resposta.mensagem));
			
			var titulo = $('#loginForm p h3').val();
			
			if (resposta.status == "200") {
				
				carregaCssJs("js/jquery-lls/jquery-lls-menu.js", "js");
				
				menu(resposta.status);
				
			}
			else {
				
				animacao(dados.idBotao, dados.iconeBotao, false, number);
				
				mostraDialog(mensagem, "texto_cor_vermelho", '.form-signin', titulo);
				
			}
				
		},
		error: function(jqXHR, exception) {
			
			animacao(dados.idBotao, dados.iconeBotao, false, number);
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
			
		}
	 
	});
    
}
/* =========================================================
 * linkLoginCore.js
 * http://lls.net.br/
 * ========================================================= */

function linkLoginCore(icone, url, texto, corTexto) {
	
	var imagem = 'glyphicon glyphicon-' + icone;
	var spanIcone = span(imagem);
	
	if (corTexto == null) corTexto = 'text-danger';
	
	var link = a(
		url,
		'javascript:void(0);',
		corTexto,
		'link'
	).append(spanIcone).append(' ').append(texto);
	
	return paragrafo('text-muted text-center', '').append(link);
	
}
/* =========================================================
 * core.js
 * http://lls.net.br/
 * ========================================================= */

function core(dados) {
	
	if (dados.tipo == '1') loginInicio();
	
	clearHtml();
	
	$('.autocomplete-suggestions').remove();
	
	$('.container').empty();
	
	painel('container_center');
	
	eval ('formulario' + dados.formulario + '(dados)');
	
	window.history.replaceState('', '', "/");
	
}
/* =========================================================
 * formularioCadastroSenha.js
 * http://lls.net.br/
 * ========================================================= */

function formularioCadastroSenha(dados) {
	
	carregaCssJs("js/jquery.validate.min.js", "js");
	
	var campoEmail = campoTextoHorizontal('email', 'email', '', 0 , 0, 'Email', true, 50, 'enabled', 'envelope');
	var campoSenhaNova = campoTextoHorizontal('senhaNova', 'password', '', 0 , 0, 'Digite a nova senha', true, 10, 'enabled', 'key');
	var campoSenhaConfirma = campoTextoHorizontal('senhaConfirma', 'password', '', 0 , 0, 'Confirme a nova senha', true, 10, 'enabled', 'key');
	var campoCodigoSeguranca = campoTextoHorizontal('codigoSeguranca', 'password', '', 0 , 0, 'Código de Segurança', true, 6, 'enabled', 'shield');
	
	campoEmail.find('label').remove();
	campoSenhaNova.find('label').remove();
	campoSenhaConfirma.find('label').remove();
	campoCodigoSeguranca.find('label').remove();
	
	var formulario = formularioLoginCore(dados);
	
	formulario.find('#' + dados.idBotao)
		.before(campoEmail)
		.before(campoCodigoSeguranca)
		.before(campoSenhaNova)
		.before(campoSenhaConfirma);
	
	formulario.find('#email').focus();
	
	$('#painel').removeClass('container_center').addClass('container_senha');
	
	formulario.unbind('submit');
	
	validarFormularioCadastroSenha(dados, formulario);
	
}
/* =========================================================
 * tituloPainelLogin.js
 * http://lls.net.br/
 * ========================================================= */

function tituloPainelLogin() {
	
	return 'Login de Usuário';
	
}
/* =========================================================
 * formularioSenha.js
 * http://lls.net.br/
 * ========================================================= */

function formularioSenha(dados) {
	
	var campoEmail = campoTexto('email', 'email', '', 'Email', 'true', '-1', 50, 'envelope');
	
	var formulario = formularioLoginCore(dados);
	
	formulario.find('#' + dados.idBotao).before(campoEmail);
	
	formulario.find('#email').attr('autocomplete', 'on').focus();
	
}
/* =========================================================
 * formularioLoginCore.js
 * http://lls.net.br/
 * ========================================================= */

function formularioLoginCore(dados) {
	
	var titulo = tituloLogin(dados.titulo);
	
	var logo = imagem('//lls-ws.github.io/imagens/logo.png', '', 100, 100);
	
	var imagemPainel = paragrafo('text-center', '').append(logo);
	
	var layout = paragrafo('text-center', '');
	
	var recuperarSenha = linkLoginCore(dados.icone, dados.url, dados.texto);
	
	var senhaPainel = $("<div/>")
		.append(layout)
		.append(recuperarSenha);
	
	var botaoLogin = botao(
		dados.idBotao,
		dados.textoBotao,
		dados.iconeBotao,
		'0',
		'btn btn-block btn-lg ' + dados.tipoBotao,
		'submit',
		''
	);
	
	var formulario = formularioHorizontal('login', 'form form-signin form_center formulario_cor');
	
	formulario.attr('role', 'form');
	
	formulario.append(imagemPainel)
		.append(titulo)
		.append(botaoLogin)
		.append(senhaPainel);
	
	formulario.submit(function(event) {
		
		event.preventDefault();
		
		eval(dados.urlBotao + '(dados)');
		
	});
	
	mudaPainel(formulario, 0);
	
	return formulario;
	
}
/* =========================================================
 * nomeProjeto.js
 * http://lls.net.br/
 * ========================================================= */

function nomeProjeto() {
	
	return $('#nomeProjeto').text();
	
}
/* =========================================================
 * eventoFormularioLogin.js
 * http://lls.net.br/
 * ========================================================= */

function eventoFormularioLogin(dados) {
	
	var number = animacao(dados.idBotao, dados.iconeBotao, true);
	
	var $email = $('#email').val();
	var $senha = $('#senha').val();
	
	$.ajax({
		type: "POST",
		url: "efetuaLogin",
		dataType: "json",
		data : {'email': $email, 'senha': $senha},
		success: function(resposta) {
			
			if (resposta.status == "200") {
				
				menu(resposta.status);
				
			}
			else {
				
				animacao(dados.idBotao, dados.iconeBotao, false, number);
				
				var $mensagem = decodeURIComponent(unescape(resposta.mensagem));
				
				mostraDialog($mensagem, 'texto_cor_vermelho', '.form-signin', tituloPainelLogin());
				
			}
				
		},
		error: function(jqXHR, exception) {
			
			animacao(dados.idBotao, dados.iconeBotao, false, number);
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
			
		}
	 
	});
    
}
/* =========================================================
 * mudaPainel.js
 * http://lls.net.br/
 * ========================================================= */

function mudaPainel(novoPainel, posicaoItemMenu) {
	
	if (posicaoItemMenu > 0) {
	
		marcarMenu(posicaoItemMenu);
	
	}
	
	clearHtml();
	
	$('.autocomplete-suggestions').empty();
	
	$("#painel").empty();
	
	$("#painel").html(novoPainel);
	
}
/* =========================================================
 * formularioCadastroLogin.js
 * http://lls.net.br/
 * ========================================================= */

function formularioCadastroLogin(dados) {
	
	var campoNome = campoTexto('nome', 'text', '', 'Nome', true, '-1', 50, 'user');
	var campoEmail = campoTexto('email', 'email', '', 'Email', true, '-1', 50, 'envelope');
	var campoFone = campoTelefone('telefone', true);
	
	var formulario = formularioLoginCore(dados);
	
	formulario.find('#' + dados.idBotao)
		.before(campoNome)
		.before(campoEmail)
		.before(campoFone);
	
	formulario.find('#email').attr('autocomplete', 'on');
	formulario.find('#nome').focus();
	
}
/* =========================================================
 * loginInicio.js
 * http://lls.net.br/
 * ========================================================= */

function loginInicio() {
	
	$('meta[name=description]')
		.attr('content', nomeProjeto());
	
	container();
	
}
/* =========================================================
 * usuario.js
 * http://lls.net.br/
 * ========================================================= */

function usuario(tipo) {
	
	var dados = criaLink(tipo);
	
	dados["titulo"] = 'Ativação de Usuário';
	dados["formulario"] = 'CadastroSenha';
	dados["urlBotao"] = 'eventoFormularioCadastroSenha';
	
	dados.iconeBotao = 'check';
	dados.textoBotao = 'Ativar';
	
	core(dados);
	
}
/* =========================================================
 * login.js
 * http://lls.net.br/
 * ========================================================= */

function login(tipo) {
	
	var dados = {
		tipo: tipo,
		formulario: 'Login'
	}
	
	core(dados);
	
}
/* =========================================================
 * cadastroLogin.js
 * http://lls.net.br/
 * ========================================================= */

function cadastroLogin(tipo) {
	
	var dados = criaLink(tipo);
	
	dados["titulo"] = 'Cadastro de Usuário';
	dados["urlBotao"] = 'eventoFormularioCadastroLogin';
	dados["formulario"] = 'CadastroLogin';
	
	core(dados);
	
}
/* =========================================================
 * validarFormularioCadastroSenha.js
 * http://lls.net.br/
 * ========================================================= */

function validarFormularioCadastroSenha(dados, formulario) {
	
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
			senhaNova: {checkSenhaMin: true,
						checkSenhaFraca: true,
						checkSenhaForte: true},
			senhaConfirma: {checkSenhaConfirma: true},
			codigoSeguranca: {checkCodigoSegurancaMin: true}
        },
        messages: {
			email: 'Email informado de forma errada!',
			codigoSeguranca: {required: 'É necessário informar o código de segurança!'},
			senhaNova: {required: 'É necessário informar a nova senha!'},
			senhaConfirma: {required: 'É necessário confirmar a nova senha!'}
		},
		invalidHandler: function(e, validator){
            if(validator.errorList.length)
				$('#tabs a[href="#' + jQuery(validator.errorList[0].element).closest(".tab-pane").attr('id') + '"]').tab('show');
        },
        submitHandler: function(form) {
			eval(dados.urlBotao + '(dados)');
        }
    });
	
	validarFormularioSenha();
	
}
/* =========================================================
 * formularioLogin.js
 * http://lls.net.br/
 * ========================================================= */

function formularioLogin(dados) {
	
	dados["icone"] = 'lock';
	dados["url"] = 'senha(0)';
	dados["texto"] = 'Recuperar senha';
	
	dados["icone2"] = 'user';
	dados["url2"] = 'cadastroLogin(0)';
	dados["texto2"] = 'Criar novo usuário';
	
	dados["idBotao"] = 'botaoLogin';
	dados["textoBotao"] = 'Acessar';
	dados["iconeBotao"] = 'sign-in';
	dados["tipoBotao"] = 'btn-primary';
	dados["urlBotao"] = 'eventoFormularioLogin';
	
	var campoEmail = campoTexto('email', 'text', '', 'Email', 'true', '-1', 50, 'envelope');
	var campoSenha = campoTexto('senha', 'password', '', 'Senha', 'true', '-1', 10, 'key');
	
	var formulario = formularioLoginCore(dados);
	
	formulario.find('#' + dados.idBotao)
		.before(campoEmail)
		.before(campoSenha);
	
	var url = window.location.hostname;
	
	if (url != "lls.net.br") {
		
		var layout = paragrafo('text-center', '');
	
		var novoUsuario = linkLoginCore(dados.icone2, dados.url2, dados.texto2, 'text-muted');
		
		var usuarioPainel = $("<div/>")
			.append(layout)
			.append(novoUsuario);
		
		formulario.find('#' + dados.idBotao).before(usuarioPainel);
		
	}
	
	formulario.find('#email').attr('autocomplete', 'on').focus();
	
}
/* =========================================================
 * eventoFormularioCadastroLogin.js
 * http://lls.net.br/
 * ========================================================= */

function eventoFormularioCadastroLogin(dados) {
	
	var number = animacao(dados.idBotao, dados.iconeBotao, true);
	
	var $nome = encodeURIComponent( unescape($('#nome').val()));
	var $email = $('#email').val();
	var $telefone = pegaTelefoneNumeros($('#telefone').val());
	
	$.ajax({
		type: "POST",
		url: "efetuaCadastroLogin",
		dataType: "json",
		data : {'email': $email, 'nome': $nome, 'telefone': $telefone},
		success: function(resposta) {
			
			var mensagem = decodeURIComponent(unescape(resposta.mensagem));
			
			if (resposta.status == "200") {
				
				login(0);
				
				mostraDialog(mensagem, "texto_cor_verde", '.form-signin', 'Cadastro de Usuário');
				
			}
			else {
				
				animacao(dados.idBotao, dados.iconeBotao, false, number);
				
				mostraDialog(mensagem, "texto_cor_vermelho", '.form-signin', 'Cadastro de Usuário');
				
			}
			
		},
		error: function(jqXHR, exception) {
			
			animacao(dados.idBotao, dados.iconeBotao, false, number);
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
			
		}
	 
	});
    
}
/* =========================================================
 * eventoFormularioSenha.js
 * http://lls.net.br/
 * ========================================================= */

function eventoFormularioSenha(dados) {
	
	var number = animacao(dados.idBotao, dados.iconeBotao, true);
	
	var $email = $('#email').val();
	
	$.ajax({
		type: "POST",
		url: "recuperaSenha",
		dataType: "json",
		data : {'email': $email},
		success: function(resposta) {
			
			var mensagem = decodeURIComponent(unescape(resposta.mensagem));
			
			if (resposta.status == "200") {
				
				login(0);
				
				mostraDialog(mensagem, "texto_cor_verde", '.form-signin', 'Recuperação de Senha');
				
			}
			else {
				
				animacao(dados.idBotao, dados.iconeBotao, false, number);
				
				mostraDialog(mensagem, "texto_cor_vermelho", '.form-signin', 'Recuperação de Senha');
				
			}
				
		},
		error: function(jqXHR, exception) {
			
			animacao(dados.idBotao, dados.iconeBotao, false, number);
			
			mostraAjaxErro(
				exception + ': ' + jqXHR.status + ' - ' + jqXHR.responseText,
				jqXHR.status
			);
			
		}
	 
	});
    
}
/* =========================================================
 * clearHtml.js
 * http://lls.net.br/
 * ========================================================= */

function clearHtml()
{
	
	$('.ui-dialog').empty();
	$('.ui-dialog').remove();
	
	$('.ui-widget').empty();
	
	$('.ui-datepicker').remove();
	
}
/* =========================================================
 * criaLink.js
 * http://lls.net.br/
 * ========================================================= */

function criaLink(tipo) {
	
	var dados = {
		tipo: tipo,
		icone: 'remove',
		url: 'login(0)',
		texto: 'Cancelar',
		idBotao: 'botaoEnviar',
		iconeBotao: 'send',
		tipoBotao: 'btn-success',
		textoBotao: 'Enviar'
	}
	
	return dados;
	
}
/* =========================================================
 * tituloLogin.js
 * http://lls.net.br/
 * ========================================================= */

function tituloLogin(tipo) {
	
	var $tituloLogin = $('<h3>');
	
	$tituloLogin.addClass('form-signin-heading text-center texto_label');
	
	if (tipo == null) {
		$tituloLogin.text(nomeProjeto());
	}
	else {
		$tituloLogin.text(tipo);
	}
	
	return $tituloLogin;
	
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
 * menu.js
 * http://lls.net.br/
 * ========================================================= */

function menu(tipo) {
	
	if (tipo == '1') loginInicio();
	
	$.getScript("//lls-ws.github.io/jquery-lls/jquery-lls-menu.js");
	carregaCss("//lls-ws.github.io/jquery-lls/jquery-lls-menu.css");
	
	$('.scroll-pane').jScrollPane();
	
	$('.container').empty();
	
	$('.container').append(telaMenu());
	
	painel('');
	
	formularioMenu();
	
	window.history.replaceState('', '', "/");
	
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
/* ================ menuCadastrosOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function menuCadastrosOpcoes(nomesItensMenu, opcoesMenu) {
	return opcoesMenu;
}
/* ================ telaMenuOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function telaMenuOpcoes(nomesItensMenu, opcoesMenu) {
	return opcoesMenu;
}
/* ================ menuRelatorioOpcoes.js ===========================
 * http://lls.net.br/
 * ========================================================= */

function menuRelatorioOpcoes(nomesItensMenu, opcoesMenu) {
	return opcoesMenu;
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
 * input.js
 * http://lls.net.br/
 * ========================================================= */

function input(id, type, classForm, placeholder, required, maxlength) {
	
	var $input = $('<input>').attr({
		id: id,
		name: id,
		type: type,
		placeholder: placeholder,
		required: required,
		maxlength: maxlength
	});
	
	$input.addClass(classForm);
	$input.addClass('input-large');
	
	return $input;
}
/* =========================================================
 * novoFormulario.js
 * http://lls.net.br/
 * ========================================================= */

function novoFormulario(nomeTabela, textoLabel, posicaoItemMenu, click, nomeTabelaLancamento) {
	
	if (posicaoItemMenu == 1) {
		
		tabelaCadastro(posicaoItemMenu, nomeTabela, textoLabel);
	
		eval ('eventoListaCadastro(1, "' + nomeTabela + '")');
	
	}
	else {
		
		tabelaRelatorio(posicaoItemMenu, nomeTabela, textoLabel, nomeTabelaLancamento);
		
		if (textoLabel != 'Data') {
		
			eval ('eventoListaCadastro(1, "' + nomeTabela + '")');
			
		}
		
	}

	if (click == 'click') {
		
		if($('.navbar-toggle').css('display') !='none'){
		
			$(".navbar-toggle").trigger("click");
	
		}
	
	}

}
/* =========================================================
 * li.js
 * http://lls.net.br/
 * ========================================================= */

function li(id, classes) {
	
	var $li = $('<li>').attr('id', id);
	
	$li.addClass(classes);
	
	return $li;
	
}
/* =========================================================
 * painel.js
 * http://lls.net.br/
 * ========================================================= */

function painel(classes) {
	
	var $painel = $("<div/>").attr({id: "painel"}).addClass(classes);
	
	$('.container').append($painel);
	
}
/* =========================================================
 * campoTexto.js
 * http://lls.net.br/
 * ========================================================= */

function campoTexto(id, type, textoLabel, placeholder, required,
					tamanhoCampo, maxlength, icon) {
	
	var $campoTexto = $("<div/>").addClass('input-group margin-bottom-sm');
	
	var $label = label(id, textoLabel, 'texto_label');
		
	var iconImage = $("<i/>").attr('id', id + 'Image')
		.attr('aria-hidden', true)
		.addClass('fa fa-lg fa-' + icon);
	
	var iconSpan = span('input-group-addon').append(iconImage);
	
	var $input = input(id, type, 'form-control', placeholder, required, maxlength);	
	
	if (tamanhoCampo >= 0) {
				
		var $tamanhoCampo = 'col-md-' + tamanhoCampo;
		
		$campoTexto.addClass('row');
		
		var $divForm = $("<div/>").addClass('form-group');
		
		$divForm.addClass($tamanhoCampo);
		
		$divForm.append($label);
		
		$divForm.append($input);
		
		$campoTexto.append($divForm);
		
		return $campoTexto;
		
	}
	else {
		
		$campoTexto.append($label);
		
		$campoTexto.append(iconSpan);
		
		$campoTexto.append($input);
		
		return $campoTexto;
		
	}
		
}
/* =========================================================
 * a.js
 * http://lls.net.br/
 * ========================================================= */

function a(onclick, href, classes, id, data_toggle, role, aria_expanded) {
	
	return $('<a />')
		.attr('id', id)
		.attr('onclick', onclick)
		.attr('href', href)
		.attr('data-toggle', data_toggle)
		.attr('role', role)
		.attr('aria-expanded', aria_expanded)
		.addClass(classes);
	
}
/* =========================================================
 * paragrafo.js
 * http://lls.net.br/
 * ========================================================= */

function paragrafo(posicaoTexto, corTexto) {
	
	var $paragrafo = $("<p/>").addClass(posicaoTexto);
	
	$paragrafo.addClass(corTexto);
	
	return $paragrafo;
	
}
/* =========================================================
 * divDialog.js
 * http://lls.net.br/
 * ========================================================= */

function divDialog(textoMensagem, corTexto) {
	
	textoMensagem = textoMensagem.replace(/\n/g, "<br />");
	
	var $icone = span('glyphicon glyphicon-info-sign');
	
	var $paragrafo = paragrafo('text-center', corTexto)
		.append($icone)
		.append(' ')
		.append(textoMensagem);
	
	return $divDialog = $("<div/>").attr('id', 'divDialog')
								   .append($paragrafo);
		
}
/* =========================================================
 * botao.js
 * http://lls.net.br/
 * ========================================================= */

function botao(id, label, icone, tamanhoBotao, tipoBotao, type, onClick) {
	
	var iconImage = $("<i/>").attr('id', 'image' + id)
		.attr('aria-hidden', true)
		.addClass('fa fa-fw fa-lg fa-' + icone);
	
	tamanhoBotao = 'col-md-' + tamanhoBotao;
		
	var button = $("<button/>")
		.attr('id', id)
		.attr('name', id)
		.attr('type', type)
		.addClass(tipoBotao)
		.append(label)
		.append(' ')
		.append(iconImage)
		.addClass(tamanhoBotao)
		.click(function() {
				  
			eval(onClick);
			  
		});
	
	return button;
	
}
/* =========================================================
 * carregaCssJs.js
 * http://lls.net.br/
 * ========================================================= */

function carregaCssJs(filename, filetype) {
	
	if (filetype == "css") {
        
		carregaCss(filename);
		
    }
    else if (filetype == "js") {
		
		$.getScript(filename);
        
    }
        
}

function carregaCss(file) {
	
	$('<link/>', {
	   rel: 'stylesheet',
	   type: 'text/css',
	   href: file
	}).appendTo('head');
        
}
/* =========================================================
 * b.js
 * http://lls.net.br/
 * ========================================================= */

function b(classes) {
	
	var $b = $('<b />').addClass(classes);
	
	return $b;
	
}
/* =========================================================
 * ul.js
 * http://lls.net.br/
 * ========================================================= */

function ul(classes, role) {
	
	var $ul = $("<ul/>").addClass(classes);
	
	$ul.attr("role", role);
	
	return $ul;
	
}
/* =========================================================
 * container.js
 * http://lls.net.br/
 * ========================================================= */

function container() {
	
	$('body').find('.container').remove();
	
	var container = $("<div/>").addClass('container');
	
	$('body').append(container);
	
}
/* =========================================================
 * divInput.js
 * http://lls.net.br/
 * ========================================================= */

function divInput(id, colClass) {
	
	var $idDivInput = id + 'DivInput';
	
	var $divInput = $("<div/>").attr({id: $idDivInput});
	
	if (colClass == "5" || colClass == "9") {
		
		colClass = 'col-xs-9 col-md-7';
		
	}
	
	$divInput.addClass(colClass);
	
	return $divInput;
}
/* =========================================================
 * novoCadastro.js
 * http://lls.net.br/
 * ========================================================= */

function novoCadastro(nomeTabela, click, posicaoItemMenu, id) {
	
	marcarMenu(posicaoItemMenu);
	
	if (click == 'click') {
		
		if($('.navbar-toggle').css('display') !='none'){
		
			$(".navbar-toggle").trigger("click");
	
		}
	
	}
	
	if (id == null) id = 0;
	
	var formulario = eval('formulario' + nomeTabela + '("' + id + '", "' + nomeTabela + '")');
	
	mostraDialogAlterar(
		formulario,
		tituloPainelCadastro(0, eval('pegaNomeColunas' + nomeTabela + '(3)')),
		'Altera' + nomeTabela
	);
	
	if (posicaoItemMenu == "1") {
		
		setTimeout(function() {
		
			formulario.find('#nome' + nomeTabela).focus();
			formulario.find('#codigo' + nomeTabela).focus();
		
		}, 0);
		
	}
	else {
		
		setTimeout(function() {
		
			formulario.find('#nomeProcuraCadastro' + nomeTabela + 'FazendaProdutor').focus();
			formulario.find('#nomeProcuraCadastro' + nomeTabela + 'Milho').focus();
		
		}, 0);
		
	}

}
/* =========================================================
 * campoTextoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoTextoHorizontal(
		id,
		type,
		textoLabel,
		tamanhoCampo,
		tamanhoLabel,
		placeholder,
		required,
		maxlength,
		enabled,
		icon) {
						      
	var $campoTextoHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $input = input(id, type, 'form-control', placeholder, required, maxlength);
	
	if (icon != null) {
	
		var $campoTexto = $("<div/>").addClass('input-group margin-bottom-sm');
	
		var iconImage = $("<i/>").addClass('fa fa-lg fa-' + icon).attr('aria-hidden', true);;
	
		var iconSpan = span('input-group-addon').append(iconImage);
		
		$campoTexto.append(iconSpan).append($input);
		
	}
	
	if (enabled == "disabled") {
		
		$input.attr("disabled", enabled);
		
	}
	
	var $divInput = divInput(id, tamanhoCampo);
	
	var $idSpan = id + "1";
	
	var $span = span('glyphicon form-control-feedback').attr('id', $idSpan);
	
	if (icon != null) $divInput.append($campoTexto);
	else $divInput.append($input);
	
	$divInput.append($span);
	
	$campoTextoHorizontal.append($divInput);
	
	return $campoTextoHorizontal;
	
}
/* =========================================================
 * campoHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoHorizontal(id, textoLabel, colClass) {
	
	var $idFormGroup = id + 'FormGroup';
	
	var $divFormGroup = $("<div/>").attr({id: $idFormGroup});
	
	$divFormGroup.addClass('form-group has-feedback');
	
	var $label = label(id, textoLabel, 'control-label texto_label texto_grande');
	
	if (colClass == "2" ) {
		
		colClass = 'col-xs-2 col-md-2';
		
	}
	
	$label.addClass(colClass);
	
	$divFormGroup.append($label);
	
	return $divFormGroup;
	
}
/* =========================================================
 * formularioHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function formularioHorizontal(id, classe) {
	
	var $idFormulario = id + 'Form';
	
	var $formulario = $("<form/>").attr('id', $idFormulario);
	
	$formulario.addClass(classe);
	$formulario.addClass('form');
	
	$formulario.attr('role', 'form');
	$formulario.attr('accept-charset', 'ISO-8859-1');
	
	return $formulario;
	
}
/* =========================================================
 * mostraDialog.js
 * http://lls.net.br/
 * ========================================================= */

function mostraDialog(textoMensagem, corTexto, classe, titulo) {
	
	$('#divDialog').empty();
	$('#divDialog').remove();
	
	var $divDialog = divDialog(textoMensagem, corTexto);
	
	$divDialog.dialog({
		title: titulo,
		autoOpen: false,
		modal: true,
		position: { my: 'center', at: 'center', of: $("#painel"), within: $(classe) },
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function (ev, ui) {
			$(this).dialog('destroy').remove();
        }
	});
	
	$divDialog.dialog("open");
	
	$("body").scrollTop('0');
	
}
/* =========================================================
 * label.js
 * http://lls.net.br/
 * ========================================================= */

function label(id, textoLabel, classes) {
	
	var $label = $("<label>").attr('for', id);
	
	$label.attr('id', id + 'Label');
	
	$label.addClass("text-center");
	
	$label.addClass(classes);
	
	$label.text(textoLabel);
	
	return $label;
}
/* =========================================================
 * animacao.js
 * http://lls.net.br/
 * ========================================================= */

function animacao(idBotao, iconeBotao, enable, number) {
	
	var animation = [
		{spinner: '', animated: 'spin'},
		{spinner: 'spinner', animated: 'spin'},
		{spinner: 'circle-notch', animated: 'spin'},
		{spinner: 'sync', animated: 'spin'},
		{spinner: 'cog', animated: 'spin'},
		{spinner: 'spinner', animated: 'pulse'},
		{spinner: 'stroopwafel', animated: 'spin'}
	]
	
	if (enable) {
		
		number = 0 + Math.floor(Math.random() * 7);
		
		if (number == 0) {
			
			$('#image' + idBotao)
				.addClass('fa-' + animation[number].spinner + ' fa-' + animation[number].animated);
				
		}
		else {
			
			$('#image' + idBotao)
				.removeClass('fa-' + iconeBotao)
				.addClass('fa-' + animation[number].spinner + ' fa-' + animation[number].animated);
			
		}
	}
	else {

		$('#image' + idBotao)
			.removeClass('fa-' + animation[number].spinner + ' fa-' + animation[number].animated)
			.addClass('fa-' + iconeBotao);
			
	}
	
	return number;

}
/* =========================================================
 * mostraAjaxErro.js
 * http://lls.net.br/
 * ========================================================= */

function mostraAjaxErro(textoMensagem, status) {
	
	if (status == "200") {
			
		login(0);
		
		
	}
	else if (status == "0") {
		
		mostraDialog(
			'Estabelecendo conexão...',
			'texto_cor_branco',
			'form',
			'Conexão'
		);
		
	}
	else {
		
		mostraDialog(
			textoMensagem,
			'texto_cor_branco',
			'form',
			'Apache-Tomcat'
		);
		
	}
	
}
/* =========================================================
 * span.js
 * http://lls.net.br/
 * ========================================================= */

function span(classes) {
	
	var $span = $("<span/>").addClass(classes);
	
	return $span;
	
}
/* =========================================================
 * imagem.js
 * http://lls.net.br/
 * ========================================================= */

function imagem(url, classe, width, height) {
	
	var $imagem = $('<img>');
	
	$imagem.attr('src', url);
	
	$imagem.attr('class', classe);
	
	$imagem.width(width);
	
	$imagem.height(height);
	
	return $imagem;
	
}
/* =========================================================
 * pegaTelefoneNumeros.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTelefoneNumeros(valorComMascara) {
						      
	var $numeros = valorComMascara.replace(/\(/g,'').replace(/\)/g,'').replace(/\ /g,'').replace(/-/g,'');
	
	return $numeros;
	
}
/* =========================================================
 * campoTelefone.js
 * http://lls.net.br/
 * ========================================================= */

function campoTelefone(id, required, icon, textoLabel) {
	
	var maxlength = 15;
	
	if (icon == null) icon = 'whatsapp';
	if (textoLabel == null) textoLabel = '';
	
	var campoTelefone = campoTexto(
		id,
		'text',
		textoLabel,
		'(__) _____-____',
		required,
		'-1',
		maxlength,
		icon
	);
	
	campoTelefone.find('#' + id).mask("(99) 9999-9999?9");
	
	campoTelefone.find('#' + id).on("blur", function() {
		var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );

		if( last.length == 5 ) {
			var move = $(this).val().substr( $(this).val().indexOf("-") + 1, 1 );

			var lastfour = last.substr(1,4);

			var first = $(this).val().substr( 0, 9 );

			$(this).val( first + move + '-' + lastfour );
			
		}
	})
	
	return campoTelefone;
	
}
/* =========================================================
 * campoTelefoneHorizontal.js
 * http://lls.net.br/
 * ========================================================= */

function campoTelefoneHorizontal(id, textoLabel, tamanhoCampo, tamanhoLabel, required) {
	
	var $campoTelefoneHorizontal = campoHorizontal(id, textoLabel, tamanhoLabel);
	
	var $campoTelefone = campoTelefone(id, required);
	
	var $divInput = divInput(id, tamanhoCampo);
	
	var $idSpan = id + "1";
	
	var $span = span('glyphicon form-control-feedback').attr('id', $idSpan);
	
	$divInput.append($campoTelefone);
	
	$divInput.append($span);
	
	$campoTelefoneHorizontal.append($divInput);
	
	return $campoTelefoneHorizontal;
	
}
/* =========================================================
 * pegaTelefoneMascara.js
 * http://lls.net.br/
 * ========================================================= */

function pegaTelefoneMascara(telefoneNumeros) {
	
	if(telefoneNumeros.length == 11) {
	
		var telefoneMascara = $("<input>").val(telefoneNumeros).mask("(99) 99999-9999");
	
	} else {
		
		var telefoneMascara = $("<input>").val(telefoneNumeros).mask("(99) 9999-9999");
			
	}
	
	return telefoneMascara.val();
	
}
