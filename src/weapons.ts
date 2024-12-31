interface WeaponOption {
  name: string;
  count: number;
}

const weaponOptions: WeaponOption[] = [
  { name: '回復', count: 0 },
  { name: '回避', count: 0 },
  { name: 'ダウン', count: 0 },
  { name: '連撃', count: 0 },
  { name: '反撃', count: 0 },
  { name: '会心', count: 0 },
  { name: '仲間連撃', count: 0 },
  { name: '仲間会心', count: 0 },
  { name: '技能会心', count: 0 },
];

const MAX_TOTAL = 20;
let totalCount = 0;

const weaponList = document.getElementById('weapons-option-list') as HTMLDivElement;
const totalCountDisplay = document.getElementById('weapons-total-count') as HTMLSpanElement;

export function updateWeaponsUI() {
  weaponList.innerHTML = '';
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
}

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
    updateWeaponsUI();
  }
});

updateWeaponsUI();
