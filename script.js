// Benchmark comparisons and self-improvement measurements from the submitted paper.
const tabs = [...document.querySelectorAll('[data-benchmark]')];
function selectBenchmark(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBenchmark(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectBenchmark(tabs[next], true); }
  });
});
if (tabs.length) selectBenchmark(tabs[0]);
document.querySelectorAll('.headline-results a').forEach((link, index) => {
  link.addEventListener('click', () => selectBenchmark(tabs[index]));
});

function renderChart(data, metric) {
  const values = data[metric];
  const xs = values.map((_, i) => 48 + i * 352 / (values.length - 1));
  const ys = values.map(value => 217 - value / data.max * 166);
  const color = metric === 'success' ? '#09848b' : '#5b32b4';
  const label = metric === 'success' ? 'Success rate (%)' : 'Score';
  const description = `${data.title} ${label}: ${values.map((v, i) => `${data.round[i]} ${v.toFixed(2)}`).join(', ')}`;
  let svg = `<svg viewBox="0 0 450 285" role="img" aria-label="${description}"><text x="48" y="19" fill="#666b78" font-size="12">${label}</text>`;
  for (let value = 0; value <= data.max; value += 20) {
    const y = 217 - value / data.max * 166;
    svg += `<line x1="48" y1="${y}" x2="400" y2="${y}" stroke="#e5e8ef"/><text x="35" y="${y + 4}" text-anchor="end" fill="#777d89" font-size="12">${value}</text>`;
  }
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  svg += `<polygon points="48,217 ${points} 400,217" fill="${color}" fill-opacity="0.06"/><polyline points="${points}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  values.forEach((value, i) => {
    svg += `<circle cx="${xs[i]}" cy="${ys[i]}" r="5" fill="white" stroke="${color}" stroke-width="2.5"/><text x="${xs[i]}" y="${ys[i] - 14}" text-anchor="middle" fill="${color}" font-size="14" font-weight="700">${value.toFixed(2)}</text><text x="${xs[i]}" y="242" text-anchor="middle" fill="#666b78" font-size="11">${data.round[i]}</text>`;
  });
  return `${svg}</svg>`;
}
document.querySelectorAll('[data-chart]').forEach(card => {
  const data = JSON.parse(card.dataset.chart);
  card.querySelectorAll('[data-metric]').forEach(button => button.addEventListener('click', () => {
    card.querySelectorAll('[data-metric]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    card.querySelector('.chart-graphic').innerHTML = renderChart(data, button.dataset.metric);
  }));
});
