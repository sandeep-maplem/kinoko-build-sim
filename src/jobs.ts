interface Job {
  id: number;
  name: string;
  palLimit: number;
}

const jobs: Job[] = [
  { id: 1, name: '武聖', palLimit: 5 },
  { id: 2, name: '戦神', palLimit: 5 },
  { id: 3, name: '聖狩', palLimit: 5 },
  { id: 4, name: '羽皇', palLimit: 5 },
  { id: 5, name: '先知', palLimit: 5 },
  { id: 6, name: '魔王', palLimit: 5 },
  { id: 7, name: '獣王', palLimit: 6 },
  { id: 8, name: '霊尊', palLimit: 6 }
];
const QUERY_KEY = 'job';

let selectedJob: Job = jobs[0];
const jobRadios = document.querySelectorAll('input[name="job"]');

jobRadios.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const selectedRadio = event.target as HTMLInputElement;
    const selectedId = parseInt(selectedRadio.value, 10);
    selectJob(selectedId);
  });
});

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  params.set(QUERY_KEY, String(selectedJob.id));
  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function selectJob(jobId: number) {
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    selectedJob = job;
    updateURL();
  }
}

function loadJobFromURL() {
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get(QUERY_KEY) || '1', 10);
  const job = jobs.find(j => j.id === jobId);

  if (job) {
    selectedJob = job;
    updateRadioSelection(jobId);
  }
}

function updateRadioSelection(jobId: number) {
  const selectedRadio = document.querySelector(`input[name="job"][value="${jobId}"]`) as HTMLInputElement | null;
  if (selectedRadio) {
    selectedRadio.checked = true;
  }
}

export function updateJobsUI() {
  loadJobFromURL();
}

export function getpalLimit(): number {
  return selectedJob.palLimit;
}