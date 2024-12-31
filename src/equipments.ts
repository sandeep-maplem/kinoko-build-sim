import { showResetModal } from './resetModal';

interface EquipmentOption {
  id: number;
  name: string;
  count: number;
}

const equipmentOptions: EquipmentOption[] = [
  { id: 1, name: '回復', count: 0 },
  { id: 2, name: '回避', count: 0 },
  { id: 3, name: 'ダウン', count: 0 },
  { id: 4, name: '連撃', count: 0 },
  { id: 5, name: '反撃', count: 0 },
  { id: 6, name: '会心', count: 0 },
  { id: 7, name: '仲間連撃', count: 0 },
  { id: 8, name: '仲間会心', count: 0 },
  { id: 9, name: '技能会心', count: 0 },
];

const MAX_TOTAL = 20;
let totalCount = 0;
const QUERY_KEY = 'equipments';

function ensureEquipmentList() {
  const equipmentList = document.getElementById('equipments-option-list') as HTMLDivElement;
  if (!equipmentList) {
    throw new Error('equipmentList could not be found.');
  }
  return equipmentList;
}

function renderEquipments() {
  const equipmentList  = ensureEquipmentList();
  equipmentList.innerHTML = '';
  const totalCountDisplay = document.getElementById('equipments-total-count') as HTMLSpanElement;
  equipmentOptions.forEach((option, index) => {
    const item = document.createElement('div');
    item.classList.add('equipments-option-item');

    item.innerHTML = `
      <span class="equipments-option-name">${option.name}</span>
      <div class="equipments-counter">
        <button data-index="${index}" data-action="decrease">-</button>
        <span>${option.count}</span>
        <button data-index="${index}" data-action="increase">+</button>
      </div>
    `;
    equipmentList.appendChild(item);
  });
  totalCountDisplay.textContent = `${totalCount}`;
  updateURL();
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = equipmentOptions
    .filter(option => option.count > 0)
    .map(option => `${option.id}:${option.count}`)
    .join(',');

  if (selectedIds) {
    params.set(QUERY_KEY, selectedIds);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadEquipmentsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const equipmentData = params.get(QUERY_KEY)?.split(',') || [];

  equipmentOptions.forEach(option => {
    option.count = 0;
  });

  totalCount = 0;
  equipmentData.forEach(entry => {
    const [idStr, countStr] = entry.split(':');
    const id = parseInt(idStr);
    const count = parseInt(countStr);
    const equipment = equipmentOptions.find(option => option.id === id);

    if (equipment && !isNaN(count)) {
      const remaining = MAX_TOTAL - totalCount;
      const actualCount = Math.min(count, 10, remaining);

      equipment.count = actualCount;
      totalCount += actualCount;
    }
  });
}

export function updateEquipmentsUI() {
  loadEquipmentsFromURL();
  renderEquipments();
  const equipmentList = ensureEquipmentList();

  if (!equipmentList.dataset.listener) {
    equipmentList.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      const action = target.dataset.action;
      const index = Number(target.dataset.index);

      if (action && index !== undefined) {
        if (action === 'increase' && totalCount < MAX_TOTAL && equipmentOptions[index].count < 10) {
          equipmentOptions[index].count++;
          totalCount++;
        } else if (action === 'decrease' && equipmentOptions[index].count > 0) {
          equipmentOptions[index].count--;
          totalCount--;
        }
        renderEquipments();
      }
    });

    equipmentList.dataset.listener = 'true';
  }
}

const resetEquipmentsBtn = document.getElementById('reset-equipments-btn') as HTMLButtonElement;

resetEquipmentsBtn.addEventListener('click', () => {
  showResetModal(QUERY_KEY, '装備');
});

// for test
export function getEquipmentState() {
  return {
    totalCount,
    equipmentOptions: equipmentOptions.map(option => ({ ...option }))
  };
}
