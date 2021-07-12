import { Test } from '@nestjs/testing';
import { ExpensesListService } from './expenses-list.service';
import { ExpenseService } from './../expense/expense.service';
import { ExpensesListRepository } from './expenses-list.repository';
import { ParticipantService } from '../participant/participant.service';
import { User } from '../auth/user.entity';
import { PagedResponse, Pagination } from '../shared';
import { ExpensesList } from './expenses-list.entity';
import { Expense } from '../expense/expense.entity';
import { GetExpenseFilterDto } from '../expense/dto/get-expense-filter.dto';
import { CreateExpenseDto } from '../expense/dto/create-expense.dto';
import { Participant } from '../participant/participant.entity';
import { CreateOrUpdateParticipantDto } from '../participant/dto/create-update-participant.dto';
import { CreateExpensesListDto } from './dto/create-expenses-list.dto';
import { DeleteResult } from 'typeorm';
import { UpdateExpensesListDto } from './dto/update-expenses-list.dto';
import { Currencies, ExpensesListStatus } from './expenses-list.enums';
import { ExpensesSettler } from './expenses-list-settler';
import { ExpensesListResolution } from './interfaces';

const mockExpensesListRepository = () => ({
    getExpensesLists: jest.fn(),
    findOne: jest.fn(),
    createExpensesList: jest.fn(),
    delete: jest.fn()
});

const mockExpenseService = () => ({
    getExpenses: jest.fn(),
    createExpense: jest.fn()
});

const mockParticipantService = () => ({
    getParticipants: jest.fn(),
    createParticipant: jest.fn()
});

const mockUser = {
    username: 'john'
} as User;

describe('ExpensesListService', () => {
    let expensesListService: ExpensesListService;
    let expensesListRepository: any;
    let expenseService: any;
    let participantService: any;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ExpensesListService,
                { provide: ExpensesListRepository, useFactory: mockExpensesListRepository },
                { provide: ExpenseService, useFactory: mockExpenseService },
                { provide: ParticipantService, useFactory: mockParticipantService },
            ]
        }).compile();
        expensesListService = module.get<ExpensesListService>(ExpensesListService);
        expensesListRepository = module.get<ExpensesListRepository>(ExpensesListRepository);
        expenseService = module.get<ExpenseService>(ExpenseService);
        participantService = module.get<ParticipantService>(ParticipantService);
    });

    describe('getExpensesLists', () => {
        it('calls ExpensesListRepository.getExpensesLists and returns the result', () => {
            const returnValue = new Promise((_, _2) => ({} as PagedResponse<ExpensesList[]>));
            expensesListRepository.getExpensesLists.mockReturnValueOnce(returnValue);
            const result = expensesListService.getExpensesLists(null, mockUser, {} as Pagination);
            expect(result).toEqual(returnValue);
        });
    });

    describe('getExpensesListsRelatedExpenses', () => {
        it('calls ExpenseService.getExpenses and returns the expenses for the target expenses list', () => {
            const returnValue = new Promise((_, _2) => ({} as PagedResponse<Expense[]>));
            expenseService.getExpenses.mockReturnValueOnce(returnValue);
            const result = expensesListService.getExpensesListRelatedExpenses(
                1, mockUser, {} as GetExpenseFilterDto, {} as Pagination
            );
            expect(result).toEqual(returnValue);
        });
    });

    describe('createExpensesListExpense', () => {
        const newExpense: CreateExpenseDto = {
            name: 'Bar bill',
            amount: 234,
            paidBy: 1,
            participantIds: [1,2],
            date: (new Date()).toISOString()
        };
        const allExpensesListParticipants: Participant[] = [
            { id: 1 } as Participant, { id: 2 } as Participant, { id: 3 } as Participant
        ];
        
        it('calls ExpenseService.createExpensesListExpense and returns created expense', () => {
            jest.spyOn(expensesListService, 'getExpensesListById').mockResolvedValue({} as ExpensesList);
            const expectedResult = new Promise((_, _2) => ({} as Expense));
            participantService.getParticipants.mockResolvedValueOnce(allExpensesListParticipants);
            expenseService.createExpense.mockReturnValue(expectedResult);
            const result = expensesListService.createExpensesListExpense(1, newExpense, mockUser);
            expect(expensesListService.getExpensesListById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });

        it('calls ExpenseService.createExpensesListExpense with the correct destinataries', async () => {
            jest.spyOn(expensesListService, 'getExpensesListById').mockResolvedValueOnce({} as ExpensesList);
            participantService.getParticipants.mockResolvedValueOnce(allExpensesListParticipants);
            await expensesListService.createExpensesListExpense(1, newExpense, mockUser);
            expect(expenseService.createExpense).toHaveBeenCalledWith(
                newExpense,
                mockUser,
                {} as ExpensesList,
                allExpensesListParticipants.slice(0,2) // include only the participants in the expense and not all of them
            );
        });
    });

    describe('getExpensesListRelatedParticipants', () => {
        it('calls ExpenseService.getExpensesListRelatedParticipants and returns the participants in the list', () => {
            const returnValue = new Promise((_, _2) => ({} as Participant[]));
            participantService.getParticipants.mockReturnValueOnce(returnValue);
            const result = expensesListService.getExpensesListRelatedParticipants(1, mockUser);
            expect(result).toEqual(returnValue);
        });
    });

    describe('createExpensesListParticipant', () => {
        it('calls ExpenseService.createExpensesListParticipant to create a participant for the target expenses list', () => {
            const returnValue = new Promise((_, _2) => ({} as Participant));
            jest.spyOn(expensesListService, 'getExpensesListById').mockResolvedValue({} as ExpensesList);
            participantService.createParticipant.mockReturnValueOnce(returnValue);
            const result = expensesListService.createExpensesListParticipant(1, {} as CreateOrUpdateParticipantDto, mockUser);
            expect(expensesListService.getExpensesListById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(returnValue);
        });
    });

    describe('getExpensesListById', () => {
        it('calls ExpenseService.getExpensesListById and the repository successfully finds an expenses list', async () => {
            const returnValue = {} as ExpensesList;
            expensesListRepository.findOne.mockResolvedValueOnce(returnValue);
            const result = await expensesListService.getExpensesListById(1, mockUser);
            expect(result).toEqual(returnValue);
        });

        it('calls ExpenseService.getExpensesListById but the expenses are removed from the result', async () => {
            const returnValue = { expenses: [{} as Expense] } as ExpensesList;
            expensesListRepository.findOne.mockResolvedValueOnce(returnValue);
            const result = await expensesListService.getExpensesListById(1, mockUser);
            expect(result.expenses).toBeUndefined();
        });

        it('calls ExpenseService.getExpensesListById and the repository fails to find the expenses list', async () => {
            expensesListRepository.findOne.mockResolvedValueOnce(null);
            await expect(expensesListService.getExpensesListById(1, mockUser)).rejects.toThrow();
        });
    });

    describe('getExpensesListResolution', () => {

        beforeEach(() => {
            expensesListRepository.findOne.mockResolvedValueOnce({
                name: 'My expenses list',
                participants: [{ id: 1, name: 'John' } as Participant, { id: 2, name: 'Mary' } as Participant]
            } as ExpensesList);
        });

        it('calls ExpenseService.getExpensesListResolution but throws because there are no expenses', async () => {
            const expenses = { items: [] } as PagedResponse<Expense[]>
            expenseService.getExpenses.mockResolvedValueOnce(expenses);
            await expect(expensesListService.getExpensesListResolution(1, mockUser)).rejects.toThrow();
        });

        it('calls ExpenseService.getExpensesListResolution and returns an expenses list resolution', async () => {
            const expenses = {
                items: [{ name: 'bar', amount: 100, paidBy: 1, participantIds: [1,2] } as Expense]
            } as PagedResponse<Expense[]>
            expenseService.getExpenses.mockResolvedValueOnce(expenses);
            const result = await expensesListService.getExpensesListResolution(1, mockUser);
            const expectedResult: ExpensesListResolution = {
                settle: { 1: [], 2: [{ amount: 50, payTo: '1' }] },
                status: { 1: 50, 2: -50 }
            };
            expect(result).toStrictEqual(expectedResult);
        });
    });

    describe('createExpensesList', () => {
        it('calls ExpensesListRepository.createExpensesList and returns the newly created expenses list', () => {
            const returnValue = new Promise((_, _2) => ({} as ExpensesList));
            expensesListRepository.getExpensesLists.mockReturnValueOnce(returnValue);
            const result = expensesListService.createExpensesList({} as CreateExpensesListDto, mockUser);
            expect(result).toEqual(returnValue);
        });
    });

    describe('deleteExpensesList', () => {
        it('calls ExpensesListRepository.deleteExpensesList and deletes the expenses list', () => {
            const resolvedValue = { affected: 1 } as DeleteResult;
            expensesListRepository.delete.mockResolvedValueOnce(resolvedValue);
            const result = expensesListService.deleteExpensesList(1, mockUser);
            expect(result).resolves.not.toThrow();;
        });
        
        it('calls ExpensesListRepository.deleteExpensesList but fails to find and therefore to delete the expenses list', () => {
            const resolvedValue = { affected: 0 } as DeleteResult;
            expensesListRepository.delete.mockResolvedValueOnce(resolvedValue);
            expect(expensesListService.deleteExpensesList(1, mockUser)).rejects.toThrow();
        });
    });

    describe('updateExpensesList', () => {
        it('calls ExpensesListRepository.updateExpensesList and returns the updated expenses list', async () => {
            const expensesList = {
                name: 'Some name', description: 'awesome trip', status: ExpensesListStatus.OPEN, currency: Currencies.ARS,
                save: () => {}
            } as ExpensesList;
            jest.spyOn(expensesListService, 'getExpensesListById').mockResolvedValue(expensesList);
            const updateExpensesListDto = {
                name: 'Rio trip', currency: Currencies.EUR
            } as UpdateExpensesListDto;
            const result = await expensesListService.updateExpensesList(1, updateExpensesListDto, mockUser);
            expect(result.name).toBe(updateExpensesListDto.name);
            expect(result.currency).toBe(expensesList.currency);
            expect(result.description).toBe(expensesList.description);
            expect(result.status).toBe(expensesList.status);
        });
    }); 

});
