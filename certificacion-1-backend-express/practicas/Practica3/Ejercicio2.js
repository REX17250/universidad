//Consumir una Promise
import { getUser } from "./sandbox.js";

getUser().then(user => console.log(user.name))