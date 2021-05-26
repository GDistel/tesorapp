import { Expense } from "src/expense/expense.entity";
import { Participant } from "src/participant/participant.entity";
import { ParticipantsDebtStatus, ParticipantsSettlements } from "./interfaces";

export class ExpensesSettler {
    public participantsDebtStatus: ParticipantsDebtStatus;
    public participantsSettlements: ParticipantsSettlements;

    constructor(private expenses: Expense[], private expensesListParticipants: Participant[]) {
        this.participantsDebtStatus = this.getParticipantsDebtStatus(expenses, expensesListParticipants);
        this.participantsSettlements = this.getParticipantsSettlements();
    }

    private getParticipantsDebtStatus(expenses: Expense[], participants: Participant[]): ParticipantsDebtStatus {
        const participantsDebtStatus = this.initDebtStatusObject(participants);
        expenses.forEach(expense => {
            const destinataries = expense.participantIds.length;
            const debtShare = expense.amount / destinataries;
            expense.participantIds.forEach(participantId => participantsDebtStatus[participantId] -= debtShare);
            participantsDebtStatus[expense.paidBy] += expense.amount;
        });
        return participantsDebtStatus;
    }

    private initDebtStatusObject(participants: Participant[]): ParticipantsDebtStatus {
        const emptyDebtStatus = { } as ParticipantsDebtStatus;
        return participants.reduce(
            (participantsDebtStatus, participant) => ({ ...participantsDebtStatus, [participant.id]: 0 }), emptyDebtStatus
        );
    }

    public getParticipantsSettlements(): ParticipantsSettlements {
        const sortedDebtsMatrix: [string, number][] = Object.entries(this.participantsDebtStatus).sort(
            ([participantId1, debtAmount1], [participantId2, debtAmount2]) => debtAmount1 - debtAmount2
        );
        return this.createParticipantsSettlements(sortedDebtsMatrix);
    }

    private createParticipantsSettlements(
        sortedDebts: [string, number][], participantsSettlements = {} as ParticipantsSettlements
    ): ParticipantsSettlements {
        if (!Object.keys(participantsSettlements).length) {
            this.expensesListParticipants.forEach(part => participantsSettlements[part.id] = []);
        }
        const firstIdx = 0;
        const lastIdx = sortedDebts.length - 1;
        const [participant1, amount1] = sortedDebts[firstIdx];
        const [participant2, amount2] = sortedDebts[lastIdx];
        if (sortedDebts.length === 2) {
            participantsSettlements[participant1].push({ payTo: participant2, amount: Math.abs(amount1) });
        } else {
            const difference = Math.abs(amount1) - Math.abs(amount2);
            if (difference > 0) {
                participantsSettlements[participant1].push({ payTo: participant2, amount: Math.abs(amount2) });
                sortedDebts[firstIdx][1] = -1 * Math.abs(difference);
                sortedDebts.pop();
            } else if (difference < 0) {
                participantsSettlements[participant1].push({ payTo: participant2, amount: Math.abs(amount1) });
                sortedDebts[lastIdx][1] = Math.abs(difference);
                sortedDebts.shift();
            } else if (difference === 0) {
                participantsSettlements[participant1].push({ payTo: participant2, amount: Math.abs(amount1) });
                sortedDebts.shift();
                sortedDebts.pop();
            }
            this.createParticipantsSettlements(sortedDebts, participantsSettlements);
        }
        return participantsSettlements;
    }
}
