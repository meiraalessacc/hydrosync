const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });


  const steps = document.querySelectorAll('.step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 150);
      }
    });
  }, { threshold: 0.2 });
  steps.forEach(s => observer.observe(s));

  const stats = document.querySelectorAll('.stat-val');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp .6s ease both';
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => statObs.observe(s));



  //simulador

    // Estado
  let area = 1.0;
  let culturaSelected = '';
  let currentStep = 1;

  function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    event.target.classList.add('active');
    if (name === 'dashboard') drawChart();
  }

  function selectCultura(el, nome) {
    document.querySelectorAll('.cultura-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    culturaSelected = nome;
  }

  function changeArea(delta) {
    area = Math.max(0.5, Math.round((area + delta) * 10) / 10);
    document.getElementById('area-display').textContent = area.toFixed(1).replace('.', ',') + ' hectare' + (area > 1 ? 's' : '');
  }

  function nextStep(n) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < n) s.classList.add('done');
      if (i + 1 === n) s.classList.add('active');
    });
    document.getElementById('sc-' + n).classList.add('active');
    currentStep = n;
  }

  function calcularSimulacao() {
    const cult = culturaSelected || 'Tomate';
    const areaTxt = area.toFixed(1).replace('.', ',') + ' hectare' + (area > 1 ? 's' : '');
    const regiao = document.getElementById('regiao').value;
    const solo = document.getElementById('solo').value;

    const agua = Math.round(12450 * area);
    const economia = 42;
    const prod = (28.5 * area).toFixed(1);
    const qty = Math.round(180 * area);

    document.getElementById('r-cultura').textContent = cult;
    document.getElementById('r-area').textContent = areaTxt;
    document.getElementById('r-regiao').textContent = regiao;
    document.getElementById('r-solo').textContent = solo;
    document.getElementById('r-agua').textContent = agua.toLocaleString('pt-BR');
    document.getElementById('r-economia').textContent = economia + '%';
    document.getElementById('r-prod').textContent = prod;
    document.getElementById('r-qty').textContent = qty + ' L';

    nextStep(4);
  }

  function iniciarSimulacao() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); showDash(); }, 2000);
  }

  function showDash() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('page-dashboard').classList.add('active');
    document.querySelectorAll('nav button')[2].classList.add('active');
    drawChart();
  }

  function drawChart() {
    const existing = Chart.getChart('soilChart');
    if (existing) existing.destroy();

    const labels = ['-48h', '-42h', '-36h', '-30h', '-24h', '-18h', '-12h', '-6h', 'Agora'];
    const data = [58, 52, 45, 48, 42, 38, 34, 30, 32];

    new Chart(document.getElementById('soilChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: '#1d9e75',
          backgroundColor: 'rgba(29,158,117,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1d9e75',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, grid: { color: '#e8f0e8' }, ticks: { font: { family: 'Outfit' } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  }