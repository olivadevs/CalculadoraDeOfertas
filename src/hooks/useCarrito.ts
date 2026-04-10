import { useState, useMemo } from "react";

// Tipo de cada ítem en el carrito
export interface ItemCarrito {
  id: string;
  precioOriginal: number;
  precioFinal: number;
}

// Tipo del objeto que devuelve el hook
export interface UseCarritoReturn {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "id">) => void;
  eliminar: (id: string) => void;
  vaciar: () => void;
  totalFinal: number;
  totalAhorrado: number;
}

export function useCarrito(): UseCarritoReturn {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  // Agrega un nuevo ítem al carrito generando un id único
  const agregar = (item: Omit<ItemCarrito, "id">) => {
    const nuevoItem: ItemCarrito = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    setItems((prev) => [...prev, nuevoItem]);
  };

  // Elimina un ítem por su id
  const eliminar = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Vacía el carrito completo
  const vaciar = () => setItems([]);

  // Total a pagar (suma de precios finales)
  const totalFinal = useMemo(
    () => items.reduce((acc, item) => acc + item.precioFinal, 0),
    [items]
  );

  // Total ahorrado (diferencia entre precios originales y finales)
  const totalAhorrado = useMemo(
    () => items.reduce((acc, item) => acc + (item.precioOriginal - item.precioFinal), 0),
    [items]
  );

  return { items, agregar, eliminar, vaciar, totalFinal, totalAhorrado };
}
