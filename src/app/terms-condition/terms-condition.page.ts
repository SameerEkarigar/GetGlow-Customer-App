import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.page.html',
  styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {
  termConditionData: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.termCondition();
  }
  termCondition(){
    this.apiService.getTermsCondition().subscribe((response=>{
      if(response){
        this.termConditionData = response;
        // console.log(response);
      }
    }))
  }
}