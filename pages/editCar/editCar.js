import { URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";
import { setResponseText } from "../../index.js";

export function initEditCar(match) {
  document.getElementById("btn-find-car-to-edit").onclick = fetchCarData;
  document.getElementById("btn-submit-edited-car").onclick = editCarData;
  document.getElementById("submitted").innerText = ""
  if (match?.params?.id) {
    try {
      const id = match?.params?.id;
      document.getElementById("text-for-id").value = id;
      renderCar(id);
    } catch (error) {
      document.getElementById("error").innerText = "Could not find user";
    }
  }
}

const naviRoute = "editCar";

async function fetchCarData() {
  const id = document.getElementById("text-for-id").value;
  if (!id) {
    document.getElementById("error").innerText = "Please provide an ID";
    return;
  }
  try {
    renderCar(id);
    const queryString = "?id=" + id;
    window.router.navigate(`/${naviRoute}${queryString}`, {
      callHandler: false,
      updateBrowserURL: true,
    });
  } catch (error) {
    console.log("oh nej: " + error.message);
  }
}


async function editCarData() {
  try {
    const car = {};
    car.model = document.getElementById("text-for-model").value;
    car.brand = document.getElementById("text-for-brand").value;
    car.pricePerDay = document.getElementById("text-for-price-per-day").value;
    car.bestDiscount = document.getElementById("text-for-best-discount").value;

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    };

    const token = localStorage.getItem("token")
    if (!token) {
      setResponseText("You must login to use this feature", false)
      return
    }
    options.headers.Authorization = "Bearer " + token
    

    const id = document.getElementById("text-for-id").value;
    const data = await fetch(URL + "/" + id, options).then(handleHttpErrors);

    if (data) {
      document.getElementById("submitted").innerText = "Submitted!"

    }

  } catch (err) {
      if (err.apiError) {
        setResponseText(err.apiError.message, false)
    } else {
        setResponseText(err.message, false)
    }

  }
}

async function renderCar(id) {
  try {
    const options = {
      method : "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const token = localStorage.getItem("token")
    if (!token) {
      setResponseText("You must login to use this feature", false)
      return
    }
    options.headers.Authorization = "Bearer " + token

    const car = await fetch(URL + "/" + id, options).then(handleHttpErrors);

    if (!Object.keys(car).includes("id")) {
      throw new Error("No car found for id:" + id);
    }

    document.getElementById("text-for-model").value = car.model;
    document.getElementById("text-for-brand").value = car.brand;
    document.getElementById("text-for-price-per-day").value = car.pricePerDay;
    document.getElementById("text-for-best-discount").value = car.bestDiscount;
  }  catch (err) {
    if (err.apiError) {
      setResponseText(err.apiError.message, false)
  } else {
      setResponseText(err.message, false)
  }

}
}
