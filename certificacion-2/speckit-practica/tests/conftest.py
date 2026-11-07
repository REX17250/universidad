from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from app.main import app

# Reloj fijo para las pruebas. La sustitución de obtener_ahora (app/fechas.py) con
# app.dependency_overrides se añade en la Fase 4 (T026), cuando ese módulo exista.
AHORA = datetime(2026, 10, 26, 10, 0)


@pytest.fixture
def ruta_db(tmp_path, monkeypatch):
    ruta = tmp_path / "organizador.db"
    monkeypatch.setenv("ORGANIZADOR_DB", str(ruta))
    return ruta


@pytest.fixture
def cliente(ruta_db):
    # "with" ejecuta el lifespan, que crea el esquema en la base temporal.
    with TestClient(app) as cliente_prueba:
        yield cliente_prueba
    app.dependency_overrides.clear()


@pytest.fixture
def crear_materia():
    def _crear(cliente, nombre, color="azul"):
        respuesta = cliente.post("/api/materias", json={"nombre": nombre, "color": color})
        assert respuesta.status_code == 201, respuesta.text
        return respuesta.json()

    return _crear
