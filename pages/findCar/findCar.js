import {URL} from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { setResponseText } from "../../index.js"

export async function initFindCar(match) {
    document.getElementById("error").innerText = ""
    document.getElementById("btn-get-car").onclick = fetchCarData
    if (match?.params?.id) {
        try{
            const id = match.params.id
            renderCar(id)
        } catch (error) {
            document.getElementById("error").innerText = "Could not find user"
            console.log(error)
        }
    } 
}

const naviRoute = "findCar"


async function fetchCarData()
 {
    const id = document.getElementById("text-for-id").value
    if (!id) {
        document.getElementById("error").innerText = "Please provide an ID"
        return
    }
    try {
        renderCar(id)
        const queryString = "?id=" + id
        window.router.navigate(`/${naviRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
        
    } catch (error) {
        console.log("oh nej: " + error.message)
        
    }
    
    
    
}

async function renderCar(id) {
    document.getElementById("text-for-id").value = ""
    try {
        const options = {
            method : "GET", 
            headers : {
                "Context-Type" : "application/json"
            }
        }

        const token = localStorage.getItem("token")
        if (!token) {
          setResponseText("You must login to use this feature", false)
          return
        }
        options.headers.Authorization = "Bearer " + token
        

        const car = await fetch(URL + "/" + id, options).then(handleHttpErrors)        
        
        if (!Object.keys(car).includes("id")) {  
            throw new Error("No car found for id:" + id)
          }
      
        
        document.getElementById("model").innerText = car.model
        document.getElementById("brand").innerText = car.brand
        document.getElementById("price-per-day").innerText = car.pricePerDay
        document.getElementById("best-discount").innerText = car.bestDiscount
        
    } catch (err) {
        if (err.apiError) {
          setResponseText(err.apiError.message, false)
      } else {
          setResponseText(err.message, false)
      }
  
    }




    
}

