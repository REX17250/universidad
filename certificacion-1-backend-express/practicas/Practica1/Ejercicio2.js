//Evaluador de contraseñas seguras
function evaluarPassword(password){
    let segura = true;
    let insegura = "Contraseña insegura:";
    if(password.length < 8){
        insegura += "falta longitud mínima";
        segura = false;
    }
    if(!/[A-Z]/.test(password)){
        insegura += "falta mayúscula";
        segura = false;
    }
    if(!/[a-z]/.test(password)){
        insegura += "falta minúscula";
        segura = false;
    }
    if(!/[0-9]/.test(password)){
        insegura += "falta número";
        segura = false;
    }
    if(!/[!@#$%&]/.test(password)){
        insegura += "falta carácter símbolo";
        segura = false;
    }


    if(segura)return("Contraseña segura")
    else return(insegura);

}

console.log(evaluarPassword("Abcd1234#"));