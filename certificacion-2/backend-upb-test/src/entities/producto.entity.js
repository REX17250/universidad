class Producto {
    constructor(id, nombre, precio, stock, createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.precio = Number(precio);
        this.stock = Number(stock);
        this.createdAt = createdAt;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Producto(row.id, row.nombre, row.precio, row.stock, row.created_at);
    }
}

module.exports = Producto;