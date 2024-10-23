import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FAQPage implements OnInit {
  faqData: any;
  faqData1: any;

  constructor(private router: Router,private apiService: ApiService) { }

  ngOnInit() {
    this.getFaqs();
  }

  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
  getFaqs(){
    this.apiService.getFaqData().subscribe((response)=>{
      if(response){
        this.faqData = response;
        this.faqData1 = response[0];
      }
    })
  }
}
