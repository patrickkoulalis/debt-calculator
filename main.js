const form = document.forms['calc'].elements;
let pv,
    ir,
    np,
    savings,
    mni,
    mfe,
    mle,
    extraCash,
    payment = 0,
    paymentAdd,
    tip,
    newTip,
    newTerm;  

//Session Storage For Form
for(let i = 0; i <= 6; i++) {
    // See if we have an autosave value
    if (sessionStorage.getItem("autosave_form" + i)) {
        // Restore the contents
        form[i].value = sessionStorage.getItem("autosave_form" + i);
        if(form[i] === form[0]) pv = Number(form[0].value);
        if(form[i] === form[1]) ir = Number(form[1].value)/100;
        if(form[i] === form[2]) np = Number(form[2].value);
        if(form[i] === form[3]) mni = Number(form[3].value);
        if(form[i] === form[4]) mfe = Number(form[4].value);
        if(form[i] === form[5]) mle = Number(form[5].value);
        // Update Values
        update();
    }
    // Listen for changes in the text field
    form[i].addEventListener("change", function() {
        // save the results
        form[i].value = form[i].value;
        sessionStorage.setItem("autosave_form" + i, form[i].value);
        if(form[i] === form[0]) pv = Number(form[0].value);
        if(form[i] === form[1]) ir = Number(form[1].value)/100;
        if(form[i] === form[2]) np = Number(form[2].value);
        if(form[i] === form[3]) mni = Number(form[3].value);
        if(form[i] === form[4]) mfe = Number(form[4].value);
        if(form[i] === form[5]) mle = Number(form[5].value);
        // Update Values
        update();
    });
}

newTerm = (Math.log(1 + (ir / (payment / (pv - ir))) / Math.log(1 + ir))) / 12;
newTerm = newTerm * 1000;
newTerm = Math.round(newTerm);
newTerm = newTerm / 1000;
console.log(newTerm)

//On Button Click Display Results.
const calc = document.querySelector('.calculate');
calc.addEventListener('click', showResults);

// Show Final Results
function showResults(e) {
    e.preventDefault();
    //Basic Results With No Savings
    const basicPayment = document.querySelector('#basic-payment span'),
        basicTip = document.querySelector('#basic-tip span'),
        basicSave = document.querySelector('#basic-savings span'),
        basicExtra = document.querySelector('#basic-extra span');
	basicPayment.textContent = '$' + payment;
    basicTip.textContent = '$' + tip;
    basicSave.textContent = '$0';
    basicExtra.textContent = '$' + extraCash;
    
    //Advanced Results With Savings
    const advPayment = document.querySelector('#adv-payment span'),
        advTip = document.querySelector('#adv-tip span'),
        advSave = document.querySelector('#adv-savings span'),
        advExtra = document.querySelector('#adv-extra span');
    advPayment.textContent = '$' + (payment + extraCash);
    advTip.textContent ='$' + (payment - pv);
    advSave.textContent = '$' + savings;
    advExtra.textContent = '$' + (extraCash - extraCash);
    console.log(pv, ir, np);
}

//Update
function  update(){
    // Update Total Intrest Paid On Refresh
    tip = Math.round(np * Math.round(Math.abs(pmt(ir/12, np, pv))) - pv);

    //Update Extra Cash on refresh
    extraCash = mni - (mle + mfe);

    //Update Inital Payment on refresh
    payment = Math.round(Math.abs(pmt(ir/12, np, pv)));

    //Update Savings on refresh
    savings = (tip - newTip);
}

//Some Money Peoples Function
function pmt(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}

//function for formatting number with commas
function numberormat(number, decimals, dec_point, thousands_sep) {

    var n = !isFinite( + number) ? 0: +number,
    prec = !isFinite( + decimals) ? 0: Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',': thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.': dec_point,
    s = '',
    toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}