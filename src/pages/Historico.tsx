
import React, { useState } from 'react';
import { useFinancas } from '@/contexts/FinancasContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

const mesesNomes = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

const formatData = (data: Date) => {
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);
};

const Historico = () => {
  const anoAtual = new Date().getFullYear();
  const { transacoes, removerTransacao, limparTodasTransacoes } = useFinancas();
  
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAno, setFiltroAno] = useState<string>(anoAtual.toString());
  const [filtroMes, setFiltroMes] = useState<string>('todos');
  const [dialogLimparAberto, setDialogLimparAberto] = useState(false);
  
  const anos = Array.from(
    new Set(transacoes.map(t => t.data.getFullYear()))
  ).sort((a, b) => b - a);
  
  if (!anos.includes(anoAtual)) {
    anos.unshift(anoAtual);
  }

  // Filtrar transações com base nos critérios selecionados
  const transacoesFiltradas = transacoes.filter(t => {
    // Filtro por texto na descrição
    if (filtroTexto && !t.descricao.toLowerCase().includes(filtroTexto.toLowerCase())) {
      return false;
    }
    
    // Filtro por tipo
    if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) {
      return false;
    }
    
    // Filtro por ano
    if (t.data.getFullYear().toString() !== filtroAno) {
      return false;
    }
    
    // Filtro por mês
    if (filtroMes !== 'todos' && t.data.getMonth().toString() !== filtroMes) {
      return false;
    }
    
    return true;
  }).sort((a, b) => b.data.getTime() - a.data.getTime());
  
  // Calcular totais das transações filtradas
  const totalReceitas = transacoesFiltradas
    .filter(t => t.tipo === 'receita')
    .reduce((total, t) => total + t.valor, 0);
    
  const totalDespesas = transacoesFiltradas
    .filter(t => t.tipo === 'despesa')
    .reduce((total, t) => total + t.valor, 0);
    
  const saldoFiltrado = totalReceitas - totalDespesas;

  return (
    <div className="space-y-8 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas transações
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-texto">Descrição</Label>
              <Input
                id="filtro-texto"
                placeholder="Filtrar por descrição"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filtro-tipo">Tipo</Label>
              <Select
                value={filtroTipo}
                onValueChange={setFiltroTipo}
              >
                <SelectTrigger id="filtro-tipo">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filtro-ano">Ano</Label>
              <Select
                value={filtroAno}
                onValueChange={setFiltroAno}
              >
                <SelectTrigger id="filtro-ano">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {anos.map(ano => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filtro-mes">Mês</Label>
              <Select
                value={filtroMes}
                onValueChange={setFiltroMes}
              >
                <SelectTrigger id="filtro-mes">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {mesesNomes.map((mes, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Total de Receitas</p>
              <p className="text-xl font-medium text-emerald-500">
                {formatCurrency(totalReceitas)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Despesas</p>
              <p className="text-xl font-medium text-rose-500">
                {formatCurrency(totalDespesas)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className={`text-xl font-medium ${saldoFiltrado >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatCurrency(saldoFiltrado)}
              </p>
            </div>
          </div>
          
          {/* Lista de transações */}
          {transacoesFiltradas.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {transacoesFiltradas.map((t) => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between p-4 rounded-md bg-card border border-border/50 hover:border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      t.tipo === 'receita' ? "bg-emerald-100 text-emerald-500" : "bg-rose-100 text-rose-500"
                    )}>
                      {t.tipo === 'receita' ? 
                        <ArrowUpCircle className="w-6 h-6" /> : 
                        <ArrowDownCircle className="w-6 h-6" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{t.descricao}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatData(t.data)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "font-semibold",
                      t.tipo === 'receita' ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {t.tipo === 'receita' ? '+' : '-'} {formatCurrency(t.valor)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removerTransacao(t.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma transação encontrada com os filtros selecionados.
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            variant="destructive" 
            onClick={() => setDialogLimparAberto(true)}
            disabled={transacoes.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Histórico
          </Button>
        </CardFooter>
      </Card>
      
      {/* Diálogo de confirmação para limpar histórico */}
      <AlertDialog open={dialogLimparAberto} onOpenChange={setDialogLimparAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar histórico</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir todas as transações? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                limparTodasTransacoes();
                setDialogLimparAberto(false);
              }}
            >
              Excluir tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Historico;
