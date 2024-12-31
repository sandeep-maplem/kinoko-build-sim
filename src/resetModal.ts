import { updateAllUI } from './uiManager';

let resetTargetKey: string | null = null;

const modal = document.createElement('div');
modal.innerHTML = `
  <div class="modal-content">
    <p>本当にリセットしますか？</p>
    <button id="confirm-yes">はい</button>
    <button id="confirm-no">キャンセル</button>
  </div>
`;
modal.classList.add('modal');
document.body.appendChild(modal);

const confirmYesBtn = modal.querySelector('#confirm-yes') as HTMLButtonElement;
const confirmNoBtn = modal.querySelector('#confirm-no') as HTMLButtonElement;

export function showResetModal(queryKey: string, itemName: string) {
  resetTargetKey = queryKey;
  modal.querySelector('p')!.textContent = `${itemName}をリセットしますか？`;
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  resetTargetKey = null;
}

function resetQueryParameter() {
  if (resetTargetKey) {
    const params = new URLSearchParams(window.location.search);
    params.delete(resetTargetKey);
    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
  }
}

confirmYesBtn.addEventListener('click', () => {
  resetQueryParameter();
  updateAllUI();
  closeModal();
});

confirmNoBtn.addEventListener('click', closeModal);
