/**
 * 都立新宿高校 米国同窓会 2026 - メインスクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. モバイルナビゲーションの開閉
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // リンククリック時にメニューを閉じる
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. ギャラリーのモーダル（Lightbox）機能
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-caption-title')?.textContent || '';
      const caption = item.querySelector('.gallery-caption-sub')?.textContent || '';

      if (modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || title;
        if (modalTitle) modalTitle.textContent = title;
        if (modalCaption) modalCaption.textContent = caption;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // スクロール防止
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // 3. ギャラリーのカテゴリ絞り込み（フィルタリング）
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. メッセージ投稿（ブラウザ上でのリアルタイム追加デモ）
  const messageForm = document.getElementById('messageForm');
  const messagesGrid = document.getElementById('messagesGrid');

  if (messageForm && messagesGrid) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('msgName');
      const gradInput = document.getElementById('msgGrad');
      const textInput = document.getElementById('msgText');

      const name = nameInput.value.trim();
      const grad = gradInput.value.trim() || '同窓生';
      const text = textInput.value.trim();

      if (!name || !text) {
        alert('お名前とメッセージを入力してください。');
        return;
      }

      // 新しいメッセージカードを作成して追加
      const newCard = document.createElement('div');
      newCard.className = 'message-card';
      newCard.style.animation = 'fadeIn 0.5s ease';

      const initial = name.charAt(0);
      newCard.innerHTML = `
        <div class="message-quote-icon">“</div>
        <p class="message-text">${escapeHtml(text)}</p>
        <div class="message-author">
          <div class="author-avatar">${escapeHtml(initial)}</div>
          <div>
            <h4 class="author-name">${escapeHtml(name)}</h4>
            <p class="author-meta">${escapeHtml(grad)}</p>
          </div>
        </div>
      `;

      messagesGrid.insertBefore(newCard, messagesGrid.firstChild);

      // フォームをリセット
      messageForm.reset();
      alert('メッセージが追加されました！（※HTMLファイルを保存・共有するには、HTMLソースに追記してください）');
    });
  }

  // 5. サイトURLコピー機能
  const copyBtn = document.getElementById('copyUrlBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const urlText = window.location.href;
      navigator.clipboard.writeText(urlText).then(() => {
        const origText = copyBtn.textContent;
        copyBtn.textContent = 'コピー完了！';
        copyBtn.style.backgroundColor = '#16a34a';
        setTimeout(() => {
          copyBtn.textContent = origText;
          copyBtn.style.backgroundColor = '';
        }, 2000);
      }).catch(() => {
        alert('URLのコピーに失敗しました。アドレスバーからコピーしてください。');
      });
    });
  }

  // HTMLエスケープヘルパー
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
