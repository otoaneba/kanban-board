import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from '../models/task.model';
import { Status } from '../models/task.model';
import { Priority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService {

  private toDo: Task[] = [];
  private implementing: Task[] = [];
  private done: Task[] = [];

  constructor() { }

  /**
   * @description - Function to check local storage (or cacshe) and populates the different task array accordingly.
   * @returns {void}
   */
  public checkCasche(): void {
    try {
      let keys = Object.keys(localStorage);
      if (keys) {
        for (let i = 0; i < keys.length; i++) {
          let temp = localStorage.getItem(keys[i]);
          if (temp) {
            let task = JSON.parse(temp);
            this.addTask(task);
          }
        }
      }
    } catch (e) {
      alert("Error parsing JSON. Try clearing cacshe or running in incognito mode. error: \n" + e);
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
      localStorage.setItem(task.id, JSON.stringify(task))
    } catch (e) {
      alert("error parsing JSON")
    }
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
    localStorage.removeItem(id);
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
        this.updateLocalStorage(event.item.data, event.item.data.id, event.container.id)
    }
  }

  /**
   * @description - Updates the tasks in the local storage.
   * @param {string} id - The id of the task.
   * @returns {void} 
   */
  private updateLocalStorage(task: Task, id: string, newStatus: string): void {
    let cacshedTask = localStorage.getItem(id);
    if (cacshedTask) {
      let newTask = new Task(newStatus === 'TODO' ? Status.Todo : newStatus === 'IMPLEMENTING' ? Status.Implementing : Status.Done, task.description, task.priority, id);
      localStorage.setItem(id, JSON.stringify(newTask));
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
