import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JsonTestService } from './jsontest';

describe('JsonTestService', () => {
  let service: JsonTestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonTestService],
    });

    service = TestBed.inject(JsonTestService);  
    httpMock = TestBed.inject(HttpTestingController); 
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users from service', (done) => {
    const mock = [{ name: 'A', date: '2025-09-01' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mock); 
  });
});
