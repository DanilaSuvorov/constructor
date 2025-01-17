// Decision tree data structure
const decisionTree = {
    start: {
        question: "Система эффективных продаж - это:",
        options: [
            { text: "Ответ на вопрос, чем мы лучше = позиционирование на рынке", next: "positioning" },
            { text: "Регулярная работа с вашими клиентами", next: "regularity" }
        ]
    },
    positioning: {
        question: "Исследование рынка",
        options: [
            { text: "Customer development действующих, потенциальных и ушедших клиентов", next: "custdev" },
            { text: "Анализ конкурентов", next: "analyze" }
        ]
    },
    regularity: {
        question: "Что именно вам интересно?",
        options: [
            { text: "Ритм бизнеса", next: "rhytm" },
            { text: "Ваша команда", next: "team" },
            { text: "Финансы", next: "finance" }
        ]
    },
    custdev: {
        result: "Результат:",
        services: [
            "Маркетинг"
        ],
        url: "marketing/marketing.html"
    },
    analyze: {
        result: "Результат:",
        services: [
            "Маркетинг"
        ],
        url: "marketing/marketing.html"
    },
    rhytm: {
        result: "Результат:",
        services: [
            "Продажи"
        ],
        url: "sales/sales.html"
    },
    team: {
        result: "Результат:",
        services: [
            "Персонал"
        ],
        url: "personnel/personnel.html"
    },
    finance: {
        result: "Результат:",
        services: [
            "Финансы"
        ],
        url: "finance/finance.html"
    }
};

function updatePath(selectedOption) {
    const pathContainer = document.getElementById('selected-path');
    const pathItem = document.createElement('span');
    pathItem.textContent = selectedOption;
    pathContainer.appendChild(pathItem);
}

function clearPath() {
    const pathContainer = document.getElementById('selected-path');
    pathContainer.innerHTML = '';
}

function showResult(node) {
    const container = document.getElementById('decision-tree');
    container.innerHTML = `
        <div class="result-node">
            <h3 style="color: #0066cc;">${node.result}</h3>
            <ul>
                ${node.services.map(service => `
                    <li>
                        <a href="${node.url}" style="text-decoration: none; color: inherit; display: block;">
                            ${service}
                        </a>
                    </li>
                `).join('')}
            </ul>
            <button style="background: linear-gradient(135deg, #0066cc, #0052a3); color: white;"
                    onclick="resetTree()">Начать сначала</button>
        </div>
    `;
}

function showNode(nodeId) {
    const node = decisionTree[nodeId];
    const container = document.getElementById('decision-tree');

    if (node.result) {
        showResult(node);
        return;
    }

    container.innerHTML = `
        <div class="tree-node">
            <h3>${node.question}</h3>
            <div class="options">
                ${node.options.map(option => `
                    <button data-next="${option.next}">${option.text}</button>
                `).join('')}
            </div>
        </div>
    `;

    // Add click handlers to buttons
    container.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            updatePath(button.textContent);
            showNode(button.dataset.next);
        });
    });
}

function resetTree() {
    clearPath();
    showNode('start');
}

// Initialize the tree when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showNode('start');
});