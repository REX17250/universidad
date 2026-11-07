import { url } from "inspector";
import { addText, getContent, getLine, getArrayContent, replaceLine, deleteText} from "./fileServices.js";
import http from "http";
import randomItem from "random-item";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type","application/json");
    let urlParameters = req.url.split("/");
    console.log(urlParameters);

    if(req.method == 'GET' && req.url == '/words'){
        const content = await getContent();
        res.statusCode = 200;
        res.end(JSON.stringify({
            content
        }));
        return;
    }
    //Ejercicio 5
    if(req.method == 'DELETE' && urlParameters[1] == "words" && urlParameters[2]){
        const lineNumber = Number(urlParameters[2])
        if(!Number.isInteger(lineNumber) || lineNumber <= 0){
            res.starusCode = 400;
            res.end(JSON.stringify({error:"Bad request"}));
            return;
        }
        const line = await getLine(lineNumber);
        if(line === undefined){
            res.starusCode = 404;
            res.end(JSON.stringify({error:"Not found"}));
            return;
        }
        await deleteText(lineNumber);
        res.statusCode = 200;
        res.end(JSON.stringify({ "Line Eliminated": lineNumber}));
        return;
    }
    //Ejercicio 4
    if(req.method == 'PATCH' && urlParameters[1] == "words" && urlParameters[2]){
        const lineNumber = Number(urlParameters[2]);
        if(!Number.isInteger(lineNumber) || lineNumber <= 0){
            res.statusCode = 400;
            res.end(JSON.stringify({error: "Bad Request"}));
            return;
        }
        const line = await getLine(lineNumber);
        if(line == undefined){
            res.statusCode = 404;
            res.end(JSON.stringify({error: "Not Found"}));
            return;
        }
        const body = await new Promise((resolve) => {
            let words = "";
            req.on("data", (chunk) => { words += chunk; });
            req.on("end", () => resolve(words));
        });
        const { word } = JSON.parse(body);
        await replaceLine(urlParameters[2], word)
        res.statusCode = 200;
        res.end(JSON.stringify({ line }));
        return;
    }
    //Ejercicio 3
    if(req.method == 'GET' && req.url == '/random-word'){
        const content = await getArrayContent();
        const line = randomItem(content);
        res.statusCode = 200;
        res.end(JSON.stringify({
            line
        }));
        return;
    }
    //Ejercicio 2
    if(req.method == 'GET' && urlParameters[1] == "words" && urlParameters[2]){
        const lineNumber = Number(urlParameters[2]);
        if(!Number.isInteger(lineNumber) || lineNumber <= 0){
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Bad Request" }));
            return;
        }
        const line = await getLine(lineNumber);
        if(line == undefined){
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Not Found" }));
            return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ line }));
        return;
    }
    //Ejercicio 1
    if(req.method == 'POST' && urlParameters[1]=="words"){
        const body = await new Promise((resolve) => {
            let words = "";
            req.on("data", (chunk) => { words += chunk; });
            req.on("end", () => resolve(words));
        });
        const {word} = JSON.parse(body);
        await addText(word);
        res.statusCode = 200;
        let message = word + " fue agregada correctamente"
        res.end(JSON.stringify({        // "acá está tu respuesta, chau"
            "message": message
        }));
        return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({
        "error": "Not method to handle the url"
    }));
});

server.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});