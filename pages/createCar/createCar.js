import {getURL} from "../../settings.js"


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
        const res = await fetch(getURL(),options)
        const data = await res.json()
        document.getElementById("added-model").innerHTML = "Model: " + 
        "<span>"+ data?.model +"</span>"
        document.getElementById("added-brand").innerHTML = "Brand: " +
        "<span>"+ data?.brand +"</span>"
        document.getElementById("added-price-per-day").innerHTML = "Price per day: " +
        "<span>"+ data?.pricePerDay +"</span>"
        document.getElementById("added-best-discount").innerHTML = "Best discount: " +
        "<span>"+ data?.bestDiscount +"</span>"
    } catch (error) {
        console.log("ups")
        
    }


  }




