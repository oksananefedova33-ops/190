// /ui/html-langbadge/html-langbadge.js
(function() {
  'use strict';

  const LANGUAGES = [
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'zh-Hans', flag: '🇨🇳', name: '中文' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'pt', flag: '🇵🇹', name: 'Português' },
    { code: 'ko', flag: '🇰🇷', name: '한국어' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano' },
    { code: 'ja', flag: '🇯🇵', name: '日本語' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
    { code: 'pl', flag: '🇵🇱', name: 'Polski' },
    { code: 'cs', flag: '🇨🇿', name: 'Čeština' },
    { code: 'uk', flag: '🇺🇦', name: 'Українська' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'da', flag: '🇩🇰', name: 'Dansk' },
    { code: 'fi', flag: '🇫🇮', name: 'Suomi' },
    { code: 'no', flag: '🇳🇴', name: 'Norsk' },
    { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
    { code: 'el', flag: '🇬🇷', name: 'Ελληνικά' },
    { code: 'hu', flag: '🇭🇺', name: 'Magyar' },
    { code: 'ro', flag: '🇷🇴', name: 'Română' },
    { code: 'id', flag: '🇮🇩', name: 'Indonesia' },
    { code: 'bg', flag: '🇧🇬', name: 'Български' },
    { code: 'et', flag: '🇪🇪', name: 'Eesti' },
    { code: 'lt', flag: '🇱🇹', name: 'Lietuvių' },
    { code: 'lv', flag: '🇱🇻', name: 'Latviešu' },
    { code: 'sk', flag: '🇸🇰', name: 'Slovenčina' },
    { code: 'sl', flag: '🇸🇮', name: 'Slovenščina' },
    { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' }
  ];

  class HtmlLangBadgeGenerator {
    constructor() {
      this.backdrop = null;
      this.selectedLangs = [];
      this.badgeColor = '#2ea8ff';
      this.onInsert = null;
    }

    open(callback) {
      this.onInsert = callback;
      this.createModal();
      this.render();
    }

    createModal() {
      if (this.backdrop) return;

      this.backdrop = document.createElement('div');
      this.backdrop.className = 'html-langbadge-backdrop';
      this.backdrop.innerHTML = `
        <div class="html-langbadge-modal">
          <div class="html-langbadge-header">
            <div class="html-langbadge-title">🌐 Выбор языков</div>
            <button class="html-langbadge-close" type="button">×</button>
          </div>
          <div class="html-langbadge-body">
            <div class="html-langbadge-section">
              <label class="html-langbadge-label">Цвет плашки:</label>
              <div class="html-langbadge-color-input">
                <input type="color" class="html-langbadge-color-picker" value="${this.badgeColor}" />
                <input type="text" class="html-langbadge-color-value" value="${this.badgeColor}" />
              </div>
            </div>
            <div class="html-langbadge-section">
              <label class="html-langbadge-label">Языки сайта:</label>
              <div class="html-langbadge-langs-grid" id="htmlLangBadgeGrid"></div>
            </div>
          </div>
          <div class="html-langbadge-footer">
            <button class="html-langbadge-select-all" type="button">Выбрать все</button>
            <div class="html-langbadge-buttons">
              <button class="html-langbadge-btn" type="button" data-action="cancel">Отмена</button>
              <button class="html-langbadge-btn primary" type="button" data-action="apply">Применить</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.backdrop);
      this.attachEventHandlers();
    }

    render() {
      const grid = document.getElementById('htmlLangBadgeGrid');
      if (!grid) return;

      grid.innerHTML = LANGUAGES.map(lang => `
        <div class="html-langbadge-lang-item" data-lang="${lang.code}">
          <div class="html-langbadge-lang-checkbox"></div>
          <div class="html-langbadge-lang-text">${lang.flag} ${lang.name}</div>
        </div>
      `).join('');

      // Обработчики кликов на языки
      grid.querySelectorAll('.html-langbadge-lang-item').forEach(item => {
        item.addEventListener('click', () => {
          const lang = item.dataset.lang;
          if (this.selectedLangs.includes(lang)) {
            this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
            item.classList.remove('selected');
          } else {
            this.selectedLangs.push(lang);
            item.classList.add('selected');
          }
          this.updateApplyButton();
        });
      });
    }

    attachEventHandlers() {
      const modal = this.backdrop.querySelector('.html-langbadge-modal');
      const colorPicker = modal.querySelector('.html-langbadge-color-picker');
      const colorValue = modal.querySelector('.html-langbadge-color-value');
      const selectAllBtn = modal.querySelector('.html-langbadge-select-all');
      const closeBtn = modal.querySelector('.html-langbadge-close');
      const cancelBtn = modal.querySelector('[data-action="cancel"]');
      const applyBtn = modal.querySelector('[data-action="apply"]');

      // Цвет
      colorPicker.addEventListener('input', (e) => {
        this.badgeColor = e.target.value;
        colorValue.value = this.badgeColor;
      });

      colorValue.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (/^#[0-9a-f]{6}$/i.test(value)) {
          this.badgeColor = value;
          colorPicker.value = value;
        }
      });

      // Выбрать все
      selectAllBtn.addEventListener('click', () => {
        const allSelected = this.selectedLangs.length === LANGUAGES.length;
        
        if (allSelected) {
          // Снять все
          this.selectedLangs = [];
          modal.querySelectorAll('.html-langbadge-lang-item').forEach(item => {
            item.classList.remove('selected');
          });
        } else {
          // Выбрать все
          this.selectedLangs = LANGUAGES.map(l => l.code);
          modal.querySelectorAll('.html-langbadge-lang-item').forEach(item => {
            item.classList.add('selected');
          });
        }
        
        this.updateApplyButton();
      });

      // Закрытие
      closeBtn.addEventListener('click', () => this.close());
      cancelBtn.addEventListener('click', () => this.close());
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });

      // Применить
      applyBtn.addEventListener('click', () => {
        if (this.selectedLangs.length > 0) {
          this.generateAndInsertHtml();
        }
      });
    }

    updateApplyButton() {
      const applyBtn = this.backdrop.querySelector('[data-action="apply"]');
      if (applyBtn) {
        applyBtn.disabled = this.selectedLangs.length === 0;
      }
    }

    generateAndInsertHtml() {
      const langMap = {};
      LANGUAGES.forEach(l => {
        langMap[l.code] = { flag: l.flag, name: l.name };
      });

      // Первый язык как текущий
      const currentLang = this.selectedLangs[0];
      const currentFlag = langMap[currentLang].flag;
      const currentName = langMap[currentLang].name;

      // Опции для всех языков
      const optionsHtml = this.selectedLangs.map(lang => {
        const flag = langMap[lang].flag;
        const name = langMap[lang].name;
        const active = lang === currentLang ? ' active' : '';
        
        return `<a class="lang-option${active}" href="#" data-lang="${lang}">
          <span class="lang-flag">${flag}</span>
          <span class="lang-name">${name}</span>
        </a>`;
      }).join('');

      // Генерируем полный HTML с инлайн-стилями
      const html = `<style>
/* Языковой переключатель */
.lang-selector-wrapper { display: inline-block; position: relative; }
.lang-selector { position: relative; cursor: pointer; display: inline-block; }
.lang-chip {
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid ${this.badgeColor};
  background: #0f1723;
  color: #fff;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  user-select: none;
}
.lang-chip:hover {
  background: ${this.badgeColor};
  transform: scale(1.05);
}
.lang-flag { font-size: 20px; line-height: 1; }
.lang-name { font-weight: 500; }
.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: none;
  min-width: 220px;
  max-height: 280px;
  overflow-y: auto;
  background: rgba(12, 18, 26, 0.96);
  border: 1px solid rgba(46,168,255,0.25);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(46,168,255,0.2);
  backdrop-filter: blur(8px);
  z-index: 9999;
}
.lang-dropdown.show { display: block !important; }
.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: #e8f2ff;
  transition: background .2s ease;
  font-size: 14px;
}
.lang-option:hover { background: rgba(46, 168, 255, 0.12); }
.lang-option.active {
  background: ${this.badgeColor};
  color: #fff;
}
.lang-dropdown::-webkit-scrollbar { width: 8px; }
.lang-dropdown::-webkit-scrollbar-track { background: #0b111a; border-radius: 4px; }
.lang-dropdown::-webkit-scrollbar-thumb { background: #2a3f5f; border-radius: 4px; }
.lang-dropdown::-webkit-scrollbar-thumb:hover { background: #3a5070; }
</style>

<div class="lang-selector-wrapper">
  <div class="lang-selector" onclick="this.querySelector('.lang-dropdown').classList.toggle('show')">
    <div class="lang-chip">
      <span class="lang-flag">${currentFlag}</span>
      <span class="lang-name">${currentName}</span>
    </div>
    <div class="lang-dropdown">
      ${optionsHtml}
    </div>
  </div>
</div>

<script>
// Закрытие дропдауна при клике вне его
document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-selector')) {
    document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('show'));
  }
});

// Переключение языков (заглушка для демонстрации)
document.querySelectorAll('.lang-option').forEach(option => {
  option.addEventListener('click', function(e) {
    e.preventDefault();
    const lang = this.dataset.lang;
    
    // Обновляем активный язык
    this.closest('.lang-dropdown').querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
    this.classList.add('active');
    
    // Обновляем отображаемый язык
    const chip = this.closest('.lang-selector').querySelector('.lang-chip');
    chip.querySelector('.lang-flag').textContent = this.querySelector('.lang-flag').textContent;
    chip.querySelector('.lang-name').textContent = this.querySelector('.lang-name').textContent;
    
    // Закрываем дропдаун
    this.closest('.lang-dropdown').classList.remove('show');
    
    // Здесь должна быть логика переключения на другую версию страницы
    console.log('Переключение на язык:', lang);
  });
});
</script>`;

      // Вставляем в callback
      if (this.onInsert && typeof this.onInsert === 'function') {
        this.onInsert(html);
      }

      this.close();
    }

    close() {
      if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
      }
      this.backdrop = null;
      this.selectedLangs = [];
      this.badgeColor = '#2ea8ff';
    }
  }

  // Экспортируем в глобальный scope
  window.HtmlLangBadgeGenerator = HtmlLangBadgeGenerator;
})();