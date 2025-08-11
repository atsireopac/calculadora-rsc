# 📊 Calculadora RSC - Reconhecimento de Saberes e Competências

**Versão:** 1.2.0  
**Desenvolvido por:** [Erik Barbosa](https://github.com/atsireopac/)  
**Desenvolvido para:** Técnicos Administrativos em Educação (TAE)  
**Licença:** MIT

## 📋 Sobre o Projeto

A Calculadora RSC é uma aplicação web desenvolvida para auxiliar Técnicos Administrativos em Educação (TAE) no cálculo automático de pontuação para o Reconhecimento de Saberes e Competências. O sistema permite que os usuários selecionem suas competências e qualificações, calculando automaticamente a pontuação total e determinando o nível RSC correspondente.

## 🎯 Funcionalidades Principais

### ✅ Cálculo Automático de Pontuação
- Seleção de competências por categorias
- Cálculo automático da pontuação total
- Determinação do nível RSC baseado na pontuação e escolaridade
- Validação de pré-requisitos de escolaridade

### 📊 Interface Interativa
- Painel de resultados em tempo real
- Barra de progresso visual para cada nível RSC
- Lista de competências selecionadas
- **Sistema de busca avançado por palavras-chave**
  - Busca ativada ao pressionar Enter
  - Busca por múltiplas palavras simultaneamente
  - Scroll automático para o primeiro resultado
  - Destaque visual dos itens encontrados
  - Contador de resultados encontrados
  - Limpeza automática ao apagar o texto
- Animações visuais de feedback
- **Botão "Limpar Tudo" otimizado** que preserva os blocos de progresso visual

### 📄 Relatórios
- Exportação de relatório detalhado em formato de texto
- Resumo completo das competências selecionadas
- Informações sobre o nível RSC alcançado
- Data e hora da geração do relatório

### 🎨 Experiência do Usuário
- Interface responsiva e moderna
- Animação de confete ao atingir requisitos
- Notificações informativas
- Design intuitivo com ícones Font Awesome

## 🏗️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização avançada com:
  - Flexbox e Grid Layout
  - Animações e transições CSS
  - Design responsivo
  - Gradientes e efeitos visuais
- **JavaScript (ES6+)**: Lógica da aplicação com:
  - Manipulação do DOM
  - Event Listeners
  - Map e Set para gerenciamento de estado
  - Funções arrow e destructuring

### Bibliotecas Externas
- **Font Awesome 6.0.0**: Ícones vetoriais
- **CDN**: Carregamento otimizado de recursos

### Arquitetura
- **SPA (Single Page Application)**: Aplicação de página única
- **Vanilla JavaScript**: Sem dependências de frameworks
- **Modular CSS**: Organização por componentes
- **Responsive Design**: Compatível com dispositivos móveis

## 📐 Regras de Negócio

### Níveis RSC e Requisitos

| Nível | Pontuação Mínima | Escolaridade Mínima | Itens Mínimos | IQ Equivalente |
|-------|------------------|---------------------|---------------|----------------|
| RSC-1 | 10 pontos | Fund. Incompleto | 2 itens | IQ Fundamental Completo (10%) |
| RSC-2 | 20 pontos | Fund. Completo | 3 itens | IQ Médio (20%) |
| RSC-3 | 25 pontos | Médio/Técnico | 4 itens | IQ Graduação (25%) |
| RSC-4 | 30 pontos | Graduação | 5 itens | IQ Especialização (30%) |
| RSC-5 | 52 pontos | Pós-graduação | 8 itens | IQ Mestrado (52%) |
| RSC-6 | 75 pontos | Mestrado | 12 itens | IQ Doutorado (75%) |

### Categorias de Competências

#### 🎓 Formação Acadêmica e Pedagógica
- Graduação (1.0 pts)
- Pós-graduação lato sensu (0.5 pts)
- Mestrado (2.0 pts)
- Doutorado (3.0 pts)
- Cursos de formação pedagógica (0.2 pts)

#### 💼 Experiência Profissional
- Experiência no Serviço Público (0.1 pts/mês)
- Experiência na Iniciativa Privada (0.05 pts/mês)
- Experiência em Gestão/Coordenação (0.15 pts/mês)

#### 📚 Capacitação e Desenvolvimento
- Cursos de capacitação (0.1 pts por 20h)
- Participação em eventos (0.05 pts por evento)
- Certificações profissionais (0.3 pts cada)
- Cursos de idiomas (0.2 pts cada)
- Cursos técnicos (0.4 pts cada)

#### 🔬 Produção Técnica e Científica
- Publicação de artigos (0.5 pts cada)
- Apresentação de trabalhos (0.3 pts cada)
- Organização de eventos (0.4 pts cada)
- Participação em bancas (0.2 pts cada)
- Projetos de pesquisa (0.6 pts cada)

#### 🌐 Conhecimento em Idiomas
- Inglês básico/intermediário/avançado (0.2/0.4/0.6 pts)
- Espanhol básico/intermediário/avançado (0.2/0.4/0.6 pts)
- Outros idiomas (0.3 pts cada)

#### 💻 Conhecimentos Tecnológicos
- Pacote Office avançado (0.3 pts)
- Programação/Desenvolvimento (0.5 pts)
- Design gráfico (0.4 pts)
- Sistemas específicos (0.3 pts cada)

### Validações do Sistema

1. **Pré-requisito de Escolaridade**: O usuário só pode alcançar níveis RSC compatíveis com sua escolaridade
2. **Quantidade Mínima de Itens**: Cada nível exige um número mínimo de competências selecionadas
3. **Pontuação Mínima**: Cada nível possui uma pontuação mínima obrigatória
4. **Validação de Entrada**: Campos numéricos são validados para evitar valores inválidos

## 🚀 Como Usar

### Instalação
1. Clone ou baixe os arquivos do projeto
2. Abra o arquivo `index.html` em um navegador web moderno
3. Ou execute um servidor local:
   ```bash
   python -m http.server 3000
   ```

### Utilização
1. **Selecione sua escolaridade** no dropdown superior
2. **Marque suas competências** clicando nos checkboxes correspondentes
3. **Insira quantidades** quando aplicável (experiência em meses, horas de curso, etc.)
4. **Acompanhe em tempo real** sua pontuação no painel lateral
5. **Exporte o relatório** quando finalizar a seleção

### 🔍 Sistema de Busca Avançado

O sistema de busca foi aprimorado para oferecer uma experiência mais eficiente:

**Como usar:**
1. Digite as palavras-chave no campo de busca
2. Pressione **Enter** para executar a busca
3. O sistema buscará por **todas as palavras** digitadas no título e descrição das competências
4. Os resultados serão destacados visualmente
5. A página fará scroll automático para o primeiro resultado
6. Um contador mostrará quantos itens foram encontrados

**Funcionalidades:**
- ✅ Busca por múltiplas palavras simultaneamente
- ✅ Busca tanto no título quanto na descrição
- ✅ Destaque visual dos resultados encontrados
- ✅ Scroll automático para o primeiro resultado
- ✅ Contador de resultados em tempo real
- ✅ Limpeza automática ao apagar o texto
- ✅ Integração com o botão "Limpar Tudo"

### Dicas de Uso
- Use a **busca por palavras-chave** para encontrar competências específicas rapidamente
- O **painel de resultados** mostra seu progresso em tempo real
- A **animação de confete** indica quando você atinge os requisitos para um nível
- O botão **"Limpar Tudo"** reseta todas as seleções mas preserva os blocos de progresso visual

## 📁 Estrutura do Projeto

```
calculadoraRSC/
├── index.html          # Estrutura principal da aplicação
├── styles.css          # Estilos e animações CSS
├── script.js           # Lógica JavaScript da aplicação
└── README.md           # Documentação do projeto
```

## 🔧 Configuração e Personalização

### Modificar Níveis RSC
Edite o objeto `NIVEIS_RSC` no arquivo `script.js`:

```javascript
const NIVEIS_RSC = {
    'RSC-1': { 
        minPontos: 10, 
        percentual: 10, 
        preRequisito: 'Fund. Incompleto',
        minItens: 2,
        iq: 'IQ Fundamental Completo (10%)'
    },
    // ... outros níveis
};
```

### Adicionar Novas Competências
1. Adicione o HTML da competência no `index.html`
2. Configure os atributos `data-pontos` e `data-categoria`
3. Atualize a função `getCompetenciaNome()` se necessário

### Personalizar Estilos
Modifique as variáveis CSS no início do arquivo `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

## 🐛 Resolução de Problemas

### Problemas Comuns

**Checkbox não marca/desmarca corretamente**
- Certifique-se de clicar apenas na área do checkbox, não no texto

**Pontuação não atualiza**
- Verifique se o JavaScript está habilitado no navegador
- Abra o console do desenvolvedor para verificar erros

**Layout quebrado em dispositivos móveis**
- Verifique se a meta tag viewport está presente no HTML
- Teste em diferentes tamanhos de tela

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

### Versão 1.2.0 (2025)
- ✅ **Sistema de busca avançado por palavras-chave**
  - Busca ativada apenas ao pressionar Enter
  - Suporte a múltiplas palavras simultaneamente
  - Scroll automático para o primeiro resultado
  - Destaque visual dos itens encontrados
  - Contador de resultados em tempo real
- ✅ **Correção do botão "Limpar Tudo"**
  - Preserva os blocos visuais de progresso no painel direito
  - Mantém a funcionalidade de limpeza das seleções
- ✅ **Rodapé aprimorado**
  - Design moderno com fundo escuro
  - Link para o GitHub do desenvolvedor
  - Posicionamento fixo ao final da página
  - Informações legais atualizadas

### Versão 1.0.0 (2024)
- ✅ Implementação inicial da calculadora RSC
- ✅ Interface responsiva e moderna
- ✅ Cálculo automático de pontuação
- ✅ Sistema de validação de pré-requisitos
- ✅ Exportação de relatórios
- ✅ Animações e feedback visual
- ✅ Busca básica por competências
- ✅ Painel de resultados em tempo real

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Erik Barbosa** - [GitHub](https://github.com/atsireopac/)

Desenvolvido com ❤️ para auxiliar os Técnicos Administrativos em Educação no processo de Reconhecimento de Saberes e Competências.

### Sobre o Desenvolvedor
- 1 ano de experiência em arquitetura e sustentação de software na Fundação Universidade de Brasília
- 1 ano de experiência em monitoração de redes de computadores na Caixa Econômica Federal
- Especialização em Engenharia de Software
- MBA em Gestão de Negócios de Tecnologia da Informação
- Bacharelado em Engenharia de Software

---

**Nota**: Esta aplicação é uma ferramenta auxiliar. Sempre consulte a documentação oficial da sua instituição para informações atualizadas sobre o processo RSC.