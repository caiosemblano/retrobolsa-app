import { ArrowLeft, BookOpenText, Database, Gauge, School, Target, Trophy, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

/** Os níveis, na mesma escala da API (Levels.java). */
const niveis: [number, string, number][] = [
  [1, 'Curioso', 0],
  [2, 'Aprendiz', 50],
  [3, 'Estagiário', 150],
  [4, 'Analista Jr.', 300],
  [5, 'Analista', 500],
  [6, 'Gestor', 750],
  [7, 'Estrategista', 1000],
  [8, 'Lenda do Pregão', 1300],
];

function Secao({ icone: Icone, titulo, children }: { icone: typeof Trophy; titulo: string; children: ReactNode }) {
  return (
    <Card className="gap-3 p-5">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <Icone className="size-5 shrink-0 text-info" aria-hidden="true" />
        {titulo}
      </h2>
      <div className="max-w-prose space-y-2 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </Card>
  );
}

/** As regras do jogo num lugar só: rodada, pontos, XP, temporada, turmas e de onde vêm os dados. */
export function ComoFuncionaScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Button>

      <div>
        <h1 className="font-display text-3xl">Como funciona</h1>
        <p className="text-muted-foreground">As regras do RetroBolsa, sem letras miúdas.</p>
      </div>

      <Secao icone={Wallet} titulo="A rodada">
        <p>
          Cada rodada é um <strong>período real da história do Brasil</strong>. Você recebe um orçamento (em geral
          R$ 100.000) e escolhe entre ações e títulos com <strong>nomes escondidos</strong>, vendo só os números que
          um investidor tinha na época: setor, P/L, ROE, dividendos, a taxa dos títulos e o cenário econômico do ano
          anterior.
        </p>
        <p>
          Enquanto o mercado está aberto, dá para editar a carteira. Depois que ele fecha, o jogo aplica os retornos
          reais de cada ano, e na revelação você descobre quais empresas eram e o que aconteceu com elas. O que não
          for investido fica parado, rendendo 0%.
        </p>
      </Secao>

      <Secao icone={Trophy} titulo="Pontos e ranking">
        <p>
          Cada rodada vale a sua <strong>rentabilidade em pontos</strong>, arredondada: +12,4% viram 12 pontos e −8%
          tiram 8. A pontuação nunca fica abaixo de zero.
        </p>
        <p>
          O ranking da rodada ordena pela rentabilidade. O <strong>ranking da temporada</strong> soma os pontos de um
          bloco de 4 rodadas, começando do zero a cada temporada; o geral soma tudo desde o início.
        </p>
      </Secao>

      <Secao icone={Gauge} titulo="XP e níveis">
        <p>
          O XP mede <strong>dedicação, não desempenho</strong>: quem estuda e participa sobe de nível mesmo perdendo
          dinheiro numa rodada. Cada coisa dá XP uma vez só:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>aula concluída: 20 XP; nota máxima no quiz da aula: 15 XP;</li>
          <li>carteira enviada numa rodada: 30 XP; terminar acima do CDI: 20 XP;</li>
          <li>primeiro treino em cada rodada passada: 15 XP;</li>
          <li>conquistas: 10, 25, 50 ou 100 XP, conforme a raridade;</li>
          <li>missões da semana: de 20 a 30 XP cada.</li>
        </ul>
        <table className="mt-2 w-full max-w-sm text-left">
          <caption className="sr-only">Níveis e o XP necessário</caption>
          <thead>
            <tr className="text-xs uppercase tracking-wide">
              <th scope="col" className="py-1 font-medium">Nível</th>
              <th scope="col" className="py-1 text-right font-medium">A partir de</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {niveis.map(([numero, titulo, xp]) => (
              <tr key={numero} className="border-t border-border">
                <td className="py-1">
                  {numero}. {titulo}
                </td>
                <td className="py-1 text-right">{xp} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Secao>

      <Secao icone={Target} titulo="Missões e treino">
        <p>
          Toda segunda-feira valem <strong>3 missões novas</strong>, as mesmas para todo mundo. A mesma aula ou rodada
          conta uma vez por missão, então não adianta repetir.
        </p>
        <p>
          No <strong>treino</strong>, você remonta a carteira de uma rodada que já acabou e vê o resultado na hora. O
          treino não vale pontos nem entra no ranking.
        </p>
      </Secao>

      <Secao icone={School} titulo="Turmas">
        <p>
          O professor cria a turma e passa um <strong>código de 6 letras</strong>. No Perfil, em "Minhas turmas", você
          digita o código para entrar. A turma tem ranking próprio, e o professor pode passar aulas como tarefa.
        </p>
        <p>
          O professor vê o seu nome de usuário, as aulas, os quizzes, as rodadas e o XP, mas <strong>nunca o seu
          e-mail</strong>. Você pode sair da turma quando quiser.
        </p>
      </Secao>

      <Secao icone={Database} titulo="De onde vêm os dados">
        <p>
          Selic, CDI, inflação (IPCA), poupança, dólar e crescimento do PIB vêm das séries oficiais do{' '}
          <strong>Banco Central do Brasil</strong>. O Ibovespa vem do Banco Central até 2018 e, depois, de cotações
          públicas do índice.
        </p>
        <p>
          <strong>Os retornos das ações são aproximados.</strong> Eles foram reconstruídos a partir de dados históricos
          públicos e podem diferir dos números oficiais das empresas. Servem para aprender como o mercado se comportou
          em cada época, não para decidir investimentos de verdade.
        </p>
      </Secao>

      <Secao icone={BookOpenText} titulo="Não é recomendação">
        <p>
          O RetroBolsa é um jogo para aprender. Nada aqui é recomendação de investimento, e resultados do passado não
          garantem resultados no futuro.
        </p>
      </Secao>
    </div>
  );
}
