//Encadenar Promises
import { getUser, getOrders } from "./sandbox.js";

function printOrdersByUser(id){
    getUser(id)
    .then(user => {
        console.log(user); 
        return getOrders(id)
    })
    .then(order => console.log(order))
    .catch(error => console.log(error))
}

printOrdersByUser(-1);
printOrdersByUser(1);
