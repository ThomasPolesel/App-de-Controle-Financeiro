
import React, { useState } from 'react';
import { useFinancas } from '@/contexts/FinancasContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, ResponsiveContainer, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const Graficos = () => {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth();
  
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual.toString());
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual.toString());
  
  const { balancoAnual, balancoMensal, transacoes } = useFinancas();
  
  // Dados para gráficos anuais
  const dadosAnuais = balancoAnual(parseInt(anoSelecionado)).map(balanco => ({
    name: mesesNomes[balanco.mes],
    Receitas: balanco.receitas,
    Despesas: balanco.despesas,
    Saldo: balanco.saldo
  }));

  // Dados para gráficos mensais
  const dadosMensais = (() => {
    const mes = parseInt(mesSelecionado);
    const ano = parseInt(anoSelecionado);
    
    const transacoesMes = transacoes.filter(t => 
      t.data.getMonth() === mes && 
      t.data.getFullYear() === ano
    );
    
    // Agrupa transações por categoria (descrição) para o gráfico de pizza
    const categorias: Record<string, { receitas: number, despesas: number }> = {};
    
    transacoesMes.forEach(t => {
      if (!categorias[t.descricao]) {
        categorias[t.descricao] = { receitas: 0, despesas: 0 };
      }
      
      if (t.tipo === 'receita') {
        categorias[t.descricao].receitas += t.valor;
      } else {
        categorias[t.descricao].despesas += t.valor;
      }
    });
    
    // Dados para o gráfico de pizza
    const dadosPizza = Object.entries(categorias).map(([nome, valores]) => ({
      name: nome,
      Receitas: valores.receitas,
      Despesas: valores.despesas,
      value: valores.receitas + valores.despesas
    }));
    
    // Calcular o total de receitas e despesas para o mês
    const balanco = balancoMensal(mes, ano);
    
    return {
      categorias: dadosPizza,
      receitas: balanco.receitas,
      despesas: balanco.despesas,
      saldo: balanco.saldo
    };
  })();

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Gerar anos para o select
  const anos = [];
  for (let i = anoAtual - 10; i <= anoAtual; i++) {
    anos.push(i);
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Selecione o período para visualização</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Select 
                value={anoSelecionado}
                onValueChange={setAnoSelecionado}
              >
                <SelectTrigger id="ano">
                  <SelectValue placeholder="Selecione o ano" />
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
              <Label htmlFor="mes">Mês</Label>
              <Select 
                value={mesSelecionado}
                onValueChange={setMesSelecionado}
              >
                <SelectTrigger id="mes">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {mesesNomes.map((mes, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
            <CardDescription>
              {mesesNomes[parseInt(mesSelecionado)]} de {anoSelecionado}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-xl font-medium text-emerald-500">{formatCurrency(dadosMensais.receitas)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-xl font-medium text-rose-500">{formatCurrency(dadosMensais.despesas)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`text-xl font-medium ${dadosMensais.saldo >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatCurrency(dadosMensais.saldo)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="anual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anual">Visão Anual</TabsTrigger>
          <TabsTrigger value="mensal">Visão Mensal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="anual">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Anual</CardTitle>
                <CardDescription>Receitas e despesas ao longo do ano {anoSelecionado}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosAnuais}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="Receitas" fill="#10b981" />
                      <Bar dataKey="Despesas" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saldo Mensal</CardTitle>
                <CardDescription>Evolução do saldo ao longo do ano {anoSelecionado}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dadosAnuais}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Saldo"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mensal">
          <Card>
            <CardHeader>
              <CardTitle>Transações por Categoria</CardTitle>
              <CardDescription>
                {mesesNomes[parseInt(mesSelecionado)]} de {anoSelecionado}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dadosMensais.categorias.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosMensais.categorias}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosMensais.categorias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">
                    Nenhuma transação registrada neste período.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Graficos;
