export class Task {
    public status: Status;
    public description: string;
    public priority: Priority;
    public id: string;

    constructor(status: Status, description: string, priority: Priority, id: string) {
        this.status = status;
        this.description = description;
        this.priority = priority;
        this.id = id;
    }
}

export enum Status {
    Todo = "TODO",
    Implementing = "IMPLEMENTING",
    Done = "DONE"
}

export enum Priority {
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH"
}