let allJobs = [];

async function loadJobs() {
  document.getElementById('loader').style.display = 'block';
  try {
    const response = await fetch('data/jobs.json');
    allJobs = await response.json();
    displayJobs(allJobs);
    populateDepartments();
  } catch (error) {
    console.error('Error fetching jobs:', error);
  } finally {
    document.getElementById('loader').style.display = 'none';
  }
}

function displayJobs(jobs) {
  const jobList = document.getElementById('jobList');
  jobList.innerHTML = '';

  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p>Department: ${job.department}</p>
      <p>Location: ${job.location}</p>
      <button onclick="openModal(${job.id})" aria-label="View details for ${job.title}">Apply</button>
    `;
    jobList.appendChild(jobCard);
  });
}

function populateDepartments() {
  const departments = [...new Set(allJobs.map(job => job.department))];
  const select = document.getElementById('departmentFilter');
  departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept;
    option.textContent = dept;
    select.appendChild(option);
  });
}

function filterJobs() {
  const department = document.getElementById('departmentFilter').value;
  const search = document.getElementById('titleSearch').value.toLowerCase();

  const filteredJobs = allJobs.filter(job => {
    const matchesDepartment = department === 'all' || job.department === department;
    const matchesSearch = job.title.toLowerCase().includes(search);
    return matchesDepartment && matchesSearch;
  });

  displayJobs(filteredJobs);
}

function openModal(jobId) {
  const job = allJobs.find(job => job.id === jobId);
  if (job) {
    document.getElementById('modalTitle').textContent = job.title;
    document.getElementById('modalDepartment').textContent = `Department: ${job.department}`;
    document.getElementById('modalLocation').textContent = `Location: ${job.location}`;
    document.getElementById('modalDescription').textContent = job.description;
    document.getElementById('applyLink').href = `https://acmecorp.com/apply/${job.id}`;
    document.getElementById('jobModal').style.display = 'flex';
  }
}

function closeModal() {
  document.getElementById('jobModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('jobModal');
  if (event.target === modal) {
    closeModal();
  }
};

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

window.onload = loadJobs;
