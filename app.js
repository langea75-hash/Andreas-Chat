import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth,signInWithCustomToken,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig={apiKey:"DEIN_API_KEY",authDomain:"DEIN_PROJEKT.firebaseapp.com",projectId:"DEIN_PROJEKT",appId:"DEINE_APP_ID"};
const auth=getAuth(initializeApp(firebaseConfig));

const $=s=>document.querySelector(s);
const authView=$("#authView"),homeView=$("#homeView"),message=$("#message");

function showMessage(text,success=false){
  message.textContent=text;
  message.classList.toggle("success",success);
}
function switchTab(tab){
  const login=tab==="login";
  $("#loginTab").classList.toggle("active",login);
  $("#registerTab").classList.toggle("active",!login);
  $("#loginForm").classList.toggle("hidden",!login);
  $("#registerForm").classList.toggle("hidden",login);
  showMessage("");
}
async function api(path,data){
  const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  const result=await response.json();
  if(!response.ok) throw new Error(result.error||"Unbekannter Fehler");
  return result;
}

$("#loginTab").onclick=()=>switchTab("login");
$("#registerTab").onclick=()=>switchTab("register");

$("#loginForm").onsubmit=async event=>{
  event.preventDefault();
  showMessage("Anmeldung läuft …");
  try{
    const result=await api("/api/login",{username:$("#loginUsername").value,pin:$("#loginPin").value});
    sessionStorage.setItem("psssProfile",JSON.stringify(result));
    await signInWithCustomToken(auth,result.token);
    showMessage("Anmeldung erfolgreich.",true);
  }catch(error){showMessage(error.message);}
};

$("#registerForm").onsubmit=async event=>{
  event.preventDefault();
  showMessage("Registrierung läuft …");
  try{
    const result=await api("/api/register",{displayName:$("#displayName").value,username:$("#registerUsername").value,pin:$("#registerPin").value,inviteCode:$("#inviteCode").value});
    sessionStorage.setItem("psssProfile",JSON.stringify(result));
    await signInWithCustomToken(auth,result.token);
    showMessage("Konto wurde erstellt.",true);
  }catch(error){showMessage(error.message);}
};

$("#logoutButton").onclick=async()=>{sessionStorage.removeItem("psssProfile");await signOut(auth);};

onAuthStateChanged(auth,user=>{
  if(!user){
    authView.classList.remove("hidden");
    homeView.classList.add("hidden");
    return;
  }
  const stored=JSON.parse(sessionStorage.getItem("psssProfile")||"{}");
  $("#welcomeName").textContent=`Hallo ${stored.displayName||user.displayName||""}`;
  $("#welcomeUsername").textContent=stored.username?`@${stored.username}`:"";
  authView.classList.add("hidden");
  homeView.classList.remove("hidden");
});
