import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamProjects } from './team-projects';

describe('TeamProjects', () => {
  let component: TeamProjects;
  let fixture: ComponentFixture<TeamProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamProjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
