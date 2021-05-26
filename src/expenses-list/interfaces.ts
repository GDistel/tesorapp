export interface ParticipantsDebtStatus {
    // the key is the participant id, the value is the participant's debt
    [key: number]: number;
}

export interface Settlement {
    payTo: string;
    amount: number;
}

export interface ParticipantsSettlements {
    // the key is the participant id
    [key: string]: Settlement[];
}

export interface ExpensesListResolution {
    status: ParticipantsDebtStatus;
    settle: ParticipantsSettlements;
}