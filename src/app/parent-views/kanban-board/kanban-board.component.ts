import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop,  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList } from '@angular/cdk/drag-drop';

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
  public priorities: Priority[] = [Priority.Low, Priority.Medium, Priority.High];
  public todoTasks: Task[];
  public implementingTasks: Task[];
  public doneTasks: Task[];

  constructor(private kanbanBoardService: KanbanBoardService) {}

  ngOnInit() {
    this.kanbanBoardService.checkCache();
    this.retrieveTasks();
    console.log('onInitcalled')
  }

  /**
   * @description - Function to run when this component initializes to retrieve all tasks.
   * @returns {void}
   */
  private retrieveTasks(): void {
    this.todoTasks = this.kanbanBoardService.getToDoTasks();
    this.implementingTasks = this.kanbanBoardService.getImplementingTasks();
    this.doneTasks = this.kanbanBoardService.getDoneTasks();
    /**
     * This code below may be deleted as desired. It is only used so the user does not start with an empty board.
     */
    let localStorageSize = localStorage.length
    if (!localStorageSize) {
      this.kanbanBoardService.addTask(new Task(Status.Todo , "New kanban board feature. Best kanban board better than Evernote.", Priority.Low, Date.now().toString()));
    }
  }

  /**
   * @description - Submits the form with a new task.
   * @returns {void}
   */
  public onSubmit(): void {
    this.kanbanBoardService.addTask(this.task);
    // if (this.task.status === "TODO") {
    //   this.todoTasks = this.kanbanBoardService.getToDoTasks();
    // } else if (this.task.status === "IMPLEMENTING") {
    //   this.implementingTasks = this.kanbanBoardService.getImplementingTasks();
    // } else {
    //   this.doneTasks = this.kanbanBoardService.getDoneTasks();
    // }
    this.updateTasks(this.task)
    this.closeModal.nativeElement.click();
    this.task = new Task(Status.Todo , "", Priority.Low, Date.now().toString());
  }

  /**
   * @description - Deletes the task with the given id. The task to be deleted is emitted from TaskComponent. @see TaskComponent for more details.
   * @param {Task} task - The task to be deleted.
   * @returns {void}
   */
  public onDeleteTask(task: Task): void {
    this.kanbanBoardService.deleteTask(task.id);
    this.updateTasks(task);
    // if (task.status === "TODO") {
    //   this.todoTasks = this.kanbanBoardService.getToDoTasks();
    // } else if (task.status === "IMPLEMENTING") {
    //   this.implementingTasks = this.kanbanBoardService.getImplementingTasks();
    // } else {
    //   this.doneTasks = this.kanbanBoardService.getDoneTasks();
    // }
  }

  private updateTasks(task: Task): void {
    if (task.status === "TODO") {
      this.todoTasks = this.kanbanBoardService.getToDoTasks();
    } else if (task.status === "IMPLEMENTING") {
      this.implementingTasks = this.kanbanBoardService.getImplementingTasks();
    } else {
      this.doneTasks = this.kanbanBoardService.getDoneTasks();
    }
  }

  /**
   * @description - Function to run when a cdkDragItem is dropped into a cdkDropList.
   * @param {CdkDragDrop<Task[]>} event - An event containing the cdkDragItem, and the origin and destination cdkDropList.
   * @returns {void}
   */
  public onDrop(event: CdkDragDrop<Task[]>): void {
    this.kanbanBoardService.drop(event);
  }
}
