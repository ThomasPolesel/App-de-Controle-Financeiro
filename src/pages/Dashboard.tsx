
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFinancas } from '@/contexts/FinancasContext';
import { TipoTransacao } from '@/models/Transacao';
import { ArrowDownCircle, ArrowUpCircle, Banknote, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

const Dashboard = () => {
  const { 
    saldoInicial, 
    setSaldoInicial,
    saldoAtual,
    adicionarTransacao,
    transacoes
  } = useFinancas();

  const [novoSaldoInicial, setNovoSaldoInicial] = useState(saldoInicial.toString());
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('receita');

  // Calcular receitas e despesas do mês atual
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const transacoesMes = transacoes.filter(t => 
    t.data.getMonth() === mesAtual && 
    t.data.getFullYear() === anoAtual
  );

  const receitasMes = transacoesMes
    .filter(t => t.tipo === 'receita')
    .reduce((total, t) => total + t.valor, 0);

  const despesasMes = transacoesMes
    .filter(t => t.tipo === 'despesa')
    .reduce((total, t) => total + t.valor, 0);

  // Últimas 5 transações
  const ultimasTransacoes = [...transacoes]
    .sort((a, b) => b.data.getTime() - a.data.getTime())
    .slice(0, 5);

  const atualizarSaldoInicial = () => {
    const valor = parseFloat(novoSaldoInicial);
    if (!isNaN(valor)) {
      setSaldoInicial(valor);
    }
  };

  const submeterTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = parseFloat(valor);
    
    if (descricao.trim() && !isNaN(valorNumerico) && valorNumerico > 0) {
      adicionarTransacao(descricao, valorNumerico, tipo);
      setDescricao('');
      setValor('');
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Saldo Inicial</CardTitle>
            <CardDescription>Configure o valor inicial disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saldo-inicial">Valor Inicial (R$)</Label>
                <div className="flex gap-2">
                  <Input
                    id="saldo-inicial"
                    type="number"
                    value={novoSaldoInicial}
                    onChange={(e) => setNovoSaldoInicial(e.target.value)}
                    placeholder="0,00"
                  />
                  <Button onClick={atualizarSaldoInicial}>Atualizar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Nova Transação</CardTitle>
            <CardDescription>Adicione receitas ou despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submeterTransacao} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Conta de luz, Salário, etc."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={tipo}
                    onValueChange={(value) => setTipo(value as TipoTransacao)}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Adicionar Transação
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Atual
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldoAtual)}</div>
            <p className="text-xs text-muted-foreground">
              Saldo inicial: {formatCurrency(saldoInicial)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receitas do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(receitasMes)}</div>
            <p className="text-xs text-muted-foreground">
              {transacoesMes.filter(t => t.tipo === 'receita').length} transações
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas do Mês
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">{formatCurrency(despesasMes)}</div>
            <p className="text-xs text-muted-foreground">
              {transacoesMes.filter(t => t.tipo === 'despesa').length} transações
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            As últimas 5 transações registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ultimasTransacoes.length > 0 ? (
            <ul className="space-y-4">
              {ultimasTransacoes.map((t) => (
                <li 
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-md bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      t.tipo === 'receita' ? "bg-emerald-100 text-emerald-500" : "bg-rose-100 text-rose-500"
                    )}>
                      {t.tipo === 'receita' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{t.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.data.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    t.tipo === 'receita' ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {t.tipo === 'receita' ? '+' : '-'} {formatCurrency(t.valor)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Nenhuma transação registrada ainda.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href="/historico">Ver histórico completo</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
