"""Rutas de la API para colores y materias."""

import sqlite3

from fastapi import APIRouter, HTTPException

from app.basedatos import Conexion
from app.colores import PALETA
from app.esquemas import MateriaEntrada, MateriaSalida
from app.textos import normalizar_nombre

router = APIRouter(prefix="/api")

CONSULTA_MATERIAS = """
SELECT m.id, m.nombre, m.color, COUNT(t.id) AS cantidad_tareas
FROM materias AS m
LEFT JOIN tareas AS t ON t.materia_id = m.id
{filtro}
GROUP BY m.id
ORDER BY m.nombre_normalizado, m.id
"""


def _buscar_materia(conexion: sqlite3.Connection, id_materia: int) -> MateriaSalida:
    fila = conexion.execute(
        CONSULTA_MATERIAS.format(filtro="WHERE m.id = ?"), (id_materia,)
    ).fetchone()
    return MateriaSalida(**dict(fila))


def _error_duplicado(conexion: sqlite3.Connection, nombre_normalizado: str) -> HTTPException:
    # El mensaje muestra el nombre tal como lo registró el estudiante, no el que intentó repetir.
    existente = conexion.execute(
        "SELECT nombre FROM materias WHERE nombre_normalizado = ?", (nombre_normalizado,)
    ).fetchone()
    return HTTPException(
        status_code=409,
        detail=f"Ya existe una materia llamada «{existente['nombre']}». Elige otro nombre.",
    )


@router.get("/colores")
def listar_colores() -> list[dict]:
    return PALETA


@router.get("/materias")
def listar_materias(conexion: Conexion) -> list[MateriaSalida]:
    filas = conexion.execute(CONSULTA_MATERIAS.format(filtro="")).fetchall()
    return [MateriaSalida(**dict(fila)) for fila in filas]


@router.post("/materias", status_code=201)
def crear_materia(entrada: MateriaEntrada, conexion: Conexion) -> MateriaSalida:
    nombre_normalizado = normalizar_nombre(entrada.nombre)
    try:
        cursor = conexion.execute(
            "INSERT INTO materias (nombre, nombre_normalizado, color) VALUES (?, ?, ?)",
            (entrada.nombre, nombre_normalizado, entrada.color),
        )
    except sqlite3.IntegrityError as error:
        raise _error_duplicado(conexion, nombre_normalizado) from error
    return _buscar_materia(conexion, cursor.lastrowid)
