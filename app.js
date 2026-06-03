let openDate = null;

function toggleDate(date){

    if(openDate === date){
        openDate = null;
    }else{
        openDate = date;
    }

    
}

function getCategoryIcon(category){

    switch(category){

        case "外食費":
            return "🍜";

        case "交通費":
            return "🚃";

        case "チケ代":
            return "🎫";

        case "チェキ":
            return "📸";

        case "旅行":
            return "✈️";

        case "航空部":
            return "🛩️";

        default:
            return "📦";
    }
}


let accounts =
    JSON.parse(localStorage.getItem("accounts")) || [];

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

function save(){

    localStorage.setItem(
        "accounts",
        JSON.stringify(accounts)
    );

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    renderAccountList();
    renderCalendar();
    renderCategoryChart();
}

function addAccount() {

    const name =
        document.getElementById(
            "accountName"
        ).value;

    const balance =
        Number(
            document.getElementById(
                "accountBalance"
            ).value
        );

    if (!name) {
        return;
    }

    accounts.push({
        id: Date.now(),
        name: name,
        balance: balance
    });

    document.getElementById(
        "accountName"
    ).value = "";

    document.getElementById(
        "accountBalance"
    ).value = "";

    save();
}

function editAccount(id) {

    const account =
        accounts.find(
            a => a.id === id
        );

    if (!account) {
        return;
    }

    const newName =
        prompt(
            "口座名",
            account.name
        );

    if (!newName) {
        return;
    }

    const newBalance =
        Number(
            prompt(
                "残高",
                account.balance
            )
        );

    if (isNaN(newBalance)) {
        return;
    }

    account.name = newName;
    account.balance = newBalance;

    save();
}

function deleteAccount(id) {

    if (!confirm("この口座を削除しますか？")) {
        return;
    }

    accounts =
        accounts.filter(
            a => a.id !== id
        );

    transactions =
        transactions.filter(
            t => t.accountId !== id
        );

    save();
}

function categoryChanged() {

    const category =
        document.getElementById(
            "category"
        ).value;

    const accountSelect =
        document.getElementById(
            "accountSelect"
        );

    if (category === "チェキ") {

        document.getElementById(
            "amount"
        ).value = 3000;

        for (let i = 0; i < accountSelect.options.length; i++) {

            if (
                accountSelect.options[i]
                .text === "現金"
            ) {
                accountSelect.selectedIndex = i;
                break;
            }
        }
    }

    if (
        category === "チケ代" ||
        category === "航空部"
    ) {

        for (let i = 0; i < accountSelect.options.length; i++) {

            if (
                accountSelect.options[i]
                .text === "三井住友"
            ) {
                accountSelect.selectedIndex = i;
                break;
            }
        }
    }
}

function addTransaction() {

    const type =
        document.getElementById(
            "transactionType"
        ).value;

    const transactionDate =
        document.getElementById(
            "transactionDate"
        ).value;

    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );

    const category =
        document.getElementById(
            "category"
        ).value;

    const accountId =
        Number(
            document.getElementById(
                "accountSelect"
            ).value
        );

    const account =
        accounts.find(
            a => a.id === accountId
        );

    if (!account || amount <= 0) {
        return;
    }

    if (type === "income") {
        account.balance += amount;
    }

    if (type === "expense") {
        account.balance -= amount;
    }

    transactions.push({
        id: Date.now(),
        type,
        category,
        amount,
        accountId,
        date: transactionDate
    });

    document.getElementById(
        "amount"
    ).value = "";

    save();
}

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            t => t.id === id
        );

    if (!transaction) {
        return;
    }

    const account =
        accounts.find(
            a => a.id === transaction.accountId
        );

    if (account) {

        if (transaction.type === "income") {
            account.balance -= transaction.amount;
        }

        if (transaction.type === "expense") {
            account.balance += transaction.amount;
        }
    }

    transactions =
        transactions.filter(
            t => t.id !== id
        );

    save();
}





window.onload = function(){

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    document.getElementById(
        "transactionDate"
    ).value = today;

    renderAccountList();
    renderCalendar();
    renderDayTransactions();
    renderCategoryChart();
};

function toggleAccountManager(){

    const manager =
        document.getElementById(
            "accountManager"
        );

    const button =
        document.querySelector(
            ".toggle-btn"
        );

    if(
        manager.style.display ===
        "none"
    ){

        manager.style.display =
            "block";

        button.textContent =
            "▲ 口座管理を閉じる";

    }else{

        manager.style.display =
            "none";

        button.textContent =
            "▼ 口座管理を開く";
    }
}

let currentMonth =
    new Date()
    .toISOString()
    .substring(0,7);

function changeMonth(direction){

    let [year, month] =
        currentMonth
        .split("-")
        .map(Number);

    month += direction;

    if(month < 1){
        month = 12;
        year--;
    }

    if(month > 12){
        month = 1;
        year++;
    }

    currentMonth =
        `${year}-${String(month)
            .padStart(2,"0")}`;

    renderCalendar();
    renderCategoryChart();
}

let selectedDate =
    new Date()
    .toISOString()
    .substring(0,10);

    function renderCalendar(){

    const calendar =
        document.getElementById(
            "calendar"
        );

    calendar.innerHTML = "";

    calendar.innerHTML = `
    <div class="weekday">日</div>
    <div class="weekday">月</div>
    <div class="weekday">火</div>
    <div class="weekday">水</div>
    <div class="weekday">木</div>
    <div class="weekday">金</div>
    <div class="weekday">土</div>
    `;

    
    const [year, month] =
    currentMonth
    .split("-")
    .map(Number);

    document.getElementById(
        "calendarTitle"
    ).textContent =
        `${year}年${month}月`;

    
    
    const daysInMonth =
        new Date(
            year,
            month,
            0
        ).getDate();

    const firstDay =
     new Date(
        year,
        month - 1,
        1
    ).getDay();

    for(
        let i = 0;
        i < firstDay;
        i++
    ){

    calendar.innerHTML +=
        `<div></div>`;
}

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const date =
            `${currentMonth}-${String(day)
                .padStart(2,"0")}`;

        let total = 0;

        transactions.forEach(t=>{

            if(
                t.date === date &&
                t.type === "expense"
            ){
                total += t.amount;
            }

        });

        calendar.innerHTML += `
        <div
            class="calendar-day"
            onclick="selectDate('${date}')">

            <div>${day}</div>

            <div>
                ¥${total}
            </div>

        </div>
        `;
    }
}

function selectDate(date){

    selectedDate = date;

    renderDayTransactions();
}

function renderDayTransactions(){

    const box =
        document.getElementById(
            "dayTransactions"
        );

    box.innerHTML = "";

    document.getElementById(
        "selectedDateTitle"
    ).textContent =
        selectedDate;

    transactions
    .filter(
        t=>t.date===selectedDate
    )
    .forEach(t=>{

        box.innerHTML += `
        <div class="history-item">

            ${getCategoryIcon(
                t.category
            )}

            ${t.category}

            ¥${t.amount.toLocaleString()}

        </div>
        `;
    });
}

let chart = null;

function renderCategoryChart(){

    const monthTransactions =
        transactions.filter(t => {

            return (
                t.type === "expense" &&
                t.date.startsWith(currentMonth)
            );

        });

    const categoryTotals = {};

    monthTransactions.forEach(t => {

        if(!categoryTotals[t.category]){
            categoryTotals[t.category] = 0;
        }

        categoryTotals[t.category] += t.amount;

    });

    const labels =
        Object.keys(categoryTotals);

    const data =
        Object.values(categoryTotals);

    const ctx =
        document
        .getElementById("categoryChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                data: data
            }]
        },

        options: {

            plugins: {

                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function renderAccountList(){

    const accountList =
        document.getElementById(
            "accountList"
        );

    const accountSelect =
        document.getElementById(
            "accountSelect"
        );

    accountList.innerHTML = "";
    accountSelect.innerHTML = "";

    let total = 0;

    accounts.forEach(account => {

        total += account.balance;

        accountList.innerHTML += `
    <div class="account">

        <strong>
            ${account.name}
        </strong>

        <div>
            ¥${account.balance.toLocaleString()}
        </div>

        <button
            onclick="editAccount(${account.id})">
            編集
        </button>

        <button
            onclick="deleteAccount(${account.id})">
            削除
        </button>

    </div>
    `;

        accountSelect.innerHTML += `
        <option value="${account.id}">
            ${account.name}
        </option>
        `;
    });

    document.getElementById(
        "totalAssets"
    ).textContent =
        `総資産: ¥${total.toLocaleString()}`;
}

function editAccount(id){

    const account =
        accounts.find(
            a => a.id === id
        );

    if(!account){
        return;
    }

    const newName =
        prompt(
            "口座名",
            account.name
        );

    if(!newName){
        return;
    }

    const newBalance =
        Number(
            prompt(
                "残高",
                account.balance
            )
        );

    if(isNaN(newBalance)){
        return;
    }

    account.name = newName;
    account.balance = newBalance;

    save();
}

function deleteAccount(id){

    if(
        !confirm(
            "この口座を削除しますか？"
        )
    ){
        return;
    }

    accounts =
        accounts.filter(
            a => a.id !== id
        );

    save();
}