import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '@angular/router';

import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  @Input() public task: Task;
  @Input() public empty: boolean;
  @Output() public id: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deletedTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor() {}

  public onDelete(task: Task, id: string): void {
    console.log("event: ", task, id);
    // this.id.emit(task.id);
    this.deletedTask.emit(task);
  }

}
