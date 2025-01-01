import { updateEquipmentsUI, getEquipmentState } from './equipments';

describe('loadEquipmentsFromURL', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="equipments-option-list"></div>
      <span id="equipments-total-count">0</span>
      <button id="reset-equipments-btn" class="reset-btn" title="装備をリセット">↺</button>
    `;
  });

  test('クエリから正しく武器がロードされる', () => {
    window.history.pushState({}, '', '?equipments=1:5,2:10');
    updateEquipmentsUI();

    const state = getEquipmentState();
    expect(state.equipmentOptions[0].count).toBe(5);
    expect(state.equipmentOptions[1].count).toBe(10);
    expect(state.totalCount).toBe(15);
  });

  test('合計がMAX_TOTALを超えない', () => {
    window.history.pushState({}, '', '?equipments=1:15,2:10');
    updateEquipmentsUI();

    const state = getEquipmentState();
    expect(state.equipmentOptions[0].count).toBe(10);
    expect(state.equipmentOptions[1].count).toBe(10);
    expect(state.totalCount).toBe(20);
  });

  test('不正なIDは無視される', () => {
    window.history.pushState({}, '', '?equipments=999:5,1:3');
    updateEquipmentsUI();

    const state = getEquipmentState();
    expect(state.equipmentOptions[0].count).toBe(3);
    expect(state.totalCount).toBe(3);
  });
});
