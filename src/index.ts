import { updateAllUI } from './uiManager';
import { setupTabScroll, handleScrollHighlight } from './events';

window.addEventListener('load', () => {
  updateAllUI();
  setupTabScroll();
  handleScrollHighlight();
});
