import { Component, inject, input, computed, linkedSignal } from '@angular/core';
import { PaginationService } from './pagination.service';
import {  ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  activatedRoute = inject(ActivatedRoute)

  currentPage = input<number>(1);
  totalPages = input<number>(10);

  activePage = linkedSignal(this.currentPage)

  paginationService = inject(PaginationService);

  paginationList = computed(  () =>  this.paginationService.buildPagination(this.activePage(), this.totalPages()));
  query = linkedSignal (()=> this.activatedRoute.snapshot.queryParamMap.get('query') ?? '');

}
