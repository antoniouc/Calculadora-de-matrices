import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import './matrices.css';

// Definimos el tipo de la matriz como un array de arrays de números
type Matriz = number[][];

// Componente para ingresar matrices
interface MatrizInputProps {
  matriz: Matriz;
  setMatriz: React.Dispatch<React.SetStateAction<Matriz>>;
  label: string;
}

const MatrizInput: React.FC<MatrizInputProps> = ({ matriz, setMatriz, label }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newMatriz = matriz.map((row, i) => 
      row.map((val, j) => (i === rowIndex && j === colIndex ? parseFloat(e.target.value) || 0 : val))
    );
    setMatriz(newMatriz);
  };

  return (
    <div className='matriz-container'>
      <h3>{label}</h3>
      {matriz.map((row, rowIndex) => (
        <div className='matriz-row' key={rowIndex}>
          {row.map((col, colIndex) => (
            <input
            className='matriz-inputs'
              key={colIndex}
              type="number"
              value={col}
              onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const CalculadoraMatrices: React.FC = () => {
  // Estado de las matrices y operación
  const [matriz1, setMatriz1] = useState<Matriz>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);

  const [matriz2, setMatriz2] = useState<Matriz>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);

  const [resultado, setResultado] = useState<Matriz>([]);
  const [operacion, setOperacion] = useState<string>("sumar");

  // Validación con Zod
  const matrizSchema = z.array(z.array(z.number()));

  const validarMatrices = (): boolean => {
    try {
      matrizSchema.parse(matriz1);
      matrizSchema.parse(matriz2);
      return true;
    } catch (error) {
      alert("Las matrices son inválidas.");
      return false;
    }
  };

  // Función para realizar la operación aritmética
  const calcularResultado = () => {
    if (!validarMatrices()) return;

    let nuevoResultado: Matriz;

    switch (operacion) {
      case "sumar":
        nuevoResultado = matriz1.map((fila, i) =>
          fila.map((valor, j) => valor + matriz2[i][j])
        );
        break;
      case "restar":
        nuevoResultado = matriz1.map((fila, i) =>
          fila.map((valor, j) => valor - matriz2[i][j])
        );
        break;
      case "multiplicar":
        nuevoResultado = matriz1.map((fila, i) =>
          matriz2[0].map((_, j) =>
            fila.reduce((acc, _, n) => acc + matriz1[i][n] * matriz2[n][j], 0)
          )
        );
        break;
      default:
        nuevoResultado = [];
    }

    setResultado(nuevoResultado);
  };

  // Efecto que calcula el resultado cada vez que cambien las matrices o la operación
  useEffect(() => {
    calcularResultado();
  }, [matriz1, matriz2, operacion]);

  return (
    <div className='calculadora-container'>
      <h1>Calculadora de Matrices</h1>
      <div className='contenedor-matrices'>
      <MatrizInput  matriz={matriz1} setMatriz={setMatriz1} label="Matriz 1" />
      <MatrizInput matriz={matriz2} setMatriz={setMatriz2} label="Matriz 2" />
      </div>
      <div>
        <label>Operación: </label>
        <select value={operacion} onChange={(e) => setOperacion(e.target.value)}>
          <option value="sumar">Sumar</option>
          <option value="restar">Restar</option>
          <option value="multiplicar">Multiplicar</option>
        </select>
      </div>

      {resultado.length > 0 && (
        <div className='resultado-container'>
          <h3>Resultado</h3>
          {resultado.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((col, colIndex) => (
                <span key={colIndex}>{col} </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculadoraMatrices;

