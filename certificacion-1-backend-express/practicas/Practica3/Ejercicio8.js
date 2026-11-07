//Obtener detalles de productos de forma paralela
import{getProductList, getProductDetail} from "./sandbox.js"

async function printAvailableProductDetails (){
    try{
        const products = await getProductList();
        const detail = await Promise.all (products.map(product => getProductDetail(product)));
        const filter = detail.filter(productDetail => productDetail.stock > 0);
        console.log("Available Products:")
        console.log(filter)
    }catch(error){
        console.log(error);
    }   
}

printAvailableProductDetails();