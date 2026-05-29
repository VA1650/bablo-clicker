const SAVE_KEY = "bablo_clicker_clean";

const state = {
    money:0,
    bank:0,
    cpc:1,
    cps:0,
    prestige:0
};

const BANK_RATE = 0.001;

/* ---------- helpers ---------- */

function mult(){
    return 1 + state.prestige;
}

function income(){
    return state.cps * mult();
}

function clickValue(){
    return state.cpc * mult();
}

/* ---------- costs ---------- */

function clickCost(){
    return Math.floor(10 * Math.pow(1.6, state.cpc - 1));
}

function autoCost(){
    return Math.floor(25 * Math.pow(1.7, state.cps));
}

function megaCost(){
    return Math.floor(120 * Math.pow(1.8, Math.max(0, state.cps - 1)));
}

/* ---------- gameplay ---------- */

function click(){
    state.money += clickValue();
}

function buyClick(){
    if(state.money >= clickCost()){
        state.money -= clickCost();
        state.cpc++;
    }
}

function buyAuto(){
    if(state.money >= autoCost()){
        state.money -= autoCost();
        state.cps++;
    }
}

function buyMega(){
    if(state.money >= megaCost()){
        state.money -= megaCost();
        state.cps += 5;
    }
}

function bank(){
    if(state.money >= 1000){
        state.money -= 1000;
        state.bank += 1000;
    }
}

function withdraw(){
    state.money += state.bank;
    state.bank = 0;
}

function prestige(){
    if(state.money < 1000) return;

    state.money = 0;
    state.bank = 0;
    state.cpc = 1;
    state.cps = 0;

    state.prestige++;
}

/* ---------- events ---------- */

function showEvent(t){
    const el = document.getElementById("eventLog");
    el.innerText = t;
    setTimeout(()=>el.innerText="",1500);
}

function events(){
    let r = Math.random();

    if(r < 0.05){
        let g = income() * 2;
        state.money += g;
        showEvent("💹 +" + Math.floor(g));
    }

    if(r > 0.97){
        let l = state.money * 0.1;
        state.money -= l;
        showEvent("📉 -" + Math.floor(l));
    }
}

/* ---------- save ---------- */

function save(){
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        state,
        time:Date.now()
    }));
}

function load(){
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return;

    const data = JSON.parse(raw);
    Object.assign(state, data.state);

    if(data.time){
        const diff = (Date.now()-data.time)/1000;
        state.money += income() * diff;
    }
}

/* ---------- render ---------- */

function render(){

    document.getElementById("money").innerText = Math.floor(state.money);
    document.getElementById("bank").innerText = Math.floor(state.bank);

    document.getElementById("income").innerText = Math.floor(income());
    document.getElementById("clickVal").innerText = Math.floor(clickValue());

    document.getElementById("prestige").innerText = state.prestige;

    document.getElementById("cCost").innerText = clickCost();
    document.getElementById("aCost").innerText = autoCost();
    document.getElementById("mCost").innerText = megaCost();
}

/* ---------- loop ---------- */

document.getElementById("clickBtn").onclick = ()=>{ click(); render(); save(); };

document.getElementById("buyClick").onclick = ()=>{ buyClick(); render(); save(); };
document.getElementById("buyAuto").onclick = ()=>{ buyAuto(); render(); save(); };
document.getElementById("buyMega").onclick = ()=>{ buyMega(); render(); save(); };

document.getElementById("bankBtn").onclick = ()=>{ bank(); render(); save(); };
document.getElementById("withdrawBtn").onclick = ()=>{ withdraw(); render(); save(); };
document.getElementById("prestigeBtn").onclick = ()=>{ prestige(); render(); save(); };

load();
render();

setInterval(()=>{
    state.money += income();
    state.bank += state.bank * BANK_RATE;
    events();
    render();
},1000);

setInterval(save,2000);