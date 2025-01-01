import { initJobsUI } from './jobs';
import { initEquipmentsUI } from './equipments';
import { initSkillsUI } from './skills';
import { initPalsUI } from './pals';

export function updateAllUI() {
  initJobsUI();
  initEquipmentsUI();
  initSkillsUI();
  initPalsUI();
}
