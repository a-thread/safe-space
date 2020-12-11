import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from "../services/data.service";

@Component({
  selector: 'app-state-template',
  templateUrl: './state-template.component.html',
  styleUrls: ['./state-template.component.scss']
})

export class StateTemplateComponent implements OnInit {

  // Declaring Title and Name
  public stateTitle: string;
  public stateName: string;

  // Declaring Path
  public restaurantPath: string;
  public cafePath: string;
  public resourcePath: string;
  public miscPath: string;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    // Data from route
    this.route.data
      .subscribe((data) => {
        // setting name and title
        this.stateName = data.stateName;
        this.stateTitle = data.stateTitle;
        
        // setting paths for routerLinks
        this.resourcePath = "/" + this.stateName + "-resource";
        this.cafePath = "/" + this.stateName + "-coffee-shop";
        this.restaurantPath = "/" + this.stateName + "-restaurant";
        this.miscPath = "/" + this.stateName + "-misc";

      });
  }

}
