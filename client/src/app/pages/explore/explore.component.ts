import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

//  Session and/or Local storage
import { UserSessionStorageService } from "../../services/webstorage.service";

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
    public user: { username: string; };
    public welcomeTitle: string;

    constructor(public auth: AuthService, public storage: UserSessionStorageService) { }



    ngOnInit(): void {
        this.auth.userProfile$.subscribe(async data => {
            await this.storage.setupLocalStorage(data);
            const userData = this.storage.getDataFromLocal();
            this.user = userData;
            this.welcomeTitle = "Welcome " + this.user.username + "!";
        })
    }

}
