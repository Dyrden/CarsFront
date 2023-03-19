import {URL} from "../../settings.js"
import {setResponseText} from "../../index.js"
import { handleHttpErrors } from "../../utils.js"


export function initCreateCar(){
    
    document.getElementById("submit-car").onclick = (evt) => {
        addCar(getCarDetails())
    }
}


function getCarDetails() {
    const car = {}
    car.model = document.getElementById("input-field1").value
    car.brand = document.getElementById("input-field2").value
    car.pricePerDay = document.getElementById("input-field3").value
    car.bestDiscount = document.getElementById("input-field4").value
    return car
}

  
  async function addCar(car) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(car),
    }
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            setResponseText("You must login to use this feature", false)
            return
        }
        options.headers.Authorization = "Bearer " + token
        

        const data = await fetch(URL,options).then(handleHttpErrors)
        document.getElementById("added-model").innerHTML = "Model: " + 
        "<span>"+ data?.model +"</span>"
        document.getElementById("added-brand").innerHTML = "Brand: " +
        "<span>"+ data?.brand +"</span>"
        document.getElementById("added-price-per-day").innerHTML = "Price per day: " +
        "<span>"+ data?.pricePerDay +"</span>"
        document.getElementById("added-best-discount").innerHTML = "Best discount: " +
        "<span>"+ data?.bestDiscount +"</span>"
    } catch (err) {
        if (err.apiError) {
            setResponseText(err.apiError.message, false)
        } else {
            setResponseText(err.message, false)
        }
    
      }
  }




