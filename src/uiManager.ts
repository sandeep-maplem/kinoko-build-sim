import { initJobsUI } from './jobs';
import { updateEquipmentsUI } from './equipments';
import { updateSkillsUI } from './skills';
import { initPalsUI } from './pals';

export function updateAllUI() {
  initJobsUI();
  updateEquipmentsUI();
  updateSkillsUI();
  initPalsUI();
}
