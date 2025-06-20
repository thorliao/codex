const energyData = [];
const moodData = [];

function addRecord() {
    const timestamp = document.getElementById('timestamp').value;
    const energy = parseInt(document.getElementById('energy').value);
    const mood = parseInt(document.getElementById('mood').value);
    if (!timestamp) {
        alert('請填入時間');
        return;
    }
    const time = new Date(timestamp);
    energyData.push({time, value: energy});
    moodData.push({time, value: mood});
    updateCharts();
}

document.getElementById('add-btn').addEventListener('click', addRecord);

function groupByPeriod(data, period) {
    const result = {};
    data.forEach(({time, value}) => {
        let key;
        switch (period) {
            case 'year':
                key = time.getFullYear();
                break;
            case 'month':
                key = `${time.getFullYear()}-${time.getMonth()+1}`;
                break;
            case 'day':
                key = time.toISOString().slice(0,10);
                break;
            default:
                key = time.toISOString();
        }
        if (!result[key]) result[key] = [];
        result[key].push(value);
    });
    return Object.keys(result).sort().map(k => ({label: k, value: average(result[k])}));
}

function average(arr) {
    return arr.reduce((a,b)=>a+b,0)/arr.length;
}

let energyChart, moodChart;

function updateCharts() {
    const period = 'day';
    const energyGrouped = groupByPeriod(energyData, period);
    const moodGrouped = groupByPeriod(moodData, period);
    const labels = energyGrouped.map(r=>r.label);

    const energyValues = energyGrouped.map(r=>r.value);
    const moodValues = moodGrouped.map(r=>r.value);

    if (energyChart) {
        energyChart.destroy();
    }
    if (moodChart) {
        moodChart.destroy();
    }

    const ctx1 = document.getElementById('energyChart').getContext('2d');
    energyChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '精神',
                data: energyValues,
                borderColor: 'blue',
                fill: false
            }]
        }
    });

    const ctx2 = document.getElementById('moodChart').getContext('2d');
    moodChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '心情',
                data: moodValues,
                borderColor: 'green',
                fill: false
            }]
        }
    });
}
