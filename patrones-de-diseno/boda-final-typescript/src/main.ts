import { SistemaDeAudio } from './command/receiver/SistemaDeAudio';
import { SistemaDeNotificaciones } from './observer/subject/SistemaDeNotificaciones';
import {
  PantallaGiganteObserver,
  LucesLaserObserver,
  MaquinaDeHumoObserver,
  GuardaespaldsDonaldObserver,
  GuardaespaldasMaduoObserver,
  WeddingPlannerObserver,
  GarrixObserver,
  FinDelMundoObserver,
} from './observer/concretos';
import { Solicitante } from './command/pelea/Solicitante';
import { AsistenteDeFuria } from './factory-method/concretos/AsistenteDeFuria';
import { PeleaDiplomatica } from './command/pelea/PeleaDiplomatica';
import { TornamesaDeGarrix } from './command/invoker/TornamesaDeGarrix';
import {
  CancionBase,
  EfectoGarrixDecorator,
  EfectoTrumpDecorator,
  EfectoMaduoDecorator,
} from './decorator';
import { AsistenteDeDonald } from './factory-method/concretos/AsistenteDeDonald';
import { AsistenteDeMaduro } from './factory-method/concretos/AsistenteDeMaduro';

// 1. Presentacion del evento
console.log('========================================');
console.log('BIENVENIDOS A LA BODA DEL SIGLO');
console.log('DJ: Martin Garrix');
console.log('Novios: Donald Trump y Nicolas Maduro');
console.log('========================================');

// 2. Crear Receiver
const sistemaDeAudio = new SistemaDeAudio();

// 3. Crear Subject del Observer
const notificador = new SistemaDeNotificaciones();

// 4. Crear y suscribir todos los Observers
const pantalla = new PantallaGiganteObserver();
const luces = new LucesLaserObserver();
const humo = new MaquinaDeHumoObserver();
const guardaDonald = new GuardaespaldsDonaldObserver();
const guardaMaduro = new GuardaespaldasMaduoObserver();
const weddingPlanner = new WeddingPlannerObserver();
const garrixObs = new GarrixObserver();
const cronista = new FinDelMundoObserver();

notificador.suscribir(pantalla);
notificador.suscribir(luces);
notificador.suscribir(humo);
notificador.suscribir(guardaDonald);
notificador.suscribir(guardaMaduro);
notificador.suscribir(weddingPlanner);
notificador.suscribir(garrixObs);
notificador.suscribir(cronista);

// 5. Crear Solicitantes
const donald = new Solicitante('Donald Trump', 'YMCA', 9, true, true);
const maduro = new Solicitante('Nicolas Maduro', 'El Carnaval del Mundo', 7, false, true);

// 6. Crear AsistenteDeFuria (Factory Method especial)
const asistenteFuria = new AsistenteDeFuria(notificador);

// 7. Crear PeleaDiplomatica
const pelea = new PeleaDiplomatica(donald, maduro);

// 8. Crear Invoker con sus dependencias
const tornamesa = new TornamesaDeGarrix(pelea, asistenteFuria, sistemaDeAudio);

// 9. Demostrar Decorator antes de empezar las peleas
console.log('--- DEMO DE CANCIONES DECORADAS ---');

const cancionDonald = new EfectoGarrixDecorator(
  new EfectoTrumpDecorator(new CancionBase('YMCA', 'Village People'))
);
console.log('Cancion de Donald: ' + cancionDonald.descripcion());
cancionDonald.reproducir();

const cancionMaduo = new EfectoGarrixDecorator(
  new EfectoMaduoDecorator(new CancionBase('El Carnaval del Mundo', 'Carlos Vives'))
);
console.log('Cancion de Maduro: ' + cancionMaduo.descripcion());
cancionMaduo.reproducir();

// 10. Loop principal de peleas
console.log('--- INICIO DE LA BODA - COMIENZAN LAS PELEAS ---');

for (let ronda = 1; ronda <= 10; ronda++) {
  console.log('--- RONDA ' + ronda + ' ---');

  const petDonald = new AsistenteDeDonald().procesarPeticion(sistemaDeAudio);
  const petMaduro = new AsistenteDeMaduro().procesarPeticion(sistemaDeAudio);

  tornamesa.agregarPeticion(petDonald);
  tornamesa.agregarPeticion(petMaduro);
  tornamesa.procesarCola();

  notificador.notificar({
    tipoEvento: 'PELEA_RESUELTA',
    cancionActual: 'cancion del ganador',
    solicitante: 'ganador de la ronda',
    ganador: pelea.ultimoGanador ?? 'desconocido',
    perdedor: pelea.ultimoPerdedor ?? 'desconocido',
  });
}

console.log('La boda termino sin incidentes diplomaticos mayores.');
