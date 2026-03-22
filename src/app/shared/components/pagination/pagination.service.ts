import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => params.get('page') ? +params.get('page')! : 1),
      map((page) => Number.isNaN(+page) ? 1 :page )
    ),{
      initialValue:1
    }
  )


   buildPagination(currentPage:number, totalPages:number){
    const base = [
      1,
      currentPage -1,
      currentPage,
      currentPage +1,
      currentPage +2,
      totalPages
    ]

    const filter = base.filter((base) => base > 0 && base <= totalPages)

    const unique = [... new Set(filter)].sort((a,b) => a - b)

    return unique.reduce((acc: (number| string)[], number, index, arr)=> {

      acc.push(number)

      if(arr[index +1] && arr[index +1] - number > 1){
        acc.push('...')
      }

        return acc;
    }, [])

  }


}
