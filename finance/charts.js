// Initialize default data with dates
window.dataArr = [
	{ date: '2024-01-01', sales: 0 },
	{ date: '2024-02-01', sales: 0 },
	{ date: '2024-03-01', sales: 0 },
	{ date: '2024-04-01', sales: 0 },
	{ date: '2024-05-01', sales: 0 },
	{ date: '2024-06-01', sales: 0 }
];

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	const ctx = document.getElementById('financialChart').getContext('2d');
	window.myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dataArr.map(row => new Date(row.date).toLocaleDateString('ru-RU')),
			datasets: [{
				label: 'Сумма продаж',
				data: dataArr.map(row => row.sales),
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.1,
				fill: true
			}]
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Сумма продаж (₽)'
					}
				},
				x: {
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
							day: 'dd.MM.yyyy'
						}
					},
					title: {
						display: true,
						text: 'Дата'
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: 'Финансовый график'
				},
				legend: {
					position: 'top'
				}
			}
		}
	});

	// Add event listener for file input
	document.getElementById('excelFileInput').addEventListener('change', handleFileSelect);
});

// Handle file selection
function handleFileSelect(event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function(e) {
		const data = new Uint8Array(e.target.result);
		const workbook = XLSX.read(data, { type: 'array' });
		
		// Get first sheet
		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];
		
		// Convert to JSON
		const jsonData = XLSX.utils.sheet_to_json(worksheet);
		
		// Transform data to required format
		const chartData = jsonData.map(row => {
			const keys = Object.keys(row);
			return {
				date: String(row[keys[0]]), // First column as date
				sales: parseFloat(row[keys[1]]) // Second column as sales value
			};
		}).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

		// Update chart with new data
		updateChart(chartData);
	};
	reader.readAsArrayBuffer(file);
}

// Update chart with new data
function updateChart(newData) {
	window.dataArr = newData;
	window.myChart.data.labels = newData.map(row => new Date(row.date).toLocaleDateString('ru-RU'));
	window.myChart.data.datasets[0].data = newData.map(row => row.sales);
	window.myChart.update();
}

// Generate random data for demonstration
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('generateChart').addEventListener('click', function() {
		if (window.myChart) {
			const newData = window.dataArr.map(item => ({
				date: item.date,
				sales: Math.floor(Math.random() * 100000) + 10000
			}));
			updateChart(newData);
		}
	});
});