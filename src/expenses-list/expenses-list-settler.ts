import { Expense } from "src/expense/expense.entity";
import { Participant } from "src/participant/participant.entity";
import { FinalScore, FinalSolution } from "./interfaces";

export class ExpensesSettler {
    public finalScore: FinalScore;
    public finalSolution: FinalSolution;

    constructor(public expenses: Expense[], public expensesListParticipants: Participant[]) {
        this.finalScore = this.getFinalScore(expenses, expensesListParticipants);
        this.finalSolution = this.createFinalSolution();
    }

    private getFinalScore(expenses: Expense[], participants: Participant[]): FinalScore {
        const finalScore = this.initFinalScore(participants);
        expenses.forEach(expense => {
            const destinataries = expense.participantIds.length;
            const debtShare = expense.amount / destinataries;
            expense.participantIds.forEach(participantId => finalScore[participantId] -= debtShare);
            finalScore[expense.paidBy] += expense.amount;
        });
        return finalScore;
    }

    private initFinalScore(participants: Participant[]): FinalScore {
        const emptyFinalScore = { } as FinalScore;
        return participants.reduce(
            (finalScore, participant) => ({ ...finalScore, [participant.id]: 0 }), emptyFinalScore
        );
    }

    public createFinalSolution(): FinalSolution {
        const sortedDebts = Object.entries(this.finalScore).sort(
            ([participantId1, debtAmount1], [participantId2, debtAmount2]) => debtAmount1 - debtAmount2
        );
        return this.reduceDebtorsArray(sortedDebts);
    }

    private reduceDebtorsArray(sortedDebts: any[], finalSolution = {} as FinalSolution): FinalSolution {
        if (!Object.keys(finalSolution).length) {
            this.expensesListParticipants.forEach(part => finalSolution[part.id] = []);
        }
        const startIdx = 0;
        const endIdx = sortedDebts.length - 1;
        const [participant1, amount1] = sortedDebts[startIdx];
        const [participant2, amount2] = sortedDebts[endIdx];
        if (sortedDebts.length === 2) {
            finalSolution[participant1].push({ destinatary: participant2, amount: Math.abs(amount1) });
        } else {
            const comparison = Math.abs(amount1) - Math.abs(amount2);
            if (comparison > 0) {
                finalSolution[participant1].push({ destinatary: participant2, amount: Math.abs(amount2) });
                sortedDebts[startIdx][1] = -1 * Math.abs(comparison);
                sortedDebts.pop();
            } else if (comparison < 0) {
                finalSolution[participant1].push({ destinatary: participant2, amount: Math.abs(amount1) });
                sortedDebts[endIdx][1] = Math.abs(comparison);
                sortedDebts.shift();
            } else if (comparison === 0) {
                finalSolution[participant1].push({ destinatary: participant2, amount: Math.abs(amount1) });
                sortedDebts.shift();
                sortedDebts.pop();
            }
            this.reduceDebtorsArray(sortedDebts, finalSolution);
        }
        return finalSolution;
    }
}
