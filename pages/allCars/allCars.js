import {getURL} from "../../settings.js"
import { sanitizeStringWithTableRows } from "../../utils.js"

let carsData


export function initAllCars() {
    document.getElementById("btn-get-all").onclick = getCars
    if(!carsData == 0) {
        showData(carsData)
    }

}

async function getCars() {

    const options = {
        method: "GET"
    }
    try {
        const cars = await fetch(getURL(),options).then(res => res.json())
        carsData = cars
        showData(cars)        
    } catch (error) {

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