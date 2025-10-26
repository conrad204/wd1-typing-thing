import { API_KEY } from "./config.js";

async function fetchQuote(){
    try{
        const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
            method: "GET",
            headers: {
                "X-Api-Key": API_KEY,
            }
        })
        const data = await res.json();
        const quote = data[0];
        return quote;
    }

    catch(error){
        console.log("Fetching error:", error)
        return "your quote didn't load, so type this instead."
    }
}

async function main(){
    const getQuote = await fetchQuote();
    return getQuote;
}

fetchQuote();

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

document.addEventListener("DOMContentLoaded", () => {
    loadPersonalBest();
});

document.getElementById('start').addEventListener('click', async () => {
    const quoteObj = await main();
    const quote = quoteObj.quote;
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(function(word) {return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.focus();
    startTime = new Date().getTime()
});

document.getElementById('reset').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1){
        const pad = n => n.toString().padStart(2, "0");
        const elapsedTime = new Date().getTime() - startTime;
        const wpmRaw= (wordIndex+1)/((elapsedTime/1000)/60);
        const wpm = wpmRaw.toFixed(2);
        const message = `congrats, you\'re not a bum and you finished in ${elapsedTime / 1000} seconds and you type at a speed of ${wpm} wpm.`; // use backticks
        messageElement.innerText = message;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const seconds = now.getSeconds();
        const dateString = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(min)}:${pad(seconds)}`;
        saveWpm(dateString, wpm);
    }
    else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord){
        typedValueElement.value = '';
        wordIndex++;

        for (const wordElement of quoteElement.childNodes){ //childNodes are span elements
            wordElement.className = '';
        }

        quoteElement.childNodes[wordIndex].className = 'highlight';
    }
    else if (currentWord.startsWith(typedValue)){
        typedValueElement.className = '';
    }

    else {
        typedValueElement.className = 'error';
    }

});

function saveWpm(runDate, runWpm){
    localStorage.setItem(runDate, JSON.stringify(runWpm));
}

function loadPersonalBest(){
    const table = document.getElementById("wpmPersonalBest");
    for (let i = 0; i < localStorage.length; i++){
        const date = localStorage.key(i);
        const wpm = JSON.parse(localStorage.getItem(date));
        const row = table.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = wpm;
    }
}