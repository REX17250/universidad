//Usa Promise.all
import { getUser, getProductList } from "./sandbox.js";

async function getData (){
    try{
        const data = await Promise.all([getUser(), getProductList()]);
        console.log(data)
    }catch(error){
        console.log(error);
    }
}

getData();