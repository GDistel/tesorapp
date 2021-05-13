import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ExpensesListStatus } from '../expenses-list.enums';

export class ExpensesListValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        ExpensesListStatus.OPEN,
        ExpensesListStatus.ARCHIVED
    ];

    transform(value: any) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }

    isStatusValid(status: any): boolean {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
