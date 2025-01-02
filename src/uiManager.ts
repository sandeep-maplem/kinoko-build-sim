import { initJobsUI } from './jobs';
import { initEquipmentsUI } from './equipments';
import { initSkillsUI } from './skills';
import { initPalsUI } from './pals';
import { initRelicsUI } from './relics';

export function updateAllUI() {
  initJobsUI();
  initEquipmentsUI();
  initSkillsUI();
  initPalsUI();
  initRelicsUI();
}
