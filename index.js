const http = require('http');

const PORT = 3000;
const RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify(payload));
}

function sendHtml(res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
    });

    res.end(`<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Курс рубля к доллару</title>
    <style>
        :root {
            color-scheme: light;
            font-family: Arial, Helvetica, sans-serif;
            background: #eef2f7;
            color: #182230;
        }

        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            padding: 24px;
        }

        main {
            width: min(100%, 460px);
            background: #ffffff;
            border: 1px solid #d7dde8;
            border-radius: 8px;
            padding: 28px;
            box-shadow: 0 18px 40px rgba(21, 32, 51, 0.12);
        }

        .topline {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 26px;
        }

        h1 {
            margin: 0;
            font-size: 22px;
            line-height: 1.2;
        }

        button {
            width: 44px;
            height: 44px;
            display: inline-grid;
            place-items: center;
            flex: 0 0 auto;
            border: 1px solid #c7d0df;
            border-radius: 8px;
            background: #f8fafc;
            color: #182230;
            cursor: pointer;
            transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
        }

        button:hover {
            background: #eef4ff;
            border-color: #7da4e8;
        }

        button:active {
            transform: scale(0.96);
        }

        button:disabled {
            cursor: wait;
            opacity: 0.72;
        }

        button.loading svg {
            animation: spin 850ms linear infinite;
        }

        .label {
            margin: 0 0 8px;
            font-size: 14px;
            color: #65758b;
        }

        .rate {
            margin: 0;
            font-size: 44px;
            line-height: 1;
            font-weight: 700;
            color: #0f172a;
        }

        .meta {
            min-height: 22px;
            margin: 18px 0 0;
            font-size: 14px;
            color: #65758b;
        }

        .error {
            color: #b42318;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <main>
        <div class="topline">
            <h1>USD к RUB</h1>
            <button id="refresh" type="button" aria-label="Обновить курс" title="Обновить курс">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M20 4v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <p class="label">1 доллар США сейчас стоит</p>
        <p id="rate" class="rate">...</p>
        <p id="meta" class="meta">Загрузка курса...</p>
    </main>

    <script>
        const rateElement = document.getElementById('rate');
        const metaElement = document.getElementById('meta');
        const refreshButton = document.getElementById('refresh');

        const formatter = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        async function loadRate() {
            refreshButton.disabled = true;
            refreshButton.classList.add('loading');
            metaElement.classList.remove('error');
            metaElement.textContent = 'Обновление...';

            try {
                const response = await fetch('/api/rate', { cache: 'no-store' });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Не удалось получить курс');
                }

                rateElement.textContent = formatter.format(data.rate);
                metaElement.textContent = 'Обновлено: ' + new Date(data.updatedAt).toLocaleString('ru-RU');
            } catch (error) {
                metaElement.classList.add('error');
                metaElement.textContent = error.message;
            } finally {
                refreshButton.disabled = false;
                refreshButton.classList.remove('loading');
            }
        }

        refreshButton.addEventListener('click', loadRate);
        loadRate();
    </script>
</body>
</html>`);
}

async function getUsdRubRate() {
    const response = await fetch(RATE_API_URL, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`Сервис курса валют вернул HTTP ${response.status}`);
    }

    const data = await response.json();
    const rate = data && data.rates && data.rates.RUB;

    if (typeof rate !== 'number') {
        throw new Error('В ответе сервиса нет курса RUB');
    }

    return {
        rate,
        updatedAt: new Date().toISOString(),
        source: RATE_API_URL,
    };
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/') {
        sendHtml(res);
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/rate') {
        try {
            sendJson(res, 200, await getUsdRubRate());
        } catch (error) {
            sendJson(res, 502, { error: error.message });
        }
        return;
    }

    sendJson(res, 404, { error: 'Страница не найдена' });
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
