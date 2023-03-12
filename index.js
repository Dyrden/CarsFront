// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below


// import all pages init functions

import {
  setActiveLink,
  loadTemplate,
  renderTemplate,
  adjustForMissingHash,
} from "./utils.js";

// import all pages init functions
import {initAllCars} from "./pages/allCars/allCars.js"
import {initCreateCar} from "./pages/createCar/createCar.js"
import {initFindCar} from "./pages/findCar/findCar.js"
import {initEditCar} from "./pages/editCar/editCar.js"

window.addEventListener("load", async () => {
  // html templates
  const templateHome = await loadTemplate("./pages/home/home.html");
  const templateAbout = await loadTemplate("./pages/about/about.html");
  const templateAllCars = await loadTemplate("./pages/allCars/allCars.html");
  const templateCreateCar = await loadTemplate("./pages/createCar/createCar.html");
  const templatefindCar = await loadTemplate("./pages/findCar/findCar.html");
  const templateEditCar = await loadTemplate("./pages/editCar/editCar.html");

  adjustForMissingHash();

  // making our router
  const router = new Navigo("/", { hash: true });

  //not nice but easy, this make the router global and accessable from 'window'
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
