import { Component, OnInit, ViewChild } from '@angular/core';
import {   CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, } from '@angular/cdk/drag-drop';

import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import { Task } from 'src/app/models/task.model';
import { Status } from 'src/app/models/task.model';
import { Priority } from 'src/app/models/task.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  
  @ViewChild('closeModal') closeModal: { nativeElement: { click: () => void; }; };
  public task: Task = new Task(Status.Todo , "", Priority.Low, Date.now().toString());
  public todoTasks: Task[];
  public implementingTasks: Task[];
  public doneTasks: Task[];

  constructor(private kanbanBoardService: KanbanBoardService) {}

  ngOnInit() {
    this.retrieveTasks();
  }

  /**
   * 
   */
  private retrieveTasks(): void {
    this.todoTasks = this.kanbanBoardService.getToDoTasks();
    this.implementingTasks = this.kanbanBoardService.getImplementingTasks();
    this.doneTasks = this.kanbanBoardService.getDoneTasks();
  }

  /**
   * @description - Submits the form with a new task.
   */
  public onSubmit(): void {
    this.kanbanBoardService.addTask(this.task);
    this.closeModal.nativeElement.click();
    this.task = new Task(Status.Todo , "", Priority.Low, Date.now().toString());

  }

  /**
   * 
   */
  public onDeleteTask(id: Task) {
    console.log('deleting from kanban board')
    this.kanbanBoardService.deleteTask(id.id, id.status)
  }

  public onDrop(event: CdkDragDrop<Task[]>) {
    this.kanbanBoardService.drop(event);
  }
}
