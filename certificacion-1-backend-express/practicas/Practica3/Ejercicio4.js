//Async/Await
import { getUser, getOrders } from "./sandbox.js";

async function printOrdersByUser (id){
    try {
        const user = await getUser(id);
        console.log(user);
        const order = await getOrders(id);
        console.log(order)

    }catch(error){
        console.log(error);
    }
}

printOrdersByUser(-1);
printOrdersByUser(0);