import { updateWeaponsUI, getWeaponState } from './weapons';

describe('loadWeaponsFromURL', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="weapons-option-list"></div>
      <span id="weapons-total-count">0</span>
    `;
  });

  test('クエリから正しく武器がロードされる', () => {
    window.history.pushState({}, '', '?weapons=1:5,2:10');
    updateWeaponsUI();

    const state = getWeaponState();
    expect(state.weaponOptions[0].count).toBe(5);
    expect(state.weaponOptions[1].count).toBe(10);
    expect(state.totalCount).toBe(15);
  });

  test('合計がMAX_TOTALを超えない', () => {
    window.history.pushState({}, '', '?weapons=1:15,2:10');
    updateWeaponsUI();

    const state = getWeaponState();
    expect(state.weaponOptions[0].count).toBe(10);
    expect(state.weaponOptions[1].count).toBe(10);
    expect(state.totalCount).toBe(20);
  });

  test('不正なIDは無視される', () => {
    window.history.pushState({}, '', '?weapons=999:5,1:3');
    updateWeaponsUI();

    const state = getWeaponState();
    expect(state.weaponOptions[0].count).toBe(3);
    expect(state.totalCount).toBe(3);
  });
});
