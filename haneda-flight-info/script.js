document.addEventListener('DOMContentLoaded', () => {
    const flightDataBody = document.getElementById('flight-data');

    // 羽田空港のフライト情報APIエンドポイント（国際線到着）
    const API_URL = 'https://tokyo-haneda.com/app_resource/flight/data/lan/hdacf_arr.json';

    async function fetchFlightData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayFlightData(data.flight_information);
        } catch (error) {
            console.error("データの取得に失敗しました:", error);
            flightDataBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">フライト情報の取得に失敗しました。</td></tr>`;
        }
    }

    function displayFlightData(flights) {
        flightDataBody.innerHTML = ''; // 既存のデータをクリア

        if (!flights || flights.length === 0) {
            flightDataBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">現在表示できるフライト情報はありません。</td></tr>`;
            return;
        }

        flights.forEach(flight => {
            const row = document.createElement('tr');

            // ステータスに応じてクラスを付与
            let statusClass = '';
            switch (flight.status_jp) {
                case '定刻': statusClass = 'status-ontime'; break;
                case '遅れ': statusClass = 'status-delayed'; break;
                case '欠航': statusClass = 'status-cancelled'; break;
                case '着陸': statusClass = 'status-landed'; break;
            }

            row.innerHTML = `
                <td>${flight.airline || ''}</td>
                <td>${flight.flight_number || ''}</td>
                <td>${flight.airport_jp || ''}</td>
                <td>${flight.scheduled_time || ''}</td>
                <td>${flight.estimated_time || ''}</td>
                <td class="${statusClass}">${flight.status_jp || ''}</td>
                <td>${flight.terminal_jp || ''}</td>
                <td>${flight.gate_number || ''}</td>
            `;
            flightDataBody.appendChild(row);
        });
    }

    // ページ読み込み時にデータを取得し、その後5分ごとに更新
    fetchFlightData();
    setInterval(fetchFlightData, 60000); // 60000ミリ秒 = 1分
});
