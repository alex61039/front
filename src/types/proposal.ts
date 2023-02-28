export enum ProposalStatuses {
  NOT_PROCESSED = 'NOT_PROCESSED',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

export const PROPOSAL_STATUS_LABELS = {
  [ProposalStatuses.NOT_PROCESSED]: 'Заявка не обрабатывается',
  [ProposalStatuses.PROCESSING]: 'Заявка в обработке',
  [ProposalStatuses.DONE]: 'Предложение сделано',
};
