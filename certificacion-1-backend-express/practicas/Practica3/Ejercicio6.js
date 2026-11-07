//Menejo de errores
import {getOrders} from "./sandbox.js"

function test1(id) {
    getOrders(id)
    .then(order => console.log(order))
    .catch(error => console.log(error));
}

async function test2(id) {
    try{
        const orders = await getOrders(id);
        console.log(orders);
    }catch(error){
        console.log(error);
    }
}

test1(-1);
test1(1);
test2(-1);
test2(1);