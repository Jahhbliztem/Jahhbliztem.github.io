function formatMoney(value){
    return value.toLocaleString("en-US",{
        style:"currency",
        currency:"USD"
    });
}

function calculateEstimate(){
    const income = parseFloat(document.getElementById("income").value);
    const taxRate = parseFloat(document.getElementById("taxRate").value);
    const result = document.getElementById("estimateResult");

    if(isNaN(income) || isNaN(taxRate)){
        result.textContent = "Please enter valid numbers.";
        return;
    }

    const annualTax = income * (taxRate / 100);
    const monthlyTax = annualTax / 12;
    const netAnnual = income - annualTax;

    result.textContent = `${formatMoney(annualTax)} yearly tax, ${formatMoney(monthlyTax)} monthly, and ${formatMoney(netAnnual)} net income.`;
}

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    const button = document.getElementById("estimateButton");
    if (button) {
        button.addEventListener("click", calculateEstimate);
    }
});