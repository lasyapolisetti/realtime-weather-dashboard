"use strict";

const state={cities:[],unit:"C",timerLeft:60,countdownId:null,chart:null,chartRange:"6h"};
const REFRESH_INTERVAL=60;
const chartColors=["#00e5ff","#ff5722","#00e676","#ffeb3b","#ff4081","#ab47bc","#26c6da","#ffca28"];

function weatherCodeInfo(c){
 const m={0:["Clear Sky","☀️"],1:["Mainly Clear","🌤️"],2:["Partly Cloudy","⛅"],3:["Overcast","☁️"],45:["Foggy","🌫️"],48:["Rime Fog","🌫️"],51:["Light Drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy Drizzle","🌧️"],56:["Freezing Drizzle","🌧️"],57:["Heavy Freezing Drizzle","🌧️"],61:["Light Rain","🌦️"],63:["Rain","🌧️"],65:["Heavy Rain","🌧️"],66:["Freezing Rain","🌧️"],67:["Heavy Freezing Rain","🌧️"],71:["Light Snow","🌨️"],73:["Snow","❄️"],75:["Heavy Snow","❄️"],77:["Snow Grains","❄️"],80:["Light Showers","🌦️"],81:["Showers","🌧️"],82:["Heavy Showers","🌧️"],85:["Snow Showers","🌨️"],86:["Heavy Snow Showers","🌨️"],95:["Thunderstorm","⛈️"],96:["Thunderstorm with Hail","⛈️"],99:["Severe Thunderstorm with Hail","⛈️"]};
 const x=m[c]||["Unknown","🌤️"]; return {label:x[0],icon:x[1]};
}

async function geocodeCity(name){
 const r=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(name)+"&count=1&language=en&format=json");
 if(!r.ok) throw new Error("Could not search for the city.");
 const d=await r.json();
 if(!d.results?.length) throw new Error("City not found. Please enter a valid city name.");
 return d.results[0];
}

function nearestIndex(times,target){
 let best=0,diff=Infinity,t=new Date(target).getTime();
 times.forEach((x,i)=>{const v=Math.abs(new Date(x).getTime()-t);if(v<diff){diff=v;best=i}});
 return best;
}

async function fetchWeatherData(name,knownLocation=null){
 const loc=knownLocation||await geocodeCity(name);
 const p=new URLSearchParams({
  latitude:loc.latitude,longitude:loc.longitude,
  current:"temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m",
  hourly:"temperature_2m,uv_index,visibility",
  past_days:"2",forecast_days:"1",timezone:"auto",wind_speed_unit:"kmh"
 });
 const r=await fetch("https://api.open-meteo.com/v1/forecast?"+p);
 if(!r.ok) throw new Error("Could not fetch weather data.");
 const d=await r.json(),c=d.current,h=d.hourly,i=nearestIndex(h.time,c.time),w=weatherCodeInfo(c.weather_code);
 const city=[loc.name,loc.admin1,loc.country].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(", ");
 return {city,searchName:loc.name,location:loc,tempC:c.temperature_2m,humidity:c.relative_humidity_2m,
  windKmh:c.wind_speed_10m,condition:w.label,icon:w.icon,feelsLikeC:c.apparent_temperature,
  pressure:c.surface_pressure,uvIndex:h.uv_index[i]??null,
  visibility:h.visibility[i]==null?null:+(h.visibility[i]/1000).toFixed(1),
  timestamp:Date.now(),observationTime:c.time,timezone:d.timezone,
  history:h.time.map((time,j)=>({time,tempC:h.temperature_2m[j]}))};
}

function toDisplay(t){if(t==null)return "—";return state.unit==="F"?Math.round(t*9/5+32):Math.round(t)}
function unitLabel(){return state.unit==="F"?"°F":"°C"}
function slugify(s){return s.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}
function classifyCondition(d){
 if(d.tempC>=38)return{cls:"heat",label:"🔥 Extreme Heat"};
 if(d.tempC<=0)return{cls:"cold",label:"🧊 Extreme Cold"};
 if(d.windKmh>=60)return{cls:"storm",label:"⚠️ Storm Warning"};
 if(d.humidity>=85)return{cls:"humidity",label:"💧 High Humidity"};
 return{cls:"normal",label:"✅ Normal"};
}

function renderCard(d){
 const el=document.getElementById("card-"+slugify(d.searchName));if(!el)return;
 const a=classifyCondition(d),wind=state.unit==="F"?Math.round(d.windKmh*.621371)+" mph":Math.round(d.windKmh)+" km/h";
 el.innerHTML=`<div class="card-header"><div><div class="card-city-name">${d.city}</div>
 <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px;">Updated ${new Date(d.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div></div>
 <span class="card-weather-icon" title="${d.condition}">${d.icon}</span><button class="card-remove" data-city="${d.searchName}" title="Remove">✕</button></div>
 <div class="card-body"><div class="card-temp">${toDisplay(d.tempC)}${unitLabel()}</div>
 <div style="color:var(--text-muted);font-size:.82rem;margin:-4px 0 10px;">${d.condition}</div>
 <div class="card-stats">
 ${row("🌡️","Feels Like",toDisplay(d.feelsLikeC)+unitLabel())}
 ${row("💧","Humidity",Math.round(d.humidity)+"%")}
 ${row("💨","Wind",wind)}
 ${row("🌬️","Pressure",d.pressure==null?"—":Math.round(d.pressure)+" hPa")}
 ${row("👁️","Visibility",d.visibility==null?"—":d.visibility+" km")}
 ${row("☀️","UV Index",d.uvIndex==null?"—":Number(d.uvIndex).toFixed(1))}
 </div></div><div class="card-condition-bar condition-${a.cls}">${a.label}</div>`;
 const t=el.querySelector(".card-temp");t.style.animation="none";requestAnimationFrame(()=>t.style.animation="pulseAnim .4s ease");
}
function row(i,l,v){return `<div class="stat-row"><span class="stat-label"><span class="stat-icon">${i}</span> ${l}</span><span class="stat-value">${v}</span></div>`}
function createCardShell(n){const e=document.createElement("div");e.className="weather-card";e.id="card-"+slugify(n);e.innerHTML=`<div class="card-loading"><div class="spinner"></div><span>Fetching ${n}…</span></div>`;return e}

async function addCity(name){
 name=name.trim();if(!name){showToast("Please enter a city name","error");return}
 if(state.cities.some(c=>slugify(c.searchName)===slugify(name))){showToast(name+" is already added","error");return}
 document.getElementById("emptyState").style.display="none";
 const shell=createCardShell(name);document.getElementById("cardsGrid").appendChild(shell);
 try{
  const d=await fetchWeatherData(name);
  if(state.cities.some(c=>c.location.latitude===d.location.latitude&&c.location.longitude===d.location.longitude)){shell.remove();showToast(d.searchName+" is already added","error");return}
  shell.id="card-"+slugify(d.searchName);state.cities.push(d);renderCard(d);updateChart();showChartSection();showToast(d.searchName+" added successfully");updateTimestamps();
 }catch(e){shell.remove();showToast(e.message||"Could not fetch weather","error");if(!state.cities.length)document.getElementById("emptyState").style.display=""}
}
function removeCity(name){
 const s=slugify(name);state.cities=state.cities.filter(c=>slugify(c.searchName)!==s);
 const e=document.getElementById("card-"+s);if(e){e.style.transition="all .3s";e.style.transform="scale(.9)";e.style.opacity="0";setTimeout(()=>e.remove(),300)}
 if(!state.cities.length){document.getElementById("emptyState").style.display="";document.getElementById("chartSection").style.display="none"}else updateChart();
 showToast(name+" removed");
}
async function refreshAll(){
 if(!state.cities.length)return;
 const old=[...state.cities],res=await Promise.allSettled(old.map(c=>fetchWeatherData(c.searchName,c.location)));
 res.forEach((x,i)=>{if(x.status==="fulfilled"){const j=state.cities.findIndex(c=>c.location.latitude===old[i].location.latitude&&c.location.longitude===old[i].location.longitude);if(j>=0){state.cities[j]=x.value;renderCard(x.value)}}});
 updateTimestamps();updateChart();
}

function updateTimestamps(){document.getElementById("lastUpdated").textContent="Last Updated: "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
function startCountdown(){
 state.timerLeft=REFRESH_INTERVAL;updateCountdownDisplay();clearInterval(state.countdownId);
 state.countdownId=setInterval(()=>{state.timerLeft--;updateCountdownDisplay();if(state.timerLeft<=0){state.timerLeft=REFRESH_INTERVAL;refreshAll()}},1000);
}
function updateCountdownDisplay(){
 document.getElementById("nextUpdate").textContent=`Next Update: ${state.timerLeft}s`;
 const r=document.getElementById("timerRing");if(r)r.style.strokeDashoffset=56.5*(1-state.timerLeft/REFRESH_INTERVAL);
}

function rangeHours(){return parseInt(state.chartRange)}
function historySlice(c,h){
 const end=new Date(c.observationTime).getTime(),start=end-(h-1)*3600000;
 return (c.history||[]).filter(p=>{const t=new Date(p.time).getTime();return t>=start&&t<=end}).slice(-h);
}
function chartLabel(t){return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
function showChartSection(){if(state.cities.length)document.getElementById("chartSection").style.display=""}
function updateChart(){
 if(!state.cities.length)return;const h=rangeHours(),labels=historySlice(state.cities[0],h).map(p=>chartLabel(p.time));
 const datasets=state.cities.map((c,i)=>({label:c.searchName,data:historySlice(c,h).map(p=>toDisplay(p.tempC)),borderColor:chartColors[i%chartColors.length],backgroundColor:chartColors[i%chartColors.length]+"18",borderWidth:2.5,pointBackgroundColor:chartColors[i%chartColors.length],pointBorderColor:"#0d1829",pointBorderWidth:2,pointRadius:h===24?2:4,pointHoverRadius:7,tension:.35,fill:true}));
 const sub=document.querySelector(".chart-sub");if(sub)sub.textContent=`Last ${h} hours — All monitored cities`;
 if(state.chart){state.chart.data.labels=labels;state.chart.data.datasets=datasets;state.chart.options.scales.y.title.text=`Temperature (${unitLabel()})`;state.chart.options.scales.x.ticks.maxTicksLimit=h===24?8:12;state.chart.update();return}
 state.chart=new Chart(document.getElementById("tempChart").getContext("2d"),{type:"line",data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{labels:{color:"#7ba4cc",font:{family:"'Exo 2', sans-serif",size:12},boxWidth:14,padding:20}},tooltip:{backgroundColor:"#0d1829",borderColor:"rgba(33,150,243,.4)",borderWidth:1,titleColor:"#e8f4ff",bodyColor:"#7ba4cc",padding:12,callbacks:{label:x=>` ${x.dataset.label}: ${x.parsed.y}${unitLabel()}`}}},scales:{x:{ticks:{color:"#7ba4cc",font:{family:"'Exo 2', sans-serif"},maxTicksLimit:h===24?8:12},grid:{color:"rgba(33,150,243,.06)"}},y:{ticks:{color:"#7ba4cc",font:{family:"'Exo 2', sans-serif"},callback:v=>`${v}${unitLabel()}`},grid:{color:"rgba(33,150,243,.08)"},title:{display:true,text:`Temperature (${unitLabel()})`,color:"#7ba4cc",font:{family:"'Exo 2', sans-serif",size:12}}}}}});
}

function switchUnit(u){if(state.unit===u)return;state.unit=u;document.querySelectorAll(".unit-btn").forEach(b=>b.classList.toggle("active",b.dataset.unit===u));state.cities.forEach(renderCard);if(state.chart)updateChart()}
function showToast(msg,type="success"){const c=document.getElementById("toastContainer"),t=document.createElement("div");t.className=`toast ${type}`;t.innerHTML=`<span>${type==="success"?"✅":"⚠️"}</span><span>${msg}</span>`;c.appendChild(t);setTimeout(()=>{t.style.animation="toastOut .3s ease forwards";setTimeout(()=>t.remove(),300)},3000)}
function updateFooterClock(){const e=document.getElementById("footerTime");if(e)e.textContent=new Date().toLocaleString()}

document.addEventListener("DOMContentLoaded",()=>{
 const tc=document.createElement("div");tc.className="toast-container";tc.id="toastContainer";document.body.appendChild(tc);
 document.getElementById("addCityBtn").addEventListener("click",()=>{const i=document.getElementById("cityInput");addCity(i.value);i.value="";i.focus()});
 document.getElementById("cityInput").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("addCityBtn").click()});
 document.querySelectorAll(".quick-city").forEach(b=>b.addEventListener("click",()=>addCity(b.dataset.city)));
 document.getElementById("cardsGrid").addEventListener("click",e=>{const b=e.target.closest(".card-remove");if(b)removeCity(b.dataset.city)});
 document.querySelectorAll(".unit-btn").forEach(b=>b.addEventListener("click",()=>switchUnit(b.dataset.unit)));
 document.querySelectorAll(".chart-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".chart-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.chartRange=b.dataset.range;updateChart()}));
 startCountdown();updateFooterClock();setInterval(updateFooterClock,1000);
 ["Chennai","Delhi","Mumbai"].forEach((c,i)=>setTimeout(()=>addCity(c),i*600));
});
