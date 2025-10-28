export interface HistSolicitacao {
  id: number;
  solicitacaoId: number | null;
  cliente: boolean | null;
  statusOld: string | null;
  statusNew: string | null;
  funcionarioOld: number | null;
  funcionarioNew: number | null;
  dataHora: string; // ISO string
}
