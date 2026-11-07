//Consultar información completa de una orden
import { getUser, getOrders, getPaymentStatus, getShippingInfo } from "./sandbox.js"

async function printOrderSummary (userId, orderId){
    try{
        const user = await getUser(userId);
        const orders = await getOrders(userId);

        const order = orders.find(order => orderId === order.id)
        if(order){
            const [PaymentStatus, ShippingInfo] = await Promise.all([getPaymentStatus(orderId), getShippingInfo(orderId)]);
            console.log("User:"+user.name);
            console.log("Order:"+order.product+" - "+ order.price);
            console.log("Payment status:"+PaymentStatus.status);
            console.log("Shipping status:"+ShippingInfo.status);
            console.log("Shipping company:"+ShippingInfo.company);
        }else{
            throw new Error(`Order ${orderId} not found`);
        }
    }catch(error){
        console.log(error);
    }

}

printOrderSummary(1, 1);
printOrderSummary(1, 99);
printOrderSummary(-1, 1);