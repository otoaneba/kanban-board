import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  @Input() public task: Task;
  @Input() public empty: boolean;
  @Output() public deletedTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor() {}

  /**
   * @description - Emit the task to be deleted to the parent component.
   * @param {Task} task - Task to be deleted. 
   * @returns {void} 
   */
  public onDelete(task: Task): void {
    this.deletedTask.emit(task);
  }
}
