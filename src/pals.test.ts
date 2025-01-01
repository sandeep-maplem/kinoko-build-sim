import { initPalsUI, getPalState } from './pals';
import { pals } from './consts';

describe('loadPalsFromURL', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="jobs-option-container" data-selected-job="1"></div>
            <div id="pals-list"></div>
            <div id="selected-pals"></div>
            <button id="reset-pals-btn" class="reset-btn" title="仲間をリセット">↺</button>
    `;
        initPalsUI();
    });

    test('クエリから正しく仲間がロードされる', () => {
        window.history.pushState({}, '', '?pals=0:1,1:2');
        initPalsUI();

        const state = getPalState();
        expect(state.selectedPals[0]).toBe(String(pals[0].id));
        expect(state.selectedPals[1]).toBe(String(pals[1].id));
        expect(state.totalCount).toBe(2);
    });

    test('スロットの最大数を超えない', () => {
        const palLimit = 5;
        window.history.pushState({}, '', '?pals=0:1,1:2,2:3,3:4,4:5,5:6');
        initPalsUI();

        const state = getPalState();
        expect(Object.values(state.selectedPals).length).toBe(palLimit);
        expect(state.totalCount).toBe(palLimit);
    });

    test('存在しない仲間のIDはURLから自動で削除される', () => {
        window.history.pushState({}, '', '?pals=0:999,1:1');
        initPalsUI();

        const state = getPalState();
        expect(state.selectedPals[0]).toBeNull();
        expect(state.selectedPals[1]).toBe(String(pals[0].id));

        const updatedParams = new URLSearchParams(window.location.search);
        expect(updatedParams.get('pals')).toBe('1:1');
    });
});
