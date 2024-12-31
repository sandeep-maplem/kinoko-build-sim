interface WeaponOption {
  id: number;
  name: string;
  count: number;
}

const weaponOptions: WeaponOption[] = [
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
const WEAPON_QUERY_KEY = 'weapons';

function ensureWeaponList() {
  const weaponList = document.getElementById('weapons-option-list') as HTMLDivElement;
  if (!weaponList) {
    throw new Error('weaponList could not be found.');
  }
  return weaponList;
}

function renderWeapons() {
  const weaponList  = ensureWeaponList();
  weaponList.innerHTML = '';
  const totalCountDisplay = document.getElementById('weapons-total-count') as HTMLSpanElement;
  weaponOptions.forEach((option, index) => {
    const item = document.createElement('div');
    item.classList.add('weapons-option-item');

    item.innerHTML = `
      <span class="weapons-option-name">${option.name}</span>
      <div class="weapons-counter">
        <button data-index="${index}" data-action="decrease">-</button>
        <span>${option.count}</span>
        <button data-index="${index}" data-action="increase">+</button>
      </div>
    `;
    weaponList.appendChild(item);
  });
  totalCountDisplay.textContent = `${totalCount}`;
  updateURL();
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = weaponOptions
    .filter(option => option.count > 0)
    .map(option => `${option.id}:${option.count}`)
    .join(',');

  if (selectedIds) {
    params.set(WEAPON_QUERY_KEY, selectedIds);
  } else {
    params.delete(WEAPON_QUERY_KEY);
  }

  history.replaceState(null, '', '?' + params.toString());
}

function loadWeaponsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const weaponData = params.get(WEAPON_QUERY_KEY)?.split(',') || [];

  totalCount = 0;
  weaponData.forEach(entry => {
    const [idStr, countStr] = entry.split(':');
    const id = parseInt(idStr);
    const count = parseInt(countStr);
    const weapon = weaponOptions.find(option => option.id === id);

    if (weapon && !isNaN(count)) {
      const remaining = MAX_TOTAL - totalCount;
      const actualCount = Math.min(count, 10, remaining);

      weapon.count = actualCount;
      totalCount += actualCount;
    }
  });
}

export function updateWeaponsUI() {
  loadWeaponsFromURL();
  renderWeapons();
  const weaponList = ensureWeaponList();

  if (!weaponList.dataset.listener) {
    weaponList.addEventListener('click', (event) => {
      const target = event.target as HTMLButtonElement;
      const action = target.dataset.action;
      const index = Number(target.dataset.index);

      if (action && index !== undefined) {
        if (action === 'increase' && totalCount < MAX_TOTAL && weaponOptions[index].count < 10) {
          weaponOptions[index].count++;
          totalCount++;
        } else if (action === 'decrease' && weaponOptions[index].count > 0) {
          weaponOptions[index].count--;
          totalCount--;
        }
        renderWeapons();
      }
    });

    weaponList.dataset.listener = 'true';
  }
}

// for test
export function getWeaponState() {
  return {
    totalCount,
    weaponOptions: weaponOptions.map(option => ({ ...option }))
  };
}
