import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanBoardComponent } from './parent-views/kanban-board/kanban-board.component';

const routes: Routes = [];
routes.push(
  {path: '', component: KanbanBoardComponent},
)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
