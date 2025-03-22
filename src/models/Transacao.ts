
export type TipoTransacao = 'receita' | 'despesa';

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: Date;
}

export interface BalancoMensal {
  mes: number;
  ano: number;
  receitas: number;
  despesas: number;
  saldo: number;
}
