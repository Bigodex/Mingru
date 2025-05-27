// Gerenciamento de Abas
class TabManager {
  constructor() {
      this.tabButtons = document.querySelectorAll('.tab-button');
      this.tabPanels = document.querySelectorAll('.tab-panel');
      this.init();
  }

  init() {
      this.tabButtons.forEach(button => {
          button.addEventListener('click', (e) => this.switchTab(e));
      });

      // Suporte a navegação por teclado
      this.tabButtons.forEach((button, index) => {
          button.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  const nextIndex = e.key === 'ArrowLeft' 
                      ? (index - 1 + this.tabButtons.length) % this.tabButtons.length
                      : (index + 1) % this.tabButtons.length;
                  this.tabButtons[nextIndex].click();
                  this.tabButtons[nextIndex].focus();
              }
          });
      });
  }

  switchTab(e) {
      const targetTab = e.target.dataset.tab;
      
      // Atualizar botões
      this.tabButtons.forEach(button => {
          button.classList.remove('active');
          button.setAttribute('aria-selected', 'false');
      });
      
      e.target.classList.add('active');
      e.target.setAttribute('aria-selected', 'true');
      
      // Atualizar painéis com animação
      this.tabPanels.forEach(panel => {
          panel.classList.remove('active');
      });
      
      setTimeout(() => {
          const targetPanel = document.getElementById(`${targetTab}-panel`);
          targetPanel.classList.add('active');
      }, 150);
  }
}

// Gerenciamento de Formulários
class FormManager {
  constructor() {
      this.forms = document.querySelectorAll('.auth-form');
      this.init();
  }

  init() {
      this.forms.forEach(form => {
          form.addEventListener('submit', (e) => this.handleSubmit(e));
          
          // Configurar inputs
          const inputs = form.querySelectorAll('input');
          inputs.forEach(input => {
              input.addEventListener('blur', () => this.validateField(input));
              input.addEventListener('input', () => this.clearError(input));
          });
      });

      // Configurar toggles de senha
      this.setupPasswordToggles();
  }

  setupPasswordToggles() {
      const passwordToggles = document.querySelectorAll('.password-toggle');
      
      passwordToggles.forEach(toggle => {
          toggle.addEventListener('click', () => {
              const input = toggle.previousElementSibling.previousElementSibling;
              const eyeIcon = toggle.querySelector('.eye-icon');
              
              if (input.type === 'password') {
                  input.type = 'text';
                  toggle.setAttribute('aria-label', 'Ocultar senha');
                  eyeIcon.innerHTML = `
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                  `;
              } else {
                  input.type = 'password';
                  toggle.setAttribute('aria-label', 'Mostrar senha');
                  eyeIcon.innerHTML = `
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  `;
              }
          });
      });
  }

  validateField(input) {
      const errorElement = document.getElementById(`${input.id}-error`);
      let errorMessage = '';

      // Validação por tipo de campo
      switch (input.type) {
          case 'email':
              if (!this.isValidEmail(input.value)) {
                  errorMessage = 'Por favor, insira um e-mail válido.';
              }
              break;
          
          case 'password':
              if (input.name === 'password') {
                  const passwordErrors = this.validatePassword(input.value);
                  if (passwordErrors.length > 0) {
                      errorMessage = passwordErrors[0];
                  }
              } else if (input.name === 'confirmPassword') {
                  const passwordInput = document.getElementById('register-password');
                  if (input.value !== passwordInput.value) {
                      errorMessage = 'As senhas não coincidem.';
                  }
              }
              break;
          
          case 'text':
              if (input.name === 'name' && input.value.trim().length < 2) {
                  errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
              }
              break;
      }

      // Exibir erro
      if (errorMessage) {
          errorElement.textContent = errorMessage;
          input.style.borderBottomColor = '#D32F2F';
          return false;
      } else {
          errorElement.textContent = '';
          input.style.borderBottomColor = '';
          return true;
      }
  }

  clearError(input) {
      const errorElement = document.getElementById(`${input.id}-error`);
      errorElement.textContent = '';
      input.style.borderBottomColor = '';
  }

  isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  validatePassword(password) {
      const errors = [];
      
      if (password.length < 8) {
          errors.push('Senha deve ter pelo menos 8 caracteres.');
      }
      if (!/[a-zA-Z]/.test(password)) {
          errors.push('Senha deve conter pelo menos uma letra.');
      }
      if (!/[0-9]/.test(password)) {
          errors.push('Senha deve conter pelo menos um número.');
      }
      if (!/[^a-zA-Z0-9]/.test(password)) {
          errors.push('Senha deve conter pelo menos um caractere especial.');
      }
      
      return errors;
  }

  async handleSubmit(e) {
      e.preventDefault();
      
      const form = e.target;
      const formData = new FormData(form);
      const button = form.querySelector('.auth-button');
      const buttonText = button.querySelector('.button-text');
      const spinner = button.querySelector('.spinner');
      
      // Validar todos os campos
      const inputs = form.querySelectorAll('input[required]');
      let isValid = true;
      
      inputs.forEach(input => {
          if (!this.validateField(input)) {
              isValid = false;
          }
      });
      
      if (!isValid) {
          this.shakeForm(form);
          return;
      }
      
      // Mostrar loading
      button.disabled = true;
      buttonText.textContent = 'Carregando...';
      spinner.classList.remove('hidden');
      
      try {
          // Simular chamada de API
          await this.simulateAPICall(formData);
          
          // Sucesso
          this.showSuccess(form.id === 'login-form' ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!');
          
      } catch (error) {
          this.showError('Erro ao processar solicitação. Tente novamente.');
      } finally {
          // Restaurar botão
          button.disabled = false;
          buttonText.textContent = form.id === 'login-form' ? 'Entrar' : 'Cadastrar';
          spinner.classList.add('hidden');
      }
  }

  async simulateAPICall(formData) {
      // Simular delay de rede
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simular sucesso na maioria dos casos
              if (Math.random() > 0.1) {
                  resolve({ success: true });
              } else {
                  reject(new Error('Erro simulado'));
              }
          }, 2000);
      });
  }

  shakeForm(form) {
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
          form.style.animation = '';
      }, 500);
  }

  showSuccess(message) {
      // Criar notificação de sucesso
      this.showNotification(message, 'success');
  }

  showError(message) {
      // Criar notificação de erro
      this.showNotification(message, 'error');
  }

  showNotification(message, type) {
      // Remover notificação existente
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
          existingNotification.remove();
      }

      // Criar nova notificação
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      
      // Estilos da notificação
      Object.assign(notification.style, {
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '16px 24px',
          borderRadius: '8px',
          color: 'white',
          fontWeight: '500',
          zIndex: '1000',
          transform: 'translateX(100%)',
          transition: 'transform 0.3s ease',
          backgroundColor: type === 'success' ? '#4CAF50' : '#F44336'
      });
      
      document.body.appendChild(notification);
      
      // Animar entrada
      setTimeout(() => {
          notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remover após 3 segundos
      setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
              notification.remove();
          }, 300);
      }, 3000);
  }
}

// Gerenciamento de Acessibilidade
class AccessibilityManager {
  constructor() {
      this.init();
  }

  init() {
      // Melhorar navegação por teclado
      this.setupKeyboardNavigation();
      
      // Configurar ARIA labels dinâmicos
      this.setupDynamicARIA();
  }

  setupKeyboardNavigation() {
      // Permitir Enter para submeter formulários
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
              const form = e.target.closest('form');
              if (form) {
                  const submitButton = form.querySelector('.auth-button');
                  if (submitButton && !submitButton.disabled) {
                      submitButton.click();
                  }
              }
          }
      });
  }

  setupDynamicARIA() {
      // Atualizar aria-invalid baseado em erros
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
          const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                  if (mutation.type === 'childList' || mutation.type === 'characterData') {
                      const errorElement = document.getElementById(`${input.id}-error`);
                      if (errorElement && errorElement.textContent.trim()) {
                          input.setAttribute('aria-invalid', 'true');
                      } else {
                          input.removeAttribute('aria-invalid');
                      }
                  }
              });
          });
          
          const errorElement = document.getElementById(`${input.id}-error`);
          if (errorElement) {
              observer.observe(errorElement, {
                  childList: true,
                  characterData: true,
                  subtree: true
              });
          }
      });
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  new TabManager();
  new FormManager();
  new AccessibilityManager();
  
  // Configurar foco inicial
  const firstInput = document.querySelector('#login-email');
  if (firstInput) {
      firstInput.focus();
  }
});

// Utilitários globais
window.MingruAuth = {
  // Função para alternar tema (se necessário no futuro)
  toggleTheme: () => {
      document.body.classList.toggle('dark-theme');
  },
  
  // Função para limpar todos os formulários
  clearForms: () => {
      document.querySelectorAll('.auth-form').forEach(form => {
          form.reset();
          form.querySelectorAll('.error-message').forEach(error => {
              error.textContent = '';
          });
      });
  }
};