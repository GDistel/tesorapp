export interface ParticipantsDebtStatus {
    [key: number]: number;
}

export interface Settlement {
    destinatary: string;
    amount: number;
}

export interface ParticipantsSettlements {
    [key: string]: Settlement[]
}

export interface ExpensesListResolution {
    status: ParticipantsDebtStatus;
    settle: ParticipantsSettlements;
}