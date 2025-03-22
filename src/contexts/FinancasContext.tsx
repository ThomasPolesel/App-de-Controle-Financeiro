
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transacao, TipoTransacao, BalancoMensal } from '../models/Transacao';
import { toast } from "sonner";

// Interface do contexto
interface FinancasContextType {
  saldoInicial: number;
  setSaldoInicial: (valor: number) => void;
  saldoAtual: number;
  transacoes: Transacao[];
  adicionarTransacao: (descricao: string, valor: number, tipo: TipoTransacao) => void;
  removerTransacao: (id: string) => void;
  balancoMensal: (mes: number, ano: number) => BalancoMensal;
  balancoAnual: (ano: number) => BalancoMensal[];
  limparTodasTransacoes: () => void;
}

// Criação do contexto
const FinancasContext = createContext<FinancasContextType | undefined>(undefined);

// Provider
export const FinancasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados
  const [saldoInicial, setSaldoInicial] = useState<number>(() => {
    const salvo = localStorage.getItem('saldoInicial');
    return salvo ? parseFloat(salvo) : 0;
  });
  
  const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
    const salvo = localStorage.getItem('transacoes');
    if (salvo) {
      const parsedTransacoes = JSON.parse(salvo);
      // Converte as strings de data para objetos Date
      return parsedTransacoes.map((t: any) => ({
        ...t,
        data: new Date(t.data)
      }));
    }
    return [];
  });

  // Efeito para salvar o saldo inicial no localStorage
  useEffect(() => {
    localStorage.setItem('saldoInicial', saldoInicial.toString());
  }, [saldoInicial]);

  // Efeito para salvar as transações no localStorage
  useEffect(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  // Calcular saldo atual
  const saldoAtual = transacoes.reduce((total, transacao) => {
    return transacao.tipo === 'receita' 
      ? total + transacao.valor 
      : total - transacao.valor;
  }, saldoInicial);

  // Adicionar transação
  const adicionarTransacao = (descricao: string, valor: number, tipo: TipoTransacao) => {
    const novaTransacao: Transacao = {
      id: crypto.randomUUID(),
      descricao,
      valor,
      tipo,
      data: new Date()
    };
    
    setTransacoes([...transacoes, novaTransacao]);
    toast.success(tipo === 'receita' ? 'Receita adicionada' : 'Despesa adicionada');
  };

  // Remover transação
  const removerTransacao = (id: string) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
    toast.success('Transação removida');
  };

  // Limpeza completa
  const limparTodasTransacoes = () => {
    setTransacoes([]);
    toast.success('Todas as transações foram removidas');
  };

  // Balanço mensal
  const balancoMensal = (mes: number, ano: number): BalancoMensal => {
    const transacoesFiltradas = transacoes.filter(t => {
      return t.data.getMonth() === mes && t.data.getFullYear() === ano;
    });

    const receitas = transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0);
      
    const despesas = transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0);

    return {
      mes,
      ano,
      receitas,
      despesas,
      saldo: receitas - despesas
    };
  };

  // Balanço anual
  const balancoAnual = (ano: number): BalancoMensal[] => {
    const meses = [];
    for (let i = 0; i < 12; i++) {
      meses.push(balancoMensal(i, ano));
    }
    return meses;
  };

  // Valor do contexto
  const value: FinancasContextType = {
    saldoInicial,
    setSaldoInicial,
    saldoAtual,
    transacoes,
    adicionarTransacao,
    removerTransacao,
    balancoMensal,
    balancoAnual,
    limparTodasTransacoes
  };

  return (
    <FinancasContext.Provider value={value}>
      {children}
    </FinancasContext.Provider>
  );
};

// Hook para usar o contexto
export const useFinancas = (): FinancasContextType => {
  const context = useContext(FinancasContext);
  if (context === undefined) {
    throw new Error('useFinancas deve ser usado dentro de um FinancasProvider');
  }
  return context;
};
