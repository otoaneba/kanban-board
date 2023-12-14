import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from '../models/task.model';
import { Status } from '../models/task.model';
import { Priority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService {

  private toDo: Task[] = [new Task(Status.Todo , "New kanban board feature. Best kanban board better than Evernote.", Priority.Low, Date.now().toString())]
  private implementing: Task[] = [new Task(Status.Implementing , "New kanban board implementing feature", Priority.Low, (Date.now()+1).toString())];
  private done: Task[] = [new Task(Status.Done , "New kanban board done feature", Priority.Low, (Date.now()+2).toString())];

  constructor() { }

  /**
   * @description - Adds a task into one of the columns: todo, implementing, or done.
   * @param {Task} task - The task to be added into the toDo array.
   */
  public addTask(task: Task): void {
    if (!this.toDo) {
      this.toDo = []
    }
    this.toDo.push(task);
  }

  /**
   * @description - Function deletes the task with the given ID from a given STATUS.
   * @param {string} id - The id of the task to be deleted.
   * @param {Status} from - The Status of the task, which gives us which array the task is in.
   * @returns {void}
   */
  public deleteTask(id: string, from: Status): void {
    // Can use Map to improve performance
    if (from === 'TODO' && this.toDo) {
      for (let i = 0; i < this.toDo.length; i++) {
        if (this.toDo[i]?.id === id) {
          this.toDo.splice(i, 1);
        }
      }
    } else if (from === 'IMPLEMENTING' && this.implementing) {
      for (let i = 0; i < this.implementing.length; i++) {
        if (this.implementing[i]?.id === id) {
          this.implementing.splice(i, 1);
        }
      }
    } else if (from === 'DONE' && this.done) {
      for (let i = 0; i < this.done.length; i++) {
        if (this.done[i]?.id === id) {
          this.done.splice(i, 1);
        }
      }
    }
  }

  /**
   * @description - Function (called from KanbanBoardComponent) to tranfer or reorder the task by dragging the selected task. @see KanbanBoardComponent and its onDrop() to see more details.
   * @param {CdkDragDrop<Task[]>} event - An event containing the cdkDragItem, and the origin and destination cdkDropList.
   */
  public drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      /**
       * update the status of the dragged task (e.g. 'TODO' -> 'IMPLEMENTING')
       */
      event.item.data.status = event.container.id;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  /**
   * @description - Getter for toDo array.
   * @returns {[Task]} Array containing current To Do tasks.
   */
  public getToDoTasks(): Task[] {
    return this.toDo;
  }

   /**
   * @description - Getter for toDo array.
   * @returns {[Task]} Array containing current To Do tasks.
   */
   public getImplementingTasks(): Task[] {
    return this.implementing;
  }

   /**
   * @description - Getter for toDo array.
   * @returns {[Task]} Array containing current To Do tasks.
   */
   public getDoneTasks(): Task[] {
    return this.done;
  }
}
