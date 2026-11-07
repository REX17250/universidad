import { FILE } from "dns";
import fs from "fs/promises";

const FILE_PATH = "./content.txt";

export async function addText(text){
    await fs.appendFile(FILE_PATH,text+"\n");
}

export async function deleteText(line){
    const content = await fs.readFile(FILE_PATH, "utf-8");
    const lines = content.split("\n");
    lines.splice(line - 1, 1);
    await fs.writeFile(FILE_PATH, lines.join('\n'), "utf-8");
}

export async function replaceLine(line, word){
    const content = await fs.readFile(FILE_PATH,"utf-8");
    const lines = content.split("\n")
    lines[line - 1] = word;
    await fs.writeFile(FILE_PATH, lines.join("\n"),"utf-8")
}

export async function getContent(){
    try{
        const content = await fs.readFile(FILE_PATH,"utf-8");
        return content;
    }catch(error){
        if(error.code === "ENOENT"){
            console.log(`File in path ${FILE_PATH} does not exist`);
            return "";
        }
        throw error;
    }
}

export async function getArrayContent(){
    try{
        const content = await fs.readFile(FILE_PATH,"utf-8");
        const array = content.split("\n")
        return array;
    }catch(error){
        if(error.code === "ENOENT"){
            console.log(`File in path ${FILE_PATH} does not exist`);
            return "";
        }
        throw error;
    }
}

export async function getLine(line){
    try{
        const content = await fs.readFile(FILE_PATH,"utf-8");
        const lines = content.split("\n")
        return lines[line-1];
    }catch(error){
        if(error.code === "ENOENT"){
            console.log(`Line in file ${FILE_PATH} does not exist`);
            return "";
        }
        throw error;
    }
}