/**
 * Auto Service - Sistema de Agendamento Automotivo
 * Arquivo: script.js
 * Descrição: Validação de formulário e funcionalidades interativas
 */

// ===================================
// CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ===================================

// Elementos do DOM
const formulario = document.getElementById('formCadastro');
const botaoEnvio = formulario.querySelector('button[type="submit"]');
const successMessage = document.getElementById('successMessage');

// Mapa de campos e suas regras de validação
const camposValidacao = {
  nome: {
    regex: /^[a-zA-ZÀ-ÿ\s]{3,}$/,
    mensagem: 'Nome deve ter no mínimo 3 caracteres'
  },
  cpf: {
    regex: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    mensagem: 'CPF deve estar no formato: 000.000.000-00'
  },
  telefone: {
    regex: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    mensagem: 'Telefone deve estar no formato: (00) 00000-0000'
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensagem: 'E-mail inválido'
  }
};

// ===================================
// FUNÇÕES DE VALIDAÇÃO
// ===================================

/**
 * Valida um campo de entrada usando regex
 * @param {HTMLElement} campo - Elemento do formulário a validar
 * @param {string} tipo - Tipo de validação (nome, cpf, etc)
 * @returns {boolean} - Verdadeiro se válido
 */
function validarCampo(campo, tipo) {
  const valor = campo.value.trim();
  
  // Validação básica (campo obrigatório)
  if (campo.hasAttribute('required') && valor === '') {
    marcarComo('invalido', campo);
    return false;
  }

  // Se há regra de validação específica
  if (camposValidacao[tipo]) {
    const regex = camposValidacao[tipo].regex;
    if (valor !== '' && !regex.test(valor)) {
      marcarComo('invalido', campo);
      return false;
    }
  }

  // Validações especiais
  if (tipo === 'ano') {
    const ano = parseInt(valor);
    const anoAtual = new Date().getFullYear();
    if (ano < 1980 || ano > anoAtual + 1) {
      marcarComo('invalido', campo);
      return false;
    }
  }

  if (tipo === 'quilometragem') {
    if (isNaN(valor) || parseInt(valor) < 0) {
      marcarComo('invalido', campo);
      return false;
    }
  }

  if (tipo === 'data') {
    const dataSelecionada = new Date(valor);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    
    if (dataSelecionada < dataAtual) {
      marcarComo('invalido', campo);
      return false;
    }
  }

  marcarComo('valido', campo);
  return true;
}

/**
 * Marca um campo como válido ou inválido
 * @param {string} status - 'valido' ou 'invalido'
 * @param {HTMLElement} campo - Elemento do formulário
 */
function marcarComo(status, campo) {
  if (status === 'valido') {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
  } else if (status === 'invalido') {
    campo.classList.remove('is-valid');
    campo.classList.add('is-invalid');
  }
}

/**
 * Valida todos os campos do formulário
 * @returns {boolean} - Verdadeiro se todos os campos são válidos
 */
function validarFormularioCompleto() {
  let formularioValido = true;

  // Validar campos de texto
  const camposTexto = ['nome', 'cpf', 'telefone', 'email', 'marca', 'modelo', 'placa', 'descricao'];
  camposTexto.forEach(id => {
    const campo = document.getElementById(id);
    if (campo && !validarCampo(campo, id)) {
      formularioValido = false;
    }
  });

  // Validar campos numéricos
  const camposNumero = ['ano', 'quilometragem'];
  camposNumero.forEach(id => {
    const campo = document.getElementById(id);
    if (campo && !validarCampo(campo, id)) {
      formularioValido = false;
    }
  });

  // Validar selects
  const selects = ['tipoServico'];
  selects.forEach(id => {
    const campo = document.getElementById(id);
    if (campo && campo.value === '') {
      marcarComo('invalido', campo);
      formularioValido = false;
    } else if (campo) {
      marcarComo('valido', campo);
    }
  });

  // Validar radio buttons
  const prioridade = document.querySelector('input[name="prioridade"]:checked');
  if (!prioridade) {
    formularioValido = false;
    mostrarMensagem('Por favor, selecione uma prioridade.', 'warning');
  }

  // Validar data e hora
  const data = document.getElementById('data');
  const horario = document.getElementById('horario');
  
  if (data && !validarCampo(data, 'data')) {
    formularioValido = false;
  }
  
  if (horario && horario.value === '') {
    marcarComo('invalido', horario);
    formularioValido = false;
  } else if (horario) {
    marcarComo('valido', horario);
  }

  return formularioValido;
}

// ===================================
// VALIDAÇÃO EM TEMPO REAL
// ===================================

/**
 * Configura eventos de validação em tempo real para os campos
 */
function configurarValidacaoEmTempoReal() {
  // Campos de texto com validação específica
  ['nome', 'cpf', 'telefone', 'email'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('blur', () => validarCampo(campo, id));
      campo.addEventListener('input', () => {
        if (campo.classList.contains('is-invalid')) {
          validarCampo(campo, id);
        }
      });
    }
  });

  // Campos numéricos
  ['ano', 'quilometragem'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('blur', () => validarCampo(campo, id));
      campo.addEventListener('input', () => {
        if (campo.classList.contains('is-invalid')) {
          validarCampo(campo, id);
        }
      });
    }
  });

  // Selects
  ['tipoServico'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('change', () => {
        if (campo.value !== '') {
          marcarComo('valido', campo);
        }
      });
    }
  });

  // Data
  const data = document.getElementById('data');
  if (data) {
    data.addEventListener('blur', () => validarCampo(data, 'data'));
  }

  // Hora
  const horario = document.getElementById('horario');
  if (horario) {
    horario.addEventListener('blur', () => {
      if (horario.value !== '') {
        marcarComo('valido', horario);
      }
    });
  }

  // Textarea
  const descricao = document.getElementById('descricao');
  if (descricao) {
    descricao.addEventListener('blur', () => {
      if (descricao.value.trim() !== '') {
        marcarComo('valido', descricao);
      }
    });
  }
}

// ===================================
// FUNÇÕES DE FORMATAÇÃO
// ===================================

/**
 * Formata o CPF enquanto o usuário digita
 * @param {Event} event - Evento de input
 */
function formatarCPF(event) {
  let valor = event.target.value.replace(/\D/g, '');
  
  if (valor.length > 11) {
    valor = valor.substring(0, 11);
  }

  if (valor.length > 9) {
    valor = valor.substring(0, 3) + '.' + valor.substring(3, 6) + '.' + valor.substring(6, 9) + '-' + valor.substring(9);
  } else if (valor.length > 6) {
    valor = valor.substring(0, 3) + '.' + valor.substring(3, 6) + '.' + valor.substring(6);
  } else if (valor.length > 3) {
    valor = valor.substring(0, 3) + '.' + valor.substring(3);
  }

  event.target.value = valor;
}

/**
 * Formata o telefone enquanto o usuário digita
 * @param {Event} event - Evento de input
 */
function formatarTelefone(event) {
  let valor = event.target.value.replace(/\D/g, '');
  
  if (valor.length > 11) {
    valor = valor.substring(0, 11);
  }

  if (valor.length > 7) {
    valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2, 7) + '-' + valor.substring(7);
  } else if (valor.length > 2) {
    valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2);
  }

  event.target.value = valor;
}



// ===================================
// TRATAMENTO DE SUBMISSÃO
// ===================================

/**
 * Manipula a submissão do formulário
 * @param {Event} event - Evento de submit
 */
function handleSubmit(event) {
  event.preventDefault();

  // Validar formulário completo
  if (!validarFormularioCompleto()) {
    mostrarMensagem('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning');
    return;
  }

  // Simular envio do formulário
  mostrarMensagemSucesso();
  
  // Limpar formulário após sucesso
  setTimeout(() => {
    formulario.reset();
    limparValidacao();
  }, 2000);
}

/**
 * Mostra a mensagem de sucesso
 */
function mostrarMensagemSucesso() {
  successMessage.classList.remove('d-none');
  successMessage.classList.add('show');

  // Esconder mensagem após 5 segundos
  setTimeout(() => {
    successMessage.classList.add('d-none');
    successMessage.classList.remove('show');
  }, 5000);
}

/**
 * Limpa todas as validações do formulário
 */
function limparValidacao() {
  const campos = formulario.querySelectorAll('.form-control, .form-select, input[type="radio"]');
  campos.forEach(campo => {
    campo.classList.remove('is-valid', 'is-invalid');
  });
}

/**
 * Exibe uma mensagem ao usuário
 * @param {string} mensagem - Texto da mensagem
 * @param {string} tipo - Tipo de alerta (success, warning, danger, info)
 */
function mostrarMensagem(mensagem, tipo = 'info') {
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.setAttribute('role', 'alert');
  alerta.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  formulario.parentElement.insertBefore(alerta, formulario);
}

// ===================================
// INICIALIZAÇÃO
// ===================================

/**
 * Inicializa todos os eventos e funcionalidades do formulário
 */
function inicializarFormulario() {
  // Configurar validação em tempo real
  configurarValidacaoEmTempoReal();

  // Eventos de formatação
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const placa = document.getElementById('placa');
  const imagem = document.getElementById('imagem');

  if (cpf) {
    cpf.addEventListener('input', formatarCPF);
  }

  if (telefone) {
    telefone.addEventListener('input', formatarTelefone);
  }

  if (placa) {
    placa.addEventListener('input', formatarPlaca);
  }

  if (imagem) {
    imagem.addEventListener('change', validarArquivo);
  }

  // Evento de submissão do formulário
  formulario.addEventListener('submit', handleSubmit);

  // Adicionar classe de validação ao carregar
  formulario.classList.add('needs-validation');

  console.log('✅ Formulário inicializado com sucesso!');
}

// ===================================
// INICIAR QUANDO DOM ESTIVER PRONTO
// ===================================

document.addEventListener('DOMContentLoaded', inicializarFormulario);
