import { updateJobsUI } from './jobs';
import { updateEquipmentsUI } from './equipments';
import { updateSkillsUI } from './skills';

export function updateAllUI() {
  updateJobsUI();
  updateEquipmentsUI();
  updateSkillsUI();
}
