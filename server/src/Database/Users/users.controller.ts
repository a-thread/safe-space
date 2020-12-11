import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import {UsersService } from "./users.service";

@Controller("api/user")
export class UsersController {
    //  "readonly" means we won't change the "productsService" to another value/type
    constructor(private readonly usersService: UsersService) { } //  "productServices" can be called anything, "ProductsService" is exported from service file

    @Post()
    async addUser(
        @Body("subId") subId: string,
        @Body("username") username: string,
        @Body("email") email: string,
        @Body("firstName") firstName: string,
        @Body("lastName") lastName: string,
        @Body("pronouns") pronouns: string,
        @Body("favoriteBusinesses") favoriteBusinesses: [string],
        @Body("reviewedBusinesses") reviewedBusinesses: [string],
        @Body("location") location: string,
        @Body("moreInfo") moreInfo: string,
        @Body("photo") photo: string
    ): Promise<any> {  //  "any" is the type of response we will get back from this req
        const generatedId = await this.usersService.insertUser(
            subId,
            username,
            email,
            firstName,
            lastName,
            pronouns,
            favoriteBusinesses,
            reviewedBusinesses,
            location,
            moreInfo,
            photo
        );
        return { id: generatedId };
    }

    @Get()
    async getAllUsers() {
        const users = await this.usersService.getAllUsers();
        //  .map() the users to give us the "_id" as just an "id"
        return users.map((user) => ({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            pronouns: user.pronouns,
            favoriteBusinesses: user.favoriteBusinesses,
            reviewedBusinesses: user.reviewedBusinesses,
            location: user.location,
            moreInfo: user.moreInfo
        }));
    }

    @Get(":id")
    getOneUser(@Param("id") userId: string) {
        return this.usersService.getOneUser(userId);
    }

    @Get("sub/:authSub")
    getUserIdByFindingAuthSub(@Param("authSub") userSub: string) {
        return this.usersService.getUserIdByFindingAuthSub(userSub);
    }

    @Get("sub/all/:authSub")
    getUserDataBySub(@Param("authSub") userSub: string) {
        return this.usersService.getUserDataBySub(userSub);
    }

    @Patch(":id")
    async updateUser(
        @Param("id") authSubId: string,
        @Body("username") username: string,
        @Body("email") email: string,
        @Body("firstName") firstName: string,
        @Body("lastName") lastName: string,
        @Body("pronouns") pronouns: string,
        @Body("favoriteBusinesses") favoriteBusinesses: [string],
        @Body("reviewedBusinesses") reviewedBusinesses: [string],
        @Body("location") location: string,
        @Body("moreInfo") moreInfo: string,
        @Body("photo") photo: string
    ) {
        await this.usersService.updateUser(
            authSubId,
            username,
            email,
            firstName,
            lastName,
            pronouns,
            favoriteBusinesses,
            reviewedBusinesses,
            location,
            moreInfo,
            photo
        );
        return {"User": "updated"};
    }

    @Delete(":id")
    async removeUser(@Param("id") userId: string) {
        await this.usersService.deleteUser(userId);
        return "user deleted";
    }
}