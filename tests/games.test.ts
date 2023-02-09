import app from "app";
import supertest from "supertest";
import prisma from "config/database";
import { inputConsole } from "./factories/console-factory";
import { inputGame } from "./factories/game-factory";
import httpStatus from "http-status";

beforeAll(async()=> {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

const server = supertest(app);

describe("GET /games", () => {
    it("should respond with a list of games that are on the database", async ()=>{
        const cons0le = await inputConsole()
        const game = await inputGame(cons0le.id)

        const response = await server.get("/games")
        expect(response.body).toEqual(expect.arrayContaining([
            {
                id: game.id,
                title: game.title,
                consoleId: game.consoleId,
                Console:{
                    id: cons0le.id,
                    name: cons0le.name
                }
            }
        ]))
    }) 
})

describe("GET /games/:id", () => {
    it("should respond with Game Not Found if the id does not relate to any console", async ()=>{

        const response = await server.get('/games/9999')
        expect(response.statusCode).toEqual(httpStatus.NOT_FOUND)
    })

    it("should respond with the game related to the informed id", async ()=>{
        const cons0le = await inputConsole()
        const game = await inputGame(cons0le.id)

        const response = await server.get(`/games/${game.id}`)
        expect(response.body).toEqual(
            {
                id: game.id,
                title: game.title,
                consoleId: game.consoleId
            }
        )
    })
})

describe("POST/games", () => {
    it("should respond with -This console already exists!- if that console input have already been done", async ()=>{
        const cons0le = await inputConsole()
        const game = await inputGame(cons0le.id)

        const response = await server.post("/games").send({
            title: game.title,
            consoleId: game.consoleId
        })
        expect(response.statusCode).toEqual(httpStatus.CONFLICT)
    })

    it("should respond with with httpStatus.CREATED", async ()=>{
        const cons0le = await inputConsole()

        const response = await server.post("/games").send({
            title: "Mario Party",
            consoleId: cons0le.id
        })
        expect(response.statusCode).toEqual(httpStatus.CREATED)
    }) 
})