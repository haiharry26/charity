import { TestBed } from '@angular/core/testing';

import { FinanceReportService } from './finance-report.service';

describe('FinanceReportService', () => {
  let service: FinanceReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanceReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
