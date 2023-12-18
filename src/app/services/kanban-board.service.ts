import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from '../models/task.model';
import { Status } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService {

  // front end arrays 
  private toDo: Task[] = [];
  private implementing: Task[] = [];
  private done: Task[] = [];

  // cached data array
  private localStorageKey: string = "kanban-board-tasks";
  private localStorageTasksArray: Task[] = [];

  constructor() { }

  /**
   * @description - Function to check local storage (or cache) and populates the different task array accordingly.
   * @returns {void}
   */
  public checkCache(): void {
    try {
      this.toDo = [];
      this.implementing = [];
      this.done = [];
      let cachedTask = localStorage.getItem(this.localStorageKey);
      if (cachedTask) {
        let parsedTasks = JSON.parse(cachedTask);
        if (parsedTasks) {
          this.localStorageTasksArray =  parsedTasks;
          parsedTasks.filter((task: Task) => {
            if (task && task.status === "TODO") {
              this.toDo.push(task);
            } else if (task && task.status === "IMPLEMENTING") {
              this.implementing.push(task);
            } else {
              this.done.push(task);
            }
          })
        }
      }
    } catch (e) {
      alert("Error parsing JSON. Try clearing cache or running in incognito mode. error: \n" + e);
    }
  }



  /**
   * @description - Adds a task into one of the columns: todo, implementing, or done.
   * @param {Task} task - The task to be added into the toDo array.
   */
  public addTask(task: Task): void {
    if (task && task.status === 'TODO') {
      this.toDo.push(task);
    } else if (task && task.status === 'IMPLEMENTING') {
      this.implementing.push(task);
    } else {
      this.done.push(task);
    }
    try {
      this.localStorageTasksArray.push(task);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageTasksArray));
    } catch (e) {
      alert("Error parsing JSON. Try clearing cache or running in incognito mode. error: \n" + e)
    }
  }

  /**
   * @description - Function deletes the task with the given ID from a given STATUS.
   * @param {string} id - The id of the task to be deleted.
   * @param {Status} from - The Status of the task, which gives us which array the task is in.
   * @returns {void}
   */
  public deleteTask(id: string): void {
    try {
      for (let i = 0; i < this.localStorageTasksArray.length; i++) {
        if (this.localStorageTasksArray[i]?.id === id) {
          this.localStorageTasksArray.splice(i, 1);
          localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageTasksArray));
        }
      }
      this.checkCache();
    } catch (e) {
      alert("Error deleting JSON data. Try clearing cache or running in incognito mode. error: \n" + e)
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
       * update the status of the dragged task (e.g. 'TODO' -> 'IMPLEMENTING').
       * Tag of "id" is used to track the status of the selected task, hence setting the container.id to the task. 
       */
      event.item.data.status = event.container.id;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.updateLocalStorage();
    }
  }

  /**
   * @description - Updates the tasks in the local storage. Simply readd the updated array to override the array in local storage.
   * @returns {void}
   */
  private updateLocalStorage(): void {
    try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageTasksArray));
    } catch (e) {
      alert("Error adding JSON data. Try clearing cache or running in incognito mode. error: \n" + e)
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
