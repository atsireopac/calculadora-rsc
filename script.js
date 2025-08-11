// Configuração dos níveis RSC
const NIVEIS_RSC = {
    'RSC-1': { 
        minPontos: 10, 
        percentual: 10, 
        preRequisito: 'Fund. Incompleto',
        minItens: 2,
        iq: 'IQ Fundamental Completo (10%)'
    },
    'RSC-2': { 
        minPontos: 20, 
        percentual: 20, 
        preRequisito: 'Fund. Completo',
        minItens: 3,
        iq: 'IQ Médio (20%)'
    },
    'RSC-3': { 
        minPontos: 25, 
        percentual: 25, 
        preRequisito: 'Médio/Técnico',
        minItens: 4,
        iq: 'IQ Graduação (25%)'
    },
    'RSC-4': { 
        minPontos: 30, 
        percentual: 30, 
        preRequisito: 'Graduação',
        minItens: 5,
        iq: 'IQ Especialização (30%)'
    },
    'RSC-5': { 
        minPontos: 52, 
        percentual: 52, 
        preRequisito: 'Pós-graduação',
        minItens: 8,
        iq: 'IQ Mestrado (52%)'
    },
    'RSC-6': { 
        minPontos: 75, 
        percentual: 75, 
        preRequisito: 'Mestrado',
        minItens: 12,
        iq: 'IQ Doutorado (75%)'
    }
};

// Estado da aplicação
let competenciasSelecionadas = new Map();
let totalPontos = 0;
let nivelEscolaridade = '';

// Mapeamento de escolaridade para validação
const ESCOLARIDADE_MAPPING = {
    'fund-incompleto': ['RSC-1'],
    'fund-completo': ['RSC-2'],
    'medio-tecnico': ['RSC-3'],
    'graduacao': ['RSC-4'],
    'pos-graduacao': ['RSC-5'],
    'mestrado': ['RSC-6'],
    'doutorado': ['RSC-6']
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventListeners();
    atualizarResultados();
});

// Configurar event listeners
function inicializarEventListeners() {
    // Event listeners para checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-pontos]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Event listeners para inputs de quantidade
    const quantidadeInputs = document.querySelectorAll('.quantidade-input');
    
    quantidadeInputs.forEach(input => {
        input.addEventListener('input', handleQuantidadeChange);
        input.addEventListener('blur', handleQuantidadeBlur);
        input.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir que o clique no input afete o label/checkbox
        });
        input.addEventListener('focus', function(e) {
            e.stopPropagation(); // Prevenir que o foco no input afete o label/checkbox
        });
        input.addEventListener('mousedown', function(e) {
            e.stopPropagation(); // Prevenir que mousedown no input afete o label/checkbox
        });
        input.addEventListener('mouseup', function(e) {
            e.stopPropagation(); // Prevenir que mouseup no input afete o label/checkbox
        });
        input.disabled = true; // Inicialmente desabilitado
    });

    // Select de escolaridade
    const escolaridadeSelect = document.getElementById('nivel-escolaridade');
    if (escolaridadeSelect) {
        escolaridadeSelect.addEventListener('change', handleEscolaridadeChange);
    }
    
    // Botões de ação
    const btnLimpar = document.getElementById('btn-limpar');
    const btnExportar = document.getElementById('btn-exportar');
    

    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparTudo);
    }
    
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarRelatorio);
    }
}

// Manipular mudança de checkbox
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const competenciaId = checkbox.id;
    const pontosPorUnidade = parseFloat(checkbox.dataset.pontos) || 0;
    const categoria = checkbox.dataset.categoria || 'geral';
    
    // Procurar o input de quantidade usando data-for ou pela estrutura do DOM
    let quantidadeInput = document.querySelector(`input[data-for="${competenciaId}"]`);
    if (!quantidadeInput) {
        // Fallback: procurar na estrutura do DOM
        quantidadeInput = checkbox.closest('.competencia-item')?.querySelector('.quantidade-input');
    }
    
    if (checkbox.checked) {
        // Habilitar input de quantidade se existir
        if (quantidadeInput) {
            quantidadeInput.disabled = false;
            // Se não tem valor, definir como 1
            if (!quantidadeInput.value) {
                quantidadeInput.value = '1';
            }
            quantidadeInput.focus();
        }
        
        // Adicionar competência selecionada
        const quantidade = quantidadeInput ? parseInt(quantidadeInput.value) || 1 : 1;
        const pontosTotal = pontosPorUnidade * quantidade;
        
        competenciasSelecionadas.set(competenciaId, {
            nome: getCompetenciaNome(competenciaId),
            pontosPorUnidade,
            quantidade,
            pontosTotal,
            categoria
        });
    } else {
        // Desabilitar input de quantidade
        if (quantidadeInput) {
            quantidadeInput.disabled = true;
            quantidadeInput.value = '';
        }
        
        // Remover competência selecionada
        competenciasSelecionadas.delete(competenciaId);
    }
    
    atualizarResultados();
}

// Manipular mudança de quantidade
function handleQuantidadeChange(event) {
    const input = event.target;
    const competenciaId = input.dataset.for;
    const quantidade = parseInt(input.value) || 1;
    
    if (competenciasSelecionadas.has(competenciaId)) {
        const competencia = competenciasSelecionadas.get(competenciaId);
        competencia.quantidade = quantidade;
        competencia.pontosTotal = competencia.pontosPorUnidade * quantidade;
        
        competenciasSelecionadas.set(competenciaId, competencia);
        atualizarResultados();
    }
}

// Manipular quando input de quantidade perde o foco
function handleQuantidadeBlur(event) {
    const input = event.target;
    const competenciaId = input.dataset.for;
    const checkbox = document.getElementById(competenciaId);
    
    // Se o input tem valor e o checkbox existe, garantir que permaneça marcado
    if (input.value && checkbox && competenciasSelecionadas.has(competenciaId)) {
        checkbox.checked = true;
        
        // Se o valor foi alterado, atualizar os dados
        const quantidade = parseInt(input.value) || 1;
        const competencia = competenciasSelecionadas.get(competenciaId);
        if (competencia.quantidade !== quantidade) {
            competencia.quantidade = quantidade;
            competencia.pontosTotal = competencia.pontosPorUnidade * quantidade;
            competenciasSelecionadas.set(competenciaId, competencia);
            atualizarResultados();
        }
    }
    // Se o input está vazio mas o checkbox está marcado, definir quantidade como 1
    else if (!input.value && checkbox && checkbox.checked && competenciasSelecionadas.has(competenciaId)) {
        input.value = '1';
        const competencia = competenciasSelecionadas.get(competenciaId);
        competencia.quantidade = 1;
        competencia.pontosTotal = competencia.pontosPorUnidade * 1;
        competenciasSelecionadas.set(competenciaId, competencia);
        atualizarResultados();
    }
}

// Manipular mudança de escolaridade
function handleEscolaridadeChange(event) {
    nivelEscolaridade = event.target.value;
    atualizarResultados();
    
    if (nivelEscolaridade) {
        const niveisPermitidos = ESCOLARIDADE_MAPPING[nivelEscolaridade] || [];
        const maiorNivel = niveisPermitidos[niveisPermitidos.length - 1] || 'Nenhum';
        mostrarNotificacao(`Escolaridade selecionada: ${event.target.options[event.target.selectedIndex].text}. Nível máximo possível: ${maiorNivel}`, 'info');
    }
}

// Obter nome da competência pelo ID
function getCompetenciaNome(id) {
    // Escapar IDs que começam com números para seletores CSS válidos
    const seletor = /^\d/.test(id) ? `#\\3${id.charAt(0)} ${id.slice(1)}` : `#${id}`;
    const elemento = document.querySelector(seletor);
    if (!elemento) return id;
    
    const container = elemento.closest('.competencia-item');
    if (!container) return id;
    
    const nomeElement = container.querySelector('strong');
    return nomeElement ? nomeElement.textContent : id;
}

// Função removida - o painel agora está integrado no HTML principal

// Atualizar resultados
function atualizarResultados() {
    calcularTotalPontos();
    atualizarNivelRSC();
    atualizarListaSelecionadas();
    atualizarProgressoNiveis();
}

// Calcular total de pontos
function calcularTotalPontos() {
    totalPontos = Array.from(competenciasSelecionadas.values())
        .reduce((total, comp) => total + comp.pontosTotal, 0);
    
    const totalElement = document.getElementById('total-pontos');
    if (totalElement) {
        totalElement.textContent = totalPontos.toFixed(1);
    }
}

// Atualizar nível RSC
function atualizarNivelRSC() {
    const nivelElement = document.getElementById('nivel-atual');
    if (!nivelElement) return;
    
    let nivelAtual = 'Sem nível';
    let classeCSS = 'sem-nivel';
    const totalItens = competenciasSelecionadas.size;
    let nivelAlcancado = false;
    
    // Verificar se escolaridade foi selecionada
    if (!nivelEscolaridade) {
        nivelAtual = 'Selecione sua escolaridade';
        nivelElement.textContent = nivelAtual;
        nivelElement.className = `nivel-atual ${classeCSS}`;
        return;
    }
    
    const niveisPermitidos = ESCOLARIDADE_MAPPING[nivelEscolaridade] || [];
    
    // Determinar nível baseado nos pontos, número mínimo de itens E escolaridade
    for (const [nivel, config] of Object.entries(NIVEIS_RSC)) {
        if (totalPontos >= config.minPontos && 
            totalItens >= config.minItens && 
            niveisPermitidos.includes(nivel)) {
            nivelAtual = config.iq;
            classeCSS = nivel.toLowerCase().replace('-', '-');
            nivelAlcancado = true;
        }
    }
    
    // Adicionar classe especial se requisitos foram cumpridos
    if (nivelAlcancado) {
        classeCSS += ' requisitos-cumpridos';
        // Disparar animação de confete apenas se mudou de estado
        if (!nivelElement.classList.contains('requisitos-cumpridos')) {
            setTimeout(() => criarAnimacaoConfete(), 300);
        }
    }
    
    nivelElement.textContent = nivelAtual;
    nivelElement.className = `nivel-atual ${classeCSS}`;
}

// Atualizar lista de competências selecionadas
function atualizarListaSelecionadas() {
    const listaElement = document.getElementById('lista-selecionadas');
    const countElement = document.getElementById('count-selecionadas');
    
    if (!listaElement || !countElement) return;
    
    countElement.textContent = competenciasSelecionadas.size;
    
    if (competenciasSelecionadas.size === 0) {
        listaElement.innerHTML = '<p class="sem-selecao">Nenhuma competência selecionada</p>';
        return;
    }
    
    const html = Array.from(competenciasSelecionadas.entries())
        .map(([id, comp]) => `
            <div class="competencia-selecionada">
                <span class="competencia-nome">${comp.nome}</span>
                <span class="competencia-detalhes">
                    ${comp.quantidade > 1 ? `${comp.quantidade}x ` : ''}
                    <span class="competencia-pontos">${comp.pontosTotal.toFixed(1)} pts</span>
                </span>
            </div>
        `)
        .join('');
    
    listaElement.innerHTML = html;
}

// Atualizar estatísticas por categoria
// Função atualizarEstatisticasCategorias removida - seção "Por Categoria" foi removida

// Atualizar progresso dos níveis
function atualizarProgressoNiveis() {
    const progressoElement = document.querySelector('.progresso-bars');
    if (!progressoElement) return;
    
    const totalItens = competenciasSelecionadas.size;
    const niveisPermitidos = nivelEscolaridade ? (ESCOLARIDADE_MAPPING[nivelEscolaridade] || []) : [];
    
    // Se não há nível de escolaridade selecionado, mostrar todos os níveis
    const niveisParaMostrar = nivelEscolaridade ? niveisPermitidos : Object.keys(NIVEIS_RSC);
    
    const html = niveisParaMostrar
        .map(nivel => {
            const config = NIVEIS_RSC[nivel];
            const progressoPontos = Math.min((totalPontos / config.minPontos) * 100, 100);
            const progressoItens = Math.min((totalItens / config.minItens) * 100, 100);
            const atingido = totalPontos >= config.minPontos && totalItens >= config.minItens;
            
            return `
                <div class="nivel-progresso ${atingido ? 'atingido' : ''}">
                    <div class="nivel-info">
                        <span class="nivel-nome">${nivel}</span>
                        <span class="nivel-requisito">${config.preRequisito}</span>
                    </div>
                    <div class="nivel-detalhes">
                        <small>Pontos: ${totalPontos.toFixed(1)}/${config.minPontos} | Itens: ${totalItens}/${config.minItens}</small>
                    </div>
                    <div class="progresso-bar">
                        <div class="progresso-fill" style="width: ${Math.min(progressoPontos, progressoItens)}%"></div>
                    </div>
                    <span class="progresso-percentual">${Math.min(progressoPontos, progressoItens).toFixed(0)}%</span>
                </div>
            `;
        })
        .join('');
    
    progressoElement.innerHTML = html;
}

// Obter nome de exibição da categoria
function getCategoriaDisplayName(categoria) {
    const nomes = {
        'formacao': 'Formação',
        'experiencia': 'Experiência',
        'capacitacao': 'Capacitação',
        'producao': 'Produção Técnica',
        'idiomas': 'Idiomas',
        'tecnologia': 'Tecnologia'
    };
    return nomes[categoria] || categoria;
}

// Limpar todas as seleções
function limparTudo() {
    try {
        if (confirm('Tem certeza que deseja limpar todas as seleções?')) {
            // Desmarcar todos os checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    // Disparar evento de mudança para atualizar a interface
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            // Limpar e desabilitar inputs de quantidade
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');
            quantidadeInputs.forEach(input => {
                if (input.value !== '') {
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
                input.disabled = true;
            });
            
            // Resetar escolaridade
            const escolaridadeSelect = document.getElementById('nivel-escolaridade');
            if (escolaridadeSelect && escolaridadeSelect.value !== '') {
                escolaridadeSelect.value = '';
                escolaridadeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Limpar estado
            competenciasSelecionadas.clear();
            totalPontos = 0;
            nivelEscolaridade = '';
            
            // Atualizar interface
            atualizarResultados();
            
            // Mostrar notificação
            mostrarNotificacao('Todas as seleções foram removidas!', 'info');
        }
    } catch (error) {
        console.error('Erro na função limparTudo:', error);
        alert('Erro ao limpar seleções: ' + error.message);
    }
}

// Exportar relatório
function exportarRelatorio() {
    if (competenciasSelecionadas.size === 0) {
        mostrarNotificacao('Selecione pelo menos uma competência para exportar o relatório.', 'warning');
        return;
    }
    
    const relatorio = gerarRelatorio();
    baixarRelatorio(relatorio);
    mostrarNotificacao('Relatório exportado com sucesso!', 'success');
}

// Gerar relatório
function gerarRelatorio() {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR');
    
    let relatorio = `RELATÓRIO DE AVALIAÇÃO RSC-TAE\n`;
    relatorio += `Data: ${dataFormatada} às ${horaFormatada}\n`;
    relatorio += `=====================================\n\n`;
    
    relatorio += `RESUMO GERAL\n`;
    relatorio += `Total de Pontos: ${totalPontos.toFixed(1)}\n`;
    relatorio += `Total de Itens Selecionados: ${competenciasSelecionadas.size}\n`;
    
    // Determinar nível
    let nivelAtual = 'Não atinge nenhum nível';
    let preRequisitoAtual = '';
    const totalItens = competenciasSelecionadas.size;
    
    for (const [nivel, config] of Object.entries(NIVEIS_RSC)) {
        if (totalPontos >= config.minPontos && totalItens >= config.minItens) {
            nivelAtual = `${nivel} - ${config.iq}`;
            preRequisitoAtual = config.preRequisito;
        }
    }
    relatorio += `Nível RSC: ${nivelAtual}\n`;
    if (preRequisitoAtual) {
        relatorio += `Pré-requisito de Escolaridade: ${preRequisitoAtual}\n`;
    }
    relatorio += `\n`;
    
    // Competências por categoria
    const categorias = new Map();
    competenciasSelecionadas.forEach(comp => {
        const categoria = comp.categoria;
        if (!categorias.has(categoria)) {
            categorias.set(categoria, []);
        }
        categorias.get(categoria).push(comp);
    });
    
    relatorio += `COMPETÊNCIAS SELECIONADAS\n`;
    relatorio += `=====================================\n`;
    
    categorias.forEach((competencias, categoria) => {
        relatorio += `\n${getCategoriaDisplayName(categoria).toUpperCase()}\n`;
        relatorio += `-`.repeat(getCategoriaDisplayName(categoria).length) + `\n`;
        
        competencias.forEach(comp => {
            relatorio += `• ${comp.nome}`;
            if (comp.quantidade > 1) {
                relatorio += ` (${comp.quantidade} unidades)`;
            }
            relatorio += ` - ${comp.pontosTotal.toFixed(1)} pontos\n`;
        });
        
        const totalCategoria = competencias.reduce((sum, comp) => sum + comp.pontosTotal, 0);
        relatorio += `Subtotal: ${totalCategoria.toFixed(1)} pontos\n`;
    });
    
    relatorio += `\n=====================================\n`;
    relatorio += `TOTAL GERAL: ${totalPontos.toFixed(1)} PONTOS\n`;
    relatorio += `NÍVEL RSC: ${nivelAtual}\n`;
    
    return relatorio;
}

// Baixar relatório
function baixarRelatorio(conteudo) {
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const agora = new Date();
    const timestamp = agora.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
    
    link.href = url;
    link.download = `relatorio_rsc_${timestamp}.txt`;
    link.click();
    
    window.URL.revokeObjectURL(url);
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remover notificação existente
    const existente = document.querySelector('.notificacao');
    if (existente) {
        existente.remove();
    }
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <i class="fas fa-${getIconeNotificacao(tipo)}"></i>
            <span>${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

// Obter ícone da notificação
function getIconeNotificacao(tipo) {
    const icones = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle',
        'info': 'info-circle'
    };
    return icones[tipo] || 'info-circle';
}

// Função para criar animação de confete
function criarAnimacaoConfete() {
    const container = document.createElement('div');
    container.className = 'confete-container';
    document.body.appendChild(container);
    
    // Criar múltiplos confetes
    for (let i = 0; i < 50; i++) {
        const confete = document.createElement('div');
        confete.className = 'confete';
        
        // Posição inicial aleatória
        confete.style.left = Math.random() * 100 + '%';
        confete.style.animationDelay = Math.random() * 3 + 's';
        confete.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Cores aleatórias
        const cores = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        
        container.appendChild(confete);
    }
    
    // Remover container após animação
    setTimeout(() => {
        if (container.parentElement) {
            container.remove();
        }
    }, 6000);
}