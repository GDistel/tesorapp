export interface FinalScore {
    [key: number]: number;
}

export interface Settlement {
    destinatary: string;
    amount: number;
}

export interface FinalSolution {
    [key: string]: Settlement[]
}

export interface ExpensesListResolution {
    scores: FinalScore;
    settle: FinalSolution;
}