"""Aplicación FastAPI: API REST bajo /api y frontend estático en /."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.basedatos import conectar, crear_esquema
from app.errores import registrar_manejadores
from app.rutas_materias import router as router_materias

CARPETA_ESTATICOS = Path(__file__).parent / "static"


@asynccontextmanager
async def ciclo_de_vida(_app: FastAPI):
    conexion = conectar()
    try:
        crear_esquema(conexion)
    finally:
        conexion.close()
    yield


app = FastAPI(title="Organizador de Tareas UPB", lifespan=ciclo_de_vida)
registrar_manejadores(app)

# Los routers de /api se registran ANTES de montar los estáticos en "/".
app.include_router(router_materias)

app.mount("/", StaticFiles(directory=CARPETA_ESTATICOS, html=True), name="estaticos")
