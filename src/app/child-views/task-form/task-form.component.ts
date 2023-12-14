import { Component, EventEmitter, Output } from '@angular/core';

import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import { Priority, Status, Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {

  @Output() closeModalEvent = new EventEmitter<boolean>();

  public submitted: boolean = false;
  public task = new Task(Status.Todo , "Example task. Critical task with high priority.", Priority.Low, Date.now().toString());

  constructor(private kanbanService: KanbanBoardService){}

  ngOnInit(): void {}

  /**
   * @description - Submits the form with a new task.
   */
  public onSubmit(): void {
    this.submitted = true;
    this.kanbanService.addTask(this.task);
    this.closeModalEvent.emit();
  }

}
