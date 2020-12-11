import { Component, Input, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableService } from "../../services/table.service";
import { IBusiness } from "../../services/business-interface";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  providers: [TableService],
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, AfterViewInit {

  public pageTitle: string;
  public stateName: string;
  public resourceType: string;
  public backUrl: string;

  public displayedColumns: string[] = ['type', 'name', 'city', 'state', 'description', 'phone', 'memberOwned', 'website',];
  public dataSource = new MatTableDataSource([]);
  public businessesArr: IBusiness[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tableService: TableService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data) => { // capturing data from router

        this.stateName = data.state; // setting state name
        this.resourceType = data.type; // setting resource type

        // Triggering Show Businesses function with new values
        this.showBusinesses(this.resourceType, this.stateName);

        // Setting Page title w/ capital first letter and adding "s" to make it plural
        this.pageTitle = this.handleTitle(data.type);

        // Setting url for back btn 
        this.backBtnFunction(this.stateName);
      });
  }

  showBusinesses(resource: string, state: string) {
    this.tableService.getBusinesses(resource, state)
      .subscribe(
        (data) => {
          this.businessesArr = [...data];
          this.dataSource = new MatTableDataSource(this.businessesArr);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
          this.cdr.detectChanges();
        }
      )
  }

  handleTitle(string) {
    if (string !== "misc") {
      return this.pageTitle = string + "s";
    } else {
      return this.pageTitle = string.charAt(0).toUpperCase() + string.slice(1);
    }
  };

  backBtnFunction(stateName) {
    if (stateName === "all") {
      return this.backUrl = "/explore";
    } else {
      return  this.backUrl = "/" + stateName
    }
  };

}