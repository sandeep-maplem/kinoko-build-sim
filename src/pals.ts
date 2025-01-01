import { pals, Pal } from './consts';
import { getPalLimit } from './jobs';
import { showResetModal } from './resetModal';
import { addSafeEventListener } from './helper';

const QUERY_KEY = 'pals';

function removePal(slot: number) {
    const slotElement = document.querySelector(`.pal-slot[data-slot="${slot}"]`) as HTMLDivElement;

    if (slotElement) {
        const palId = slotElement.dataset.palId;
        slotElement.removeAttribute('data-pal-id');
        slotElement.innerHTML = '<span class="pal-icon empty"></span>';
    }

    renderPalSelection();
    updateURL();
}

function togglePalSelection(pal: Pal) {
    const existingSlot = document.querySelector(
        `.pal-slot[data-pal-id="${pal.id}"]`
    ) as HTMLDivElement | null;

    if (existingSlot) {
        const slotNumber = parseInt(existingSlot.dataset.slot || '1', 10);
        removePal(slotNumber);
        updateURL();
    } else {
        const emptySlot = document.querySelector(
            '.pal-slot:not([data-pal-id])'
        ) as HTMLDivElement;

        if (emptySlot) {
            emptySlot.dataset.palId = String(pal.id);
            emptySlot.innerHTML = '';
            const palImage = document.createElement('img');
            palImage.src = pal.icon;
            palImage.alt = pal.name;
            palImage.classList.add('pal-icon', 'selected');
            palImage.dataset.palId = String(pal.id);

            addSafeEventListener(palImage, 'click', () => {
                const slot = parseInt(emptySlot.dataset.slot || '1', 10);
                removePal(slot);
                updateURL();
            });

            emptySlot.appendChild(palImage);
            updateURL();
            renderPalSelection();
        }
    }
}

function renderPalSelection() {
    const palsList = document.getElementById('pals-list') as HTMLDivElement;
    palsList.innerHTML = '';

    pals.forEach(pal => {
        const palElement = document.createElement('img');
        palElement.src = pal.icon;
        palElement.alt = pal.name;
        palElement.classList.add('pal-icon');
        palElement.dataset.palId = String(pal.id);

        addSafeEventListener(palElement, 'click', () => togglePalSelection(pal));

        palsList.appendChild(palElement);
    });

}

function renderEmptySelectedPals() {
    const selectedPalsList = document.getElementById('selected-pals') as HTMLDivElement;
    selectedPalsList.innerHTML = '';

    const palLimit = getPalLimit();
    for (let i = 0; i < palLimit; i++) {
        const palElement = document.createElement('div');
        palElement.classList.add('pal-slot');
        palElement.dataset.slot = String(i);
        palElement.innerHTML = '<span class="pal-icon empty"></span>';
        selectedPalsList.appendChild(palElement);
    }
}

function updateURL() {
    const params = new URLSearchParams(window.location.search);

    const palString = Array.from(document.querySelectorAll('.pal-slot'))
        .filter(slot => slot.hasAttribute('data-pal-id'))
        .map(slot => {
            const slotNum = slot.getAttribute('data-slot');
            const palId = slot.getAttribute('data-pal-id');
            return `${slotNum}:${palId}`;
        })
        .join(',');

    if (palString) {
        params.set(QUERY_KEY, palString);
    } else {
        params.delete(QUERY_KEY);
    }

    const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
    history.replaceState(null, '', newPath);
}

function loadPalsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const palString = params.get(QUERY_KEY);

    renderEmptySelectedPals();

    if (palString) {
        const pairs = palString.split(',').map(pair => pair.split(':'));

        pairs.forEach(([slotStr, palIdStr]) => {
            const slot = document.querySelector(`[data-slot="${slotStr}"]`) as HTMLDivElement;
            const pal = pals.find(p => p.id === parseInt(palIdStr, 10));

            if (slot && pal) {
                slot.dataset.palId = String(pal.id);
                slot.innerHTML = '';
                const palImage = document.createElement('img');
                palImage.src = pal.icon;
                palImage.alt = pal.name;
                palImage.classList.add('pal-icon', 'selected');
                palImage.dataset.palId = String(pal.id);

                addSafeEventListener(palImage, 'click', () => {
                    const slotNumber = parseInt(slot.dataset.slot || '1', 10);
                    removePal(slotNumber);
                    updateURL();
                });

                slot.appendChild(palImage);
            }
        });
        updateURL();
    }
}

export function updatePalLimitOnJobChange() {
    const selectedPalsList = document.getElementById('selected-pals') as HTMLDivElement;
    const currentSlots = selectedPalsList.querySelectorAll('.pal-slot').length;
    const newLimit = getPalLimit();

    if (currentSlots > newLimit) {
        for (let i = newLimit; i < currentSlots; i++) {
            const slot = selectedPalsList.querySelector(`[data-slot="${i}"]`);
            if (slot) {
                slot.remove();
            }
        }
        renderPalSelection();
        updateURL();
    }
    else if (currentSlots < newLimit) {
        for (let i = currentSlots; i < newLimit; i++) {
            const palElement = document.createElement('div');
            palElement.classList.add('pal-slot');
            palElement.dataset.slot = String(i);
            palElement.innerHTML = '<span class="pal-icon empty"></span>';
            selectedPalsList.appendChild(palElement);
        }
    }
}

export function initPalsUI() {
    loadPalsFromURL();
    renderPalSelection();

    const resetPalsBtn = document.getElementById('reset-pals-btn') as HTMLButtonElement;
    addSafeEventListener(resetPalsBtn, 'click', () => {
        showResetModal(QUERY_KEY, '仲間');
    });
}

// For test
export function getPalState() {
    const selectedPals: Record<number, string | null> = {};

    document.querySelectorAll('.pal-slot[data-pal-id]').forEach(slot => {
        const slotNumber = parseInt(slot.getAttribute('data-slot')!, 10);
        const palId = slot.getAttribute('data-pal-id');
        selectedPals[slotNumber] = palId;
    });

    document.querySelectorAll('.pal-slot:not([data-pal-id])').forEach(slot => {
        const slotNumber = parseInt(slot.getAttribute('data-slot')!, 10);
        selectedPals[slotNumber] = null;
    });

    return {
        selectedPals,
        totalCount: Object.values(selectedPals).filter(id => id !== null).length
    };
}

