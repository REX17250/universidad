"""Conexión a SQLite y creación del esquema."""

import os
import sqlite3
from collections.abc import Iterator
from pathlib import Path
from typing import Annotated

from fastapi import Depends

RUTA_POR_DEFECTO = "datos/organizador.db"

ESQUEMA = """
CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    nombre_normalizado TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_id INTEGER NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT NULL,
    fecha_entrega TEXT NOT NULL,
    completada INTEGER NOT NULL DEFAULT 0 CHECK (completada IN (0, 1)),
    creada_en TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tareas_entrega ON tareas (fecha_entrega, id);
"""


def ruta_base() -> Path:
    """Ruta del archivo SQLite; se lee en cada llamada para que las pruebas puedan cambiarla."""
    ruta = Path(os.environ.get("ORGANIZADOR_DB", RUTA_POR_DEFECTO))
    ruta.parent.mkdir(parents=True, exist_ok=True)
    return ruta


def conectar() -> sqlite3.Connection:
    # check_same_thread=False: FastAPI puede abrir y usar la conexión en hilos distintos.
    conexion = sqlite3.connect(ruta_base(), check_same_thread=False)
    conexion.execute("PRAGMA foreign_keys = ON")
    conexion.row_factory = sqlite3.Row
    return conexion


def crear_esquema(conexion: sqlite3.Connection) -> None:
    conexion.executescript(ESQUEMA)
    conexion.commit()


def obtener_conexion() -> Iterator[sqlite3.Connection]:
    """Dependencia de FastAPI: una conexión por petición, con commit al terminar sin errores."""
    conexion = conectar()
    try:
        yield conexion
        conexion.commit()
    finally:
        conexion.close()


# Tipo para inyectar la conexión en las rutas: `conexion: Conexion`.
Conexion = Annotated[sqlite3.Connection, Depends(obtener_conexion)]
