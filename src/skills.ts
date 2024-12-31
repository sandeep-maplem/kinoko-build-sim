import { showResetModal } from './resetModal';

interface Skill {
  id: number;
  name: string;
  icon: string;
}

// スキルデータ
const skills: Skill[] = [
  { id: 1, name: '胞子爆弾', icon: 'icons/skills/1.jpg' },
  { id: 2, name: '菌茸頭打', icon: 'icons/skills/2.jpg' },
  { id: 3, name: '胞子連撃', icon: 'icons/skills/3.jpg' },
  { id: 4, name: '巨石衝撃', icon: 'icons/skills/4.jpg' },
  { id: 5, name: 'トゲ茂み', icon: 'icons/skills/5.jpg' },
  { id: 6, name: 'キノ先駆', icon: 'icons/skills/6.jpg' },
  { id: 7, name: 'ツタ縛り', icon: 'icons/skills/7.jpg' },
  { id: 8, name: '疾駆菌茸', icon: 'icons/skills/8.jpg' },
  { id: 9, name: '蜘蛛の巣', icon: 'icons/skills/9.jpg' },
  { id: 10, name: '落パイン', icon: 'icons/skills/10.jpg' },
  { id: 11, name: '貝恩返し', icon: 'icons/skills/11.jpg' },
  { id: 12, name: 'ツタ繁茂', icon: 'icons/skills/12.jpg' },
  { id: 13, name: '蝙蝠行方', icon: 'icons/skills/13.jpg' },
  { id: 14, name: '大地回復', icon: 'icons/skills/14.jpg' },
  { id: 15, name: '菌バリア', icon: 'icons/skills/15.jpg' },
  { id: 16, name: 'ドリ爆弾', icon: 'icons/skills/16.jpg' },
  { id: 17, name: '反則打撃', icon: 'icons/skills/17.jpg' },
  { id: 18, name: '速度暖慢', icon: 'icons/skills/18.jpg' },
  { id: 19, name: 'コイン爆弾', icon: 'icons/skills/19.jpg' },
  { id: 20, name: 'スライ弾', icon: 'icons/skills/20.jpg' },
  { id: 21, name: '流星落弾', icon: 'icons/skills/21.jpg' },
  { id: 22, name: '武装解除', icon: 'icons/skills/22.jpg' },
  { id: 23, name: '目眩失神', icon: 'icons/skills/23.jpg' },
  { id: 24, name: '煙幕弾', icon: 'icons/skills/24.jpg' },
  { id: 25, name: '無常狩命', icon: 'icons/skills/25.jpg' },
  { id: 26, name: '英魂降臨', icon: 'icons/skills/26.jpg' },
  { id: 27, name: '狂風通道', icon: 'icons/skills/27.jpg' },
  { id: 28, name: '稲妻奇襲', icon: 'icons/skills/28.jpg' },
  { id: 29, name: '利刃貫通', icon: 'icons/skills/29.jpg' },
  { id: 30, name: '分身攻撃', icon: 'icons/skills/30.jpg' },
  { id: 31, name: '百斬千鎖', icon: 'icons/skills/31.jpg' },
  { id: 32, name: '風神の矢', icon: 'icons/skills/32.jpg' },
  { id: 33, name: '血月降臨', icon: 'icons/skills/33.jpg' },
  { id: 34, name: '竜吟双声', icon: 'icons/skills/34.jpg' },
  { id: 35, name: '天下の罠', icon: 'icons/skills/35.jpg' },
  { id: 36, name: 'タロット星陣', icon: 'icons/skills/36.jpg' },
  { id: 37, name: '鳶蝶入夢', icon: 'icons/skills/37.jpg' },
  { id: 38, name: '祖神の意思', icon: 'icons/skills/38.jpg' }
];

const selectedSkills: Skill[] = [];
const MAX_SELECTED = 5;
const QUERY_KEY = 'skills';

function renderSkills() {
  const skillsList = document.getElementById('skills-list') as HTMLDivElement;
  skillsList.innerHTML = '';
  skills.forEach(skill => {
    const skillElement = document.createElement('img');
    skillElement.src = skill.icon;
    skillElement.classList.add('skill-icon');
    skillElement.dataset.id = String(skill.id);
    skillElement.alt = skill.name;

    skillElement.addEventListener('click', () => toggleSkill(skill));
    skillsList.appendChild(skillElement);
  });
}

function renderSelectedSkills() {
  const selectedSkillsList = document.getElementById('selected-skills') as HTMLDivElement;
  selectedSkillsList.innerHTML = '';

  selectedSkills.forEach(skill => {
    const skillElement = document.createElement('img');
    skillElement.src = skill.icon;
    skillElement.classList.add('skill-icon', 'selected');
    skillElement.dataset.id = String(skill.id);
    skillElement.alt = skill.name;

    skillElement.addEventListener('click', () => removeSkill(skill));
    selectedSkillsList.appendChild(skillElement);
  });

  updateSkillSelectionUI();
  updateURL();
}

function toggleSkill(skill: Skill) {
  const exists = selectedSkills.some(s => s.id === skill.id);

  if (exists) {
    removeSkill(skill);
  } else if (selectedSkills.length < MAX_SELECTED) {
    selectedSkills.push(skill);
    renderSelectedSkills();
  }
}

function removeSkill(skill: Skill) {
  const index = selectedSkills.findIndex(s => s.id === skill.id);
  if (index > -1) {
    selectedSkills.splice(index, 1);
    renderSelectedSkills();
  }
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const selectedIds = selectedSkills.map(skill => skill.id).join(',');
  if(selectedIds) {
    params.set(QUERY_KEY, selectedIds);
  }else {
    params.delete(QUERY_KEY);
  }
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function updateSkillSelectionUI() {
  document.querySelectorAll('.skill-icon').forEach(icon => {
    const id = Number(icon.dataset.id);
    if (selectedSkills.some(s => s.id === id)) {
      icon.classList.add('selected');
    } else {
      icon.classList.remove('selected');
    }
  });
}

function loadSkillsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const skillIds = params.get(QUERY_KEY)?.split(',').map(id => parseInt(id)) || [];
  selectedSkills.length = 0;

  skillIds.forEach(id => {
    if (selectedSkills.length < MAX_SELECTED) {
      const skill = skills.find(s => s.id === id);
      if (skill) {
        selectedSkills.push(skill);
      }
    }
  });

  renderSelectedSkills();
}

export function updateSkillsUI() {
  loadSkillsFromURL();
  renderSkills();
}

const resetSkillsBtn = document.getElementById('reset-skills-btn') as HTMLButtonElement;

resetSkillsBtn.addEventListener('click', () => {
  showResetModal(QUERY_KEY, '技能');
});
