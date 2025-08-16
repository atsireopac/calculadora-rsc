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
    // Event listeners para checkboxes usando delegação de eventos
    document.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox' && event.target.hasAttribute('data-pontos')) {
            handleCheckboxChange(event);
        }
    });
    
    // Também manter os listeners diretos como fallback
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
    
    // Campo de busca
    const buscaInput = document.getElementById('busca-competencia');
    if (buscaInput) {
        buscaInput.addEventListener('input', handleBuscaChange);
        buscaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                realizarBusca(buscaInput.value.trim());
            }
        });
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

    // Event listener para card mobile (toque para expandir/recolher)
    const cardMobile = document.getElementById('resultado-card-mobile');
    if (cardMobile) {
        cardMobile.addEventListener('click', toggleCardMobile);
        cardMobile.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleCardMobile(e);
        });
    }
}

function handleBuscaChange(event) {
    const termoBusca = event.target.value.trim();
    
    if (termoBusca.length === 0) {
        // Se não há termo de busca, mostrar todas as competências
        mostrarTodasCompetencias();
        return;
    }
    
    // Não fazer busca em tempo real, apenas quando pressionar Enter
}

function realizarBusca(termoBusca) {
    if (!termoBusca || termoBusca.trim().length === 0) {
        mostrarTodasCompetencias();
        return;
    }
    
    // Dividir o termo de busca em palavras individuais
    const palavrasChave = termoBusca.toLowerCase().trim().split(/\s+/).filter(palavra => palavra.length > 0);
    
    if (palavrasChave.length === 0) {
        mostrarTodasCompetencias();
        return;
    }
    
    const competenciaItems = document.querySelectorAll('.competencia-item');
    let primeiroEncontrado = null;
    let totalEncontrados = 0;
    
    competenciaItems.forEach(item => {
        const competenciaInfo = item.querySelector('.competencia-info');
        const titulo = competenciaInfo.querySelector('strong').textContent.toLowerCase();
        const descricao = competenciaInfo.querySelector('p').textContent.toLowerCase();
        const textoCompleto = titulo + ' ' + descricao;
        
        // Verificar se todas as palavras-chave estão presentes no texto
        const encontrouTodasPalavras = palavrasChave.every(palavra => 
            textoCompleto.includes(palavra)
        );
        
        if (encontrouTodasPalavras) {
            item.style.display = 'block';
            item.style.backgroundColor = '#fff3cd'; // Destacar resultado
            item.style.border = '2px solid #ffc107';
            totalEncontrados++;
            
            if (!primeiroEncontrado) {
                primeiroEncontrado = item;
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Scroll até o primeiro resultado encontrado
    if (primeiroEncontrado) {
        setTimeout(() => {
            primeiroEncontrado.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
        
        mostrarNotificacao(`${totalEncontrados} competência(s) encontrada(s) para: "${termoBusca}"`, 'success');
    } else {
        mostrarNotificacao(`Nenhuma competência encontrada para: "${termoBusca}"`, 'warning');
    }
}

function mostrarTodasCompetencias() {
    const competenciaItems = document.querySelectorAll('.competencia-item');
    
    competenciaItems.forEach(item => {
        item.style.display = 'block';
        item.style.backgroundColor = '';
        item.style.border = '';
    });
}

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
        // Truncar para 3 casas decimais sem arredondamento
        const pontosTotal = Math.floor((pontosPorUnidade * quantidade) * 1000) / 1000;
        
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
        // Truncar para 3 casas decimais sem arredondamento
        competencia.pontosTotal = Math.floor((competencia.pontosPorUnidade * quantidade) * 1000) / 1000;
        
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
    atualizarResultadosMobile();
}

// Calcular total de pontos
function calcularTotalPontos() {
    totalPontos = Array.from(competenciasSelecionadas.values())
        .reduce((total, comp) => total + comp.pontosTotal, 0);
    
    const totalElement = document.getElementById('total-pontos');
    if (totalElement) {
        // Truncar para 3 casas decimais sem arredondamento
        const totalTruncado = Math.floor(totalPontos * 1000) / 1000;
        totalElement.textContent = totalTruncado.toFixed(3).replace('.', ',');
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
        // Disparar animação de confete e mensagem apenas se mudou de estado
        if (!nivelElement.classList.contains('requisitos-cumpridos')) {
            setTimeout(() => {
                criarAnimacaoConfete();
                mostrarNotificacao('🎉 Parabéns! Você atingiu a pontuação necessária para o nível RSC!', 'success');
            }, 300);
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
                    <span class="competencia-pontos">${comp.pontosTotal.toFixed(3).replace('.', ',')} pts</span>
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
                        <small>Pontos: ${totalPontos.toFixed(3).replace('.', ',')}/${config.minPontos} | Itens: ${totalItens}/${config.minItens}</small>
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
            // Limpar estado global primeiro
            competenciasSelecionadas.clear();
            totalPontos = 0;
            nivelEscolaridade = '';
            
            // Desmarcar todos os checkboxes e disparar eventos
            const checkboxes = document.querySelectorAll('input[type="checkbox"][data-pontos]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    // Disparar evento change para garantir que o estado seja atualizado
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            // Limpar e desabilitar todos os inputs de quantidade
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');
            quantidadeInputs.forEach(input => {
                input.value = '';
                input.disabled = true;
            });
            
            // Resetar seletor de escolaridade
            const escolaridadeSelect = document.getElementById('nivel-escolaridade');
            if (escolaridadeSelect) {
                escolaridadeSelect.selectedIndex = 0;
                // Disparar evento change para resetar o nível
                escolaridadeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Limpar campo de busca e remover destaques
            const buscaInput = document.getElementById('busca-competencia');
            if (buscaInput) {
                buscaInput.value = '';
            }
            mostrarTodasCompetencias(); // Remover destaques da busca
            
            // Forçar atualização completa da interface
            setTimeout(() => {
                // Resetar total de pontos
                const totalElement = document.getElementById('total-pontos');
                if (totalElement) {
                    totalElement.textContent = '0,000';
                }
                
                // Resetar nível atual
                const nivelElement = document.getElementById('nivel-atual');
                if (nivelElement) {
                    nivelElement.textContent = 'Selecione sua escolaridade';
                    nivelElement.className = 'nivel-atual sem-nivel';
                }
                
                // Limpar lista de selecionadas
                const listaElement = document.getElementById('lista-selecionadas');
                if (listaElement) {
                    listaElement.innerHTML = '<p class="sem-selecao">Nenhuma competência selecionada</p>';
                }
                
                // Resetar contador
                const countElement = document.getElementById('count-selecionadas');
                if (countElement) {
                    countElement.textContent = '0';
                }
                
                // Não limpar progresso dos níveis - manter os blocos visuais
                
                // Mostrar todas as competências
                const competenciaItems = document.querySelectorAll('.competencia-item');
                competenciaItems.forEach(item => {
                    item.style.display = 'block';
                });
                
                // Forçar uma atualização final
                atualizarResultados();
            }, 100);
            
            // Mostrar notificação
            mostrarNotificacao('Todas as seleções foram removidas!', 'success');
        }
    } catch (error) {
        console.error('Erro na função limparTudo:', error);
        mostrarNotificacao('Erro ao limpar seleções: ' + error.message, 'error');
    }
}

// Exportar relatório
function exportarRelatorio() {
    if (competenciasSelecionadas.size === 0) {
        mostrarNotificacao('Selecione pelo menos uma competência para exportar o relatório.', 'warning');
        return;
    }
    
    gerarRelatorioPDF();
    mostrarNotificacao('Relatório PDF exportado com sucesso!', 'success');
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
    relatorio += `Total de Pontos: ${totalPontos.toFixed(3).replace('.', ',')}\n`;
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
            relatorio += ` - ${comp.pontosTotal.toFixed(3).replace('.', ',')} pontos\n`;
        });
        
        const totalCategoria = competencias.reduce((sum, comp) => sum + comp.pontosTotal, 0);
        relatorio += `Subtotal: ${totalCategoria.toFixed(3).replace('.', ',')} pontos\n`;
    });
    
    relatorio += `\n=====================================\n`;
    relatorio += `TOTAL GERAL: ${totalPontos.toFixed(3).replace('.', ',')} PONTOS\n`;
    relatorio += `NÍVEL RSC: ${nivelAtual}\n`;
    
    return relatorio;
}

// Baixar relatório
// Função auxiliar para formatar números com vírgula
function formatarNumeroComVirgula(numero) {
    return numero.toFixed(3).replace('.', ',');
}

// Gerar relatório em PDF
function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR');
    const timestamp = agora.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
    
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Título principal
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE AVALIAÇÃO RSC-TAE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Data e hora
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Data: ${dataFormatada} às ${horaFormatada}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Resumo geral
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMO GERAL', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Total de Pontos: ${formatarNumeroComVirgula(totalPontos)}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Total de Itens Selecionados: ${competenciasSelecionadas.size}`, margin, yPosition);
    yPosition += 7;
    
    // Validar requisitos baseados na escolaridade selecionada
    const totalItens = competenciasSelecionadas.size;
    const niveisPermitidos = ESCOLARIDADE_MAPPING[nivelEscolaridade] || [];
    
    let nivelAtingido = null;
    let requisitosAtendidos = true;
    let motivosNaoAtendimento = [];
    
    // Verificar se há níveis compatíveis com a escolaridade
    for (const [nivel, config] of Object.entries(NIVEIS_RSC)) {
        if (niveisPermitidos.includes(nivel)) {
            if (totalPontos >= config.minPontos && totalItens >= config.minItens) {
                nivelAtingido = { nivel, config };
            } else {
                // Verificar quais requisitos não foram atendidos
                if (totalPontos < config.minPontos) {
                    motivosNaoAtendimento.push('pontuação');
                }
                if (totalItens < config.minItens) {
                    motivosNaoAtendimento.push('quantidade de itens');
                }
                break; // Para no primeiro nível não atingido
            }
        }
    }
    
    // Exibir informações de nível apenas se os requisitos foram atendidos
    if (nivelAtingido) {
        doc.text(`Nível RSC: ${nivelAtingido.nivel} - ${nivelAtingido.config.iq}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Pré-requisito de Escolaridade: ${nivelAtingido.config.preRequisito}`, margin, yPosition);
        yPosition += 7;
    } else {
        // Mostrar mensagem de requisitos não atendidos
        const motivosUnicos = [...new Set(motivosNaoAtendimento)];
        let mensagem = 'Requisitos não atendidos: ';
        
        if (motivosUnicos.length === 2) {
            mensagem += 'pontuação e quantidade de itens necessárias';
        } else if (motivosUnicos.includes('pontuação')) {
            mensagem += 'pontuação necessária';
        } else if (motivosUnicos.includes('quantidade de itens')) {
            mensagem += 'quantidade de itens necessárias';
        } else {
            mensagem = 'Nenhum nível RSC atingido';
        }
        
        doc.text(mensagem, margin, yPosition);
        yPosition += 7;
    }
    yPosition += 10;
    
    // Competências por categoria
    const categorias = new Map();
    competenciasSelecionadas.forEach(comp => {
        const categoria = comp.categoria;
        if (!categorias.has(categoria)) {
            categorias.set(categoria, []);
        }
        categorias.get(categoria).push(comp);
    });
    
    // Título das competências
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('COMPETÊNCIAS SELECIONADAS', margin, yPosition);
    yPosition += 5;
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    categorias.forEach((competencias, categoria) => {
        // Verificar se precisa de nova página
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Nome da categoria
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const categoriaNome = getCategoriaDisplayName(categoria).toUpperCase();
        doc.text(categoriaNome, margin, yPosition);
        yPosition += 8;
        
        // Competências da categoria
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        competencias.forEach(comp => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            let texto = `• ${comp.nome}`;
            if (comp.quantidade > 1) {
                texto += ` (${comp.quantidade} unidades)`;
            }
            texto += ` - ${formatarNumeroComVirgula(comp.pontosTotal)} pontos`;
            
            // Quebrar texto se for muito longo
            const linhas = doc.splitTextToSize(texto, maxWidth - 10);
            linhas.forEach(linha => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(linha, margin + 5, yPosition);
                yPosition += 5;
            });
        });
        
        // Subtotal da categoria
        const totalCategoria = competencias.reduce((sum, comp) => sum + comp.pontosTotal, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`Subtotal: ${formatarNumeroComVirgula(totalCategoria)} pontos`, margin + 5, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 15;
    });
    
    // Total final
    if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
    }
    
    yPosition += 10;
    doc.setLineWidth(1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL GERAL: ${formatarNumeroComVirgula(totalPontos)} PONTOS`, margin, yPosition);
    yPosition += 8;
    
    // Mostrar status final baseado na escolaridade selecionada
    let statusFinal = 'Requisitos não atendidos';
    
    for (const [nivel, config] of Object.entries(NIVEIS_RSC)) {
        if (niveisPermitidos.includes(nivel) && 
            totalPontos >= config.minPontos && 
            competenciasSelecionadas.size >= config.minItens) {
            statusFinal = `Requisitos atendidos para ${nivel} - ${config.iq}`;
        }
    }
    
    doc.text(statusFinal, margin, yPosition);
    
    // Salvar o PDF
    doc.save(`relatorio_rsc_${timestamp}.pdf`);
}

// Função antiga mantida para compatibilidade (não utilizada)
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

// Função para alternar card mobile
function toggleCardMobile(event) {
    // Prevenir que cliques em botões ou inputs ativem o toggle
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
        return;
    }
    
    const card = document.getElementById('resultado-card-mobile');
    if (!card) return;
    
    const isCollapsed = card.classList.contains('collapsed');
    
    if (isCollapsed) {
        card.classList.remove('collapsed');
    } else {
        card.classList.add('collapsed');
    }
    
    // Adicionar feedback visual temporário
    card.style.transform = 'scale(0.98)';
     setTimeout(() => {
         card.style.transform = '';
     }, 150);
}

// Função para atualizar resultados mobile
function atualizarResultadosMobile() {
    // Calcular pontos totais diretamente
    const pontosTotais = Array.from(competenciasSelecionadas.values())
        .reduce((total, comp) => total + comp.pontosTotal, 0);
    const pontosTruncados = Math.floor(pontosTotais * 1000) / 1000;
    
    // Atualizar card mobile principal - pontos totais
    const mobileCardPontos = document.getElementById('total-pontos-mobile');
    if (mobileCardPontos) {
        mobileCardPontos.textContent = `${pontosTruncados.toFixed(2).replace('.', ',')} pts`;
    }

    // Atualizar card mobile principal - nível atual
    const mobileCardNivel = document.getElementById('nivel-atual-mobile');
    if (mobileCardNivel) {
        const nivelAtualElement = document.getElementById('nivel-atual');
        const nivelAtual = nivelAtualElement ? nivelAtualElement.textContent : 'Sem nível';
        mobileCardNivel.textContent = nivelAtual;
    }
    
    // Atualizar barra inferior fixa - pontos totais
    const mobileBottomPontos = document.getElementById('mobile-total-pontos');
    if (mobileBottomPontos) {
        mobileBottomPontos.textContent = `${pontosTruncados.toFixed(2).replace('.', ',')} pts`;
    }

    // Atualizar barra inferior fixa - nível atual
    const mobileBottomNivel = document.getElementById('mobile-nivel-atual');
    if (mobileBottomNivel) {
        const nivelAtualElement = document.getElementById('nivel-atual');
        const nivelAtual = nivelAtualElement ? nivelAtualElement.textContent : 'Sem nível';
        mobileBottomNivel.textContent = nivelAtual;
    }
    
    // Atualizar card fixo no topo - pontos totais
    const mobileTopPontos = document.getElementById('mobile-top-total-pontos');
    if (mobileTopPontos) {
        mobileTopPontos.textContent = `${pontosTruncados.toFixed(2).replace('.', ',')} pts`;
    }

    // Atualizar card fixo no topo - nível atual
    const mobileTopNivel = document.getElementById('mobile-top-nivel-atual');
    const mobileTopCard = document.querySelector('.mobile-top-score-card');
    if (mobileTopNivel && mobileTopCard) {
        const nivelAtualElement = document.getElementById('nivel-atual');
        const nivelAtual = nivelAtualElement ? nivelAtualElement.textContent : 'Sem nível';
        mobileTopNivel.textContent = nivelAtual;
        
        // Verificar se requisitos foram atingidos para aplicar efeito visual
        const totalItens = competenciasSelecionadas.size;
        let nivelAlcancado = false;
        
        if (nivelEscolaridade) {
            const niveisPermitidos = ESCOLARIDADE_MAPPING[nivelEscolaridade] || [];
            
            for (const [nivel, config] of Object.entries(NIVEIS_RSC)) {
                if (pontosTruncados >= config.minPontos && 
                    totalItens >= config.minItens && 
                    niveisPermitidos.includes(nivel)) {
                    nivelAlcancado = true;
                    break;
                }
            }
        }
        
        // Aplicar efeito visual verde e disparar confetes se requisitos atingidos
        if (nivelAlcancado) {
            if (!mobileTopCard.classList.contains('requisitos-cumpridos')) {
                mobileTopCard.classList.add('requisitos-cumpridos');
                // Disparar animação de confete e mensagem de parabéns
                setTimeout(() => {
                    criarAnimacaoConfete();
                    mostrarNotificacao('🎉 Parabéns! Você atingiu a pontuação necessária para o nível RSC!', 'success');
                }, 300);
            }
        } else {
            mobileTopCard.classList.remove('requisitos-cumpridos');
        }
    }

    // Atualizar contagem de competências
    const mobileCompetenciasCount = document.getElementById('mobile-competencias-count');
    if (mobileCompetenciasCount) {
        mobileCompetenciasCount.textContent = competenciasSelecionadas.size;
    }

    // Atualizar lista de competências selecionadas
    const mobileListaSelecionadas = document.getElementById('mobile-lista-selecionadas');
    if (mobileListaSelecionadas) {
        mobileListaSelecionadas.innerHTML = '';
        
        competenciasSelecionadas.forEach((dados, id) => {
            const item = document.createElement('div');
            item.className = 'item-selecionado-mobile';
            
            const nome = getCompetenciaNome(id);
            const nomeResumido = nome.length > 40 ? nome.substring(0, 40) + '...' : nome;
            
            item.innerHTML = `
                <span>${nomeResumido}</span>
                <span class="pontos">${dados.pontosTotal.toFixed(3).replace('.', ',')} pts</span>
            `;
            
            mobileListaSelecionadas.appendChild(item);
        });
        
        if (competenciasSelecionadas.size === 0) {
            mobileListaSelecionadas.innerHTML = '<div style="text-align: center; opacity: 0.7; font-style: italic;">Nenhuma competência selecionada</div>';
        }
    }
    
    // Atualizar progresso mobile
    const progressoBarsMobile = document.querySelector('.progresso-bars-mobile');
    if (progressoBarsMobile) {
        progressoBarsMobile.innerHTML = '';
        
        Object.entries(NIVEIS_RSC).forEach(([nivel, config]) => {
            const bar = document.createElement('div');
            bar.className = 'progresso-bar-mobile';
            
            const atingido = pontosTruncados >= config.minPontos;
            if (atingido) {
                bar.classList.add('ativo');
            }
            
            bar.innerHTML = `
                <span>${nivel}</span>
                <span>${atingido ? '✅' : '❌'} ${config.minPontos} pts</span>
            `;
            
            progressoBarsMobile.appendChild(bar);
        });
    }
}