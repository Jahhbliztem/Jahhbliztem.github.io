function formatMoney(value){
    return value.toLocaleString("en-US",{
        style:"currency",
        currency:"USD"
    });
}

function calculateTax(){

    const income = parseFloat(document.getElementById("income").value);
    const taxRate = parseFloat(document.getElementById("taxRate").value);

    if(isNaN(income) || isNaN(taxRate)){
        alert("Please enter valid numbers.");
        return;
    }

    const annualTax = income * (taxRate / 100);

    const monthlyTax = annualTax / 12;

    const netAnnual = income - annualTax;

    const netMonthly = netAnnual / 12;

    document.getElementById("annualTax").textContent = formatMoney(annualTax);

    document.getElementById("monthlyTax").textContent = formatMoney(monthlyTax);

    document.getElementById("netAnnual").textContent = formatMoney(netAnnual);

    document.getElementById("netMonthly").textContent = formatMoney(netMonthly);

}