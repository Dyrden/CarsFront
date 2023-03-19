// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below

import {
  setActiveLink,
  loadTemplate,
  renderTemplate,
  adjustForMissingHash,
} from "./utils.js";

import {baseURL} from "./settings.js"
import {initAllCars} from "./pages/allCars/allCars.js"
import {initCreateCar} from "./pages/createCar/createCar.js"
import {initFindCar} from "./pages/findCar/findCar.js"
import {initEditCar} from "./pages/editCar/editCar.js"
import {handleHttpErrors} from "./utils.js"


document.getElementById("btn-login").onclick = loginLogoutClick
document.getElementById("btn-logout").onclick = loginLogoutClick


const userNameInput = document.getElementById("input-user")
const passwordInput = document.getElementById("input-password")
const responseStatus = document.getElementById("response")
const loginContainer = document.getElementById("login-container")
const logoutContainer = document.getElementById("logout-container")
const userDetails = document.getElementById("user-details")

window.addEventListener("load", async () => {
  // html templates
  const templateHome = await loadTemplate("./pages/home/home.html");
  const templateAbout = await loadTemplate("./pages/about/about.html");
  const templateAllCars = await loadTemplate("./pages/allCars/allCars.html");
  const templateCreateCar = await loadTemplate("./pages/createCar/createCar.html");
  const templatefindCar = await loadTemplate("./pages/findCar/findCar.html");
  const templateEditCar = await loadTemplate("./pages/editCar/editCar.html");

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });

  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({  
      "/": () => {
        renderTemplate(templateHome, "content")
      }, 
      "/about": () => {
        renderTemplate(templateAbout, "content");
      },
      "/allCars": () => {
        renderTemplate(templateAllCars, "content")
        initAllCars()
      },
      "/findCar": (match) => {
        renderTemplate(templatefindCar, "content")
        initFindCar(match)
      },
      "/createCar": () => {
        renderTemplate(templateCreateCar, "content")
        initCreateCar()
        
      },
      "/editCar": (match) => {
        renderTemplate(templateEditCar, "content")
        initEditCar(match)
        
      }
    })
    .notFound(() => {
      //load template for a notfound page
    })
    .resolve();
});


// how to make the navbar size to user privileges idea
//look for user in localstorage, if found
// add the HTML to go to certain links & routing
// the code doing this needs rerunning every time we login/logout




async function loginLogoutClick(evt) {
  evt.stopPropagation()  
  responseStatus.innerText = ""
  const logInWasClicked = evt.target.id === "btn-login" ? true : false
  if (logInWasClicked) {
    const loginRequest = {}
    loginRequest.username = userNameInput.value
    loginRequest.password = passwordInput.value
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginRequest)
    }
    try {
      const res = await fetch(baseURL + "auth/login", options).then(handleHttpErrors)
      storeLoginDetails(res)
    } catch (err) {
      responseStatus.style.color = "red"
      if (err.apiError) {
        responseStatus.innerText = err.apiError.message
      } else {
        responseStatus.innerText = err.message
      }
    }
  } else {
    //Logout was clicked
    clearLoginDetails()
  }
}

function storeLoginDetails(res) {
  localStorage.setItem("token", res.token)
  localStorage.setItem("user", res.username)
  localStorage.setItem("roles", res.roles)
  //Update UI
  toogleLoginStatus(true)
  responseStatus.innerText = ""
}

/**
 * Remove username, roles and token from localStorage, and update UI-status
 */
function clearLoginDetails() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("roles")
  //Update UI
  toogleLoginStatus(false)
  responseStatus.innerText = ""
}


function toogleLoginStatus(loggedIn) {
  loginContainer.style.display = loggedIn ? "none" : "block"
  logoutContainer.style.display = loggedIn ? "block" : "none"
  const statusTxt = loggedIn ? `User: ${localStorage["user"]} (${localStorage["roles"]})` : ""
  userDetails.innerText = statusTxt
}


export function setResponseText(txt, isOK) {
  responseStatus.style.color = isOK ? "darkgreen" : "red"
  responseStatus.innerText = txt
}



