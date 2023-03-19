import {URL} from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import {setResponseText} from "../../index.js"

let carsData


export function initAllCars() {
    document.getElementById("btn-get-all").onclick = getCars
    if(!carsData == 0) {
        showData(carsData)
    }

}

async function getCars() {

    const options = {
        method: "GET",
        headers: { "Accept": "application/json" }
    }
    try {
        const cars = await fetch(URL,options).then(handleHttpErrors)
        carsData = cars
        showData(cars)        
    } catch (err) {
        if (err.apiError) {
            setResponseText(err.apiError.message, false)
        } else {
            setResponseText(err.message, false)
        }
    
    }
}

function showData(data) {
    const tableRowData = data.map(car => `
    <tr>
        <td>${car?.model}</td>
        <td>${car?.brand}</td>
        <td>${car?.pricePerDay}</td>
        <td>${car?.bestDiscount}</td>
    </tr>`)

    const tableRowString = tableRowData.join("\n")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(tableRowString)
}