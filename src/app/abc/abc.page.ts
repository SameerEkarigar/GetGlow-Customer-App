import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from '../geocoding.service';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-abc',
  templateUrl: './abc.page.html',
  styleUrls: ['./abc.page.scss'],
})
export class AbcPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  ngOnInit() {
    
  }
  // Original slider data
  sliders = {
    sliderOne: {
      name: 'Slider One',
      items: [
        { title: 'Apple', description: 'Fresh and juicy apples' },
        { title: 'Banana', description: 'Sweet bananas' },
        { title: 'Banana', description: 'Sweet grapes' },
        { title: 'Banana', description: 'Sweet Ashu' },
        { title: 'Banana', description: 'Sweet papaya' },
      ],
    },
    sliderTwo: {
      name: 'Slider Two',
      items: [
        { title: 'Car', description: 'Drive your dreams' },
        { title: 'Bike', description: 'Ride to freedom' },
        { title: 'Bike', description: 'R15' },
        { title: 'Bike', description: 'Dominar' },
        { title: 'Bike', description: 'GT 650' },
      ],
    },
    sliderThree: {
      name: 'Slider Three',
      items: [
        { title: 'Rock', description: 'Solid and sturdy rocks' },
        { title: 'Sand', description: 'Soft and granular sand' },
      ],
    },
    sliderFour: {
      name: 'Slider Four',
      items: [
        { title: 'Ocean', description: 'Vast and deep blue sea' },
        { title: 'Mountain', description: 'Tall and majestic peaks' },
      ],
    },
  };

  // Filtered sliders for dynamic display
  filteredSliders = JSON.parse(JSON.stringify(this.sliders));

  searchTerm: string = '';

  // Filter function
  filterSliders(event: any): void {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredSliders = {
      sliderOne: {
        name: this.sliders.sliderOne.name,
        items: this.sliders.sliderOne.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        ),
      },
      sliderTwo: {
        name: this.sliders.sliderTwo.name,
        items: this.sliders.sliderTwo.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        ),
      },
      sliderThree: {
        name: this.sliders.sliderThree.name,
        items: this.sliders.sliderThree.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        ),
      },
      sliderFour: {
        name: this.sliders.sliderFour.name,
        items: this.sliders.sliderFour.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        ),
      },
    };
  }
  

}
